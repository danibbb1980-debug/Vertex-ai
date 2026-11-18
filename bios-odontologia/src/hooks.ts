import { useEffect, useRef, useState } from "react";

/** true quando o usuário pede menos movimento */
export function useMenosMovimento() {
  // começa false (igual ao HTML pré-renderizado) e corrige no primeiro efeito
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduz(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduz;
}

/** dispara uma vez quando o elemento entra na viewport */
export function useEntrou<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || entrou) return;
    if (!("IntersectionObserver" in window)) {
      setEntrou(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setEntrou(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [entrou, rootMargin]);
  return [ref, entrou] as const;
}
