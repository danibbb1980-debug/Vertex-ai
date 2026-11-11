import { useEffect, useRef, useState } from "react";
import { CONFIG, linkWhatsapp } from "../config";
import { RespiraPonto } from "./Respira";

const LINKS = [
  { href: "#sono", label: "Sono e respiração", secao: "sono" },
  { href: "#servicos", label: "Serviços", secao: "servicos" },
  { href: "#como-funciona", label: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", label: "Dúvidas", secao: "duvidas" },
  { href: "#contato", label: "Contato", secao: "contato" },
] as const;

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);
  const agendarHref = CONFIG.secoes.agendar ? "#agendar" : linkWhatsapp(CONFIG.mensagens.geral);

  useEffect(() => {
    const on = () => setRolou(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    painelRef.current?.querySelector("a")?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        solido ? "bg-white/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <FaixaRascunho />
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-md p-1" aria-label="SoluSono, voltar ao início">
          <img src="/marca/logo-azul.webp" alt="SoluSono" width={224} height={104} className="h-11 w-auto md:h-12" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-12 items-center rounded-full px-3.5 text-[0.95rem] text-text transition-colors hover:text-brand"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={agendarHref}
            className="hidden min-h-12 items-center gap-3 rounded-full bg-ink px-5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-brand sm:inline-flex"
          >
            <RespiraPonto className="[&>span:first-child]:bg-white/15 [&>span:last-child]:bg-sky" />
            Agendar avaliação
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {aberto ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h11" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-6rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-16 items-baseline gap-4 py-3 text-ink"
                >
                  <span className="num text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="titulo text-[2rem]">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={agendarHref}
            onClick={() => setAberto(false)}
            className="mt-8 flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand px-6 font-semibold text-white"
          >
            Agendar avaliação
          </a>
        </nav>
      </div>
    </header>
  );
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="relative z-50 bg-ink-deep px-4 py-1.5 text-center text-[0.75rem] leading-snug tracking-[0.02em] text-white/85">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}
