import { useEffect, useRef, useState } from "react";
import { CONFIG, whatsappLink } from "../config";
import { Assinatura } from "./Logo";
import { IconClose, IconMenu, IconWhatsApp } from "./Icons";

export const LINKS = [
  { href: "#consultorio", label: "O consultório", secao: "consultorio" },
  { href: "#atendimento", label: "Atendimento", secao: "atendimento" },
  { href: "#pais", label: "Para os pais", secao: "pais" },
  { href: "#primeira-consulta", label: "Primeira consulta", secao: "primeiraConsulta" },
  { href: "#duvidas", label: "Dúvidas", secao: "duvidas" },
  { href: "#contato", label: "Contato", secao: "contato" },
] as const;

const linksAtivos = LINKS.filter((l) => CONFIG.secoes[l.secao]);

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="bg-ink px-4 py-1.5 text-center text-[0.72rem] font-semibold text-cream sm:text-[0.78rem] sm:tracking-wide">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const ver = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setRolou(window.scrollY > 24));
    };
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => {
      window.removeEventListener("scroll", ver);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
      if (e.key === "Tab" && painelRef.current) {
        const focaveis = [
          botaoRef.current,
          ...Array.from(painelRef.current.querySelectorAll<HTMLElement>("a")),
        ].filter(Boolean) as HTMLElement[];
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
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
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <FaixaRascunho />
      <header
        className={`transition-[background-color,box-shadow,border-color] duration-300 ${
          solido
            ? "border-b border-line bg-cream/95 shadow-[0_8px_30px_-22px_rgba(29,42,71,0.45)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
          <a href="#inicio" className="shrink-0 rounded-xl">
            <Assinatura />
            <span className="sr-only">, voltar ao início</span>
          </a>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {linksAtivos.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex min-h-12 items-center rounded-full px-3 text-[0.94rem] font-semibold whitespace-nowrap text-ink-2 transition-colors hover:bg-sage-50 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink("geral")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hidden !min-h-12 !px-5 !text-[0.94rem] whitespace-nowrap sm:inline-flex"
            >
              <IconWhatsApp size={18} />
              Agendar avaliação
              <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
            </a>
            <button
              ref={botaoRef}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink xl:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        <div
          id="menu-celular"
          ref={painelRef}
          hidden={!aberto}
          className={`${CONFIG.rascunho ? "h-[calc(100dvh-6.4rem)]" : "h-[calc(100dvh-4.5rem)]"} overflow-y-auto border-t border-line bg-cream xl:hidden`}
        >
          <nav aria-label="Menu do celular" className="container-site py-6">
            <ul className="flex flex-col">
              {linksAtivos.map((l, i) => (
                <li key={l.href} className="surgir border-b border-line" style={{ animationDelay: `${i * 40}ms` }}>
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-14 items-center font-display text-[1.6rem] text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("geral")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-8 w-full"
              onClick={() => setAberto(false)}
            >
              <IconWhatsApp size={20} />
              Agendar pelo WhatsApp
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
}

/** Botão flutuante (telas grandes) e barra fixa (celular). */
export function WhatsAppFixo() {
  return (
    <>
      <a
        href={whatsappLink("geral")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp (abre em nova aba)"
        className="group fixed right-6 bottom-6 z-40 hidden h-14 items-center gap-0 rounded-full bg-sage-deep pr-[1.05rem] pl-[1.05rem] text-white shadow-[0_14px_30px_-14px_rgba(29,42,71,0.6)] transition-[background-color] duration-300 hover:bg-[#2f5948] md:inline-flex"
      >
        <IconWhatsApp size={24} />
        <span className="max-w-0 overflow-hidden text-[0.95rem] font-extrabold whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 group-hover:ml-2.5 group-hover:max-w-48 group-hover:opacity-100 group-focus-visible:ml-2.5 group-focus-visible:max-w-48 group-focus-visible:opacity-100">
          Agendar avaliação
        </span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a
          href={whatsappLink("geral")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sage w-full !min-h-12"
        >
          <IconWhatsApp size={20} />
          Agendar pelo WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </>
  );
}
