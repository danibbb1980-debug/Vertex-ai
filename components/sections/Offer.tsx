import { ArrowRight, Check, Info, ShieldCheck, X } from "lucide-react";
import { Section, SectionHeader } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { LinkButton } from "../ui/Button";
import { offer } from "@/lib/content";

export function Offer() {
  return (
    <Section id="planos" className="scroll-mt-24">
      <SectionHeader
        eyebrow={offer.eyebrow}
        title={offer.title}
        sub={offer.sub}
        accent="sem investimento inicial"
      />

      <div className="mt-16 grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Price anchor — the reference point that makes R$197 read as a bargain
            rather than as cheap. Presented as the market range, not a fake
            struck-through "our old price". */}
        <Reveal>
          <div className="rounded-2xl border border-line bg-ink-2/60 p-7">
            <p className="text-xs font-medium tracking-[0.14em] text-mist-dim uppercase">
              {offer.anchor.label}
            </p>
            <p className="mt-4 font-display text-3xl font-semibold text-mist-dim line-through decoration-rose/60 decoration-2">
              {offer.anchor.range}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mist">{offer.anchor.note}</p>

            <div className="mt-7 border-t border-line pt-7">
              <p className="text-sm text-mist">Com a Vertex, o mesmo padrão de site:</p>
              <p className="mt-2 font-display text-2xl font-semibold text-gradient">
                sem nada à vista
              </p>
            </div>
          </div>
        </Reveal>

        {/* Primary pricing card */}
        <Reveal delay={0.08}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-px rounded-[1.4rem] bg-linear-to-b from-brand/60 via-brand/20 to-transparent"
              aria-hidden="true"
            />
            <div className="relative rounded-[1.35rem] border border-transparent bg-ink-2 p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{offer.planName}</h3>
                <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand-bright">
                  Tudo incluído
                </span>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="font-display text-6xl font-semibold tracking-tight">
                  {offer.price}
                </span>
                <span className="pb-2.5 text-lg text-mist">{offer.period}</span>
              </div>
              <p className="mt-2 text-sm text-mist-dim">{offer.perDay}</p>

              <ul className="mt-8 space-y-4">
                {offer.features.map((feature) => (
                  <li key={feature.label} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3 text-mint" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[0.95rem] font-medium text-cloud">
                        {feature.label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-mist">
                        {feature.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <LinkButton href="#contato" size="lg" className="mt-9 w-full" trackAs="oferta">
                {offer.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
              <p className="mt-3 text-center text-sm text-mist-dim">{offer.ctaMicrocopy}</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Risk reversal grid — four separate reasons that saying yes is safe */}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offer.guarantees.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 0.06}>
            <div className="h-full rounded-xl border border-line bg-surface/40 p-5">
              <ShieldCheck className="size-5 text-brand-bright" aria-hidden="true" />
              <h4 className="mt-3 text-[0.95rem] font-semibold">{item.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Stating the exclusions up front removes the "what's the catch?" doubt
          that a too-good-to-be-true price otherwise creates. */}
      <Reveal delay={0.1}>
        <div className="mt-6 rounded-2xl border border-line bg-ink-2/40 p-7">
          <h4 className="flex items-center gap-2 text-[0.95rem] font-semibold">
            <Info className="size-4 text-mist" aria-hidden="true" />
            {offer.notIncluded.title}
          </h4>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {offer.notIncluded.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-mist">
                <X className="mt-0.5 size-3.5 shrink-0 text-mist-dim" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-5 text-sm text-mist-dim">
            {offer.notIncluded.note}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-mist">
          {offer.explanation}
        </p>
      </Reveal>
    </Section>
  );
}
