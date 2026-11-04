import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { CONFIG } from "../config";
import { waEscritorio } from "../lib/whatsapp";
import { comDestaque } from "../lib/text";
import { MagneticLink, SectionHead } from "./ui";

const EXPO = [0.19, 1, 0.22, 1] as const;
const n = (i: number) => String(i + 1).padStart(2, "0");

function Detalhe({ i }: { i: number }) {
  const a = CONFIG.areas[i];
  return (
    <>
      <p className="text-[1.15rem] leading-[1.55]">{a.descricao}</p>
      <p className="label mt-8 text-ink-soft">Como podemos orientar</p>
      <ul className="mt-4 divide-y divide-rule border-y border-rule">
        {a.orientacoes.map((o) => (
          <li key={o} className="flex items-baseline gap-3 py-3 text-[1rem]">
            <span aria-hidden="true" className="text-accent">
              —
            </span>
            {o}
          </li>
        ))}
      </ul>
      <MagneticLink href={waEscritorio(a.mensagem)} external icon="chat" className="mt-8">
        Conversar sobre {a.titulo}
      </MagneticLink>
    </>
  );
}

export function Areas() {
  const [ativa, setAtiva] = useState(0);
  const [sobre, setSobre] = useState(false);
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="areas" aria-labelledby="areas-titulo" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead num="01" label="Áreas de atuação" id="areas-titulo">
        Onde podemos <em>orientar</em>.
      </SectionHead>

      {/* Desktop: lista grande + painel que troca de conteúdo */}
      <div className="mt-16 hidden gap-12 lg:grid lg:grid-cols-12">
        <ul
          className="border-t border-rule lg:col-span-7"
          onPointerEnter={(e) => e.pointerType === "mouse" && setSobre(true)}
          onPointerLeave={() => setSobre(false)}
        >
          {CONFIG.areas.map((a, i) => {
            const on = ativa === i;
            return (
              <li key={a.id} className="relative border-b border-rule">
                <button
                  type="button"
                  aria-controls="area-painel"
                  aria-pressed={on}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setAtiva(i)}
                  onFocus={() => setAtiva(i)}
                  onClick={() => setAtiva(i)}
                  className="group flex w-full items-baseline gap-8 py-7 text-left transition-opacity duration-500"
                  style={{ opacity: sobre && !on ? 0.4 : 1 }}
                >
                  <span className={`label w-8 transition-colors ${on ? "text-accent" : "text-ink-soft"}`}>{n(i)}</span>
                  <span
                    className="font-display block text-[clamp(2.6rem,4.6vw,4.6rem)] transition-transform duration-700 ease-[var(--ease-long)]"
                    style={{ transform: on ? "translateX(1.25rem)" : "none" }}
                  >
                    {comDestaque(a.titulo, a.destaque)}
                  </span>
                </button>
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-ink transition-transform duration-700 ease-[var(--ease-long)]"
                  style={{ transform: `scaleX(${on ? 1 : 0})` }}
                />
              </li>
            );
          })}
        </ul>
        <div className="lg:col-span-5">
          <div id="area-painel" aria-live="polite" className="sticky top-32 min-h-[30rem] pt-7">
            <p className="label mb-6 text-ink-soft">
              <span className="text-accent">{n(ativa)}</span> / {n(CONFIG.areas.length - 1)}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={ativa}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EXPO }}
              >
                <Detalhe i={ativa} />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Celular e tablet: acordeão */}
      <ul className="mt-12 border-t border-rule lg:hidden">
        {CONFIG.areas.map((a, i) => {
          const on = aberta === i;
          return (
            <li key={a.id} className="border-b border-rule">
              <h3>
                <button
                  type="button"
                  id={`area-btn-${a.id}`}
                  aria-expanded={on}
                  aria-controls={`area-${a.id}`}
                  onClick={() => setAberta(on ? null : i)}
                  className="flex min-h-12 w-full items-baseline gap-4 py-6 text-left"
                >
                  <span className={`label w-7 shrink-0 ${on ? "text-accent" : "text-ink-soft"}`}>{n(i)}</span>
                  <span className="font-display flex-1 text-[clamp(2rem,8.5vw,3.25rem)]">{comDestaque(a.titulo, a.destaque)}</span>
                  <span aria-hidden="true" className="relative size-4 shrink-0 self-center">
                    <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                    <span
                      className="absolute top-1/2 left-0 h-px w-4 bg-current transition-transform duration-500"
                      style={{ transform: on ? "rotate(0deg)" : "rotate(90deg)" }}
                    />
                  </span>
                </button>
              </h3>
              <div className="acc" data-open={on} id={`area-${a.id}`} role="region" aria-labelledby={`area-btn-${a.id}`}>
                <div>
                  <div className="pb-10 pl-11" inert={!on}>
                    <Detalhe i={i} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
