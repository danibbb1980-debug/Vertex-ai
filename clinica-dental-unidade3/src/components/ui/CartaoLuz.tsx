/*
  Inspirado em "Spotlight" (21st.dev): uma luz suave segue o ponteiro.
  Implementação própria: a luz é um círculo movido por transform (sem repaint de
  gradiente), só em dispositivos com hover real.
*/
import { useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export function CartaoLuz({ children, className }: { children: ReactNode; className?: string }) {
  const luz = useRef<HTMLDivElement>(null);
  const mover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !luz.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    luz.current.style.transform = `translate3d(${e.clientX - r.left - 160}px, ${e.clientY - r.top - 160}px, 0)`;
  };
  return (
    <div onPointerMove={mover} className={cn("group relative overflow-hidden", className)}>
      <div
        ref={luz}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-80 rounded-full bg-[radial-gradient(circle,rgb(147_216_221/0.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </div>
  );
}
