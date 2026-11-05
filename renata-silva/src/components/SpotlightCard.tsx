import { useRef, type ReactNode } from "react";

/**
 * Cartão com luz rosê que acompanha o cursor e borda acesa no hover
 * (adaptado do "Spotlight Card" do 21st.dev). Só em dispositivos com mouse.
 */
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--sx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`spot group relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--sx, 50%) var(--sy, 0%), rgba(239,177,182,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(260px circle at var(--sx, 50%) var(--sy, 0%), rgba(239,177,182,0.7), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}
