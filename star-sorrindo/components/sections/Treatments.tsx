import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { treatments, whatsappUrl } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Ícones finos desenhados para os dois tratamentos principais. */
function ImplantIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3.5c1.6-1 3.2.2 5 0 1.8.2 3.4-1 5 0 1.3 1.7 1 4.4-.3 6.3H7.3C6 7.9 5.7 5.2 7 3.5z" />
      <path d="M10.5 9.8h3l-.3 2.2h-2.4z" />
      <path d="M10 12h4l-.6 8.3c-.2 1-1.8 1-2 0z" />
      <path d="M9.8 14.2l4.4.8M9.9 16.4l4 .8M10.1 18.6l3.6.6" />
    </svg>
  );
}
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5c1.8-1 3.6.4 5.5.2 1.9.2 3.7-1.2 5.5-.2 2 1.6 1.6 5.4.6 7.6-.7 1.6-.7 3.2-1 5-.4 2.4-.9 4.4-1.9 4.4-1.4 0-1.2-4.6-3.2-4.6s-1.8 4.6-3.2 4.6c-1 0-1.5-2-1.9-4.4-.3-1.8-.3-3.4-1-5-1-2.2-1.4-6 .6-7.6z" />
    </svg>
  );
}

const icons: Record<string, LucideIcon | typeof ImplantIcon> = {
  implantes: ImplantIcon,
  proteses: ToothIcon,
  "clinica-geral": Stethoscope,
};

export function Treatments() {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-title" className="border-t border-line bg-white/50 py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Tratamentos"
            id="tratamentos-title"
            title={
              <>
                Cuidados para cada <em className="text-gold-ink">momento do seu sorriso.</em>
              </>
            }
            intro="Além dos implantes, a Star Sorrindo acompanha a saúde bucal dos pacientes com avaliação, orientação e tratamento conforme cada necessidade."
          />
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {treatments.map((t, i) => {
            const Icon = icons[t.id] ?? Sparkles;
            return (
              <Reveal
                as="li"
                key={t.id}
                delay={i * 80}
                className={`group flex flex-col rounded-2xl border p-8 transition-[border-color,box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgb(14_29_54/0.5)] ${
                  t.featured ? "on-navy border-navy bg-navy text-ivory" : "border-line bg-white hover:border-gold/60"
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    t.featured ? "bg-ivory/10 text-gold" : "bg-sand text-gold-ink"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="serif mt-7 text-[1.8rem]">{t.name}</h3>
                <p className={`mt-3 flex-1 text-[0.95rem] leading-relaxed ${t.featured ? "text-mist" : "text-mineral"}`}>{t.summary}</p>
                <div className={`mt-7 flex flex-col gap-3 border-t pt-5 text-sm font-semibold ${t.featured ? "border-ivory/15" : "border-line"}`}>
                  {t.href && (
                    <a href={t.href} className="group/link inline-flex min-h-6 items-center gap-2">
                      <span className="link-line">Saiba mais</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                      <span className="sr-only"> sobre {t.name.toLowerCase()}</span>
                    </a>
                  )}
                  <a
                    href={whatsappUrl(t.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-6 items-center gap-2 ${t.featured ? "text-gold" : "text-gold-ink"}`}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span className="link-line">Perguntar no WhatsApp</span>
                    <span className="sr-only"> sobre {t.name.toLowerCase()} (abre em nova aba)</span>
                  </a>
                </div>
              </Reveal>
            );
          })}

          <Reveal as="li" delay={240} className="flex flex-col rounded-2xl border border-dashed border-gold/70 bg-ivory p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-gold-ink">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="serif mt-7 text-[1.8rem]">Outros cuidados</h3>
            <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-mineral">
              Procura outro tratamento odontológico? Converse com a equipe para saber se ele é realizado na clínica.
            </p>
            <a
              href={whatsappUrl("other")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-6 items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-gold-ink"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="link-line">Consultar a equipe</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
