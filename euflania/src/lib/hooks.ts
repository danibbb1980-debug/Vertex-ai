import { useEffect, useRef, useState } from "react";

/** Marca o elemento como visível uma única vez, ao entrar na viewport. */
export function useNaVista<T extends Element>(margem = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visivel) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: margem },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem, visivel]);
  return [ref, visivel] as const;
}

export function useRolou(limite = 24) {
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const f = () => setRolou(window.scrollY > limite);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [limite]);
  return rolou;
}
