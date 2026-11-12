import { m, useReducedMotion } from "motion/react";
import { CONFIG } from "../config";
import { MeioMonograma } from "./Marca";
import { BotaoContato, IconeSeta } from "./ui";

const EASE = [0.7, 0, 0.2, 1] as const;

/**
 * Momento de assinatura: a barra do monograma desce e se desenha;
 * B e N se afastam dela e cada um ancora uma coluna de conteúdo.
 * Com prefers-reduced-motion, tudo aparece já desenhado.
 */
export function Hero() {
  const reduzir = useReducedMotion();
  const anim = !reduzir;

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative pb-20 pt-36 sm:pt-40 lg:pb-28 lg:pt-44">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-fio pb-4">
          <p className="rotulo text-pedra">Advocacia · Varginha - MG</p>
          <p className="rotulo hidden text-pedra sm:block">{CONFIG.nome}</p>
        </div>

        <div style={{ ["--m" as string]: "clamp(5.5rem,17vw,14.5rem)" }} className="mt-12 grid grid-cols-[1fr_auto_1fr] gap-x-3 sm:gap-x-5 lg:mt-16 lg:gap-x-10">
          {/* Linha 1: B | N */}
          <m.div
            className="flex justify-end"
            initial={anim ? { x: 22, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.75 }}
          >
            <MeioMonograma lado="b" className="h-[var(--m)] w-auto text-tinta" />
          </m.div>

          <div className="row-span-1 flex flex-col items-center lg:row-span-2" aria-hidden="true">
            <m.span
              className="block bg-tinta"
              style={{ width: "calc(var(--m) * 0.033)", height: "calc(var(--m) * 0.987)", marginTop: "calc(var(--m) * 0.007)", transformOrigin: "top" }}
              initial={anim ? { scaleY: 0 } : false}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.05, ease: EASE, delay: 0.15 }}
            />
            <m.span
              className="hidden w-px flex-1 bg-fio lg:block"
              style={{ transformOrigin: "top" }}
              initial={anim ? { scaleY: 0 } : false}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 1.2 }}
            />
          </div>

          <m.div
            className="flex justify-start"
            initial={anim ? { x: -22, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.75 }}
          >
            <MeioMonograma lado="n" className="h-[var(--m)] w-auto text-tinta" />
          </m.div>

          {/* Linha 2: as duas colunas de conteúdo */}
          <div className="col-span-3 mt-12 lg:col-span-1 lg:mt-14 lg:text-right">
            <h1 id="titulo-hero" className="titulo text-[2.75rem] leading-[0.98] xs:text-[3.2rem] sm:text-[4.25rem] lg:ml-auto lg:max-w-[11ch] lg:text-[5.25rem]">
              Seus direitos, <span className="enfase">explicados</span> com clareza.
            </h1>
          </div>

          <m.div
            className="col-span-3 mt-8 lg:col-span-1 lg:col-start-3 lg:mt-16"
            initial={anim ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.5 }}
          >
            <p className="max-w-[34ch] text-[1.15rem] leading-relaxed text-pedra sm:text-[1.25rem]">
              Atuação em Direito do Trabalho e Direito Previdenciário, com atendimento direto pelos sócios.
            </p>
            <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              <BotaoContato />
              <a href="#areas" className="btn btn-linha">
                Conhecer as áreas de atuação
                <IconeSeta />
              </a>
            </div>
            <p className="mt-10 flex items-center gap-3 text-sm text-pedra">
              <span aria-hidden="true" className="inline-block h-4 w-[3px] bg-verde" />
              Telefone do escritório:{" "}
              <a className="link num text-tinta" href={CONFIG.telefoneHref}>
                {CONFIG.telefone}
              </a>
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
