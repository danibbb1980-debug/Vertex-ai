import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao rolar (opacity + translateY). */
export function Revelar({ children, atraso = 0, className, as = "div" }: {
  children: ReactNode; atraso?: number; className?: string; as?: "div" | "li";
}) {
  const reduzido = useReducedMotion();
  const C = as === "li" ? m.li : m.div;
  if (reduzido) return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>;
  return (
    <C
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </C>
  );
}

/** Título de seção: rótulo em caixa-alta + h2 com uma palavra em ênfase. */
export function TituloSecao({ rotulo, antes, enfase, depois = "", id, escuro = false, centro = false }: {
  rotulo: string; antes: string; enfase: string; depois?: string; id: string; escuro?: boolean; centro?: boolean;
}) {
  return (
    <Revelar className={centro ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`rotulo flex items-center gap-3 ${centro ? "justify-center" : ""} ${escuro ? "text-ouro-claro" : "text-ouro-tinta"}`}>
        <span aria-hidden="true" data-fio="ponto" className={`inline-block h-2.5 w-2.5 rounded-full border border-ouro ${escuro ? "bg-cacau" : "bg-marfim"}`} />
        {rotulo}
      </p>
      <h2 id={id} className={`mt-4 text-[2.4rem] sm:text-5xl lg:text-[3.5rem] ${escuro ? "text-marfim" : ""}`}>
        {antes} <em className="enfase">{enfase}</em>{depois}
      </h2>
    </Revelar>
  );
}
