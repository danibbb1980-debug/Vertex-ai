import { useEffect, useState } from "react";
import { contatoExterno, contatoHref, telHref, temTelefone, temWhatsapp } from "../lib/contato";
import { IconeTelefone, IconeWhatsapp } from "./Icones";

/**
 * Celular: barra fixa inferior (WhatsApp + Ligar). O rodapé tem espaço extra
 * para a barra não cobrir conteúdo. Desktop: botão flutuante discreto.
 * Ambos aparecem só depois que o visitante passa do topo da página.
 */
export function Flutuantes() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!temWhatsapp && !temTelefone) return null;

  const estado = visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0";
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-bronze/35 bg-creme/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[transform,opacity] duration-300 md:hidden ${estado}`}
        aria-hidden={!visivel}
      >
        <div className="flex gap-2.5">
          {temWhatsapp ? (
            <a href={contatoHref()} target="_blank" rel="noopener noreferrer" tabIndex={visivel ? 0 : -1} className="botao botao-primario !min-h-12 flex-1 !px-4 !text-[0.95rem]">
              <IconeWhatsapp /> Agendar<span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          ) : null}
          {temTelefone ? (
            <a href={telHref} tabIndex={visivel ? 0 : -1} className={`botao ${temWhatsapp ? "botao-contorno !px-5" : "botao-primario flex-1"} !min-h-12 !text-[0.95rem]`}>
              <IconeTelefone /> Ligar
            </a>
          ) : null}
        </div>
      </div>
      <a
        href={contatoHref()}
        {...(contatoExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        aria-label={temWhatsapp ? "Agendar pelo WhatsApp (abre em nova aba)" : "Ligar para a clínica"}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-[3px_999px_999px_3px] bg-grafite text-creme shadow-[0_14px_30px_-12px_rgb(42_41_38/0.7)] ring-1 ring-bronze/60 transition-[transform,opacity] duration-300 hover:-translate-y-0.5 md:flex ${estado}`}
      >
        {temWhatsapp ? <IconeWhatsapp className="size-6" /> : <IconeTelefone className="size-6" />}
      </a>
    </>
  );
}
