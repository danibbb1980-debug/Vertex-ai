import { m } from "motion/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "p" };

/** Entrada suave ao rolar (opacidade + translate). Com reduced-motion, o CSS global zera a duração. */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const C = as === "li" ? m.li : as === "p" ? m.p : m.div;
  return (
    <C
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </C>
  );
}

/** Filete dourado que se desenha da esquerda para a direita quando entra na tela. */
export function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <m.div
      aria-hidden
      className={`rule ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
