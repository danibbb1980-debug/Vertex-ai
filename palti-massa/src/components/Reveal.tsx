import { m as motion } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao rolar (opacity + translate), uma vez só. */
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const C = as === "li" ? motion.li : motion.div;
  return (
    <C
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </C>
  );
}

/** Título de seção com rótulo e uma palavra em ênfase. */
export function SectionTitle({ rotulo, titulo, enfase, id, intro, dark = false, center = false }: { rotulo: string; titulo: string; enfase?: string; id: string; intro?: ReactNode; dark?: boolean; center?: boolean }) {
  const parts = enfase ? titulo.split(enfase) : [titulo];
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="rotulo">{rotulo}</p>
      <h2 id={id} className={`mt-3 text-[2.4rem] font-semibold sm:text-5xl ${dark ? "text-white" : ""}`}>
        {parts[0]}
        {enfase && <span className="enfase">{enfase}</span>}
        {parts[1]}
      </h2>
      {intro && <div className={`mt-4 text-lg ${dark ? "text-white/80" : "text-cinza"}`}>{intro}</div>}
    </Reveal>
  );
}
