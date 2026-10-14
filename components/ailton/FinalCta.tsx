import { Reveal } from "@/components/ui/Reveal";
import { addressLine, ailton, telLink } from "@/lib/ailton";
import { WhatsAppCta } from "./ui";

/** Fechamento: uma chamada final e os dados de contato, discretos e completos. */
export function FinalCta() {
  return (
    <section
      id="contato"
      data-hide-float
      aria-labelledby="contato-title"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-ad-line px-4 pt-24 pb-20 sm:px-8 md:pt-36 md:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(ellipse_50%_70%_at_50%_100%,rgb(198_243_107/0.09),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <h2 id="contato-title" className="text-[clamp(2.3rem,12.6vw,2.9rem)] sm:text-7xl lg:text-[6.4rem]">
                Seu próximo passo começa com <span className="text-ad-lime">uma conversa.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.08}>
              <p className="text-[1.05rem] leading-relaxed text-ad-paper/85 md:text-lg">
                Conheça o acompanhamento, tire suas dúvidas e descubra como começar a trabalhar em
                direção aos seus objetivos.
              </p>
              <WhatsAppCta message="final" trackAs="final" className="mt-8 w-full">
                Começar pelo WhatsApp
              </WhatsAppCta>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.05}>
          <address className="mt-20 grid gap-8 border-t border-ad-line pt-10 text-sm not-italic sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[0.65rem] tracking-[0.24em] text-ad-mute uppercase">
                Profissional
              </p>
              <p className="mt-2 text-ad-paper">
                {ailton.name} <span className="text-ad-mute">|</span> {ailton.role}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.24em] text-ad-mute uppercase">Cidade</p>
              <p className="mt-2 text-ad-paper">
                {ailton.city} — {ailton.state}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.24em] text-ad-mute uppercase">
                Telefone / WhatsApp
              </p>
              <a
                href={telLink}
                data-track="ailton_final"
                data-track-label="Telefone"
                className="mt-2 inline-flex min-h-11 items-center text-ad-paper underline decoration-ad-line underline-offset-4 hover:decoration-ad-lime sm:min-h-0"
              >
                {ailton.phone.display}
              </a>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.24em] text-ad-mute uppercase">Endereço</p>
              <a
                href={ailton.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="ailton_final"
                data-track-label="Google Maps"
                className="mt-2 inline-block text-ad-paper underline decoration-ad-line underline-offset-4 hover:decoration-ad-lime"
              >
                {addressLine}
                <span className="mt-1 block text-xs text-ad-lime no-underline">
                  Ver no Google Maps ↗
                </span>
              </a>
            </div>
          </address>
        </Reveal>
      </div>
    </section>
  );
}
