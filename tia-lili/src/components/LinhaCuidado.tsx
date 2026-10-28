import { useEffect, useRef, useState, type RefObject } from "react";
import { useMovimentoReduzido } from "./rolagem";

/**
 * Momento de assinatura: uma linha curva fina que "cresce" pela página conforme a rolagem,
 * como o cuidado que acompanha o crescimento. Uma pequena estrela marca a ponta.
 * Inspirado em "Svg follow scroll" / "Line Draw SVG" (21st.dev), escrito do zero.
 *
 * - O traçado é calculado a partir da posição real das seções ([data-linha]).
 * - Em telas largas, a linha corre pelas margens e cruza de lado nos intervalos entre seções.
 * - No celular, vira um fio discreto na margem esquerda.
 * - Fica atrás do conteúdo (painéis opacos a escondem). Com movimento reduzido, aparece inteira e parada.
 */
export function LinhaCuidado({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const caminho = useRef<SVGPathElement>(null);
  const estrela = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);
  const tabela = useRef<{ comp: number; ys: Float32Array; total: number } | null>(null);
  const reduzido = useMovimentoReduzido();
  const atualRef = useRef(0);
  const escalaEstrela = useRef(1);

  // 1) Monta o traçado a partir das seções
  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    let quadro = 0;
    const calcular = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const h = el.scrollHeight;
        const topo = el.getBoundingClientRect().top + window.scrollY;
        const secoes = [...el.querySelectorAll<HTMLElement>("[data-linha]")];
        if (secoes.length < 2) return;
        const largo = w >= 1024;
        const conteudo = Math.max(0, (w - 1200) / 2) + 32;
        const xE = largo ? Math.max(18, conteudo / 2) : 9;
        const xD = largo ? w - xE : 9;
        const curva = largo ? 22 : 3;
        const fim = secoes.at(-1)!;
        const yFim = fim.getBoundingClientRect().top + window.scrollY - topo + (largo ? 70 : 80);
        const fronteiras = secoes
          .slice(1)
          .map((s) => s.getBoundingClientRect().top + window.scrollY - topo)
          .filter((y) => y < yFim - 40);

        const y0 = Math.min(secoes[0].offsetHeight * 0.42, 420);
        escalaEstrela.current = largo ? 1 : 0.62;
        let lado = 1; // 1 = direita
        let x = xD;
        let y = y0;
        let d = `M ${x} ${y}`;
        for (const b of fronteiras) {
          const antes = b - 90;
          if (antes > y + 20) {
            const meio = (antes - y) / 3;
            const dentro = lado === 1 ? -curva : curva;
            d += ` C ${x + dentro} ${y + meio} ${x - dentro} ${antes - meio} ${x} ${antes}`;
            y = antes;
          }
          if (largo) {
            lado = -lado;
            const nx = lado === 1 ? xD : xE;
            d += ` C ${x} ${b} ${nx} ${b} ${nx} ${b + 90}`;
            x = nx;
            y = b + 90;
          }
        }
        if (largo) {
          // última curva entra no bloco escuro do CTA final e some atrás dele
          const xFim = w * 0.36;
          d += ` C ${x} ${yFim - 40} ${xFim} ${yFim - 60} ${xFim} ${yFim + 30}`;
        } else if (yFim > y) {
          d += ` C ${x} ${y + (yFim - y) / 2} ${x} ${y + (yFim - y) / 2} ${x} ${yFim}`;
        }
        setGeo({ d, w, h });
      });
    };
    // Só calcula depois do carregamento, quando o navegador estiver ocioso (não pesa na primeira pintura)
    const ro = new ResizeObserver(calcular);
    const ocioso = (fn: () => void) => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 600));
    const iniciar = () => ocioso(() => ro.observe(el));
    if (document.readyState === "complete") iniciar();
    else window.addEventListener("load", iniciar, { once: true });
    return () => {
      window.removeEventListener("load", iniciar);
      ro.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [alvo]);

  // 2) Tabela comprimento -> y, para achar até onde desenhar
  useEffect(() => {
    const p = caminho.current;
    if (!p || !geo) return;
    const total = p.getTotalLength();
    const n = 260;
    const ys = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) ys[i] = p.getPointAtLength((total * i) / n).y;
    tabela.current = { comp: n, ys, total };
    p.style.strokeDasharray = `${total}`;
    p.style.strokeDashoffset = reduzido ? "0" : `${total}`;
    atualizar(atualRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, reduzido]);

  // 3) Rolagem -> y alvo (um pouco abaixo do meio da tela), com suavização própria (lerp)
  useEffect(() => {
    const el = alvo.current;
    if (!el || reduzido) return;
    let quadro = 0;
    let alvoY = 0;
    const passo = () => {
      const atual = atualRef.current;
      const prox = atual + (alvoY - atual) * 0.14;
      atualRef.current = Math.abs(alvoY - prox) < 0.5 ? alvoY : prox;
      atualizar(atualRef.current);
      quadro = atualRef.current === alvoY ? 0 : requestAnimationFrame(passo);
    };
    const aoRolar = () => {
      alvoY = -el.getBoundingClientRect().top + window.innerHeight * 0.62;
      if (!quadro) quadro = requestAnimationFrame(passo);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo, reduzido]);

  function atualizar(y: number) {
    const t = tabela.current;
    const p = caminho.current;
    if (!t || !p || reduzido) return;
    let lo = 0;
    let hi = t.comp;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (t.ys[m] < y) lo = m + 1;
      else hi = m;
    }
    const comp = (t.total * lo) / t.comp;
    p.style.strokeDashoffset = `${t.total - comp}`;
    const s = estrela.current;
    if (s) {
      const pt = p.getPointAtLength(comp);
      s.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${comp * 0.15}deg) scale(${escalaEstrela.current})`;
      s.style.opacity = comp > 4 && comp < t.total - 2 ? "1" : "0";
    }
  }

  if (!geo) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 z-0"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden
      focusable="false"
    >
      <path
        ref={caminho}
        d={geo.d}
        fill="none"
        stroke="var(--color-menta)"
        strokeWidth={1.75}
        strokeLinecap="round"
        opacity={0.95}
      />
      {!reduzido && (
        <g ref={estrela} style={{ opacity: 0, transition: "opacity .4s" }}>
          <circle r="11" fill="var(--color-creme)" />
          <path
            d="M0-8.5c.5 3.9 1.9 6.2 7.8 7.8-5.9 1.6-7.3 3.9-7.8 7.8-.5-3.9-1.9-6.2-7.8-7.8C-1.9-2.3-.5-4.6 0-8.5z"
            fill="var(--color-manteiga)"
            stroke="var(--color-taupe)"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}
