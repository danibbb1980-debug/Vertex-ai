import { useEffect } from "react";

/** Mecanismos A e B: adiciona .is-in a [data-reveal] quando entra na tela. */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Lenis: só desktop com ponteiro fino, carregado depois, em idle.
    let lenis: { destroy(): void } | undefined;
    if (window.matchMedia("(pointer: fine) and (min-width: 64rem)").matches) {
      const idle = (cb: () => void) => {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2500 });
        else setTimeout(cb, 1200);
      };
      idle(async () => {
        const { default: Lenis } = await import("lenis");
        const l = new Lenis({ duration: 1.1, anchors: { offset: -96 } });
        root.classList.add("has-lenis");
        const raf = (t: number) => {
          l.raf(t);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        lenis = l;
      });
    }
    return () => {
      io.disconnect();
      lenis?.destroy();
    };
  }, []);
}
