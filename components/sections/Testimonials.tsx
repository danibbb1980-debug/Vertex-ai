import { Info, Quote } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <Section id="depoimentos">
      <SectionHeader title={testimonials.title} eyebrow={testimonials.eyebrow} accent="em 90 dias" />

      {/* Required disclosure, placed before the quotes rather than buried under
          them. A visitor who spots an unlabelled fake discounts the whole page. */}
      <Reveal delay={0.06}>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface/50 px-6 py-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium tracking-wide text-cloud uppercase">
            <Info className="size-3.5" aria-hidden="true" />
            {testimonials.label}
          </span>
          <p className="text-sm leading-relaxed text-mist">{testimonials.disclaimer}</p>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.items.map((item, index) => (
          <Reveal as="li" key={item.name} delay={index * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-7">
              <Quote className="size-6 text-brand/50" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-cloud/90">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                {/* Initials, not a stock portrait — a fake face on a fake quote
                    is the detail that gets noticed. */}
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-deep/40 to-brand/15 font-display text-sm font-semibold text-brand-bright"
                  aria-hidden="true"
                >
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-medium text-cloud">{item.name}</span>
                  <span className="block text-xs text-mist-dim">
                    {item.role} · {item.city}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
