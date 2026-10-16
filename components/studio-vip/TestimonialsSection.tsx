import { Reveal } from "@/components/ui/Reveal";
import { studio } from "@/lib/studio-vip";
import { testimonials } from "@/lib/studio-vip-content";
import { ArrowIcon, Eyebrow, StarIcon, Stars } from "./ui";

/**
 * Prova social: só trechos de avaliações reais do Google, com o nome de quem
 * escreveu. Sem foto, sem "resultado", sem contador inventado.
 */
export function TestimonialsSection() {
  const [first, ...rest] = testimonials;

  return (
    <section
      id="avaliacoes"
      className="relative overflow-hidden bg-white py-24 text-vip-graphite sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow tone="dark">A voz dos alunos</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(2.6rem,8vw,5.2rem)] text-vip-900">
                Quem treina aqui tem histórias para contar.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-lg text-vip-graphite/75">
                Conheça as experiências compartilhadas por quem já faz parte do Studio VIP.
              </p>
            </Reveal>
          </div>

          {/* Indicador de reputação */}
          <Reveal delay={0.1} className="lg:justify-self-end">
            <div className="vip-shape inline-flex items-center gap-5 bg-vip-900 px-7 py-6 text-white [--vip-r:2.5rem]">
              <span className="font-vip-display text-7xl leading-none font-extrabold italic">
                {studio.rating.value}
              </span>
              <span>
                <Stars className="size-5" />
                <span className="mt-2 block text-sm font-semibold">
                  {studio.rating.count} avaliações no Google
                </span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Destaque */}
          <Reveal>
            <figure className="vip-quote vip-shape relative flex h-full flex-col justify-between overflow-hidden bg-vip-800 p-8 text-white [--vip-r:3.5rem] sm:p-12">
              <span
                className="pointer-events-none absolute -top-10 right-6 font-vip-display text-[14rem] leading-none font-extrabold text-vip-green/25 italic"
                aria-hidden="true"
              >
                “
              </span>
              <div>
                <span className="flex gap-1 text-vip-green" role="img" aria-label="5 de 5 estrelas">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} className="size-5" />
                  ))}
                </span>
                <blockquote className="relative mt-8 text-2xl leading-snug font-semibold sm:text-[1.9rem]">
                  <p>“{first.quote}”</p>
                </blockquote>
              </div>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="h-10 w-1 bg-vip-green" aria-hidden="true" />
                <span>
                  <span className="block font-bold">{first.name}</span>
                  <span className="text-xs tracking-wide text-white/60 uppercase">
                    Trecho de avaliação no Google
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-6">
            {rest.map((item, index) => (
              <Reveal key={item.name} delay={0.08 * (index + 1)}>
                <figure className="vip-quote h-full border border-vip-900/12 bg-vip-mist p-7 sm:p-9">
                  <span className="flex gap-1 text-vip-800" role="img" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon key={i} className="size-4" />
                    ))}
                  </span>
                  <blockquote className="mt-5 text-lg leading-relaxed font-medium text-vip-900">
                    <p>“{item.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="h-8 w-1 bg-vip-green" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-bold text-vip-900">{item.name}</span>
                      <span className="text-[0.68rem] tracking-wide text-vip-graphite/60 uppercase">
                        Trecho de avaliação no Google
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-12 flex justify-center">
          <a
            href={studio.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            data-track="google"
            data-track-label="ver-avaliacoes"
            className="vip-btn vip-btn-dark"
          >
            Ver todas as avaliações no Google
            <ArrowIcon className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
