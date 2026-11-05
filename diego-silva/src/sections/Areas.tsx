import { useState } from "react";
import { AREAS } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";
import { Arrow } from "../components/Magnetic";
import { waLink } from "../lib/whatsapp";

export function Areas({ num }: { num: string }) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  return (
    <section id="areas" aria-labelledby="areas-titulo" className="pb-28 md:pb-40">
      <div className="wrap">
        <SectionHead num={num} label="Áreas de atuação" />
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <h2 id="areas-titulo" className="text-[clamp(2.5rem,6vw,5rem)]">
              Onde podemos <em>ajudar</em>.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9 md:self-end" delay={0.1}>
            <p className="text-ink-soft">
              O escritório atua com quatro áreas do Direito. Se você não sabe em qual delas a sua situação se encaixa, tudo bem: isso faz parte da conversa.
            </p>
          </Reveal>
        </div>

        <ul
          className="mt-14 border-b border-line md:mt-20"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          {AREAS.map((a, i) => {
            const open = active === i;
            const dim = hovering && !open;
            return (
              <li
                key={a.num}
                className={`border-t border-line transition-opacity duration-500 ${dim ? "lg:opacity-40" : "opacity-100"}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              >
                <h3 className="m-0 font-sans text-base leading-normal tracking-normal">
                  <button
                    type="button"
                    id={`area-btn-${i}`}
                    aria-expanded={open}
                    aria-controls={`area-painel-${i}`}
                    onClick={() => setActive(open ? -1 : i)}
                    onFocus={() => setActive(i)}
                    className="grid min-h-16 w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-6 text-left md:grid-cols-[5rem_1fr_auto] md:py-8"
                  >
                    <span className="font-serif text-lg italic text-wine">{a.num}</span>
                    <span
                      className={`font-serif text-[clamp(1.85rem,4.6vw,4rem)] font-[360] leading-[1.02] tracking-[-0.025em] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
                        open ? "md:translate-x-3" : ""
                      }`}
                    >
                      {a.titulo}
                    </span>
                    <span
                      aria-hidden
                      className={`relative mt-2 h-4 w-4 shrink-0 self-center transition-transform duration-500 ${open ? "rotate-45" : ""}`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-ink" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`area-painel-${i}`}
                  role="region"
                  aria-labelledby={`area-btn-${i}`}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  inert={!open}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`grid gap-8 pb-10 pl-[2.75rem] transition-opacity duration-500 md:grid-cols-12 md:pl-[5.75rem] ${open ? "opacity-100 delay-150" : "opacity-0"}`}
                    >
                      <div className="md:col-span-4">
                        <p className="eyebrow text-ink-soft">Do que se trata</p>
                        <p className="mt-3">{a.doQueSeTrata}</p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="eyebrow text-ink-soft">Como podemos orientar</p>
                        <p className="mt-3">{a.comoOrientamos}</p>
                      </div>
                      <div className="md:col-span-4 md:flex md:items-end md:justify-end">
                        <a
                          href={waLink(a.mensagem)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Conversar sobre esta área: ${a.titulo} (abre o WhatsApp)`}
                          className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-wine/30 px-5 font-medium text-wine transition-colors hover:border-wine hover:bg-wine hover:text-paper"
                        >
                          Conversar sobre esta área
                          <Arrow />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
