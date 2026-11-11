import { motion, useReducedMotion } from "motion/react";
import { CONFIG } from "../config";
import { crmTexto, waLink } from "../lib";
import { Brain, BRAIN_EXIT } from "./Brain";
import { Seta } from "./Icons";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Revelação lenta por linha: cada linha sobe de dentro de uma máscara. */
function Linha({ children, i, reduce }: { children: React.ReactNode; i: number; reduce: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.5, delay: 0.25 + i * 0.22, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ onBrainDone }: { onBrainDone: () => void }) {
  const reduce = !!useReducedMotion();
  const crm = crmTexto();
  const fade = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 1.4, delay: d, ease: "easeOut" as const },
        };

  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative mx-auto max-w-[1280px] px-5 pb-20 pt-[calc(var(--header-h)+var(--draft-h,0px)+2.5rem)] md:px-10 md:pb-28 lg:px-14 lg:pt-[calc(var(--header-h)+var(--draft-h,0px)+4.5rem)]"
    >
      <div className="grid items-center gap-y-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="relative z-10 lg:col-span-7">
          <motion.p {...fade(0.1)} className="label text-stone">
            {CONFIG.titulo} <span aria-hidden="true">·</span> {CONFIG.cidade} - {CONFIG.uf}{" "}
            <span aria-hidden="true">·</span> Presencial e online
          </motion.p>

          <h1
            id="hero-titulo"
            className="mt-6 text-[clamp(2.9rem,8.4vw,6rem)] leading-[0.96] tracking-[-0.035em] text-ink"
          >
            <Linha i={0} reduce={reduce}>
              Um espaço
            </Linha>
            <Linha i={1} reduce={reduce}>
              para ser <span className="text-emerald">ouvido.</span>
            </Linha>
          </h1>

          <motion.p {...fade(1.1)} className="mt-8 max-w-[34rem] text-[1.2rem] leading-[1.55] text-graphite md:text-[1.3rem]">
            Atendimento para adultos e adolescentes, com escuta, avaliação individual e acompanhamento, com hora marcada.
          </motion.p>

          <motion.div {...fade(1.4)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary chamfer">
              Agendar minha consulta <Seta />
            </a>
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="btn btn-ghost ol chamfer">
                Conhecer os atendimentos
              </a>
            )}
          </motion.div>

          <motion.div
            {...fade(1.7)}
            className="mt-14 flex items-stretch gap-4 border-t border-rule pt-5 font-display text-[0.95rem]"
          >
            <span aria-hidden="true" className="mt-1 block h-3 w-3 shrink-0 rotate-45 border border-emerald" />
            <span className="leading-snug">
              <span className="block font-medium text-ink">{CONFIG.nome}</span>
              <span className="block text-stone">
                {crm ? `${crm} · ` : ""}
                Consultório em {CONFIG.cidade} - {CONFIG.uf}
              </span>
            </span>
          </motion.div>
        </div>

        <figure className="relative order-first w-[46vw] max-w-[15rem] sm:max-w-[17rem] lg:order-none lg:col-span-5 lg:w-full lg:max-w-[26rem] lg:justify-self-end">
          <div className="relative">
            <Brain
              draw
              duration={6.5}
              delay={0.5}
              onDone={onBrainDone}
              className="block h-auto w-full text-ink"
              title="Cérebro desenhado com uma linha contínua, símbolo do Dr. Melqui Massa"
            />
            {/* ponto de saída do traço: âncora do fio */}
            <span
              data-fio
              aria-hidden="true"
              className="absolute block h-px w-px"
              style={{ left: `${BRAIN_EXIT.x * 100}%`, top: `${BRAIN_EXIT.y * 100}%` }}
            />
          </div>
          <figcaption className="mt-6 hidden max-w-[17rem] lg:block text-[0.95rem] italic leading-snug text-stone">
            Uma linha só, com entrada, curvas e saída. Um caminho que se percorre com acompanhamento.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
