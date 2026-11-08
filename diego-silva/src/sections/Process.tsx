import { m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { ETAPAS } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";
import { MagneticLink } from "../components/Magnetic";
import { waLink } from "../lib/whatsapp";
import { useMotionOk } from "../lib/useMotionOk";

/** Linha do processo: traço vinho que se desenha ao rolar e termina em círculo no botão de contato. */
export function Process({ num }: { num: string }) {
  const track = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 65%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [reached, setReached] = useState(-1);
  const [done, setDone] = useState(false);

  useMotionValueEvent(progress, "change", (v) => {
    const el = track.current;
    if (!el) return;
    const h = el.offsetHeight;
    const marks = Array.from(el.querySelectorAll<HTMLElement>("[data-step]")).map((s) => s.offsetTop / h);
    let r = -1;
    marks.forEach((t, i) => {
      if (v >= t - 0.005) r = i;
    });
    setReached(r);
    setDone(v > 0.985);
  });

  const all = !ok; // sem animação: tudo desenhado
  return (
    <section id="como-funciona" aria-labelledby="processo-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Como funciona o atendimento" />
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-36">
              <Reveal>
                <h2 id="processo-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                  Um caminho <em>claro</em>, do primeiro contato em diante.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-md text-ink-soft">
                  Cada caso é único, mas a forma de trabalhar é sempre a mesma: ouvir, analisar, explicar e acompanhar.
                </p>
              </Reveal>
            </div>
          </div>

          <div ref={track} className="relative md:col-span-6 md:col-start-7">
            {/* trilho e traço */}
            <div aria-hidden className="absolute bottom-6 left-[11px] top-2 w-[2px]">
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
              <m.div className="absolute inset-0 origin-top rounded-full bg-wine" style={{ scaleY: all ? 1 : progress }} />
            </div>

            <ol className="relative">
              {ETAPAS.map((e, i) => {
                const on = all || reached >= i;
                return (
                  <li key={e.num} data-step className="relative pb-14 pl-14 md:pb-20 md:pl-16">
                    <span
                      aria-hidden
                      className={`absolute left-[4px] top-2 h-4 w-4 rounded-full border-2 transition-colors duration-500 ${
                        on ? "border-wine bg-wine" : "border-line bg-paper"
                      }`}
                    />
                    <p className={`font-serif text-lg italic transition-colors duration-500 ${on ? "text-wine" : "text-ink-soft"}`}>
                      Etapa {e.num}
                    </p>
                    <h3 className="mt-2 text-[1.85rem] md:text-[1.75rem] lg:text-[2.4rem]">{e.titulo}</h3>
                    <p className="mt-4 max-w-lg text-ink-soft">{e.texto}</p>
                  </li>
                );
              })}
            </ol>

            {/* fim do traço: círculo + botão */}
            <div className="relative flex items-center gap-5 pl-0">
              <span aria-hidden className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                <span
                  className={`absolute inset-0 rounded-full border-2 border-wine transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
                    all || done ? "scale-100" : "scale-0"
                  }`}
                />
                <span className={`h-2 w-2 rounded-full bg-wine transition-transform duration-500 ${all || done ? "scale-100" : "scale-0"}`} />
              </span>
              <MagneticLink href={waLink()} external className="min-w-0 py-3 text-left leading-snug">
                Começar pelo primeiro contato
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
