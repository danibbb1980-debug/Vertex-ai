import { useState } from "react";
import { FAQ } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";

export function Faq({ num }: { num: string }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="pb-28 md:pb-40">
      <div className="wrap">
        <SectionHead num={num} label="Dúvidas frequentes" />
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <h2 id="duvidas-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                Antes de <em>conversar</em>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="border-b border-line">
              {FAQ.map((f, i) => {
                const on = open === i;
                return (
                  <li key={f.p} className="border-t border-line">
                    <h3 className="m-0 font-sans text-base tracking-normal">
                      <button
                        type="button"
                        id={`faq-btn-${i}`}
                        aria-expanded={on}
                        aria-controls={`faq-painel-${i}`}
                        onClick={() => setOpen(on ? -1 : i)}
                        className="flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left font-serif text-[1.35rem] leading-snug tracking-[-0.01em] md:text-[1.6rem]"
                      >
                        {f.p}
                        <span aria-hidden className={`relative h-3.5 w-3.5 shrink-0 transition-transform duration-500 ${on ? "rotate-45" : ""}`}>
                          <span className="absolute left-0 top-1/2 h-px w-3.5 bg-wine" />
                          <span className="absolute left-1/2 top-0 h-3.5 w-px bg-wine" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-painel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      inert={!on}
                      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className={`max-w-2xl pb-7 text-ink-soft transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}>{f.r}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
