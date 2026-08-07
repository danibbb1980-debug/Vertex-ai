import { Check } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { LeadForm } from "../ui/LeadForm";
import { finalCta } from "@/lib/content";

export function FinalCta() {
  return (
    <section id="contato" className="relative scroll-mt-24 overflow-hidden px-5 py-24 sm:px-8 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-52 left-1/2 -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-brand/18 blur-[150px]"
        aria-hidden="true"
      />

      {/* The form is placed inline instead of behind a button: removing the
          extra click between intent and action is the cheapest conversion win
          available at the bottom of a long page. */}
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-mist uppercase">
              <span className="size-1.5 rounded-full bg-brand-bright" aria-hidden="true" />
              {finalCta.eyebrow}
            </span>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.9rem]">
              Pronto para dar ao seu negócio a{" "}
              <span className="text-gradient">presença online que ele merece?</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist sm:text-lg">
              {finalCta.description}
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {finalCta.assurances.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-mist">
                  <Check className="size-4 shrink-0 text-mint" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <LeadForm location="cta-final" />
        </Reveal>
      </div>
    </section>
  );
}
