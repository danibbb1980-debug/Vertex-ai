"use client";

import { useEffect, useState } from "react";
import { defaultMessage, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";

/**
 * Barra fixa de agendamento no celular. Aparece depois que o hero (com o seu
 * próprio CTA) sai da tela, e some de novo perto do rodapé.
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const footer = document.querySelector("footer");
    if (!hero || !footer || typeof IntersectionObserver === "undefined") return;
    let heroVisible = true;
    let footerVisible = false;
    const update = () => setVisible(!heroVisible && !footerVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === footer) footerVisible = e.isIntersecting;
      }
      update();
    });
    io.observe(hero);
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,opacity] duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a
        href={whatsappUrl(defaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-navy text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(14,40,55,0.6)]"
      >
        <WhatsAppIcon />
        Agende pelo WhatsApp
      </a>
    </div>
  );
}
