import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { site, whatsappUrl } from "@/lib/site-data";
import { faqItems } from "@/lib/faq";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/*
  Accordion com <details>/<summary> nativos: funciona com mouse, teclado
  (Enter/Espaço) e leitores de tela sem nenhum JavaScript. A altura anima com
  ::details-content nos navegadores que suportam; nos demais, abre direto.
*/
const links: Record<string, ReactNode> = {
  maps: (
    <a href={site.links.maps} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-4">
      Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  plans: (
    <a href={whatsappUrl("plans")} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-4">
      Consultar valores no WhatsApp<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  visit: (
    <a href={whatsappUrl("visit")} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-4">
      Combinar uma visita pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  partnerships: (
    <a href={whatsappUrl("partnerships")} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-4">
      Confirmar meu plano no WhatsApp<span className="sr-only"> (abre em nova aba)</span>
    </a>
  ),
  classes: (
    <a href="#modalidades" className="text-orange underline underline-offset-4">
      Ver a grade de aulas
    </a>
  ),
};

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative border-t border-white/8 bg-graphite py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Dúvidas frequentes</p>
            <h2 id="faq-title" className="display mt-5 text-[2.5rem] sm:text-5xl">
              Perguntas <span className="text-orange">frequentes</span>
            </h2>
            <p className="mt-5 text-mist">
              Não encontrou o que procurava? A equipe responde pelo WhatsApp.
            </p>
            <Button href={whatsappUrl("default")} external variant="outline" icon={<WhatsAppIcon className="h-5 w-5" />} className="mt-7">
              Tirar uma dúvida
            </Button>
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delay={i * 50}>
              <details className="faq-item group border-b border-white/10 first:border-t" name="faq">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                  <span className="text-lg font-semibold text-white transition-colors group-hover:text-orange sm:text-xl">
                    {item.question}
                  </span>
                  <span className="faq-icon flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-white transition-all duration-300">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <div className="pr-4 pb-7 text-mist sm:pr-16">
                  <p>{item.answer}</p>
                  {item.link && <p className="mt-3">{links[item.link]}</p>}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
