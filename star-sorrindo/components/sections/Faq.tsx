import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { site, whatsappUrl } from "@/lib/site-data";
import type { FaqItem, FaqLink } from "@/lib/faq";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/*
  Accordion com <details>/<summary> nativos: funciona com mouse, teclado
  (Enter/Espaço) e leitores de tela sem JavaScript. A altura anima com
  ::details-content nos navegadores que suportam.
*/
const linkClass = "font-semibold text-navy underline decoration-gold underline-offset-4 hover:decoration-navy";
const links: Record<FaqLink, ReactNode> = {
  whatsapp: (
    <a href={whatsappUrl("default")} target="_blank" rel="noopener noreferrer" className={linkClass}>
      Falar com a equipe no WhatsApp<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  implants: (
    <a href="/implantes-dentarios/" className={linkClass}>
      Entenda mais sobre implantes
    </a>
  ),
  maps: (
    <a href={site.links.directions} target="_blank" rel="noopener noreferrer" className={linkClass}>
      Traçar rota no Google Maps<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  contact: (
    <a href="/contato/" className={linkClass}>
      Ver contato e horários
    </a>
  ),
};

type Props = { items: FaqItem[]; title?: ReactNode; id?: string };

export function Faq({ items, id = "duvidas", title }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">Perguntas frequentes</p>
            <h2 id={`${id}-title`} className="serif mt-5 text-[2.5rem] sm:text-5xl">
              {title ?? (
                <>
                  Dúvidas <em className="text-gold-ink">frequentes</em>
                </>
              )}
            </h2>
            <p className="mt-5 text-mineral">
              As respostas são informativas e não substituem uma consulta. Não encontrou o que procurava? A equipe responde pelo
              WhatsApp.
            </p>
            <Button href={whatsappUrl("question")} external variant="outline" icon={<WhatsAppIcon className="h-5 w-5" />} className="mt-7">
              Enviar uma dúvida
            </Button>
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          {items.map((item, i) => (
            <Reveal key={item.question} delay={Math.min(i, 6) * 40}>
              <details className="faq-item group border-b border-line first:border-t" name={`faq-${id}`}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-gold-ink sm:text-[1.2rem]">{item.question}</h3>
                  <span className="faq-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-400 ease-out-soft">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <div className="pr-4 pb-7 leading-relaxed text-mineral sm:pr-16">
                  <p>{item.answer}</p>
                  {item.link && <p className="mt-4">{links[item.link]}</p>}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
