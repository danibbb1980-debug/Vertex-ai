import { Reveal } from "@/components/ui/Reveal";
import { benefits } from "@/lib/ailton";
import { Eyebrow } from "./ui";

/**
 * Benefícios em lista editorial: número grande vazado, título, texto e um
 * fio que cresce no hover. O título fica fixo à esquerda no desktop enquanto
 * a lista rola. Comunicação de processo — nenhuma promessa de resultado.
 */
export function Benefits() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="relative scroll-mt-16 border-t border-ad-line bg-ad-graphite/40 px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow>O acompanhamento</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="beneficios-title" className="mt-7 text-[2.6rem] sm:text-6xl lg:text-[4.4rem]">
                Um treino que faz <span className="text-ad-lime">sentido</span> para você.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="ad-serif mt-8 max-w-sm text-2xl leading-snug text-ad-paper/70">
                Orientação, objetivo, confiança e constância — o que sustenta um treino bem
                conduzido.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {benefits.map((item, index) => (
            <Reveal as="li" key={item.n} delay={index * 0.05}>
              <article className="ad-benefit group relative grid grid-cols-[3.75rem_1fr] gap-x-5 border-t border-ad-line py-10 sm:grid-cols-[5.5rem_1fr] sm:gap-x-8 md:grid-cols-[7.5rem_1fr] md:py-12">
                <span
                  className="ad-benefit-rule absolute -top-px left-0 h-px w-full bg-ad-lime"
                  aria-hidden="true"
                />
                <span
                  className="ad-benefit-num ad-outline font-ad-display text-6xl leading-none md:text-8xl"
                  aria-hidden="true"
                >
                  {item.n}
                </span>
                <div className="pt-1">
                  <h3 className="text-2xl text-ad-paper md:text-[2rem]">
                    <span className="sr-only">{item.n} — </span>
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ad-mute">
                    {item.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
