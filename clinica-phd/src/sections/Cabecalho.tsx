import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { Logo } from "../components/Logo";
import { IconeFechar, IconeMenu } from "../components/Icones";
import { secaoAtiva } from "../lib/secoes";
import { contatoHref } from "../lib/contato";

const LINKS = [
  { href: "#areas", rotulo: "Áreas", secao: "areas" },
  { href: "#corpo-clinico", rotulo: "Corpo clínico", secao: "corpoClinico" },
  { href: "#horarios", rotulo: "Horários", secao: "estrutura" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "faq" },
  { href: "#contato", rotulo: "Contato", secao: "localizacao" },
] as const;

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-grafite px-3 text-center text-[0.68rem] leading-tight tracking-[0.01em] sm:text-[0.78rem] text-creme/90"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const links = LINKS.filter((l) => secaoAtiva(l.secao));
  const linkAgendar = secaoAtiva("agendar") ? "#agendar" : contatoHref();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    document.documentElement.style.overflow = "hidden";
    const primeiro = painel.current?.querySelector<HTMLElement>("a,button");
    primeiro?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
      if (e.key === "Tab" && painel.current) {
        const focaveis = Array.from(painel.current.querySelectorAll<HTMLElement>("a,button"));
        const [p, u] = [focaveis[0], focaveis[focaveis.length - 1]];
        if (e.shiftKey && document.activeElement === p) {
          e.preventDefault();
          u.focus();
        } else if (!e.shiftKey && document.activeElement === u) {
          e.preventDefault();
          p.focus();
        }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${CONFIG.rascunho ? "top-8" : "top-0"} ${
        solido ? "bg-creme/95 shadow-[0_1px_0_rgb(138_106_68/0.25)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-phd flex h-[4.25rem] items-center justify-between gap-6 lg:h-20">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-sm px-1" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-flex min-h-12 items-center px-3.5 text-[0.95rem] font-medium text-grafite/85 transition-colors hover:text-grafite"
                >
                  {l.rotulo}
                  <span className="absolute inset-x-3.5 bottom-2.5 h-[5px] origin-left scale-x-0 border-y border-bronze-escuro transition-transform duration-500 ease-[var(--ease-suave)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={linkAgendar} className="botao botao-primario hidden !min-h-12 !py-2.5 sm:inline-flex">
            Agendar
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-sm text-grafite lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100dvh-4.25rem-2rem)] overflow-y-auto border-t border-bronze/30 bg-creme lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-phd flex h-full flex-col pt-6 pb-10">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-bronze/25">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-16 items-center justify-between font-serif text-[1.75rem] text-grafite"
                >
                  {l.rotulo}
                  <span className="font-sans text-xs tracking-[0.2em] text-bronze-texto">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={linkAgendar} onClick={() => setAberto(false)} className="botao botao-primario mt-8 self-start">
            Agendar
          </a>
        </nav>
      </div>
    </header>
  );
}
