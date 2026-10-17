"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site-data";
import { WhatsAppIcon } from "./BrandIcons";

/**
 * Acesso rápido ao contato, que aparece depois que o visitante rola a página:
 *  - celular: barra fixa no rodapé da tela (WhatsApp + ligar), com espaço
 *    reservado no <body> para não cobrir conteúdo;
 *  - desktop: botão flutuante discreto do WhatsApp.
 */
export function ContactDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const state = visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0";

  return (
    <>
      <div
        inert={!visible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[opacity,transform] duration-500 ease-out-soft md:hidden ${state}`}
      >
        <div className="flex gap-3">
          <a
            href={whatsappUrl("default")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-navy text-[0.92rem] font-semibold text-ivory"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Agendar avaliação
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <a
            href={`tel:${site.phone.e164}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy/25 text-navy"
            aria-label={`Ligar para ${site.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <a
        href={whatsappUrl("default")}
        target="_blank"
        rel="noopener noreferrer"
        inert={!visible}
        className={`group fixed right-6 bottom-6 z-40 hidden h-14 items-center gap-0 overflow-hidden rounded-full bg-navy pr-4 pl-4 text-ivory shadow-[0_18px_40px_-16px_rgb(14_29_54/0.7)] transition-[opacity,transform,gap,background-color] duration-500 ease-out-soft hover:gap-2.5 hover:bg-navy-3 md:flex ${state}`}
      >
        <WhatsAppIcon className="h-6 w-6 text-[#5fe39a]" />
        <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 ease-out-soft group-hover:max-w-48 group-focus-visible:max-w-48">
          Falar no WhatsApp
        </span>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    </>
  );
}
