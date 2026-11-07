import { motion, useReducedMotion } from "motion/react";
import { CONFIG } from "../config";
import { MONOGRAMA_PATH } from "../lib/monograma";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { curto, resumoFds } from "../lib/horarios";
import { Botao } from "./Botao";
import { IconeRelogio, IconeWhatsapp } from "./Icones";
import { TextReveal } from "./TextReveal";

export function Hero() {
  const reduced = useReducedMotion();
  const semana = CONFIG.horarios.find((h) => h.dias.includes(1));
  const fds = resumoFds();
  const temAtendimentos = CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0;

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className="relative overflow-hidden pt-[calc(var(--faixa-h)+6.5rem)] pb-16 sm:pb-24 lg:pt-[calc(var(--faixa-h)+8rem)]"
    >
      <div aria-hidden="true" className="luz pointer-events-none absolute inset-0" />
      <svg aria-hidden="true" viewBox="0 0 64 64" className="pointer-events-none absolute -right-16 top-[calc(var(--faixa-h)+3rem)] w-[80vw] text-ameixa/[0.07] sm:hidden">
        <path d={MONOGRAMA_PATH} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div>
          <motion.p
            className="rotulo"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Estética · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          </motion.p>
          <h1
            id="titulo-hero"
            className="mt-5 font-serif text-[2.9rem] leading-[1.02] tracking-[-0.025em] text-grafite sm:text-6xl lg:text-[5.2rem]"
          >
            <TextReveal text="Cuidado com a sua pele, no *seu* horário." onView={false} delay={0.1} />
            <span className="sr-only"> {CONFIG.marca.nomeCompleto} em {CONFIG.endereco.cidade}.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-tinta-suave sm:text-xl">
            Depilação, limpeza de pele e dermaplaning, com atendimento de segunda a sexta das 6h30 às 21h, e aos fins
            de semana pela manhã.
          </p>
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {temWhatsapp ? (
              <Botao href={linkWhatsapp()} externo icone={<IconeWhatsapp />}>
                Agendar pelo WhatsApp
              </Botao>
            ) : null}
            {temAtendimentos ? (
              <Botao href="#atendimentos" variante="secundario">
                Ver atendimentos
              </Botao>
            ) : null}
          </motion.div>
          {semana && fds ? (
            <p className="mt-8 flex items-center gap-2.5 text-[0.95rem] text-tinta-suave">
              <IconeRelogio className="size-5 text-salvia-texto" />
              <span>
                Seg. a sex. {curto(semana.abre)} às {curto(semana.fecha)}
                <span aria-hidden="true" className="mx-2 text-salvia">/</span>
                {fds.curto} {curto(fds.h.abre)} às {curto(fds.h.fecha)}
              </span>
            </p>
          ) : null}
        </div>

        {/* Composição de assinatura: monograma desenhado + luz suave */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-[30rem] sm:block" aria-hidden="true">
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,#f2d8cb_0%,rgba(242,216,203,0.35)_55%,transparent_100%)]" />
          <div className="absolute inset-[18%] rounded-full border border-ameixa/10" />
          <div className="absolute inset-[2%] rounded-full border border-dashed border-salvia/25" />
          <svg viewBox="0 0 64 64" className="absolute inset-[16%] text-ameixa">
            <motion.path
              d={MONOGRAMA_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            />
          </svg>
          <span data-trace="inicio" className="absolute left-[86%] top-[60%] size-px" />
        </div>
      </div>
    </section>
  );
}
