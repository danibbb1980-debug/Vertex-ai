import { useRef, type AnchorHTMLAttributes, type ReactNode } from "react";

/**
 * Link com efeito magnético: o botão se inclina levemente na direção do cursor.
 * Só em dispositivos com ponteiro fino e sem preferência por movimento reduzido.
 */
export function MagneticLink({
  children,
  className = "",
  strength = 0.28,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (!enabled() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength * 1.2}px, 0)`;
    if (inner.current) inner.current.style.transform = `translate3d(${x * strength * 0.35}px, ${y * strength * 0.35}px, 0)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
    if (inner.current) inner.current.style.transform = "";
  }

  return (
    <a ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <span ref={inner} className="inline-flex items-center gap-[inherit] transition-transform duration-300 ease-[var(--ease-vertex)]">
        {children}
      </span>
    </a>
  );
}
