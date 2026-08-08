"use client";

import { useEffect } from "react";
import { trackCta } from "@/lib/analytics";

/**
 * Todo o JS não essencial da página, num único componente.
 *
 * Junta duas responsabilidades que antes espalhavam client components pelo
 * site inteiro:
 *
 *  1. Revelação no scroll — um IntersectionObserver para a página toda, no
 *     lugar do `whileInView` do framer-motion (um observer por elemento).
 *  2. Analytics — um listener de clique delegado no documento, no lugar de um
 *     onClick por botão. Era isso que obrigava Button.tsx a ser client
 *     component e criava uma ilha de hidratação em cada CTA.
 *
 * Nada aqui é necessário para ler ou usar a página: os links funcionam como
 * HTML puro. Por isso o trabalho é agendado depois da pintura, para não
 * competir com o conteúdo da primeira tela.
 */
export function ClientEnhancements() {
  useEffect(() => {
    // ---- 1. Revelação no scroll ----
    const reveal = () => {
      const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
      if (targets.length === 0) return;

      if (typeof IntersectionObserver === "undefined") {
        targets.forEach((el) => el.classList.add("is-in"));
        return;
      }

      let remaining = targets.length;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
            if (--remaining === 0) observer.disconnect();
          }
        },
        { rootMargin: "0px 0px -80px 0px" },
      );

      targets.forEach((el) => observer.observe(el));
      cleanup.push(() => observer.disconnect());
    };

    // ---- 2. Analytics delegado ----
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      trackCta(el.dataset.track ?? "", el.dataset.trackLabel ?? el.textContent?.trim() ?? "");
    };

    const cleanup: Array<() => void> = [];

    document.addEventListener("click", onClick, { passive: true });
    cleanup.push(() => document.removeEventListener("click", onClick));

    /*
     * Espera a thread principal ficar livre antes de montar os observers.
     * requestIdleCallback quando disponível; senão, o próximo frame.
     */
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(reveal, { timeout: 500 })
        : window.setTimeout(reveal, 0);

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      cleanup.forEach((fn) => fn());
    };
  }, []);

  return null;
}
