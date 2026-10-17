import { clinicalCases, site } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { CasesTrack } from "@/components/ui/CasesTrack";

/**
 * Antes e depois publicados pela clínica. Sem rolagem automática: o visitante
 * navega no próprio ritmo (arrastando ou pelos botões). Desligue em
 * lib/site-data.ts → clinicalCases.enabled.
 */
export function ClinicalCases({ id = "casos" }: { id?: string }) {
  if (!clinicalCases.enabled || clinicalCases.items.length === 0) return null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="overflow-hidden py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Casos da clínica</p>
            <h2 id={`${id}-title`} className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.4rem]">
              Sorrisos que contam <em className="text-gold-ink">histórias reais.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-sm text-sm leading-relaxed text-mineral">
            Casos publicados pela {site.brand} em seu Instagram oficial. Cada tratamento é planejado individualmente e os
            resultados variam de pessoa para pessoa.
          </Reveal>
        </div>
      </div>
      <CasesTrack items={clinicalCases.items} />
    </section>
  );
}
