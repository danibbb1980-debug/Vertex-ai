import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { IconeWhatsapp } from "./Icones";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-(--faixa-h) items-center justify-center bg-grafite whitespace-nowrap px-3 text-center text-[0.68rem] font-medium leading-tight text-[#e7deec] sm:text-[0.8rem] sm:tracking-wide"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

/** Botão flutuante (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function WhatsappFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!temWhatsapp) return null;
  const href = linkWhatsapp();
  const estado = visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0";

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-ameixa text-porcelana shadow-cartao transition-[transform,opacity] duration-500 hover:scale-105 lg:flex ${estado}`}
      >
        <IconeWhatsapp className="size-6" />
      </a>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-porcelana/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,opacity] duration-500 lg:hidden ${estado}`}
      >
        <div className="mx-auto flex max-w-md gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visivel ? 0 : -1}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ameixa font-semibold text-porcelana"
          >
            <IconeWhatsapp /> Agendar pelo WhatsApp
          </a>
          {CONFIG.maps.link ? (
            <a
              href={CONFIG.maps.link}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={visivel ? 0 : -1}
              className="flex min-h-12 items-center justify-center rounded-full px-4 font-semibold text-ameixa ring-1 ring-inset ring-ameixa/30"
            >
              Como chegar
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
