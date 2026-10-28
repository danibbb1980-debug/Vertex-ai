import { useEffect } from "react";

/** Liga a classe .visivel nos elementos .revela quando entram na tela (uma vez). */
export function useRevela() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".revela:not(.visivel)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visivel"));
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Atualiza --mx/--my para a luz do .cartao-luz seguir o ponteiro. */
export function moverLuz(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
