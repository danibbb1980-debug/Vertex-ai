import { Cpu, LifeBuoy, PenTool, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { whyVertex } from "@/lib/content";

const icons: LucideIcon[] = [PenTool, Repeat, Cpu, LifeBuoy];

export function WhyVertex() {
  return (
    <Section id="por-que">
      <SectionHeader
        eyebrow={whyVertex.eyebrow}
        title={whyVertex.title}
        sub={whyVertex.sub}
        accent="Um parceiro de crescimento digital."
      />

      <ul className="mt-16 grid gap-5 sm:grid-cols-2">
        {whyVertex.cards.map((card, index) => {
          const Icon = icons[index] ?? PenTool;
          return (
            <Reveal as="li" key={card.title} delay={index * 0.07}>
              <div className="h-full rounded-2xl border border-line bg-surface/50 p-7 transition-colors duration-300 hover:border-white/20 hover:bg-surface">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-deep/30 to-brand/10">
                  <Icon className="size-5 text-brand-bright" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-mist">{card.body}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist-dim">{card.detail}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
