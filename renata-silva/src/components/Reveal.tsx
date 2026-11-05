import { Fragment, type ElementType, type ReactNode } from "react";
import { m } from "motion/react";
import { EASE, useReduced } from "../lib/motion";

/**
 * Título com revelação em corte vertical, palavra por palavra (adaptado do
 * "Vertical Cut Reveal" do 21st.dev). Use *palavra* para a ênfase em itálico.
 */
export function RevealTitle({
  text,
  as: Tag = "h2",
  className = "",
  id,
  onMount = false,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  onMount?: boolean;
  delay?: number;
}) {
  const reduce = useReduced();
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let i = 0;
  const words: ReactNode[] = [];
  parts.forEach((part, pi) => {
    const em = part.startsWith("*");
    const clean = em ? part.slice(1, -1) : part;
    clean.split(/(\s+)/).forEach((w, wi) => {
      if (!w) return;
      if (/^\s+$/.test(w)) {
        words.push(<Fragment key={`${pi}-${wi}`}> </Fragment>);
        return;
      }
      const idx = i++;
      const inner = em ? <em>{w}</em> : w;
      words.push(
        <span key={`${pi}-${wi}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          {reduce ? (
            <span className="inline-block">{inner}</span>
          ) : (
            <m.span
              className="inline-block will-change-transform"
              initial={{ y: "110%", opacity: 0 }}
              {...(onMount
                ? { animate: { y: "0%", opacity: 1 } }
                : { whileInView: { y: "0%", opacity: 1 }, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
              transition={{ duration: 0.9, ease: EASE, delay: delay + idx * 0.06 }}
            >
              {inner}
            </m.span>
          )}
        </span>,
      );
    });
  });
  return (
    <Tag id={id} className={`title ${className}`}>
      {words}
    </Tag>
  );
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "article";
}) {
  const reduce = useReduced();
  const M = m[as];
  if (reduce) {
    const T = as;
    return <T className={className}>{children}</T>;
  }
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}
