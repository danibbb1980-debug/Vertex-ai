import { useEffect, useRef, useState } from "react";

/** Adiciona a classe "visto" uma única vez, quando o elemento entra na viewport. */
export function useVisto<T extends HTMLElement>(margem = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("visto");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visto");
            io.disconnect();
          }
        });
      },
      { rootMargin: margem },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);
  return ref;
}

export function useMenorQue(px: number) {
  const [menor, setMenor] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(`(max-width: ${px - 1}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px - 1}px)`);
    const on = () => setMenor(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [px]);
  return menor;
}

export function useReduzMovimento() {
  const [r, setR] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}
