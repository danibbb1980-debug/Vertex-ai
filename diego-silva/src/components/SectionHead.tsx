import type { ReactNode } from "react";
import { Rule } from "./Reveal";

type Props = { num: string; label: string; dark?: boolean; children?: ReactNode };

/** Cabeçalho editorial de seção: número, rótulo em caixa-alta e filete dourado. */
export function SectionHead({ num, label, dark }: Props) {
  return (
    <div className="mb-10 md:mb-16">
      <div className={`eyebrow flex items-baseline gap-4 ${dark ? "text-gold-light" : "text-ink-soft"}`}>
        <span className={`font-serif text-base italic tracking-normal normal-case ${dark ? "text-gold-light" : "text-wine"}`}>{num}</span>
        <span>{label}</span>
      </div>
      <Rule className={`mt-4 ${dark ? "opacity-50" : ""}`} />
    </div>
  );
}
