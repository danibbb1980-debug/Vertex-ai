import { m, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, useReducedMotion } from "./ui";

/** Barra fina de progresso de leitura no topo. */
export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });
  return (
    <m.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[var(--accent)]"
      style={{ scaleX }}
    />
  );
}

/**
 * Cursor discreto: um anel que segue o ponteiro com mola e cresce sobre
 * links e botões. O cursor do sistema continua visível. Só em desktop com
 * mouse e sem reduced-motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 });
  const y = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 });
  const [hot, setHot] = useState(false);
  const [shown, setShown] = useState(false);
  const on = fine && !reduce;

  useEffect(() => {
    if (!on) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      const t = e.target as Element | null;
      setHot(!!t?.closest?.("a,button,label,[role=button]"));
    };
    const leave = () => setShown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [on, x, y]);

  if (!on) return null;
  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[80] -mt-4 -ml-4 h-8 w-8 rounded-full border border-[var(--fg)]"
      style={{ x, y }}
      animate={{ scale: hot ? 1.7 : 1, opacity: shown ? (hot ? 0.5 : 0.35) : 0 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
    />
  );
}
