import type { HTMLAttributes, PointerEvent } from "react";

/** Contêiner com borda e brilho que seguem o cursor. */
export function Spot({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`spot ${className}`} onPointerMove={move} {...rest}>
      {children}
    </div>
  );
}
