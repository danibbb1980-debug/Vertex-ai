"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * JS não essencial da página, num só lugar:
 *  - um IntersectionObserver para as revelações (.reveal, .reveal-lines, .reveal-image);
 *  - parallax sutil em [data-parallax] (amplitude em data-parallax, em px);
 *  - ano do rodapé.
 * Reexecuta a cada troca de rota. Nada disso é necessário para ler o conteúdo.
 */
export function ClientEnhancements() {
  const pathname = usePathname();

  useEffect(() => {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      if (el.textContent !== year) el.textContent = year;
    });

    const selector = ".reveal:not(.is-in), .reveal-lines:not(.is-in), .reveal-image:not(.is-in)";
    const targets = document.querySelectorAll<HTMLElement>(selector);
    let observer: IntersectionObserver | undefined;

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
      );
      targets.forEach((el) => observer?.observe(el));
    }

    // Parallax: só em telas grandes e sem preferência por movimento reduzido.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const rect = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) continue;
        const amount = Number(el.dataset.parallax || 40);
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1 … 1
        el.style.setProperty("--p", (progress * -amount).toFixed(1));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    if (!reduce && wide && layers.length) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
