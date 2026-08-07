import { ArrowRight, Building2, Check, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { industries } from "@/lib/content";

const icons: Record<string, LucideIcon> = {
  clinicas: Sparkles,
  imobiliarias: Building2,
  restaurantes: UtensilsCrossed,
  locais: Store,
};

export function Industries() {
  return (
    <Section id="segmentos" className="scroll-mt-24">
      <SectionHeader
        eyebrow={industries.eyebrow}
        title={industries.title}
        sub={industries.sub}
        accent="seu tipo de negócio"
      />

      <ul className="mt-16 grid gap-5 sm:grid-cols-2">
        {industries.items.map((item, index) => {
          const Icon = icons[item.slug] ?? Store;
          return (
            <Reveal as="li" key={item.slug} delay={index * 0.07}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface">
                <div
                  className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-ink/60">
                    <Icon className="size-5 text-brand-bright" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
                  {/* Outcome first, features second — the owner buys the result */}
                  <p className="mt-2 text-[0.95rem] font-medium text-brand-bright">
                    {item.outcome}
                  </p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-mist">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-mint" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      {/* Catch-all so a visitor outside the four verticals doesn't self-reject */}
      <Reveal delay={0.1}>
        <p className="mt-10 text-center text-base text-mist">
          {industries.fallback.text}{" "}
          <a
            href="#contato"
            className="inline-flex min-h-11 items-center gap-1 py-2 font-medium text-brand-bright underline-offset-4 transition-colors duration-200 hover:text-cloud hover:underline"
          >
            {industries.fallback.cta}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      </Reveal>
    </Section>
  );
}
