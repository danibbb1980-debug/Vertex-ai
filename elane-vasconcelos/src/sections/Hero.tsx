import { m, useReducedMotion } from "motion/react";
import { CONFIG, temRegistro } from "../config";
import { Botao } from "../components/Botao";
import { Foto } from "../components/Foto";
import { IconeWhatsApp } from "../components/Icones";
import { VerticalCutReveal } from "../components/VerticalCutReveal";
import { waLink } from "../lib/whatsapp";

/** Arco dourado de fundo, desenhado na entrada. */
function ArcoHero() {
  const reduzido = useReducedMotion();
  return (
    <svg aria-hidden="true" viewBox="0 0 600 600" fill="none" className="pointer-events-none absolute -right-[30%] -top-[6%] w-[150%] max-w-none sm:-right-[12%] sm:w-[115%] lg:-right-[18%] lg:-top-[12%] lg:w-[125%]">
      <m.circle
        cx="300" cy="300" r="270" stroke="#B8956A" strokeWidth="0.9"
        initial={reduzido ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 0.86, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{ rotate: 112, transformOrigin: "300px 300px" }}
      />
      <circle cx="300" cy="300" r="232" stroke="#E9CFC8" strokeWidth="0.8" />
    </svg>
  );
}

export function Hero() {
  const reduzido = useReducedMotion();
  if (!CONFIG.secoes.hero) return null;
  const foto = CONFIG.fotos.hero;
  const entrada = (d: number) =>
    reduzido ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-36" : "pt-28"} pb-16 sm:pb-24 lg:pb-28`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,#f2e0db_0%,transparent_55%)]" />
      <div className="container-site relative z-[1] grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <m.p {...entrada(0)} className="rotulo flex items-start gap-3 text-ouro-tinta">
            <span aria-hidden="true" data-fio="ponto" className="mt-[0.2rem] inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-ouro bg-marfim" />
            <span>Estética e furo de orelha infantil · São João da Boa Vista - SP</span>
          </m.p>
          <h1 id="titulo-hero" className="mt-6 text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            <VerticalCutReveal texto="Cuidado delicado, com atenção a cada detalhe." enfase="atenção" />
          </h1>
          <m.p {...entrada(0.7)} className="mt-7 max-w-xl text-lg text-texto sm:text-xl">
            Atendimento com hora marcada, explicações claras e acolhimento para você e para a sua família.
          </m.p>
          {temRegistro() && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ouro/50 px-4 py-1.5 text-sm text-cacau">
              {CONFIG.profissional.titulo} · {CONFIG.profissional.registro}
            </p>
          )}
          <m.div {...entrada(0.85)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {CONFIG.whatsapp && (
              <Botao href={waLink()} externo icone={<IconeWhatsApp className="h-5 w-5" />}>
                Agendar pelo WhatsApp
              </Botao>
            )}
            {CONFIG.secoes.atendimentos && (
              <Botao href="#atendimentos" variante="secundario">Ver atendimentos</Botao>
            )}
          </m.div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <ArcoHero />
          {foto ? (
            <div
              className="relative mx-auto aspect-[3/4] w-[86%] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_30px_60px_-30px_rgba(46,33,36,0.45)]"
            >
              <Foto foto={foto} prioridade sizes="(min-width: 1024px) 34vw, 80vw" imgClassName="object-[50%_30%]" />
            </div>
          ) : (
            <div className="relative mx-auto grid aspect-[3/4] w-[86%] place-items-center rounded-t-full rounded-b-[2rem] bg-blush-2" />
          )}
        </div>
      </div>
    </section>
  );
}
