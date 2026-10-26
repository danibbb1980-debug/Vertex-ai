import { faq } from "@/lib/faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="relative bg-paper-2 py-24 sm:py-32 lg:py-36">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionLabel index="06">Dúvidas</SectionLabel>
          <h2 id="duvidas-title" className="display h-section mt-8 text-graphite">
            Perguntas <em>frequentes</em>.
          </h2>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-graphite/15">
            {faq.map((item) => (
              <details key={item.question} className="faq-item group border-b border-graphite/15">
                <summary className="flex min-h-16 list-none items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium text-graphite transition-colors hover:text-sage sm:text-lg">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="faq-icon relative h-4 w-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current"
                  />
                </summary>
                <p className="max-w-[38rem] pb-6 leading-relaxed text-ink">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
