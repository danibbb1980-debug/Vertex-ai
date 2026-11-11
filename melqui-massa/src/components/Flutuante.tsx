import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { waLink } from "../lib";
import { Conversa } from "./Icons";

/** Botão flutuante discreto (desktop) e barra fixa no celular. */
export function Flutuante() {
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // reserva espaço no fim da página para a barra não cobrir conteúdo
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const set = () => {
      const visible = getComputedStyle(el).display !== "none";
      document.documentElement.style.setProperty("--bar-h", visible ? `${el.offsetHeight}px` : "0px");
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, []);

  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className={`chamfer fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 bg-emerald-deep px-5 font-display text-[0.95rem] font-medium text-white transition-[opacity,transform] duration-700 [--chamfer:10px] hover:bg-ink md:inline-flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <Conversa size={20} /> WhatsApp
      </a>

      <div
        ref={barRef}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-4 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-[2px] md:hidden"
      >
        <div className="flex gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary chamfer !min-h-12 flex-1 !gap-2 !px-3 whitespace-nowrap text-[0.95rem]">
            <Conversa size={20} /> Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-ghost ol chamfer !min-h-12 !px-3 text-[0.95rem]" aria-label="Ir para o formulário de agendamento">
              Formulário
            </a>
          )}
        </div>
      </div>
    </>
  );
}
