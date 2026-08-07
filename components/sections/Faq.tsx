import { ChevronDown, MessageCircle } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { LinkButton } from "../ui/Button";
import { faq } from "@/lib/content";
import { whatsappUrl } from "@/lib/site";

/**
 * Objection handling.
 *
 * Native <details>/<summary>: keyboard accessible, findable by in-page search,
 * and readable with JavaScript disabled — no state, no hydration cost. The
 * answers also feed the FAQPage structured data in app/page.tsx.
 */
export function Faq() {
  return (
    <Section id="duvidas" className="scroll-mt-24">
      <SectionHeader eyebrow={faq.eyebrow} title={faq.title} sub={faq.sub} accent="antes de começar" />

      <ul className="mx-auto mt-14 max-w-3xl space-y-3">
        {faq.items.map((item, index) => (
          <Reveal as="li" key={item.q} delay={Math.min(index * 0.04, 0.2)}>
            <details className="group rounded-xl border border-line bg-surface/40 transition-colors duration-300 open:bg-surface hover:border-white/20">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[0.95rem] font-medium text-cloud [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="size-4 shrink-0 text-mist transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-6 pb-5 text-[0.95rem] leading-relaxed text-mist">{item.a}</div>
            </details>
          </Reveal>
        ))}
      </ul>

      {/* Escape hatch for the objection that isn't listed */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-line bg-ink-2/50 p-7 text-center">
          <p className="text-base text-cloud">Ficou com outra dúvida?</p>
          <p className="mt-2 text-sm text-mist">
            Manda a pergunta no WhatsApp. Sem robô, sem formulário longo.
          </p>
          <LinkButton
            href={whatsappUrl("faq")}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            className="mt-5"
            trackAs="faq"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Perguntar no WhatsApp
          </LinkButton>
        </div>
      </Reveal>
    </Section>
  );
}
