// Momento de assinatura: um traço contínuo que se desenha conforme a página rola.
// Parte do monograma do topo, corre pelas margens (sem cruzar texto), atravessa a fileira
// dos cartões de atendimento e termina em uma gota junto ao botão de enviar a solicitação.
// Um brilho suave acompanha a ponta do traço. Com movimento reduzido, aparece já desenhado.
import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

type Pt = { x: number; y: number };

const GOTA = "M0 -13C4.6 -6.6 7.4 -2.2 7.4 1.8A7.4 7.4 0 0 1 -7.4 1.8C-7.4 -2.2 -4.6 -6.6 0 -13Z";

function construir(main: HTMLElement): Pt[] {
  const base = main.getBoundingClientRect();
  const top0 = base.top;
  const vw = main.clientWidth;
  const conteudo = Math.min(vw, 1280);
  const px = vw >= 1024 ? 40 : vw >= 640 ? 24 : 16;
  const margem = (vw - conteudo) / 2;
  const gx = {
    esq: Math.max(7, margem + px / 2),
    dir: Math.min(vw - 7, vw - margem - px / 2),
  };
  const rel = (r: DOMRect, fx: number, fy: number): Pt => ({ x: r.left - base.left + r.width * fx, y: r.top - top0 + r.height * fy });
  const visivel = (el: Element | null): el is HTMLElement => !!el && (el as HTMLElement).offsetParent !== null;

  const secoes = [...main.querySelectorAll<HTMLElement>(":scope > section")];
  const pts: Pt[] = [];
  let lado: "esq" | "dir" = "dir";

  for (const s of secoes) {
    const r = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const pt = Math.min(44, parseFloat(cs.paddingTop) / 2);
    const pb = Math.min(44, parseFloat(cs.paddingBottom) / 2);
    const topo = r.top - top0;
    const fundo = r.bottom - top0;

    if (s.id === "inicio") {
      const ini = s.querySelector('[data-trace="inicio"]');
      if (visivel(ini)) pts.push(rel(ini.getBoundingClientRect(), 0.5, 0.5));
      else pts.push({ x: gx.dir, y: topo + Math.min(r.height * 0.45, 360) });
      pts.push({ x: gx.dir, y: fundo - pb });
      lado = "dir";
      continue;
    }

    const entra: "esq" | "dir" = lado === "dir" ? "esq" : "dir";

    if (s.id === "atendimentos") {
      const cartoes = [...s.querySelectorAll('[data-trace^="atendimento-"]')].filter(visivel).map((el) => rel(el.getBoundingClientRect(), 0.5, 0.5));
      const emLinha = cartoes.length > 1 && Math.abs(cartoes[0].y - cartoes[cartoes.length - 1].y) < 4;
      if (emLinha) {
        const y = cartoes[0].y;
        const ordem = entra === "esq" ? cartoes : [...cartoes].reverse();
        const saida: "esq" | "dir" = entra === "esq" ? "dir" : "esq";
        pts.push({ x: gx[entra], y: topo + pt }, { x: gx[entra], y: y - 24 }, ...ordem.map((p, i) => ({ x: p.x, y: y + i * 6 })), { x: gx[saida], y: y + 40 }, { x: gx[saida], y: fundo - pb });
        lado = saida;
        continue;
      }
    }

    if (s.id === "agendar") {
      const botao = s.querySelector('form button[type="submit"]');
      pts.push({ x: gx[entra], y: topo + pt });
      if (visivel(botao)) {
        const b = botao.getBoundingClientRect();
        const cy = b.top - top0 + b.height / 2;
        const fim = { x: Math.min(b.right - base.left + 18, vw - 10), y: cy };
        pts.push({ x: gx[entra], y: cy - 60 });
        if (entra === "esq") pts.push({ x: b.left - base.left - 18, y: cy - 30 });
        pts.push(fim);
      }
      break;
    }

    pts.push({ x: gx[entra], y: topo + pt }, { x: gx[entra], y: fundo - pb });
    lado = entra;
  }
  return pts;
}

function caminho(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = (b.y - a.y) * 0.55;
    const horizontal = Math.abs(b.y - a.y) < 50;
    const c1 = horizontal ? { x: a.x + (b.x - a.x) * 0.4, y: a.y } : { x: a.x, y: a.y + dy };
    const c2 = horizontal ? { x: b.x - (b.x - a.x) * 0.4, y: b.y } : { x: b.x, y: b.y - dy };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

export function LinhaAssinatura({ mainRef }: { mainRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const [d, setD] = useState("");
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const [fim, setFim] = useState<Pt | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const brilhoRef = useRef<SVGGElement>(null);
  const gotaRef = useRef<SVGGElement>(null);

  // Mede a página e monta o caminho (de novo a cada mudança de tamanho).
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let t = 0;
    const medir = () => {
      const pts = construir(main);
      setDim({ w: main.clientWidth, h: main.scrollHeight });
      setD(caminho(pts));
      setFim(pts[pts.length - 1] ?? null);
    };
    const agendar = () => {
      clearTimeout(t);
      t = window.setTimeout(medir, 150);
    };
    const ro = new ResizeObserver(agendar);
    ro.observe(main);
    document.fonts?.ready.then(agendar);
    agendar();
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [mainRef]);

  // Desenha conforme a rolagem: a ponta acompanha ~65% da altura da tela.
  useEffect(() => {
    const path = pathRef.current;
    const main = mainRef.current;
    if (!path || !main || !d) return;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;

    if (reduced) {
      path.style.strokeDashoffset = "0";
      if (brilhoRef.current) brilhoRef.current.style.opacity = "0";
      gotaRef.current?.setAttribute("data-on", "true");
      return;
    }

    // Tabela comprimento -> y para achar rápido o ponto alvo.
    const N = 600;
    const ys = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) ys[i] = path.getPointAtLength((total * i) / N).y;

    let atual = 0;
    let alvo = 0;
    let raf = 0;
    const calcAlvo = () => {
      const topoMain = main.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY + window.innerHeight * 0.65 - topoMain;
      let i = 0;
      while (i < N && ys[i + 1] <= y) i++;
      alvo = (total * i) / N;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) alvo = total;
    };
    const quadro = () => {
      atual += (alvo - atual) * 0.14;
      if (Math.abs(alvo - atual) < 0.5) atual = alvo;
      path.style.strokeDashoffset = `${total - atual}`;
      const p = path.getPointAtLength(atual);
      if (brilhoRef.current) {
        brilhoRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
        brilhoRef.current.style.opacity = atual > 2 && atual < total - 2 ? "1" : "0";
      }
      gotaRef.current?.setAttribute("data-on", String(atual >= total - 2));
      raf = atual === alvo ? 0 : requestAnimationFrame(quadro);
    };
    const onScroll = () => {
      calcAlvo();
      if (!raf) raf = requestAnimationFrame(quadro);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [d, reduced, mainRef]);

  if (!d) return null;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute left-0 top-0 z-20 overflow-visible"
      width={dim.w}
      height={dim.h}
      viewBox={`0 0 ${dim.w} ${dim.h}`}
    >
      <defs>
        <radialGradient id="brilho-traco">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#f2d8cb" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f2d8cb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="#4a3459"
        strokeOpacity="0.42"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{ strokeDashoffset: reduced ? 0 : 1e6 }}
      />
      <g ref={brilhoRef} style={{ opacity: 0, transition: "opacity .4s" }}>
        <circle r="22" fill="url(#brilho-traco)" />
        <circle r="2.6" fill="#4a3459" fillOpacity="0.7" />
      </g>
      {fim ? (
        <g ref={gotaRef} className="gota-fim" data-on="false" style={{ transform: `translate(${fim.x}px, ${fim.y + 4}px)` }}>
          <g className="gota-fim-interna">
            <circle r="18" fill="url(#brilho-traco)" />
            <path d={GOTA} fill="#4a3459" fillOpacity="0.14" stroke="#4a3459" strokeOpacity="0.6" strokeWidth="1.3" />
          </g>
        </g>
      ) : null}
    </svg>
  );
}
