/* Transição de entrada das seções: opacidade + deslocamento curto, uma vez. */
import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Revelar({
  children,
  atraso = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
  y?: number;
}) {
  // Mesma marcação no servidor e no cliente; com reduced motion a entrada é instantânea.
  const reduzido = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={reduzido ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: atraso }}
    >
      {children}
    </m.div>
  );
}
