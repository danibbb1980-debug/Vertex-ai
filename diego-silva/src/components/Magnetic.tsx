import { m, useMotionValue, useSpring } from "motion/react";
import type { ReactNode, PointerEvent } from "react";
import { useFinePointer, useMotionOk } from "../lib/useMotionOk";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "wine" | "ink" | "paper" | "outline" | "outline-dark";
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
  wine: "bg-wine text-paper hover:bg-wine-deep",
  ink: "bg-ink text-paper hover:bg-ink-2",
  paper: "bg-paper text-ink hover:bg-white",
  outline: "border border-ink/25 text-ink hover:border-ink",
  "outline-dark": "border border-paper/30 text-paper hover:border-paper",
};

export function Arrow() {
  return (
    <span className="btn-arrow" aria-hidden>
      <span>→</span>
      <span>→</span>
    </span>
  );
}

/** Botão-link com atração magnética sutil (só mouse, sem reduced-motion) e seta que desliza. */
export function MagneticLink({ href, children, variant = "wine", size = "md", external, className = "", ariaLabel }: Props) {
  const fine = useFinePointer();
  const motionOk = useMotionOk();
  const active = fine && motionOk;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const pad = size === "lg" ? "min-h-14 px-7 text-[1.0625rem]" : "min-h-12 px-6 text-[0.975rem]";
  return (
    <m.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={ariaLabel}
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      data-cursor="link"
      className={`group inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-[-0.005em] transition-colors duration-300 ${pad} ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      <Arrow />
    </m.a>
  );
}
