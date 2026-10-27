import { ArrowUpRight } from "lucide-react";
import { defaultMessage, treatments, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Eyebrow } from "../ui/WaveMark";

/**
 * Lista editorial (não cards): número, nome, como a clínica chama o serviço e
 * uma linha explicando o que é. Cada linha abre o WhatsApp já com o assunto.
 */
export function Treatments() {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-title" className="bg-cream py-24 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow>Tratamentos</Eyebrow>
              <h2
                id="tratamentos-title"
                className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.4rem)] font-[420] leading-[1.04] text-navy-deep"
              >
                Cuidado para cada necessidade.
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-stone">
                Da restauração ao implante, os tratamentos que a clínica realiza. Toque em um deles para conversar
                sobre o seu caso.
              </p>
              <ButtonLink
                href={whatsappUrl(defaultMessage)}
                external
                className="mt-8"
                icon={<WhatsAppIcon className="size-5" />}
              >
                Agendar avaliação
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        <ol className="border-t border-navy/12 lg:col-span-8">
          {treatments.map((t, i) => (
            <Reveal as="li" key={t.id} delay={(i % 4) * 60} className="border-b border-navy/12">
              <a
                href={whatsappUrl(`Olá! Vim pelo site e gostaria de saber mais sobre ${t.name.toLowerCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.name}: ${t.summary} Conversar pelo WhatsApp`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-7 transition-colors duration-200 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-6 sm:py-8"
              >
                <span className="pt-1.5 text-sm font-semibold tabular-nums text-coral-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-display block text-[1.6rem] font-[440] leading-tight text-navy-deep transition-colors group-hover:text-navy sm:text-[1.95rem]">
                    {t.name}
                  </span>
                  {t.detail && (
                    <span className="mt-2 block text-xs font-bold uppercase tracking-[0.14em] text-navy/70">
                      {t.detail}
                    </span>
                  )}
                  <span className="mt-3 block max-w-xl leading-relaxed text-stone">{t.summary}</span>
                </span>
                <span className="mt-1 inline-flex size-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-sun">
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.8} aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
