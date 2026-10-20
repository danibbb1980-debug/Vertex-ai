import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { site, whatsappUrl } from "@/lib/site-data";
import { faqItems, type FaqLink } from "@/lib/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";

/*
  Accordion com <details>/<summary> nativos: funciona com mouse, teclado e
  leitores de tela sem JavaScript. A altura anima onde ::details-content existe.
*/
const linkClass = "font-semibold text-teal underline decoration-2 underline-offset-4 hover:text-teal-dark";

const links: Record<FaqLink, ReactNode> = {
  whatsapp: (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
      Conversar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  instagram: (
    <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
      Abrir o Instagram<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  maps: (
    <a href={site.links.maps} target="_blank" rel="noopener noreferrer" className={linkClass}>
      Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
};

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="bg-paper py-20 sm:py-28">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <SectionHeading
          id="duvidas-title"
          eyebrow="Dúvidas"
          title="Perguntas frequentes"
          intro="Respostas rápidas sobre contato, agendamento e localização."
          className="lg:col-span-5"
        />

        <div className="lg:col-span-7">
          {faqItems.map((item) => (
            <details key={item.question} name="faq" className="faq-item group border-b border-line first:border-t">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 rounded-xl py-5 text-left">
                <span className="text-lg font-semibold text-ink transition-colors group-hover:text-teal">{item.question}</span>
                <span className="faq-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="pr-4 pb-6 text-muted sm:pr-16">
                <p>{item.answer}</p>
                {item.link && <p className="mt-3">{links[item.link]}</p>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
