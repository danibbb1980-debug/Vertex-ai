import { Reveal } from "@/components/ui/Reveal";
import { ailton, highlights, ratingLabel, reviews } from "@/lib/ailton";
import { Eyebrow, OutlineButton, Stars } from "./ui";

/**
 * Avaliações públicas do Google, com o texto original e o nome exatamente
 * como aparece no perfil. Sem fotos de clientes e sem nota por avaliação:
 * a página só afirma o que é verificável — a média 5,0 e o total de
 * avaliações do perfil.
 */
export function Testimonials() {
  const [featured, ...rest] = reviews;

  return (
    <section
      id="avaliacoes"
      aria-labelledby="avaliacoes-title"
      className="relative scroll-mt-16 border-t border-ad-line px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Eyebrow>Avaliações no Google</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="avaliacoes-title" className="mt-7 text-[2.8rem] sm:text-7xl lg:text-[6rem]">
                Quem conhece,
                <br />
                <span className="text-ad-lime">recomenda.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-5 lg:flex-col lg:items-end lg:gap-3 lg:text-right">
              <span className="font-ad-display text-7xl leading-none text-ad-paper md:text-8xl">
                {ratingLabel}
              </span>
              <div className="flex flex-col gap-2 lg:items-end">
                <Stars className="size-4" />
                <span className="text-[0.7rem] tracking-[0.2em] text-ad-mute uppercase">
                  Média de {ailton.google.reviewCount} avaliações
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px bg-ad-line md:mt-24 lg:grid-cols-12">
          {/* Citação em destaque */}
          {featured && (
            <Reveal className="bg-ad-black lg:col-span-7">
              <figure className="flex h-full flex-col gap-8 py-10 lg:justify-between lg:gap-10 lg:py-14 lg:pr-14">
                <span className="ad-serif text-9xl leading-[0.5] text-ad-lime" aria-hidden="true">
                  “
                </span>
                <blockquote className="ad-serif text-[2rem] leading-[1.15] text-ad-paper sm:text-[2.6rem] lg:text-[3.1rem]">
                  {featured.text}
                </blockquote>
                <figcaption className="flex items-center gap-4 border-t border-ad-line pt-6">
                  <span className="font-ad-display text-lg tracking-[0.04em] text-ad-paper uppercase">
                    {featured.author}
                  </span>
                  <span className="text-[0.65rem] tracking-[0.2em] text-ad-mute uppercase">
                    Avaliação pública no Google
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          )}

          <div className="grid gap-px bg-ad-line lg:col-span-5">
            {rest.map((review, index) => (
              <Reveal key={review.author} delay={0.06 * (index + 1)} className="bg-ad-black">
                <figure className="flex h-full flex-col justify-between gap-8 py-10 lg:pl-14">
                  <blockquote className="ad-serif text-2xl leading-snug text-ad-paper/90 md:text-[1.9rem]">
                    <span className="text-ad-lime" aria-hidden="true">
                      “
                    </span>
                    {review.text}
                    <span className="text-ad-lime" aria-hidden="true">
                      ”
                    </span>
                  </blockquote>
                  <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-ad-display text-base tracking-[0.04em] text-ad-paper uppercase">
                      {review.author}
                    </span>
                    <span className="text-[0.65rem] tracking-[0.2em] text-ad-mute uppercase">
                      Avaliação pública no Google
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Temas recorrentes nas avaliações */}
        <Reveal delay={0.05}>
          <div className="mt-16 grid gap-8 border-t border-ad-line pt-10 lg:grid-cols-12">
            <p className="text-[0.7rem] font-medium tracking-[0.24em] text-ad-mute uppercase lg:col-span-3">
              O que os clientes destacam
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-3 lg:col-span-9">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="border border-ad-line px-4 py-2 text-sm text-ad-paper/85 transition-colors duration-300 hover:border-ad-lime/60"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <OutlineButton
            href={ailton.google.mapsUrl}
            external
            icon="out"
            data-track="ailton_avaliacoes"
            data-track-label="Conferir todas as avaliações"
            className="mt-12 w-full sm:w-auto"
          >
            Conferir todas as avaliações
          </OutlineButton>
        </Reveal>
      </div>
    </section>
  );
}
