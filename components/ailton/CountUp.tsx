"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  decimals?: number;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Número que conta até o valor real quando entra na tela.
 *
 * O HTML do servidor já traz o valor final: sem JS, para robôs de busca e
 * com movimento reduzido, o número aparece direto. A contagem só acontece se
 * o elemento ainda estiver fora da tela no momento da hidratação — então
 * ninguém vê o número "voltar a zero".
 */
export function CountUp({ value, decimals = 0, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.textContent = format(0, decimals);
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = format(value * eased, decimals);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value, decimals);
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(value, decimals)}
    </span>
  );
}
