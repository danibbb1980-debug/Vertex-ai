import { Reveal } from "@/components/ui/Reveal";
import { ailton, faq, waLink } from "@/lib/ailton";
import { Eyebrow, WhatsAppIcon } from "./ui";

/**
 * Perguntas frequentes em <details> nativo: acessível por teclado, achável
 * pela busca da página e legível sem JavaScript. A abertura é animada em CSS
 * (::details-content) onde o navegador suporta.
 *
 * Respostas honestas: o que não foi confirmado (valores, planos, horários)
 * é encaminhado para o WhatsApp, nunca inventado.
 */
export function Faq() {
  return (
    <section
      id="duvidas"
      aria-labelledby="duvidas-title"
      className="relative scroll-mt-16 border-t border-ad-line bg-ad-graphite/40 px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>Dúvidas frequentes</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="duvidas-title" className="mt-7 text-[2.6rem] sm:text-6xl">
              Antes de <span className="text-ad-lime">começar.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-ad-mute">
              Não encontrou o que procurava? Pergunte direto ao Ailton.
            </p>
            <a
              href={waLink("faq")}
              target="_blank"
              rel="noopener noreferrer"
              data-track="ailton_faq"
              data-track-label="Perguntar no WhatsApp"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-semibold tracking-[0.18em] text-ad-lime uppercase underline decoration-ad-lime/40 underline-offset-8 transition-colors hover:decoration-ad-lime"
            >
              <WhatsAppIcon className="size-4" />
              Perguntar no WhatsApp
            </a>
          </Reveal>
        </div>

        <ul className="border-t border-ad-line lg:col-span-8">
          {faq.map((item, index) => (
            <Reveal as="li" key={item.q} delay={Math.min(index * 0.04, 0.16)}>
              <details className="group border-b border-ad-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.05rem] font-medium text-ad-paper transition-colors hover:text-ad-lime md:text-lg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    className="ad-faq-icon relative flex size-9 shrink-0 items-center justify-center border border-ad-line text-ad-lime group-open:border-ad-lime"
                    aria-hidden="true"
                  >
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className="absolute h-3.5 w-px bg-current" />
                  </span>
                </summary>
                <div className="max-w-2xl pr-12 pb-7 text-[0.98rem] leading-relaxed text-ad-mute">
                  <p>{item.a}</p>
                  {"maps" in item && item.maps && (
                    <a
                      href={ailton.google.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="ailton_faq"
                      data-track-label="Abrir no Google Maps"
                      className="mt-4 inline-flex min-h-11 items-center text-[0.75rem] font-semibold tracking-[0.18em] text-ad-paper uppercase underline decoration-ad-lime underline-offset-8 hover:text-ad-lime"
                    >
                      Abrir no Google Maps ↗
                    </a>
                  )}
                  {"cta" in item && item.cta && (
                    <a
                      href={waLink(item.cta)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="ailton_faq"
                      data-track-label={item.q}
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-semibold tracking-[0.18em] text-ad-lime uppercase underline decoration-ad-lime/40 underline-offset-8 hover:decoration-ad-lime"
                    >
                      <WhatsAppIcon className="size-4" />
                      Perguntar no WhatsApp
                    </a>
                  )}
                </div>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
