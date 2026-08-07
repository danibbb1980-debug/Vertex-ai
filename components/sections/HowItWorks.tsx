import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { howItWorks } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="como-funciona" className="scroll-mt-24">
      <SectionHeader
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        sub={howItWorks.sub}
        accent="em uma semana"
      />

      <ol className="relative mt-16">
        {/* Timeline spine — decorative, hidden from assistive tech */}
        <div
          className="absolute top-2 bottom-2 left-[1.4rem] w-px bg-linear-to-b from-brand/70 via-brand/25 to-transparent md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        {howItWorks.steps.map((step, index) => (
          <Reveal as="li" key={step.number} delay={index * 0.08}>
            <div
              className={`relative flex gap-6 pb-12 last:pb-0 md:gap-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Node */}
              <div className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-ink-2 font-display text-sm font-semibold text-brand-bright md:absolute md:left-1/2 md:-translate-x-1/2">
                {step.number}
              </div>

              <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-14" : "md:pl-14"}`}>
                <div
                  className={`rounded-2xl border border-line bg-surface/50 p-6 transition-colors duration-300 hover:border-white/20 ${
                    index % 2 === 0 ? "md:text-right" : ""
                  }`}
                >
                  {/* Explicit timing on every step answers "how long does this take?" */}
                  <span className="inline-block rounded-full bg-brand/12 px-2.5 py-1 text-xs font-medium text-brand-bright">
                    {step.when}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{step.body}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist-dim">{step.detail}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
