"use client";

import { useEffect } from "react";

/**
 * JS não essencial da página, num único componente:
 *  - mantém o ano do rodapé atualizado;
 *  - revela os elementos .reveal quando entram na tela;
 *  - mostra o botão flutuante de WhatsApp só depois que o hero sai da tela.
 * Agendado para depois da pintura, para não competir com o conteúdo inicial.
 */
export function ClientEnhancements() {
  useEffect(() => {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      if (el.textContent !== year) el.textContent = year;
    });

    const observers: IntersectionObserver[] = [];

    const run = () => {
      const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
      if (typeof IntersectionObserver === "undefined") {
        targets.forEach((el) => el.classList.add("is-in"));
        document.querySelector(".floating-cta")?.setAttribute("data-visible", "true");
        return;
      }

      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -60px 0px" },
      );
      targets.forEach((el) => reveal.observe(el));
      observers.push(reveal);

      const hero = document.getElementById("inicio");
      const cta = document.querySelector(".floating-cta");
      if (hero && cta) {
        const heroWatch = new IntersectionObserver(([entry]) => {
          cta.setAttribute("data-visible", String(!entry.isIntersecting));
        });
        heroWatch.observe(hero);
        observers.push(heroWatch);
      }
    };

    const handle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 400 })
        : window.setTimeout(run, 0);

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
