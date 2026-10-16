import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/lib/studio-vip-content";
import { Eyebrow, WhatsAppLink } from "./ui";

/**
 * Perguntas frequentes com <details> nativo: acessível por teclado, legível
 * sem JS e encontrável pela busca do navegador. A abertura é animada por CSS
 * (::details-content) onde houver suporte; nos demais, abre normalmente.
 */
export function FAQSection() {
  return (
    <section id="duvidas" className="bg-vip-mist py-24 text-vip-graphite sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow tone="dark">Perguntas frequentes</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-[clamp(2.6rem,8vw,4.8rem)] text-vip-900">Antes de começar.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-sm leading-relaxed text-vip-graphite/75">
              Ficou com outra dúvida? A equipe responde pelo WhatsApp.
            </p>
            <WhatsAppLink message="main" trackAs="faq" variant="dark" className="mt-6">
              Perguntar no WhatsApp
            </WhatsAppLink>
          </Reveal>
        </div>

        <ul className="border-t border-vip-900/15">
          {faq.map((item, index) => (
            <Reveal
              as="li"
              key={item.q}
              delay={Math.min(index * 0.04, 0.2)}
              className="border-b border-vip-900/15"
            >
              <details className="vip-faq group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-bold text-vip-900">
                  {item.q}
                  <span
                    className="vip-faq-icon relative flex size-9 shrink-0 items-center justify-center rounded-[0_0.8rem_0_0.8rem] bg-vip-900 text-vip-green transition-colors group-open:bg-vip-green group-open:text-vip-900"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-2xl pr-12 pb-6 leading-relaxed text-vip-graphite/80">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
