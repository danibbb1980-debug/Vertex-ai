import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { CONFIG, credencial } from "../config";
import { srcSet } from "../lib/utils";
import { Botao, BotaoWhatsapp } from "../components/Base";
import { Escudo, Estrela, Nuvem } from "../components/icons";

/** Único efeito do hero: os elementos sobem e ganham foco em sequência. */
function Entrada({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15 + i * 0.12, duration: 1, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const f = CONFIG.fotos.hero;
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="papel relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-[calc(var(--faixa-h)+112px)] md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pb-24 lg:pt-[calc(var(--faixa-h)+140px)]">
        <div className="relative">
          <Entrada i={0}>
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-rosa-100 bg-white/70 px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-rosa-escuro sm:px-4 sm:text-[0.7rem] sm:tracking-[0.2em]">
              <Estrela className="h-3 w-3 text-sol" />
              Odontopediatria com carinho e cuidado
            </p>
          </Entrada>
          <Entrada i={1}>
            <h1 id="titulo-hero" className="text-[2.55rem] leading-[1.04] text-tinta sm:text-[3.4rem] lg:text-[4.1rem]">
              O primeiro cuidado com o sorriso do seu filho, com{" "}
              <span className="manuscrita relative inline-block whitespace-nowrap">
                carinho
                <svg aria-hidden viewBox="0 0 200 20" className="absolute -bottom-2 left-0 h-3 w-full text-rosa/60" preserveAspectRatio="none">
                  <path d="M3 14c40-8 90-11 194-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
          </Entrada>
          <Entrada i={2}>
            <p className="mt-7 max-w-[34rem] text-[1.08rem] leading-relaxed text-suave md:text-lg">
              Atendimento odontológico infantil acolhedor, com explicações claras para os pais em cada etapa.
            </p>
          </Entrada>
          <Entrada i={3} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoWhatsapp>Agendar avaliação</BotaoWhatsapp>
            <Botao href="#atendimento" variante="secundario">
              Conhecer o atendimento
            </Botao>
          </Entrada>
          <Entrada i={4} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-suave">
            <span className="inline-flex items-center gap-2 font-semibold text-tinta">
              <Escudo className="h-5 w-5 text-rosa-escuro" />
              {CONFIG.cro}
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-tinta/15 sm:block" />
            <span>{credencial}</span>
          </Entrada>
        </div>

        <Entrada i={2} className="relative mx-auto w-full max-w-[420px] lg:max-w-[460px]">
          {/* Moldura editorial em arco */}
          <div aria-hidden className="absolute -inset-2 translate-x-2 translate-y-3 rounded-t-[999px] sm:-inset-3 sm:translate-x-4 sm:translate-y-4 rounded-b-[2.5rem] border border-lilas/40" />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-rosa-50 shadow-[0_40px_80px_-40px_rgba(111,40,67,0.45)]">
            <img
              src={`${f.base}-800.webp`}
              srcSet={srcSet(f.base)}
              sizes="(min-width: 1024px) 460px, 86vw"
              width={f.largura}
              height={f.altura}
              alt={f.alt}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] h-auto w-full object-cover object-[50%_18%]"
            />
          </div>
          <Nuvem className="flutuar absolute -left-8 top-10 w-24 text-ceu/90 md:-left-14 md:w-28" />
          <Estrela className="flutuar absolute -right-2 top-4 h-7 w-7 text-sol [animation-delay:-3s]" />
          <Estrela className="flutuar absolute -left-3 bottom-28 h-4 w-4 text-lilas/70 [animation-delay:-5s]" />
          <div className="absolute -bottom-6 right-2 rounded-2xl border border-white bg-white/95 px-5 py-3.5 shadow-[0_20px_40px_-24px_rgba(59,42,54,0.45)] sm:-right-6">
            <p className="font-hand text-[1.45rem] leading-none text-rosa-escuro">Dra. Beatryz</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-suave">{CONFIG.profissao}</p>
          </div>
        </Entrada>
      </div>
    </section>
  );
}
