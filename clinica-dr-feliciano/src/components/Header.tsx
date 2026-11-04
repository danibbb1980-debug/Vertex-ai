import { useEffect, useRef, useState } from "react";
import { CONFIG, waLink } from "../config";
import { Icone, Logo } from "./ui";

export const LINKS = [
  { href: "#clinica", rotulo: "A clínica", secao: "clinica" },
  { href: "#atendimentos", rotulo: "Atendimentos", secao: "atendimentos" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
  { href: "#agendar", rotulo: "Agendar", secao: "agendar" },
] as const;

const linksAtivos = () => LINKS.filter((l) => CONFIG.secoes[l.secao]);

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-petroleo-950 px-3 text-center text-[0.7rem] text-linho/90 sm:text-[0.78rem] sm:tracking-wide">
      <span className="whitespace-nowrap">
        <span className="mr-2 hidden sm:inline-block size-1.5 -translate-y-px rounded-full bg-mel-claro align-middle" aria-hidden="true" />
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </span>
    </div>
  );
}

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const topo = CONFIG.rascunho ? "top-8" : "top-0";

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Menu móvel: Esc fecha, foco preso no painel, rolagem travada
  useEffect(() => {
    if (!aberto) return;
    const painel = painelRef.current;
    const focaveis = () => Array.from(painel?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focaveis()[0]?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
      if (e.key === "Tab") {
        const f = focaveis();
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener("keydown", tecla);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = "";
    };
  }, [aberto]);

  const fundo = solido || aberto;

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-[background-color,box-shadow] duration-300 ${
        fundo ? "bg-papel/92 shadow-[0_1px_0_rgba(15,58,64,0.08),0_10px_30px_-20px_rgba(15,58,64,0.35)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-md px-1" aria-label="Clínica Dr. Feliciano, voltar ao início">
          <Logo className="h-10 w-auto sm:h-11" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {linksAtivos().map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center px-3 text-[0.95rem] text-tinta-suave transition-colors hover:text-petroleo-900 after:absolute after:inset-x-3 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-mel after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario hidden !px-5 sm:inline-flex">
            <Icone nome="whatsapp" className="size-[1.1rem]" />
            Agendar avaliação
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-petroleo-900 hover:bg-petroleo-900/5 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            <Icone nome={aberto ? "fechar" : "menu"} className="size-6" />
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-4.5rem-2rem)] overflow-y-auto border-t border-petroleo-900/10 bg-papel lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul className="divide-y divide-petroleo-900/10">
            {linksAtivos().map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between font-serif text-2xl text-petroleo-900"
                >
                  {l.rotulo}
                  <Icone nome="seta" className="size-5 text-mel" />
                </a>
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-8 w-full">
            <Icone nome="whatsapp" className="size-5" />
            Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}

/* Botão flutuante (desktop) e barra fixa (celular), após o hero */
export function AtalhosWhatsApp() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.7);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a clínica pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed right-6 bottom-6 z-30 hidden size-14 items-center justify-center rounded-full bg-petroleo-900 text-linho shadow-[0_14px_30px_-12px_rgba(15,58,64,0.8)] ring-1 ring-mel/40 transition-[opacity,transform] duration-300 hover:bg-petroleo-800 md:inline-flex ${
          visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Icone nome="whatsapp" className="size-6" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-petroleo-900/10 bg-papel/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!visivel}
      >
        <div className="flex gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" tabIndex={visivel ? 0 : -1} className="btn btn-primario flex-1 !px-3 text-[0.95rem]">
            <Icone nome="whatsapp" className="size-5" />
            Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" tabIndex={visivel ? 0 : -1} className="btn btn-contorno !px-4 text-[0.95rem]" aria-label="Solicitar horário pelo formulário">
              <Icone nome="calendario" className="size-5" />
              Horário
            </a>
          )}
        </div>
      </div>
    </>
  );
}
