import Image from "next/image";
import { ailton, ratingLabel } from "@/lib/ailton";
import { OutlineButton, Stars, WhatsAppCta } from "./ui";
import heroPhoto from "@/public/ailton/ailton-davila-academia.jpg";

/**
 * Primeira dobra.
 *
 * A foto é real (Ailton na academia), tratada em preto e branco com
 * granulado para virar linguagem editorial — e para disfarçar a baixa
 * resolução do original. No mobile ela ocupa a tela inteira atrás do texto;
 * no desktop vira uma coluna à direita, que se dissolve no preto.
 *
 * Toda a entrada é CSS: o título está no HTML desde a primeira pintura.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* ── Foto ── */}
      <div className="ad-grain absolute inset-0 -z-10 lg:left-auto lg:w-[48%] xl:w-[46%]">
        <div className="ad-settle absolute inset-0">
          <Image
            src={heroPhoto}
            alt={`${ailton.name}, personal trainer, na academia em ${ailton.city}`}
            fill
            preload
            sizes="(min-width: 1024px) 48vw, 100vw"
            quality={90}
            className="object-cover object-[50%_28%] opacity-55 lg:opacity-80"
          />
        </div>
        {/* Dissolve: no mobile para baixo, no desktop para a esquerda */}
        <div className="absolute inset-0 bg-linear-to-t from-ad-black via-ad-black/75 to-ad-black/30 lg:bg-linear-to-r lg:from-ad-black lg:via-ad-black/40 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-linear-to-t from-ad-black to-transparent lg:block" />

        {/* Legenda vertical, como numa ficha de campanha */}
        <p className="absolute top-1/2 right-6 hidden origin-right -translate-y-1/2 rotate-90 text-[0.62rem] tracking-[0.4em] whitespace-nowrap text-ad-paper/60 uppercase xl:block">
          {ailton.name} — {ailton.city}, {ailton.state}
        </p>
      </div>

      {/* Linha vertical sutil na emenda texto/foto */}
      <div
        className="absolute top-0 bottom-0 left-[52%] -z-10 hidden w-px bg-linear-to-b from-transparent via-ad-paper/10 to-transparent lg:block xl:left-[54%]"
        aria-hidden="true"
      />

      {/* ── Conteúdo ── */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-28 pb-10 sm:px-8 md:pb-16 lg:justify-center lg:pt-32 lg:pb-24">
        <div className="max-w-[46rem]">
          <p
            className="anim-fade-up flex items-center gap-x-2.5 text-[0.62rem] font-medium tracking-[0.2em] whitespace-nowrap text-ad-paper/80 uppercase sm:gap-x-3 sm:text-[0.68rem] sm:tracking-[0.3em]"
            style={{ "--d": "0.05s" } as React.CSSProperties}
          >
            <span className="h-px w-5 shrink-0 bg-ad-lime sm:w-8" aria-hidden="true" />
            Personal Trainer
            <span className="text-ad-lime" aria-hidden="true">
              |
            </span>
            {ailton.city} — {ailton.state}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.3rem,12.2vw,4.6rem)] text-ad-paper md:text-[5.4rem] lg:text-[clamp(4.5rem,6.6vw,6.6rem)]"
          >
            <span className="ad-line">
              <span style={{ "--d": "0.1s" } as React.CSSProperties}>Seu próximo nível</span>
            </span>
            <span className="ad-line">
              <span style={{ "--d": "0.2s" } as React.CSSProperties}>começa com o</span>
            </span>
            <span className="ad-line">
              <span className="text-ad-lime" style={{ "--d": "0.3s" } as React.CSSProperties}>
                treino certo.
              </span>
            </span>
          </h1>

          <p
            className="anim-fade-up mt-7 max-w-xl text-[1.05rem] leading-relaxed text-ad-paper/90 md:text-lg"
            style={{ "--d": "0.45s" } as React.CSSProperties}
          >
            Treinamento com acompanhamento profissional, atenção aos detalhes e um plano alinhado
            aos seus objetivos.
          </p>
          <p
            className="anim-fade-up mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ad-mute"
            style={{ "--d": "0.52s" } as React.CSSProperties}
          >
            Mais orientação em cada movimento. Mais confiança para evoluir. Um acompanhamento
            pensado para você.
          </p>

          <div
            className="anim-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ "--d": "0.62s" } as React.CSSProperties}
          >
            <WhatsAppCta message="hero" trackAs="hero">
              Quero começar meu treino
            </WhatsAppCta>
            <OutlineButton
              href="#acompanhamento"
              icon="down"
              className="border-transparent sm:border-ad-paper/25"
            >
              Conheça o acompanhamento
            </OutlineButton>
          </div>

          <a
            href={ailton.google.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="ailton_hero"
            data-track-label="Avaliações Google"
            className="anim-fade-up group mt-9 inline-flex items-center gap-3 border-t border-ad-paper/15 pt-5 text-[0.68rem] font-medium tracking-[0.22em] text-ad-paper/85 uppercase transition-colors hover:text-ad-paper"
            style={{ "--d": "0.74s" } as React.CSSProperties}
          >
            <Stars />
            <span>
              {ratingLabel} no Google <span className="text-ad-mute">·</span>{" "}
              {ailton.google.reviewCount} avaliações
            </span>
          </a>
        </div>
      </div>

      {/* Indicador de rolagem — só desktop */}
      <div
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-14 w-px -translate-x-1/2 bg-ad-paper/10 lg:block"
        aria-hidden="true"
      >
        <span className="ad-scroll-cue absolute inset-0 bg-ad-lime" />
      </div>
    </section>
  );
}
