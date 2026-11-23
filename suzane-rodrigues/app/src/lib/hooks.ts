import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const q = "(prefers-reduced-motion: reduce)";
  const [reduced, set] = useState(false);
  useEffect(() => set(window.matchMedia(q).matches), []);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => set(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useMedia(q: string) {
  const [ok, set] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => set(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [q]);
  return ok;
}

/** Marca o elemento como visto uma vez (para acender numeração e desenhar divisores). */
export function useSeen<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}
