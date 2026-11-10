import { useEffect, useRef, useState, type RefObject } from "react";
import { prefereMenosMovimento } from "../lib/useProgressoRolagem";

type Geo = { w: number; h: number; a: string; b: string; yInicio: number; yTopoD: number; yBaseD: number };

const DESLOC = 6; // distância entre as duas linhas (como no monograma)

/**
 * Momento de assinatura: duas linhas paralelas douradas descem pela margem
 * esquerda, do hero ao CTA final, e se fecham como o "D" do monograma ao redor
 * do botão de agendar. Desenhadas conforme a rolagem; com "reduzir movimento",
 * aparecem completas e paradas.
 */
export function LinhasAssinatura({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const pa = useRef<SVGPathElement>(null);
  const pb = useRef<SVGPathElement>(null);

  // Geometria a partir da posição real do rótulo do hero e do botão final
  useEffect(() => {
    const raiz = alvo.current;
    if (!raiz) return;
    const medir = () => {
      const ini = raiz.querySelector<HTMLElement>("[data-sig-inicio]");
      const fim = raiz.querySelector<HTMLElement>("[data-sig-fim]");
      if (!ini || !fim) return setGeo(null);
      const r = raiz.getBoundingClientRect();
      const ri = ini.getBoundingClientRect();
      const rf = fim.getBoundingClientRect();
      const esq = ri.left - r.left;
      const folga = Math.max(12, Math.min(44, esq * 0.42));
      const X = Math.round(esq - folga) + 0.5;
      const o = DESLOC;
      const padV = window.innerWidth < 768 ? 12 : 16;
      const topoBtn = rf.top - r.top;
      const baseBtn = rf.bottom - r.top;
      const T = topoBtn - padV - o;
      const B = baseBtn + padV + o;
      const R = (B - T) / 2;
      const cx = rf.right - r.left - rf.height / 2;
      const y0 = ri.top - r.top + 2;
      // Linha A (esquerda): fecha o D interno
      const a = `M${X} ${y0}V${T + o}H${cx}A${R - o} ${R - o} 0 0 1 ${cx} ${B - o}H${X}V${T + o}`;
      // Linha B (direita): contorna o D externo e termina aberta, como as hastes do P
      const b = `M${X + o} ${y0}V${T}H${cx}A${R} ${R} 0 0 1 ${cx} ${B}H${X + o}`;
      setGeo({ w: r.width, h: r.height, a, b, yInicio: y0, yTopoD: T, yBaseD: B });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(raiz);
    window.addEventListener("load", medir);
    document.fonts?.ready.then(medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", medir);
    };
  }, [alvo]);

  // Desenho conforme a rolagem (suavizado; para quando chega ao alvo)
  useEffect(() => {
    if (!geo || !pa.current || !pb.current || !alvo.current) return;
    const caminhos = [pa.current, pb.current];
    const totais = caminhos.map((p) => p.getTotalLength());
    if (prefereMenosMovimento()) {
      caminhos.forEach((p) => {
        p.style.strokeDasharray = "none";
      });
      return;
    }
    caminhos.forEach((p, i) => {
      p.style.strokeDasharray = `${totais[i]} ${totais[i]}`;
    });
    let atual = -1;
    let quadro = 0;
    const alvoDesenho = () => {
      const topo = alvo.current!.getBoundingClientRect().top;
      const ponta = window.innerHeight * 0.72 - topo; // ponto de leitura em coordenadas da página
      const vertical = geo.yTopoD - geo.yInicio;
      if (ponta <= geo.yInicio) return 0;
      if (ponta < geo.yTopoD) return (ponta - geo.yInicio) / vertical;
      // o "D" fecha enquanto o botão sobe até o ponto de leitura
      const f = Math.min(1, (ponta - geo.yTopoD) / (geo.yBaseD - geo.yTopoD + 120));
      return 1 + f;
    };
    const aplicar = (v: number) => {
      caminhos.forEach((p, i) => {
        const total = totais[i];
        const vert = geo.yTopoD - geo.yInicio;
        const desenhado = v <= 1 ? v * vert : vert + (v - 1) * (total - vert);
        p.style.strokeDashoffset = String(Math.max(0, total - desenhado));
      });
    };
    const passo = () => {
      const meta = alvoDesenho();
      atual = atual < 0 ? meta : atual + (meta - atual) * 0.14;
      aplicar(atual);
      quadro = Math.abs(meta - atual) > 0.0005 ? requestAnimationFrame(passo) : 0;
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(passo);
    };
    passo();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, [geo, alvo]);

  if (!geo) return null;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute left-0 top-0 z-10"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      fill="none"
      stroke="#C49A6C"
      strokeWidth={1.5}
    >
      <path ref={pa} d={geo.a} />
      <path ref={pb} d={geo.b} />
    </svg>
  );
}
