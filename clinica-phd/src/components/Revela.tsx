import { createElement, useEffect, useRef, type ReactNode, type CSSProperties, type ElementType } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  atraso?: number;
  id?: string;
};

/**
 * Revela o conteúdo (opacidade + deslocamento) quando entra na tela.
 * Sem JavaScript ou com "reduzir movimento", o conteúdo aparece direto.
 */
export function Revela({ as = "div", children, className = "", atraso = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("visivel");
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(
    as,
    { ref, id, className: `revela ${className}`, style: atraso ? ({ "--d": `${atraso}ms` } as CSSProperties) : undefined },
    children,
  );
}
