import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao rolar (só opacidade e transform). */
export function Revelar({ children, delay = 0, className = "", y = 18 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Cabecalho({ rotulo, titulo, texto, centro = false, id }: { rotulo: string; titulo: ReactNode; texto?: ReactNode; centro?: boolean; id?: string }) {
  return (
    <div className={`max-w-2xl ${centro ? "mx-auto text-center" : ""}`}>
      <p className="rotulo">{rotulo}</p>
      <h2 id={id} className="mt-4 font-serif text-[2.1rem] leading-[1.08] tracking-[-0.015em] text-grafite sm:text-5xl">
        {titulo}
      </h2>
      {texto ? <p className="mt-5 text-lg text-tinta-suave">{texto}</p> : null}
    </div>
  );
}
