"use client";

import { useEffect, useRef } from "react";
import { waLink } from "@/lib/ailton";
import { WhatsAppIcon } from "./ui";

/**
 * Botão flutuante do WhatsApp.
 *
 * Aparece só depois que o hero sai da tela (lá o CTA já está visível) e
 * some sobre qualquer bloco marcado com `data-hide-float` — a seção de
 * conversão, o CTA final e o rodapé —, para nunca cobrir outro botão nem o
 * texto de contato. A visibilidade é uma classe CSS: mostrar/esconder não
 * passa pelo React.
 */
export function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = ref.current;
    const hero = document.getElementById("inicio");
    if (!button || !hero || typeof IntersectionObserver === "undefined") return;

    let heroVisible = true;
    const blockers = new Set<Element>();

    const update = () => {
      button.classList.toggle("is-in", !heroVisible && blockers.size === 0);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry?.isIntersecting ?? false;
        update();
      },
      { rootMargin: "0px 0px -40% 0px" },
    );

    const blockObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blockers.add(entry.target);
        else blockers.delete(entry.target);
      }
      update();
    });

    heroObserver.observe(hero);
    document.querySelectorAll("[data-hide-float]").forEach((el) => blockObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      blockObserver.disconnect();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={waLink("floating")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com o Ailton no WhatsApp"
      data-track="ailton_flutuante"
      data-track-label="WhatsApp flutuante"
      className="ad-float fixed z-30 flex size-14 items-center justify-center rounded-full bg-ad-lime text-ad-black shadow-[0_10px_30px_-8px_rgb(198_243_107/0.55)] hover:bg-[#d4f78a] md:size-16"
      style={{
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <span className="ad-ping absolute inset-0 rounded-full bg-ad-lime" aria-hidden="true" />
      <WhatsAppIcon className="relative size-7 md:size-8" />
    </a>
  );
}
