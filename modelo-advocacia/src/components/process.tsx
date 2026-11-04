import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { CONFIG } from "../config";
import { waEscritorio } from "../lib/whatsapp";
import { useReducedMotion } from "../lib/useClient";
import { MagneticLink, Rise, SectionHead } from "./ui";

/* Fundo escuro que se abre de papel para tinta ao entrar na tela (só transform). */
export function DarkPanel({ children, id, label }: { children: React.ReactNode; id?: string; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 0]);
  return (
    <section ref={ref} id={id} aria-labelledby={label} className="on-dark relative isolate !bg-transparent">
      <m.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[var(--dark)]"
        style={{ scaleX: reduced ? 1 : scaleX, borderRadius: reduced ? 0 : radius }}
      />
      {children}
    </section>
  );
}

interface Geo {
  w: number;
  h: number;
  x: number;
  nodes: number[];
  end: { x: number; y: number };
  d: string;
  len: number;
}

const R = 28;

function Node({ y, x, at, progress }: { y: number; x: number; at: number; progress: MotionValue<number> }) {
  const on = useTransform(progress, [at - 0.015, at], [0, 1]);
  return (
    <g>
      <circle cx={x} cy={y} r="5.5" fill="var(--dark)" stroke="var(--on-dark-rule)" />
      <m.circle cx={x} cy={y} r="5.5" fill="var(--accent-on-dark)" style={{ opacity: on, scale: on }} />
    </g>
  );
}

function Lines({ g, progress }: { g: Geo; progress: MotionValue<number> }) {
  const endOn = useTransform(progress, [0.96, 1], [0, 1]);
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={g.w}
      height={g.h}
      viewBox={`0 0 ${g.w} ${g.h}`}
      fill="none"
    >
      <path d={g.d} stroke="var(--on-dark-rule)" strokeWidth="1" />
      <m.path d={g.d} stroke="var(--accent-on-dark)" strokeWidth="1.25" style={{ pathLength: progress }} />
      {g.nodes.map((y, i) => (
        <Node key={i} y={y} x={g.x} at={Math.min(0.99, y / g.len)} progress={progress} />
      ))}
      <circle cx={g.end.x} cy={g.end.y} r="8" stroke="var(--on-dark-rule)" />
      <m.circle
        cx={g.end.x}
        cy={g.end.y}
        r="8"
        stroke="var(--accent-on-dark)"
        strokeWidth="1.25"
        style={{ opacity: endOn, scale: endOn }}
      />
      <m.circle cx={g.end.x} cy={g.end.y} r="2.5" fill="var(--accent-on-dark)" style={{ opacity: endOn }} />
    </svg>
  );
}

function Animated({ g, box }: { g: Geo; box: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 0.7", "end 0.72"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });
  return <Lines g={g} progress={progress} />;
}

function Static({ g }: { g: Geo }) {
  const one = useMotionValue(1);
  return <Lines g={g} progress={one} />;
}

/* Linha do processo: traço contínuo que se desenha com a rolagem e termina num círculo no botão. */
function ProcessLine({ box }: { box: React.RefObject<HTMLDivElement | null> }) {
  const [g, setG] = useState<Geo | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const b = el.getBoundingClientRect();
      const nodeEls = [...el.querySelectorAll<HTMLElement>("[data-node]")];
      const btn = el.querySelector<HTMLElement>("[data-end]")?.getBoundingClientRect();
      if (!btn || !nodeEls.length) return;
      const nodes = nodeEls.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - b.top + r.height / 2;
      });
      const first = nodeEls[0].getBoundingClientRect();
      const x = first.left - b.left + first.width / 2;
      const end = { x: btn.left - b.left - 18, y: btn.top - b.top + btn.height / 2 };
      const d = `M${x} 0 V${end.y - R} Q${x} ${end.y} ${x + R} ${end.y} H${end.x - 8}`;
      const len = end.y - R + R * 1.18 + (end.x - 8 - (x + R));
      setG({ w: b.width, h: b.height, x, nodes, end, d, len });
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [box]);

  if (!g) return null;
  return reduced ? <Static g={g} /> : <Animated g={g} box={box} />;
}

export function Process() {
  const box = useRef<HTMLDivElement>(null);
  return (
    <DarkPanel id="como-atendemos" label="processo-titulo">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-36">
              <SectionHead num="02" label="Como atendemos" id="processo-titulo">
                Cada etapa, <em>explicada</em>.
              </SectionHead>
              <p className="mt-8 max-w-md text-[1.05rem] text-[var(--on-dark-soft)]">
                Quatro etapas, explicadas antes de começar. Você sabe o que acontece em cada uma.
              </p>
            </div>
          </div>

          <div ref={box} className="relative lg:col-span-6 lg:col-start-7">
            <ProcessLine box={box} />
            <ol className="relative">
              {CONFIG.etapas.map((e, i) => (
                <li key={e.titulo} className="relative pb-16 pl-12 md:pb-24 md:pl-20">
                  <span data-node aria-hidden="true" className="absolute top-[0.55rem] left-0 size-3" />
                  <Rise>
                    <p className="label text-[var(--accent-on-dark)]">Etapa {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="font-display mt-4 text-[clamp(1.9rem,3.6vw,3rem)] !leading-[1.05]">{e.titulo}</h3>
                    <p className="mt-4 max-w-md text-[1.05rem] text-[var(--on-dark-soft)]">{e.texto}</p>
                  </Rise>
                </li>
              ))}
            </ol>
            <div className="pt-2 pb-2 pl-16 md:pl-24">
              <span data-end className="inline-block">
                <MagneticLink href={waEscritorio()} external icon="chat">
                  Começar pelo primeiro contato
                </MagneticLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </DarkPanel>
  );
}
