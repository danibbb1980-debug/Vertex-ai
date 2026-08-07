import { ArrowDown, TrendingDown } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { problem } from "@/lib/content";

export function Problem() {
  return (
    <Section id="problema">
      <SectionHeader title={problem.title} sub={problem.lead} accent="Seu negócio está pronto?" />

      <ul className="mt-16 grid gap-4 sm:grid-cols-2">
        {problem.items.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 0.07}>
            <div className="group h-full rounded-2xl border border-line bg-surface/50 p-7 transition-colors duration-300 hover:border-white/20 hover:bg-surface">
              <h3 className="text-lg font-semibold text-cloud">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{item.body}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-rose/10 px-3 py-1.5 text-xs font-medium text-rose">
                <TrendingDown className="size-3.5" aria-hidden="true" />
                {item.cost}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Problem → solution pivot */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-center text-center">
          <ArrowDown className="size-5 text-brand-bright" aria-hidden="true" />
          <p className="mt-6 max-w-2xl font-display text-2xl font-semibold sm:text-3xl">
            {problem.transition}
          </p>
          <p className="mt-4 max-w-xl text-base text-mist">{problem.transitionSub}</p>
        </div>
      </Reveal>
    </Section>
  );
}
