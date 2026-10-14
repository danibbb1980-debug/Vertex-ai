import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ailton } from "@/lib/ailton";
import { CountUp } from "./CountUp";
import { Eyebrow, OutlineButton, Stars } from "./ui";
import awardPhoto from "@/public/ailton/ailton-davila-melhor-pocos-2025.jpg";

/**
 * Autoridade e prova social. Só dados verificáveis: nota e quantidade de
 * avaliações do perfil público do Google, cidade de atendimento e o troféu
 * que aparece na foto enviada pelo profissional. Nenhuma estatística de
 * resultado físico.
 */
export function SocialProof() {
  return (
    <section
      id="acompanhamento"
      aria-labelledby="prova-title"
      className="relative scroll-mt-16 px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            <Eyebrow>Reputação</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="prova-title" className="mt-7 text-[2.6rem] sm:text-6xl lg:text-[4.6rem]">
              Resultados começam com um{" "}
              <span className="ad-serif text-ad-lime sm:text-[1.08em]">bom acompanhamento.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-ad-mute md:text-lg">
              Treinar com orientação faz diferença na forma como você executa os exercícios,
              organiza sua rotina e trabalha em direção aos seus objetivos.
            </p>
          </Reveal>

          {/* Indicadores em tabela editorial, com fios — não cartões */}
          <Reveal delay={0.12}>
            <dl className="mt-14 grid grid-cols-2 border-t border-ad-line">
              <div className="border-r border-b border-ad-line py-7 pr-5">
                <dt className="sr-only">Nota no Google</dt>
                <dd className="flex items-end gap-3">
                  <span className="font-ad-display text-6xl leading-none text-ad-paper md:text-7xl">
                    <CountUp value={ailton.google.rating} decimals={1} />
                  </span>
                </dd>
                <dd className="mt-4 flex flex-col gap-2 text-[0.7rem] tracking-[0.2em] text-ad-mute uppercase">
                  <Stars />
                  Estrelas no Google
                </dd>
              </div>
              <div className="border-b border-ad-line py-7 pl-5 md:pl-8">
                <dt className="sr-only">Avaliações de clientes</dt>
                <dd className="font-ad-display text-6xl leading-none text-ad-paper md:text-7xl">
                  <CountUp value={ailton.google.reviewCount} className="inline-block min-w-[2ch]" />
                </dd>
                <dd className="mt-4 text-[0.7rem] tracking-[0.2em] text-ad-mute uppercase">
                  Avaliações de clientes
                </dd>
              </div>
              <div className="col-span-2 border-b border-ad-line py-7 sm:col-span-1 sm:border-r sm:border-b-0 sm:pr-5">
                <dt className="text-[0.7rem] tracking-[0.2em] text-ad-mute uppercase">
                  Atendimento em
                </dt>
                <dd className="mt-3 font-ad-display text-2xl leading-tight text-ad-paper uppercase md:text-3xl">
                  {ailton.city}
                  <span className="text-ad-lime"> — {ailton.state}</span>
                </dd>
              </div>
              <div className="col-span-2 py-7 sm:col-span-1 sm:pl-5 md:pl-8">
                <dt className="text-[0.7rem] tracking-[0.2em] text-ad-mute uppercase">
                  Na prática
                </dt>
                <dd className="mt-3 font-ad-display text-2xl leading-tight text-ad-paper uppercase md:text-3xl">
                  Acompanhamento atento e orientação profissional
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <OutlineButton
              href={ailton.google.mapsUrl}
              external
              icon="out"
              data-track="ailton_prova"
              data-track-label="Ver avaliações no Google"
              className="mt-10 w-full sm:w-auto"
            >
              Ver avaliações no Google
            </OutlineButton>
          </Reveal>
        </div>

        {/* Foto do reconhecimento */}
        <Reveal delay={0.1} className="lg:col-span-5 lg:pt-24">
          <figure className="mx-auto max-w-md lg:ml-auto">
            <div className="relative">
              <div
                className="absolute -top-3 -left-3 size-16 border-t border-l border-ad-lime"
                aria-hidden="true"
              />
              <div
                className="absolute -right-3 -bottom-3 size-16 border-r border-b border-ad-lime"
                aria-hidden="true"
              />
              <div className="ad-grain relative overflow-hidden bg-ad-graphite">
                <Image
                  src={awardPhoto}
                  alt={`${ailton.name} segurando o troféu Melhor Poços 2025 — Autoridade do Ano`}
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 28rem, 100vw"
                  quality={85}
                  className="ad-parallax h-auto w-full"
                />
              </div>
            </div>
            <figcaption className="mt-6 flex items-start justify-between gap-6 border-t border-ad-line pt-5">
              <span className="font-ad-display text-xl leading-tight text-ad-paper uppercase">
                Melhor Poços 2025
                <span className="block text-ad-lime">Autoridade do Ano</span>
              </span>
              <span className="max-w-[11rem] text-right text-xs leading-relaxed text-ad-mute">
                Reconhecimento recebido por {ailton.name.split(" ")[0]} em 2025.
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
