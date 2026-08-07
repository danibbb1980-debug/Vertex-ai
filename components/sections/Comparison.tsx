import { Check, X } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { comparison } from "@/lib/content";

export function Comparison() {
  return (
    <Section id="comparacao">
      <SectionHeader
        eyebrow={comparison.eyebrow}
        title={comparison.title}
        sub={comparison.sub}
        accent="Está no sexto mês."
      />

      {/* Three columns rather than two: the site builder / DIY route is the
          option most local owners are actually weighing, and leaving it out
          would let the strongest alternative go unanswered. */}
      <ul className="mt-16 grid gap-5 lg:grid-cols-3">
        {comparison.columns.map((column, index) => (
          <Reveal as="li" key={column.name} delay={index * 0.08}>
            <div
              className={`relative h-full rounded-2xl p-7 ${
                column.highlight
                  ? "border border-brand/40 bg-linear-to-b from-brand/12 to-transparent shadow-[0_0_60px_-20px_rgba(124,108,246,0.55)]"
                  : "border border-line bg-surface/40"
              }`}
            >
              {column.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-linear-to-r from-brand-deep to-brand px-3 py-1 text-xs font-medium text-white">
                  Recomendado
                </span>
              )}
              <h3
                className={`text-lg font-semibold ${
                  column.highlight ? "text-cloud" : "text-mist"
                }`}
              >
                {column.name}
              </h3>
              <ul className="mt-6 space-y-3.5">
                {column.rows.map((row) => (
                  <li key={row.text} className="flex items-start gap-2.5">
                    {row.ok ? (
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint/15">
                        <Check className="size-3 text-mint" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose/10">
                        <X className="size-3 text-rose" aria-hidden="true" />
                      </span>
                    )}
                    <span
                      className={`text-[0.95rem] leading-relaxed ${
                        row.ok ? "text-cloud/90" : "text-mist"
                      }`}
                    >
                      {row.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
