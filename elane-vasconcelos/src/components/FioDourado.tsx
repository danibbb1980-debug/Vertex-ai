/**
 * Momento de assinatura: um fio dourado-champanhe que se desenha conforme a
 * rolagem, passando pelos pontos dourados dos rótulos (data-fio="ponto") e terminando
 * numa argola em volta do elemento data-fio="fim" (o botão de agendar).
 * Só mexe em stroke-dashoffset e num transform da "conta" na ponta; o cálculo
 * roda em rAF e apenas quando há rolagem. Com reduced motion, aparece inteiro.
 */
import { useEffect, useRef, useState, type RefObject } from "react";

type Desenho = { d: string; inicioAnel: number; topoAnel: number; altura: number; largura: number };

export function FioDourado({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const [des, setDes] = useState<Desenho | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contaRef = useRef<SVGCircleElement>(null);

  // 1) medir âncoras e montar o caminho
  useEffect(() => {
    const raiz = alvo.current;
    if (!raiz) return;
    const medir = () => {
      const W = raiz.clientWidth;
      // posição sem transforms (as entradas animadas não deslocam o fio)
      const pt = (el: HTMLElement) => {
        let x = 0, y = 0;
        let n: HTMLElement | null = el;
        while (n && n !== raiz) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
        return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2, w: el.offsetWidth, h: el.offsetHeight };
      };
      // pontos dourados dos rótulos, na ordem do documento
      const pts = Array.from(raiz.querySelectorAll<HTMLElement>('[data-fio="ponto"]'))
        .filter((e) => e.offsetParent !== null)
        .map(pt);
      const fimEl = raiz.querySelector<HTMLElement>('[data-fio="fim"]');
      if (!fimEl || pts.length === 0) return setDes(null);
      const fim = pt(fimEl);
      const estreito = W < 768;
      // corredor na margem esquerda, fora da coluna de texto
      const mx = Math.max(6, pts[0].x - (estreito ? 14 : 34));
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dy = b.y - a.y;
        d += ` C ${mx} ${a.y + dy * 0.3}, ${mx} ${a.y + dy * 0.7}, ${b.x} ${b.y}`;
      }
      // último ponto -> topo da argola em volta do botão
      const rx = fim.w / 2 + (estreito ? 12 : 22);
      const ry = fim.h / 2 + (estreito ? 11 : 16);
      const ult = pts[pts.length - 1];
      const topo = { x: fim.x, y: fim.y - ry };
      // desce pela margem até a altura do botão e entra na horizontal,
      // pelo respiro entre o texto e os botões
      const yh = topo.y - 36;
      const dy = yh - ult.y;
      d += ` C ${mx} ${ult.y + dy * 0.3}, ${mx} ${ult.y + dy * 0.7}, ${mx} ${yh}`;
      d += ` C ${mx} ${topo.y - 6}, ${topo.x - rx * 1.1} ${topo.y}, ${topo.x} ${topo.y}`;
      // argola (um pouco mais que uma volta, como o fecho de um brinco)
      d += ` A ${rx} ${ry} 0 1 1 ${fim.x} ${fim.y + ry} A ${rx} ${ry} 0 1 1 ${fim.x + rx * 0.5} ${fim.y - ry * 0.866}`;
      setDes({ d, inicioAnel: 0, topoAnel: topo.y, altura: raiz.offsetHeight, largura: W });
    };
    medir();
    const ro = new ResizeObserver(() => requestAnimationFrame(medir));
    ro.observe(raiz);
    document.fonts?.ready.then(medir);
    window.addEventListener("load", medir);
    return () => { ro.disconnect(); window.removeEventListener("load", medir); };
  }, [alvo]);

  // 2) desenhar conforme a rolagem
  useEffect(() => {
    const path = pathRef.current, raiz = alvo.current;
    if (!des || !path || !raiz) return;
    const L = path.getTotalLength();
    // tabela comprimento -> y (o trecho até a argola é monótono em y)
    const N = 240;
    const tab: { l: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) { const l = (L * i) / N; tab.push({ l, y: path.getPointAtLength(l).y }); }
    const iAnel = tab.findIndex((t) => t.y >= des.topoAnel - 0.5);
    const lAnel = iAnel >= 0 ? tab[iAnel].l : L;
    path.style.strokeDasharray = `${L}`;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conta = contaRef.current;
    const pintar = (l: number) => {
      path.style.strokeDashoffset = `${L - l}`;
      if (conta) {
        const p = path.getPointAtLength(l);
        conta.style.transform = `translate(${p.x}px, ${p.y}px)`;
        conta.style.opacity = l > 2 && l < L - 1 ? "1" : "0";
      }
    };
    if (reduzido) { pintar(L); return; }
    let raf = 0;
    const atualizar = () => {
      raf = 0;
      const topo = raiz.getBoundingClientRect().top;
      const alvoY = -topo + window.innerHeight * 0.62;
      let l = 0;
      if (alvoY >= des.topoAnel) {
        // argola: completa nos ~160px seguintes de rolagem
        const prog = Math.min(1, (alvoY - des.topoAnel) / 160);
        l = lAnel + (L - lAnel) * prog;
      } else {
        for (let i = 1; i <= iAnel; i++) {
          if (tab[i].y >= alvoY) {
            const a = tab[i - 1], b = tab[i];
            l = a.l + ((alvoY - a.y) / Math.max(1, b.y - a.y)) * (b.l - a.l);
            break;
          }
          l = tab[i].l;
        }
        l = Math.max(0, Math.min(l, lAnel));
        if (alvoY < tab[0].y) l = 0;
      }
      pintar(l);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(atualizar); };
    atualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [des, alvo]);

  if (!des) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <svg
      className="absolute left-0 top-0"
      width={des.largura}
      height={des.altura}
      viewBox={`0 0 ${des.largura} ${des.altura}`}
      fill="none"
    >
      <path ref={pathRef} d={des.d} stroke="#B8956A" strokeWidth="1.2" strokeLinecap="round" style={{ strokeDashoffset: 99999 }} />
      <circle ref={contaRef} r="3.2" cx="0" cy="0" fill="#B8956A" style={{ opacity: 0 }} />
    </svg>
    </div>
  );
}
