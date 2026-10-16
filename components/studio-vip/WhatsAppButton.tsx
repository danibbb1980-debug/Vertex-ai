"use client";

import { useEffect, useState } from "react";
import { vipWhatsapp } from "@/lib/studio-vip";
import { WhatsAppIcon } from "./ui";

/**
 * Botão flutuante de WhatsApp.
 *
 * Aparece depois que o hero sai da tela (o hero já tem o CTA principal) e
 * some de novo nas áreas marcadas com data-hide-float — aula experimental,
 * contato, CTA final e rodapé —, onde já há botões grandes de WhatsApp e ele
 * ficaria por cima deles.
 */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const tail = document.querySelectorAll("[data-hide-float]");
    if (!hero || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let heroVisible = true;
    const tailVisible = new Set<Element>();
    const update = () => setVisible(!heroVisible && tailVisible.size === 0);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        else if (entry.isIntersecting) tailVisible.add(entry.target);
        else tailVisible.delete(entry.target);
      }
      update();
    });

    observer.observe(hero);
    tail.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={vipWhatsapp("main")}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp"
      data-track-label="flutuante"
      aria-label="Conversar com o Studio VIP no WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`vip-float fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-6 ${visible ? "is-in" : ""}`}
    >
      <span className="vip-float-dot flex size-15 items-center justify-center rounded-[0_1.4rem_0_1.4rem] bg-vip-green text-vip-graphite shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:-translate-y-1">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  );
}
