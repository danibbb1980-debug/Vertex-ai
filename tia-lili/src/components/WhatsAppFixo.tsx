import { useEffect, useState } from "react";
import { linkWhatsApp } from "../config";
import { WhatsApp } from "./Icones";

/**
 * Celular: barra fixa no rodapé da tela (o rodapé do site tem espaço extra para não cobrir conteúdo).
 * Telas maiores: botão flutuante discreto, que aparece depois do hero.
 */
export function WhatsAppFixo() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    const aoRolar = () => setMostrar(window.scrollY > window.innerHeight * 0.7);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-cacau/10 bg-creme/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,opacity] duration-500 md:hidden ${
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        aria-hidden={!mostrar}
      >
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={mostrar ? 0 : -1}
          className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-menta-escuro px-5 font-bold text-white"
        >
          <WhatsApp tamanho={20} />
          Agendar avaliação pelo WhatsApp
        </a>
      </div>

      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={mostrar ? 0 : -1}
        aria-hidden={!mostrar}
        title="Agendar avaliação pelo WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-menta-escuro text-white shadow-[0_14px_34px_-14px_rgba(36,87,74,0.7)] transition-[transform,opacity,background-color] duration-500 hover:bg-menta-profundo md:inline-flex ${
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <WhatsApp tamanho={26} />
      </a>
    </>
  );
}
