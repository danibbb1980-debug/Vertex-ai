import { useEffect, useState } from "react";
import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { cn } from "../../lib/cn";
import { IconeWhatsApp } from "../ui/Icones";

/** Botão flutuante (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function Flutuantes() {
  const { unidade } = useUnidade();
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const ao = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    ao();
    window.addEventListener("scroll", ao, { passive: true });
    return () => window.removeEventListener("scroll", ao);
  }, []);
  const href = linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp (abre em nova aba)"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel || undefined}
        className={cn(
          "fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-[0_14px_34px_-12px_rgb(2_24_38/0.7)] ring-1 ring-gold-400/50 transition-[transform,opacity] duration-500 hover:bg-teal-700 md:flex",
          visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <IconeWhatsApp tamanho={26} />
      </a>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ice/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 md:hidden",
          visivel ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!visivel || undefined}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visivel ? 0 : -1}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-600 font-semibold text-white"
        >
          <IconeWhatsApp tamanho={20} /> Agendar pelo WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </>
  );
}
