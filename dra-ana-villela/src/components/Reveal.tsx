import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao entrar na tela. Sem movimento quando o usuário prefere menos animação. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  center = false,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  center?: boolean;
  id?: string;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""} ${dark ? "text-rose" : "text-rose-ink"}`}>
        <span aria-hidden className={`h-px w-8 ${dark ? "bg-rose/60" : "bg-rose-ink/50"}`} />
        {eyebrow}
      </p>
      <h2 id={id} className={`mt-5 text-[2.35rem] sm:text-5xl lg:text-[3.6rem] ${dark ? "text-porcelana" : "text-tinta"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-6 text-lg ${dark ? "text-porcelana/75" : "text-grafite"}`}>{intro}</p>}
    </Reveal>
  );
}
