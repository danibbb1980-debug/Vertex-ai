/**
 * Adaptado do componente "Vertical Cut Reveal" (21st.dev, cnippet-dev).
 * Mudanças: corte por palavra com máscara (só transform), suporte a uma palavra
 * em ênfase, sem flex-wrap (mantém o text-wrap do título), respeita reduced-motion.
 */
import { m as motion } from "motion/react";

type Props = {
  text: string;
  /** palavra que recebe o degradê de ênfase */
  enfase?: string;
  delay?: number;
  stagger?: number;
};

export function VerticalCutReveal({ text, enfase, delay = 0.1, stagger = 0.07 }: Props) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const clean = w.replace(/[.,!?]/g, "");
          const isEnf = enfase && clean === enfase;
          const inner = isEnf ? (
            <>
              <span className="enfase">{clean}</span>
              {w.slice(clean.length)}
            </>
          ) : (
            w
          );
          return (
            <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 190, damping: 24, delay: delay + i * stagger }}
                >
                  {inner}
                </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </>
  );
}
