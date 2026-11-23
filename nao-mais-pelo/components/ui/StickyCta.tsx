"use client";

import { useEffect, useState } from "react";
import { Arrow } from "@/components/ui/primitives";
import { centralWhatsappHref } from "@/lib/site";

/**
 * Barra de agendamento fixa no celular. Aparece depois do hero e some quando
 * o formulário de cadastro ou o rodapé estão na tela, para não duplicar CTAs.
 */
export function StickyCta({ href = "#agendar", label = "Agendar minha sessão" }: { href?: string; label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const blockers = Array.from(document.querySelectorAll("#agendar, footer, #apresentacao"));
    const onScreen = new Set<Element>();
    let pastHero = false;
    const sync = () => setVisible(pastHero && onScreen.size === 0);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      sync();
    });
    blockers.forEach((b) => io.observe(b));

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      sync();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 flex gap-px bg-ink/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-700 ease-[var(--ease-out-expo)] md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <a href={href} className="btn btn-green flex-1">
        <span>{label}</span>
        <Arrow />
      </a>
      <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid-light px-4" aria-label="Falar com a central pelo WhatsApp">
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
