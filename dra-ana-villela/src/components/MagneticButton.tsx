import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode, PointerEvent } from "react";

type Variant = "solid" | "outline" | "light" | "ghostLight";

const styles: Record<Variant, string> = {
  solid: "bg-tinta text-porcelana hover:bg-tinta-2",
  outline: "border border-tinta/25 text-tinta hover:border-tinta/60 bg-transparent",
  light: "bg-porcelana text-tinta hover:bg-rose",
  ghostLight: "border border-porcelana/30 text-porcelana hover:border-porcelana/70",
};

/** Botão-link com efeito magnético sutil (só com mouse fino e sem reduced-motion). */
export function MagneticButton({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function move(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ x: sx, y: sy }}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-[0.01em] transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </m.a>
  );
}
