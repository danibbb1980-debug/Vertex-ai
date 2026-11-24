import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { BotaoWhats, Marca } from "./ui";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-7 items-center justify-center bg-grafite px-4 text-center text-[0.72rem] tracking-wide text-linho">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const s = CONFIG.secoes;
  const links = [
    s.atendimentos && { href: "#atendimentos", t: "Atendimentos" },
    s.comoFunciona && { href: "#como-funciona", t: "Como funciona" },
    s.duvidas && { href: "#duvidas", t: "Dúvidas" },
    s.contato && { href: "#contato", t: "Contato" },
  ].filter(Boolean) as { href: string; t: string }[];

  useEffect(() => {
    const on = () => setRolou(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-colors duration-500 ${CONFIG.rascunho ? "top-7" : "top-0"} ${
        solido ? "border-b border-grafite/15 bg-linho" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" className="shrink-0">
          <Marca />
          <span className="sr-only">, voltar ao início</span>
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link py-3">
                  {l.t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <BotaoWhats texto="Agendar horário" className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 h-px w-6 bg-grafite transition-transform duration-300 ${aberto ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-6 bg-grafite transition-transform duration-300 ${aberto ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
      <nav
        id="menu-movel"
        aria-label="Menu"
        hidden={!aberto}
        className="border-t border-grafite/15 bg-linho px-5 pb-6 lg:hidden"
      >
        <ul>
          {links.map((l) => (
            <li key={l.href} className="border-b border-grafite/15">
              <a href={l.href} onClick={() => setAberto(false)} className="titulo flex min-h-14 items-center text-[1.7rem]">
                {l.t}
              </a>
            </li>
          ))}
        </ul>
        <BotaoWhats texto="Agendar horário" className="mt-5 w-full" />
      </nav>
    </header>
  );
}
