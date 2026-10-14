import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ailton, steps } from "@/lib/ailton";
import { Eyebrow, WhatsAppCta } from "./ui";
import trainingPhoto from "@/public/ailton/ailton-davila-treino.jpg";

/**
 * "Você não precisa treinar no escuro" — a seção literalmente se ilumina
 * quando entra na tela (holofote radial em CSS), e a linha que liga as três
 * etapas se desenha. As etapas são apresentadas como proposta de
 * funcionamento, com uma nota deixando claro que os detalhes são combinados
 * com o Ailton.
 */
export function CoachingProcess() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="processo-title"
      className="relative isolate scroll-mt-16 overflow-hidden px-4 py-24 sm:px-8 md:py-36"
    >
      <Reveal className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]">
        <div className="ad-spotlight absolute inset-0" aria-hidden="true" />
      </Reveal>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Como funciona</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="processo-title" className="mt-7 text-[2.6rem] sm:text-6xl lg:text-[5.2rem]">
                Você não precisa
                <br className="hidden sm:block" /> treinar{" "}
                <span className="ad-serif text-[1.06em] text-ad-lime">no escuro.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ad-mute md:text-lg">
                Ter dúvidas sobre os exercícios, não saber como organizar o treino ou sentir
                dificuldade para manter a consistência pode tornar a jornada mais complicada. Um
                acompanhamento profissional ajuda você a entender melhor o processo e a treinar com
                mais direção.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="hidden lg:col-span-4 lg:block">
            <figure className="ad-grain relative ml-auto w-56 overflow-hidden xl:w-60">
              <Image
                src={trainingPhoto}
                alt={`${ailton.name} durante um treino na academia`}
                sizes="15rem"
                quality={85}
                className="h-auto w-full"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ad-black/90 to-transparent px-4 pt-10 pb-3 text-[0.6rem] tracking-[0.3em] text-ad-paper/80 uppercase">
                {ailton.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Etapas */}
        <Reveal delay={0.05}>
          <ol className="relative mt-20 grid gap-12 md:mt-28 md:grid-cols-3 md:gap-10">
            {/* Linha que liga as etapas (desktop) */}
            <span
              className="ad-draw absolute top-[1.375rem] right-0 left-0 hidden h-px bg-linear-to-r from-ad-lime via-ad-lime/50 to-ad-line md:block"
              aria-hidden="true"
            />
            {/* Linha vertical (mobile) */}
            <span
              className="absolute top-2 bottom-2 left-[1.375rem] w-px bg-linear-to-b from-ad-lime via-ad-line to-transparent md:hidden"
              aria-hidden="true"
            />
            {steps.map((step) => (
              <li key={step.n} className="relative grid grid-cols-[auto_1fr] gap-6 md:block">
                <span className="relative z-10 flex size-11 items-center justify-center border border-ad-lime bg-ad-black font-ad-display text-lg text-ad-lime">
                  {step.n}
                </span>
                <div className="md:mt-9">
                  <h3 className="text-3xl text-ad-paper md:text-4xl">{step.title}</h3>
                  <p className="mt-4 max-w-xs text-[0.98rem] leading-relaxed text-ad-mute">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-20 flex flex-col gap-8 border-t border-ad-line pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-ad-mute">
              As etapas mostram uma proposta de como o acompanhamento é conduzido. Formato,
              frequência e demais detalhes são combinados diretamente com o Ailton.
            </p>
            <WhatsAppCta message="process" trackAs="processo" className="shrink-0">
              Conversar sobre meus objetivos
            </WhatsAppCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
