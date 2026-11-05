export const EASE = [0.22, 1, 0.36, 1] as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

import { useEffect, useState } from "react";

/**
 * Preferência de movimento reduzido, segura para o HTML pré-renderizado:
 * o primeiro render é igual no servidor e no navegador; depois atualiza.
 */
export function useReduced() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/** Valor que só existe no navegador (data de hoje etc.), sem divergir do HTML pré-renderizado. */
export function useClient<T>(fn: () => T, fallback: T) {
  const [v, setV] = useState(fallback);
  useEffect(() => setV(fn()), []); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}
