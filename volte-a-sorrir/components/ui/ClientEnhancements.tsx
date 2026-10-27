"use client";

import { useEffect } from "react";

/**
 * JS não essencial da página, num só lugar:
 *  - ano do rodapé sempre atual;
 *  - um único IntersectionObserver para os elementos .reveal, agendado para
 *    depois da primeira pintura.
 */
export function ClientEnhancements() {
  useEffect(() => {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      if (el.textContent !== year) el.textContent = year;
    });

    let observer: IntersectionObserver | undefined;
    const run = () => {
      const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
      if (typeof IntersectionObserver === "undefined") {
        targets.forEach((el) => el.classList.add("is-in"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      targets.forEach((el) => observer?.observe(el));
    };

    const handle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 400 })
        : window.setTimeout(run, 0);

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      observer?.disconnect();
    };
  }, []);

  return null;
}
