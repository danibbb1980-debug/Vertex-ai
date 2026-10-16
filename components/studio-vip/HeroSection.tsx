import Image from "next/image";
import equipe from "@/public/studio-vip/equipe.jpg";
import { studio } from "@/lib/studio-vip";
import { ArrowIcon, Chevrons, StarIcon, WhatsAppLink } from "./ui";

/**
 * Primeira dobra.
 *
 * A entrada usa as animações CSS do globals.css (.anim-*), que rodam na
 * primeira pintura sem esperar o JS. A foto é o LCP no desktop: vai com
 * `priority`, tamanhos responsivos e AVIF/WebP pelo next/image.
 */
export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-vip-900 pt-24 pb-12 sm:pt-28 lg:pt-30 lg:pb-20"
    >
      {/* Fundo: gradiente azul da marca + textura de linhas diagonais sutil */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_85%_10%,#0b5a89_0%,#064875_38%,#04375a_70%,#022a46_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] bg-[repeating-linear-gradient(115deg,#fff_0_1px,transparent_1px_22px)] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]"
        aria-hidden="true"
      />

      {/* "STUDIO VIP" vertical gigante, como nas peças do Instagram */}
      <div
        className="parallax pointer-events-none absolute top-24 right-[-0.12em] -z-10 hidden origin-top-right text-[11rem] lg:block xl:text-[13rem]"
        style={{ "--parallax-shift": "90px" } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="vip-ghost vip-ghost-solid block [writing-mode:vertical-rl]">
          Studio VIP
        </span>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* ── Texto ── */}
        <div className="relative">
          <p
            className="anim-fade-up flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.16em] text-white/85 uppercase sm:text-xs sm:tracking-[0.24em]"
            style={{ "--d": "0s" } as React.CSSProperties}
          >
            <span className="h-5 w-1 bg-vip-green" aria-hidden="true" />
            <span>
              Studio VIP <span className="mx-1 text-vip-green">|</span> Treinamento personalizado
            </span>
          </p>

          <h1 className="mt-5 text-[clamp(3.3rem,14vw,5.9rem)] sm:mt-6">
            <span className="anim-fade-up block" style={{ "--d": "0.05s" } as React.CSSProperties}>
              Seu treino.
            </span>{" "}
            <span className="anim-fade-up block" style={{ "--d": "0.12s" } as React.CSSProperties}>
              Sua rotina.
            </span>{" "}
            <span
              className="anim-fade-up block text-vip-green"
              style={{ "--d": "0.19s" } as React.CSSProperties}
            >
              Sua evolução.
            </span>
          </h1>

          <p
            className="anim-fade-up mt-6 max-w-xl text-base leading-relaxed font-medium text-white sm:text-lg"
            style={{ "--d": "0.26s" } as React.CSSProperties}
          >
            Treinamento personalizado, acompanhamento próximo e uma equipe preparada para ajudar
            você a evoluir no seu ritmo.
          </p>
          <p
            className="anim-fade-up mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            Mais do que treinar, você encontra orientação, acolhimento e um plano que considera seus
            objetivos e sua realidade.
          </p>

          <div
            className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            style={{ "--d": "0.36s" } as React.CSSProperties}
          >
            <WhatsAppLink message="hero" trackAs="hero" className="w-full sm:w-auto">
              Quero agendar uma aula experimental
            </WhatsAppLink>
            <a
              href="#diferenciais"
              className="vip-btn vip-btn-ghost w-full sm:w-auto"
              data-track="ancora"
              data-track-label="hero-conheca"
            >
              Conheça o Studio
              <ArrowIcon className="size-4 rotate-90" />
            </a>
          </div>

          <a
            href={studio.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="anim-fade-up group mt-7 inline-flex items-center gap-3 text-sm text-white/80"
            style={{ "--d": "0.42s" } as React.CSSProperties}
            data-track="google"
            data-track-label="hero-avaliacoes"
          >
            <span className="flex gap-0.5 text-vip-green" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="size-4" />
              ))}
            </span>
            <span>
              <strong className="font-bold text-white">{studio.rating.value}</strong> no Google
              <span className="mx-2 text-white/35">|</span>
              <span className="underline-offset-4 group-hover:underline">
                {studio.rating.count} avaliações
              </span>
            </span>
          </a>
        </div>

        {/* ── Foto da equipe, na silhueta do logotipo ── */}
        <div
          className="anim-rise-in relative mx-auto w-full max-w-[38rem] lg:mx-0 lg:justify-self-end"
          style={{ "--d": "0.15s" } as React.CSSProperties}
        >
          <div
            className="vip-shape-line"
            style={
              {
                "--vip-r": "clamp(3rem, 9vw, 6.5rem)",
                "--vip-line-gap": "12px",
              } as React.CSSProperties
            }
          >
            <div className="vip-shape relative aspect-[920/620] overflow-hidden bg-vip-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              <Image
                src={equipe}
                alt="Vando e integrantes da equipe do Studio VIP, de braços cruzados e sorrindo"
                priority
                fetchPriority="high"
                placeholder="blur"
                sizes="(min-width: 1280px) 608px, (min-width: 1024px) 46vw, (min-width: 640px) 90vw, 100vw"
                className="h-full w-full object-cover object-top"
              />
              {/* Integra a foto ao azul da marca sem alterar as pessoas */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(4,55,90,0.75)_0%,rgba(4,55,90,0)_32%),linear-gradient(to_right,rgba(6,72,117,0.35),transparent_30%)]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Selo de reputação sobreposto */}
          <div className="absolute -bottom-6 left-4 hidden items-center gap-3 rounded-[0_1.25rem_0_1.25rem] bg-white px-4 py-3 text-vip-graphite shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)] sm:left-8 sm:flex">
            <span className="font-vip-display text-4xl leading-none font-extrabold text-vip-900 italic">
              {studio.rating.value}
            </span>
            <span className="text-[0.7rem] leading-tight font-semibold">
              <span className="flex gap-0.5 text-[#d79a00]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="size-3" />
                ))}
              </span>
              <span className="mt-1 block">{studio.rating.count} avaliações no Google</span>
            </span>
          </div>

          <Chevrons className="absolute -right-1 bottom-6 hidden text-5xl text-white sm:inline-flex" />
        </div>
      </div>
    </section>
  );
}
