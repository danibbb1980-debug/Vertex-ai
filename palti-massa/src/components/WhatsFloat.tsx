import { useEffect, useState } from "react";
import { CONFIG, waLink } from "../config";
import { IconWhatsApp } from "./Icons";

/** Botão flutuante discreto (desktop) + barra fixa no celular. Aparecem após o hero. */
export function WhatsFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!CONFIG.whatsapp) return null;
  const agendar = CONFIG.secoes.agendar ? "#agendar" : "#contato";
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-30 hidden size-14 items-center justify-center rounded-full bg-petroleo-800 text-white shadow-alta transition-[transform,opacity] duration-300 hover:scale-105 md:inline-flex ${show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        tabIndex={show ? 0 : -1}
      >
        <IconWhatsApp width={26} height={26} />
      </a>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-linha bg-gelo/95 px-4 pt-2.5 backdrop-blur-md transition-transform duration-300 md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
        aria-hidden={!show}
      >
        <div className="flex gap-2.5">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario flex-1 !px-4" tabIndex={show ? 0 : -1}>
            <IconWhatsApp width={20} height={20} /> WhatsApp
          </a>
          <a href={agendar} className="btn btn-secundario flex-1 !px-4" tabIndex={show ? 0 : -1}>
            Solicitar horário
          </a>
        </div>
      </div>
    </>
  );
}
