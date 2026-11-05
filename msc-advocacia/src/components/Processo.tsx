import { m, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { ETAPAS, MSG, waLink } from "../config";
import { Btn, IconWhats, Reveal, Rich, SectionLabel, useReducedMotion } from "./ui";

/** Traço vertical com leve ondulação, em px reais (sem distorção). */
function wavyPath(h: number, x = 20) {
  const seg = 180;
  const n = Math.max(1, Math.round(h / seg));
  const step = h / n;
  let d = `M${x} 0`;
  for (let i = 0; i < n; i++) {
    const y0 = i * step;
    const sway = i % 2 ? -7 : 7;
    d += ` C ${x + sway} ${y0 + step * 0.35}, ${x - sway} ${y0 + step * 0.65}, ${x} ${y0 + step}`;
  }
  return d;
}

function Dot({ y, at, progress }: { y: number; at: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [Math.max(0, at - 0.03), at], [0, 1]);
  return (
    <g>
      <circle cx={20} cy={y} r={6} fill="var(--bg)" stroke="var(--line-strong)" strokeWidth={1} />
      <m.circle cx={20} cy={y} r={3.5} fill="var(--accent)" style={{ opacity: fill }} />
    </g>
  );
}

/**
 * Assinatura do site: a linha do processo. Inspirada nos timelines com
 * progresso do 21st.dev ("Scroll animated timeline", "Timeline" com feixe),
 * refeita em SVG: um único traço contínuo que se desenha com a rolagem,
 * acende cada etapa e termina num círculo ao lado do botão de contato.
 */
export function Processo() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const [geo, setGeo] = useState<{ h: number; dots: number[] }>({ h: 0, dots: [] });

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      const e = end.current!.getBoundingClientRect();
      const h = e.top - top + e.height / 2;
      const dots = steps.current.map((s) => (s ? s.getBoundingClientRect().top - top + 10 : 0));
      setGeo({ h, dots });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start 70%", "end 65%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const full = useTransform(smooth, () => 1);
  const progress = reduce ? full : smooth;
  const endScale = useTransform(progress, [0.94, 1], [0, 1]);

  return (
    <section id="como-funciona" data-tone="light" tabIndex={-1} aria-labelledby="proc-titulo" className="py-24 md:py-40">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-36">
            <Reveal>
              <SectionLabel n="03">Como funciona o atendimento</SectionLabel>
              <h2 id="proc-titulo" className="h2 mt-8">
                <Rich text="Quatro etapas, com você em *todas* elas." />
              </h2>
              <p className="lead mt-8 max-w-[36ch]">
                Um caminho claro, para que você saiba sempre em que ponto o seu caso está e o que vem a seguir.
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={track} className="relative md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          {geo.h > 0 && (
            <svg
              className="pointer-events-none absolute top-0 left-0 overflow-visible"
              width={40}
              height={geo.h}
              viewBox={`0 0 40 ${geo.h}`}
              aria-hidden
              focusable="false"
            >
              <path d={wavyPath(geo.h)} fill="none" stroke="var(--line)" strokeWidth={1} />
              <m.path
                d={wavyPath(geo.h)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
              {geo.dots.map((y, i) => (
                <Dot key={i} y={y} at={y / geo.h} progress={progress} />
              ))}
              <m.circle
                cx={20}
                cy={geo.h}
                r={11}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
                style={{ scale: endScale, transformOrigin: `20px ${geo.h}px` }}
              />
            </svg>
          )}

          <ol className="pl-14 md:pl-20">
            {ETAPAS.map((e, i) => (
              <li
                key={e.n}
                ref={(el) => {
                  steps.current[i] = el;
                }}
                className="pb-14 md:pb-20"
              >
                <span className="num">Etapa {e.n}</span>
                <h3 className="h3 mt-3 text-[clamp(1.5rem,1.15rem+1.4vw,2.4rem)]">{e.titulo}</h3>
                <p className="muted mt-4 max-w-[44ch] text-pretty">{e.texto}</p>
              </li>
            ))}
          </ol>
          <div ref={end} className="pl-14 md:pl-20">
            <Btn href={waLink(MSG.geral)} external icon={<IconWhats className="h-5 w-5" />}>
              Começar pelo primeiro contato
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
