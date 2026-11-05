import { m, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type React from "react";
import { useMotionOk } from "../lib/useMotionOk";

type Props = { as?: "section" | "div"; id?: string; labelledBy?: string; className?: string; children: ReactNode; ariaLabel?: string };

/**
 * Seção escura (tinta) com transição suave a partir do creme:
 * uma camada creme por trás do conteúdo some (opacidade) conforme a seção entra na tela.
 */
export function DarkSection({ as = "section", id, labelledBy, className = "", children, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "section";
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <Tag data-dark id={id} ref={ref as React.Ref<HTMLElement>} aria-labelledby={labelledBy} aria-label={ariaLabel} className={`on-dark relative isolate bg-ink text-paper ${className}`}>
      {ok ? <m.div aria-hidden className="absolute inset-0 -z-10 bg-paper" style={{ opacity }} /> : null}
      {children}
    </Tag>
  );
}
