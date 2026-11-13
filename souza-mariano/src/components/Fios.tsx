import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

/**
 * Os dois fios que saem do entrelaçado do hero e acompanham a página
 * pela margem direita (uma linha por advogada). Cruzam-se no início de
 * cada seção ([data-fio-cruza]) e voltam a se encontrar no botão de
 * contato do CTA final ([data-fio-fim]). Só em telas largas.
 */
interface Geo {
  w: number;
  h: number;
  a: string;
  b: string;
  escuroY: number;
}

function caminho(x0: number, y0: number, xc: number, cruzas: number[], fim: { x: number; y: number }, sinal: number) {
  const w = 30;
  let d = `M${x0} ${y0}`;
  let y = y0;
  let x = x0;
  let b = sinal;
  for (const yi of cruzas) {
    const k = Math.min((yi - y) * 0.42, 170);
    d += ` C${x + b * w * (x === xc ? 1 : 0)} ${y + k} ${xc + b * w} ${yi - k} ${xc} ${yi}`;
    x = xc;
    y = yi;
    b = -b;
  }
  const k = Math.min((fim.y - y) * 0.45, 170);
  d += ` C${xc + b * w} ${y + k} ${fim.x + b * 30} ${fim.y - k * 0.6} ${fim.x} ${fim.y}`;
  return d;
}

export function Fios({ alvo }: { alvo: RefObject<HTMLElement> }) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const reduz = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start start", "end end"] });
  const suave = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const comprimento = useTransform(suave, [0, 0.96], [0.04, 1]);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    const medir = () => {
      if (window.innerWidth < 1024) return setGeo(null);
      const base = el.getBoundingClientRect();
      const rel = (n: Element | null) => {
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top, h: r.height };
      };
      const ia = rel(el.querySelector('[data-fio-inicio="a"]'));
      const ib = rel(el.querySelector('[data-fio-inicio="b"]'));
      const fimEl = rel(el.querySelector("[data-fio-fim]"));
      if (!ia || !ib || !fimEl) return setGeo(null);
      const larg = Math.min(base.width, 1216);
      const xc = (base.width - larg) / 2 + larg - 52;
      const cruzas = Array.from(el.querySelectorAll("[data-fio-cruza]"))
        .map((n) => rel(n)!.y)
        .filter((y) => y > ia.y + 80 && y < fimEl.y - 80);
      const fim = { x: fimEl.x, y: fimEl.y };
      const escuro = rel(el.querySelector("[data-fio-escuro]"));
      setGeo({
        w: base.width,
        h: base.height,
        a: caminho(ia.x, ia.y, xc, cruzas, fim, 1),
        b: caminho(ib.x, ib.y, xc, cruzas, fim, -1),
        escuroY: escuro ? escuro.y : base.height,
      });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [alvo]);

  if (!geo) return null;
  const estilo = reduz ? undefined : { pathLength: comprimento };
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 hidden lg:block"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="fio-a" gradientUnits="userSpaceOnUse" x1="0" y1={geo.escuroY - 1} x2="0" y2={geo.escuroY}>
          <stop offset="0" stopColor="#5B1E34" />
          <stop offset="1" stopColor="#D2B48A" />
        </linearGradient>
        <linearGradient id="fio-b" gradientUnits="userSpaceOnUse" x1="0" y1={geo.escuroY - 1} x2="0" y2={geo.escuroY}>
          <stop offset="0" stopColor="#A9855A" />
          <stop offset="1" stopColor="#D2B48A" />
        </linearGradient>
      </defs>
      <motion.path d={geo.a} stroke="url(#fio-a)" strokeWidth="1.1" style={estilo} />
      <motion.path d={geo.b} stroke="url(#fio-b)" strokeWidth="1.1" style={estilo} />
    </svg>
  );
}
