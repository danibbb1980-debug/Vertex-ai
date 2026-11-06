import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { Marca } from "../components/Marca";
import { cn } from "../lib/cn";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div role="note" className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-cacau px-2 text-center text-[0.6875rem] leading-tight sm:text-[0.75rem] sm:tracking-[0.02em] text-marfim/90">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

const LINKS = [
  { href: "#atendimentos", rotulo: "Atendimentos", secao: "atendimentos" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
] as const;

export function Cabecalho() {
  const [solido, setSolido] = useState(false);
  const [menu, setMenu] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);
  const temForm = CONFIG.secoes.agendamento && CONFIG.whatsapp;

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    if (!menu) return;
    painel.current?.querySelector("a")?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); botaoMenu.current?.focus(); } };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [menu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-40 transition-[background-color,box-shadow] duration-500",
        CONFIG.rascunho ? "top-8" : "top-0",
        solido || menu ? "bg-marfim/95 shadow-[0_1px_0_rgba(184,149,106,0.35),0_10px_30px_-20px_rgba(46,33,36,0.35)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="rounded-md">
          <Marca />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative py-2 text-cacau/85 transition-colors hover:text-mauve after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ouro after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {temForm && (
            <a href="#agendar" className="hidden min-h-12 items-center rounded-full bg-mauve px-6 text-[0.95rem] font-medium text-marfim transition-colors hover:bg-mauve-2 sm:inline-flex">
              Agendar
            </a>
          )}
          <button
            ref={botaoMenu}
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border border-cacau/15 lg:hidden"
            aria-expanded={menu}
            aria-controls="menu-celular"
            onClick={() => setMenu((v) => !v)}
          >
            <span className="sr-only">{menu ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span className={cn("absolute left-0 h-px w-5 bg-cacau transition-transform duration-300", menu ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-px w-5 bg-cacau transition-transform duration-300", menu ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>
      <div id="menu-celular" ref={painel} hidden={!menu} className="border-t border-ouro/25 bg-marfim lg:hidden">
        <nav aria-label="Menu do celular" className="container-site py-4">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenu(false)} className="flex min-h-12 items-center border-b border-cacau/8 font-serif text-2xl text-cacau">
                  {l.rotulo}
                </a>
              </li>
            ))}
            {temForm && (
              <li className="pt-4">
                <a href="#agendar" onClick={() => setMenu(false)} className="flex min-h-12 items-center justify-center rounded-full bg-mauve font-medium text-marfim">
                  Solicitar agendamento
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
