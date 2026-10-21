import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { cn, linkWhatsapp } from "../lib/utils";
import { Assinatura, BotaoWhatsapp } from "../components/Base";
import { Conversa, Fechar, Menu } from "../components/icons";

const links = [
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#atendimento", rotulo: "Atendimento" },
  { href: "#onde-atendo", rotulo: "Onde atendo" },
  { href: "#duvidas", rotulo: "Dúvidas" },
  { href: "#contato", rotulo: "Contato" },
];

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center overflow-hidden whitespace-nowrap bg-lilas-profundo px-3 text-center text-[0.66rem] font-medium tracking-wide text-lilas-50 sm:text-xs"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-500 ease-[var(--ease-suave)]",
        solido || aberto
          ? "border-b border-tinta/[0.06] bg-marfim/92 shadow-[0_10px_30px_-24px_rgba(59,42,54,0.5)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
      style={{ top: "var(--faixa-h)" }}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <div className={cn("mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 transition-all duration-500 md:px-8", solido ? "h-[68px]" : "h-[80px]")}>
        <a href="#inicio" aria-label={`${CONFIG.nome}, início`} className="shrink-0">
          <Assinatura />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.93rem] font-medium text-tinta/80">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative py-1 transition-colors hover:text-rosa-escuro after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-rosa-escuro after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <BotaoWhatsapp className="min-h-11 px-5 py-2.5 text-[0.9rem]">Agendar avaliação</BotaoWhatsapp>
          </span>
          <button
            ref={botaoRef}
            type="button"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-tinta/10 bg-white/70 text-tinta lg:hidden"
          >
            {aberto ? <Fechar className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        hidden={!aberto}
        className="h-[calc(100dvh-var(--faixa-h)-68px)] overflow-y-auto border-t border-tinta/[0.06] bg-marfim px-5 pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Menu do celular">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex items-center justify-between border-b border-tinta/[0.07] py-4 font-serif text-[1.65rem] text-tinta"
                >
                  {l.rotulo}
                  <span aria-hidden className="text-base text-rosa">✦</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={linkWhatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAberto(false)}
          className="mt-8 flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-rosa-escuro px-6 py-3.5 font-semibold text-white"
        >
          <Conversa className="h-5 w-5" /> Agendar avaliação
        </a>
        <p className="mt-4 text-center text-sm text-suave">{CONFIG.cro}</p>
      </div>
    </header>
  );
}
