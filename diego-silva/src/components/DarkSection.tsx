import { m, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type React from "react";
import { useMotionOk } from "../lib/useMotionOk";

type Props = { as?: "section" | "div"; id?: string; labelledBy?: string; className?: string; children: ReactNode; ariaLabel?: string };

/**
 * Seção escura (tinta) com transição suave a partir do creme:
 * uma camada creme por trás do conteúdo some (opacidade) conforme a seção entra na tela.
 * A camada só é ativada no primeiro scroll e se a seção ainda estiver abaixo da tela:
 * o estado inicial (sem interação) já é o final, escuro e com contraste correto.
 */
export function DarkSection({ as = "section", id, labelledBy, className = "", children, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "section";
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!ok) return;
    const onScroll = () => {
      const el = ref.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.92) setArmed(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ok]);
  return (
    <Tag data-dark id={id} ref={ref as React.Ref<HTMLElement>} aria-labelledby={labelledBy} aria-label={ariaLabel} className={`on-dark relative isolate bg-ink text-paper ${className}`}>
      {ok && armed ? <m.div aria-hidden className="absolute inset-0 -z-10 bg-paper" style={{ opacity }} /> : null}
      {children}
    </Tag>
  );
}
