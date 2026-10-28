import { useEffect, useRef, useState } from "react";
import { linkWhatsApp, profissionaisAtivas } from "../config";
import { IconeFechar, IconeWhatsApp } from "./Icones";

/** Celular: barra fixa no rodapé. Desktop: botão discreto com escolha da profissional. */
export function WhatsFlutuante() {
  const ativas = profissionaisAtivas();
  const [aberto, setAberto] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <>
      {/* Celular */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-marfim px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 md:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!visivel}
      >
        <div className={`grid gap-2 ${ativas.length > 1 ? "grid-cols-2" : ""}`}>
          {ativas.map((p) => (
            <a
              key={p.id}
              href={linkWhatsApp(p.whatsapp, p.mensagemWhatsApp)}
              target="_blank"
              rel="noopener"
              tabIndex={visivel ? 0 : -1}
              className={`btn !min-h-12 !px-3 text-[0.85rem] ${p.id === "aline" ? "btn-ceu" : "btn-ouro"}`}
              aria-label={`Agendar com a ${p.nome} pelo WhatsApp (abre em nova aba)`}
            >
              <IconeWhatsApp tamanho={17} />
              {ativas.length > 1 ? p.nomeCurto : `Agendar com a ${p.nomeCurto}`}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div
        ref={caixa}
        className={`fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 transition-[opacity,transform] duration-500 md:flex ${
          visivel ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {aberto ? (
          <div id="menu-whats" className="abre w-72 rounded-3xl border border-linha bg-marfim p-3 shadow-[0_30px_60px_-25px_rgba(27,36,64,.45)]">
            <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.14em] text-ouro-texto">Com quem você quer falar?</p>
            <ul className="grid gap-1.5">
              {ativas.map((p) => (
                <li key={p.id}>
                  <a
                    href={linkWhatsApp(p.whatsapp, p.mensagemWhatsApp)}
                    target="_blank"
                    rel="noopener"
                    onClick={() => setAberto(false)}
                    className={`flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 transition-colors ${
                      p.id === "aline" ? "hover:bg-ceu" : "hover:bg-creme"
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${p.id === "aline" ? "bg-ceu-forte" : "bg-ouro-claro"}`}>
                      <IconeWhatsApp tamanho={17} />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-bold">{p.nome}</span>
                      <span className="block text-xs text-tinta-2">{p.id === "aline" ? "Odonto Baixinhos · crianças" : "Adultos"}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {ativas.length > 1 ? (
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-whats"
            tabIndex={visivel ? 0 : -1}
            className="btn btn-tinta !min-h-14 shadow-[0_20px_40px_-20px_rgba(27,36,64,.6)]"
          >
            {aberto ? <IconeFechar tamanho={20} /> : <IconeWhatsApp tamanho={20} />}
            {aberto ? "Fechar" : "Agendar pelo WhatsApp"}
          </button>
        ) : (
          <a
            href={linkWhatsApp(ativas[0].whatsapp, ativas[0].mensagemWhatsApp)}
            target="_blank"
            rel="noopener"
            tabIndex={visivel ? 0 : -1}
            className="btn btn-tinta !min-h-14 shadow-[0_20px_40px_-20px_rgba(27,36,64,.6)]"
          >
            <IconeWhatsApp tamanho={20} /> Agendar pelo WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
