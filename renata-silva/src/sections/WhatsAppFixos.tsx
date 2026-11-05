import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { WhatsAppIcon } from "../components/icons";
import { waLink } from "../lib/whatsapp";

/**
 * Celular: barra fixa inferior (o rodapé tem espaço reservado para não ser coberto).
 * Desktop: botão flutuante discreto. Ambos aparecem depois do hero.
 */
export function WhatsAppFixos() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-rose-300/15 bg-navy-900/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md transition-transform duration-500 md:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
        inert={!show}
      >
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
          <WhatsAppIcon />
          Agendar avaliação
        </a>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Conversar com a ${CONFIG.nome} pelo WhatsApp`}
        inert={!show}
        className={`fixed bottom-6 right-6 z-30 hidden size-14 place-items-center rounded-full border border-rose-300/30 bg-navy-900 text-rose-300 shadow-[0_12px_30px_-10px_rgba(20,27,33,0.6)] transition-[opacity,transform,color] duration-500 hover:text-rose-200 md:grid ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <WhatsAppIcon size={22} />
      </a>
    </>
  );
}
