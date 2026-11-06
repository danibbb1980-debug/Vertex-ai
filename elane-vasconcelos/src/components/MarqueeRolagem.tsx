/**
 * Faixa de palavras que desliza só com a rolagem (não se move sozinha,
 * então não precisa de botão de pausa). Inspirada no "Scroll Text Marquee"
 * do 21st.dev, reescrita sem dependências e só com transform.
 */
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const PALAVRAS = ["Estética", "Furo de orelha infantil", "Hora marcada", "Acolhimento", "Explicações claras", "São João da Boa Vista"];

export function MarqueeRolagem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const linha = [...PALAVRAS, ...PALAVRAS, ...PALAVRAS];
  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden border-y border-ouro/30 bg-marfim-2 py-5">
      <m.div style={reduzido ? undefined : { x }} className="flex w-max items-center gap-8 whitespace-nowrap">
        {linha.map((p, i) => (
          <span key={i} className="flex items-center gap-8 font-serif text-2xl italic text-mauve/80 sm:text-3xl">
            {p}
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none"><circle cx="10" cy="10" r="7" stroke="#B8956A" strokeWidth="1.1" /></svg>
          </span>
        ))}
      </m.div>
    </div>
  );
}
