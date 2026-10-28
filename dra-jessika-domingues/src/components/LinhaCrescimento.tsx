import { useEffect, useState, type RefObject } from "react";
import { carregarEfeitos } from "../lib/movimento";
import { Sparkle } from "./Decor";

/**
 * Momento de assinatura: uma linha curva fina que "cresce" ao longo da página
 * conforme a rolagem, sempre nas margens, sem cruzar o texto.
 * Sem JavaScript de efeitos ou com "reduzir movimento", aparece completa e parada.
 */
const MARCOS = [0.12, 0.27, 0.42, 0.58, 0.73, 0.88];

function desenhar(w: number, h: number) {
  // margem livre entre a borda da tela e o conteúdo (container de 76rem)
  const pad = w >= 768 ? 40 : 20;
  const margem = Math.max(pad, (w - Math.min(w, 1216)) / 2 + pad);
  const xMin = Math.max(5, margem * 0.14);
  const xMax = Math.max(xMin + 5, margem * (w >= 768 ? 0.62 : 0.55));
  const meio = (xMin + xMax) / 2;
  const amp = (xMax - xMin) / 2;
  const x = (t: number) => meio + amp * Math.sin(t * Math.PI * 9 + 0.6) * (0.75 + 0.25 * Math.sin(t * 13));
  const passos = Math.max(40, Math.round(h / 60));
  let d = "";
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    const px = x(t).toFixed(1);
    const py = (t * h).toFixed(1);
    if (i === 0) d += `M${px} ${py}`;
    else {
      const tp = (i - 0.5) / passos;
      d += ` Q${x(tp - 0.25 / passos).toFixed(1)} ${(tp * h).toFixed(1)} ${px} ${py}`;
    }
  }
  return { d, x };
}

export function LinhaCrescimento({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  const [alcancados, setAlcancados] = useState(MARCOS.length);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    let raf = 0;
    const medir = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setDim((d) =>
          d && d.w === window.innerWidth && d.h === el.offsetHeight ? d : { w: window.innerWidth, h: el.offsetHeight },
        ),
      );
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", medir);
    };
  }, [alvo]);

  const pronto = dim !== null;
  useEffect(() => {
    if (!pronto) return;
    let cancelar: (() => void) | undefined;
    let ativo = true;
    carregarEfeitos().then((e) => {
      if (!e || !ativo || !alvo.current) return;
      setAlcancados(0);
      cancelar = e.linhaCrescimento(alvo.current, (p) => {
        const n = MARCOS.filter((t) => p >= t).length;
        setAlcancados((a) => (a === n ? a : n));
      });
    });
    return () => {
      ativo = false;
      cancelar?.();
    };
  }, [pronto, alvo]);

  if (!dim) return null;
  const { d, x } = desenhar(dim.w, dim.h);
  const larg = Math.ceil(dim.w / 2);
  const lado = (esq: boolean) => (
    <svg
      className={`absolute top-0 ${esq ? "left-0" : "right-0 -scale-x-100"} overflow-visible`}
      width={larg}
      height={dim.h}
      viewBox={`0 0 ${larg} ${dim.h}`}
      aria-hidden
      focusable={false}
    >
      <path d={d} fill="none" stroke="var(--color-sage)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 7" />
      <path
        data-cresce
        pathLength={1}
        d={d}
        fill="none"
        stroke={esq ? "var(--color-sage-500)" : "var(--color-coral)"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {lado(true)}
      <div className="hidden xl:block">{lado(false)}</div>
      {MARCOS.map((t, i) => (
        <Sparkle
          key={t}
          filled
          className={`absolute h-3.5 w-3.5 transition-[opacity,scale] duration-700 ${
            i % 2 ? "text-coral" : "text-butter"
          } ${i < alcancados ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          style={{ left: x(t) - 7, top: t * dim.h - 7 }}
        />
      ))}
    </div>
  );
}
