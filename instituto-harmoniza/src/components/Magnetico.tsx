import { useEffect, useRef, type ReactNode } from "react";
import { CONFIG } from "../config";
import { carregarMotion, podeEfeitoDePonteiro } from "../lib/movimento";

/**
 * Efeito magnético sutil (o botão se aproxima do cursor e volta com mola).
 * Só em mouse/trackpad, nunca em toque e nunca com movimento reduzido.
 */
export function Magnetico({ children, forca = 0.22, limite = 9 }: { children: ReactNode; forca?: number; limite?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !CONFIG.movimento.botaoMagnetico || !podeEfeitoDePonteiro()) return;
    let animate: typeof import("motion").animate | null = null;
    carregarMotion().then((m) => (animate = m.animate));
    const mola = { type: "spring", stiffness: 260, damping: 16, mass: 0.6 } as const;
    const limitar = (v: number) => Math.max(-limite, Math.min(limite, v));
    const mover = (e: PointerEvent) => {
      if (!animate) return;
      const r = el.getBoundingClientRect();
      animate(
        el,
        { x: limitar((e.clientX - (r.left + r.width / 2)) * forca), y: limitar((e.clientY - (r.top + r.height / 2)) * forca) },
        mola,
      );
    };
    const soltar = () => animate?.(el, { x: 0, y: 0 }, mola);
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", soltar);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", soltar);
    };
  }, [forca, limite]);

  return (
    <span ref={ref} className="inline-flex">
      {children}
    </span>
  );
}
