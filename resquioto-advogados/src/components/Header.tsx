import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { cx, temAreas, waLink } from "../lib/util";
import { Logo } from "./Logo";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-preto px-4 text-center text-[12px] leading-tight tracking-[0.02em] text-apoio-escuro"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const topo = CONFIG.rascunho ? "top-8" : "top-0";

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const links = [
    { href: "#escritorio", rotulo: "O escritório", mostrar: CONFIG.secoes.escritorio },
    { href: "#atuacao", rotulo: "Atuação", mostrar: CONFIG.secoes.atuacao && temAreas() },
    { href: "#como-funciona", rotulo: "Como funciona", mostrar: CONFIG.secoes.comoFunciona },
    { href: "#duvidas", rotulo: "Dúvidas", mostrar: CONFIG.secoes.duvidas },
    { href: "#contato", rotulo: "Contato", mostrar: CONFIG.secoes.contato },
  ].filter((l) => l.mostrar);

  return (
    <header
      className={cx(
        "fixed inset-x-0 z-40 transition-[background-color,border-color] duration-500",
        topo,
        solido || aberto ? "border-b border-fio bg-nevoa" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="trilho flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" className="-ml-1 block p-1" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <Logo tom="preto" className="h-11 w-auto md:h-12" />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="py-3 text-[15px] text-preto/80 transition-colors hover:text-preto">
              {l.rotulo}
            </a>
          ))}
          <a href={CONFIG.secoes.agendar ? "#agendar" : waLink()} className="btn btn-cheio !min-h-[48px] !px-5">
            Agendar atendimento
          </a>
        </nav>
        <button
          ref={botao}
          type="button"
          className="-mr-3 flex h-12 w-12 items-center justify-center lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <span className="relative block h-3 w-6">
            <span className={cx("absolute left-0 block h-px w-6 bg-preto transition-transform duration-300", aberto ? "top-1.5 rotate-45" : "top-0")} />
            <span className={cx("absolute left-0 block h-px w-6 bg-preto transition-transform duration-300", aberto ? "top-1.5 -rotate-45" : "top-3")} />
          </span>
        </button>
      </div>
      <div
        id="menu-celular"
        hidden={!aberto}
        className="h-[calc(100dvh-72px-2rem)] overflow-y-auto border-t border-fio bg-nevoa lg:hidden"
      >
        <nav aria-label="Menu" className="trilho flex flex-col pt-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="display border-b border-fio py-4 text-[34px]"
            >
              {l.rotulo}
            </a>
          ))}
          <a
            href={CONFIG.secoes.agendar ? "#agendar" : waLink()}
            onClick={() => setAberto(false)}
            className="btn btn-cheio mt-8"
          >
            Agendar atendimento
          </a>
        </nav>
      </div>
    </header>
  );
}
