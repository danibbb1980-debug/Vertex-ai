/**
 * Adaptado de "Reveal" (21st.dev, @asanshay).
 * Mudanças: deslocamento e desfoque menores, curva mais suave, respeita reduced-motion.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  }),
};

export function Reveal({
  children,
  className,
  index = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const M = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <M
      variants={VARIANTS}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      className={className}
    >
      {children}
    </M>
  );
}
