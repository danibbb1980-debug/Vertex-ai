import { useRef, type ReactNode } from "react";
import {m, useMotionValue, useSpring } from "motion/react";
import { canHover, useReduced } from "../lib/motion";

/** Leve atração do botão em direção ao cursor (adaptado do "Magnetic Button" do 21st.dev). */
export function Magnetic({ children, strength = 0.18, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReduced();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: React.PointerEvent) => {
    if (reduce || !canHover() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span ref={ref} className={`inline-flex ${className}`} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </m.span>
  );
}
