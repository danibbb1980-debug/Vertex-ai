import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { IconeWhatsApp } from "./Icones";

/**
 * Celular: barra fixa no rodapé da tela (o body reserva o espaço dela).
 * Desktop: botão flutuante discreto, que aparece depois do hero.
 */
export function WhatsAppFixo() {
  const [aposHero, setAposHero] = useState(false);
  useEffect(() => {
    const aoRolar = () => setAposHero(window.scrollY > window.innerHeight * 0.7);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-marfim/92 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-tinta px-5 text-[0.95rem] font-medium text-marfim"
        >
          <IconeWhatsApp tamanho={18} className="text-champanhe" />
          Agendar avaliação pelo WhatsApp
        </a>
      </div>

      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Conversar pelo WhatsApp ${CONFIG.telefoneExibicao}`}
        tabIndex={aposHero ? 0 : -1}
        aria-hidden={!aposHero || undefined}
        className={`fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full border border-champanhe/50 bg-tinta text-champanhe shadow-[0_10px_30px_-12px_rgb(24_20_17/0.6)] transition-[opacity,transform] duration-500 ease-[var(--ease-suave)] hover:scale-105 md:grid ${
          aposHero ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <IconeWhatsApp tamanho={24} />
      </a>
    </>
  );
}
