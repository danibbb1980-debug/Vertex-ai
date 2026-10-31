import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Entrada suave ao rolar (só transform/opacity). */
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}

/** Revelação de título palavra por palavra, com máscara (texto visível sem JS de opacidade). */
export function TextReveal({ text, emphasis, className = "" }: { text: string; emphasis?: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => {
        const clean = w.replace(/[.,!?]$/, "");
        const isEm = emphasis && clean === emphasis;
        const trail = w.slice(clean.length);
        const content = isEm ? (
          <>
            <em className="enfase">{clean}</em>
            {trail}
          </>
        ) : (
          w
        );
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" style={i < words.length - 1 ? { marginRight: "0.26em" } : undefined}>
            {reduce ? (
              <span className="inline-block">{content}</span>
            ) : (
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.06 }}
              >
                {content}
              </motion.span>
            )}
          </span>
        );
      })}
    </span>
  );
}
