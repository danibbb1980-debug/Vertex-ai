import { useEffect, useRef, useState } from "react";
import { CONFIG, modoAtual } from "../config";
import { IconeFechar, IconeMenu } from "./Icones";

function links() {
  const modo = modoAtual();
  const l: { href: string; texto: string }[] = [{ href: "#inicio", texto: "Início" }];
  if (CONFIG.mostrarAline && CONFIG.secoes.aline) l.push({ href: "#odonto-baixinhos", texto: "Odonto Baixinhos" });
  if (modo === "aline" && CONFIG.secoes.paraOsPais) l.push({ href: "#para-os-pais", texto: "Para os pais" });
  if (CONFIG.mostrarJosiane && CONFIG.secoes.josiane)
    l.push({ href: "#dra-josiane", texto: modo === "josiane" ? "Atendimento" : "Dra. Josiane" });
  if (CONFIG.secoes.comoFunciona) l.push({ href: "#como-funciona", texto: "Como funciona" });
  if (CONFIG.secoes.duvidas) l.push({ href: "#duvidas", texto: "Dúvidas" });
  if (CONFIG.secoes.contato) l.push({ href: "#contato", texto: "Contato" });
  return l;
}

function Assinatura() {
  const modo = modoAtual();
  if (modo === "aline")
    return (
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.3rem] font-medium [font-variation-settings:'SOFT'_100]">Odonto Baixinhos</span>
        <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ouro-texto">Dra. Aline Maciel</span>
      </span>
    );
  if (modo === "josiane")
    return (
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.25rem] uppercase tracking-[0.08em] [font-variation-settings:'SOFT'_0]">Dra. Josiane Silva</span>
        <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ouro-texto">Cirurgiã-Dentista</span>
      </span>
    );
  return (
    <span className="flex items-center gap-3 leading-none">
      <span className="font-display text-[1.9rem] font-light italic text-ouro-texto">997</span>
      <span className="h-8 w-px bg-ouro/50" aria-hidden="true" />
      <span className="flex flex-col">
        <span className="text-[0.82rem] font-bold tracking-wide">Av. Afonso Pena, 997</span>
        <span className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-tinta-2">Alfenas · MG</span>
      </span>
    </span>
  );
}

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const topo = CONFIG.rascunho ? "top-8" : "top-0";

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    document.documentElement.style.overflow = "hidden";
    painel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  const itens = links();
  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow] duration-500 ${
        solido || aberto ? "bg-marfim/97 shadow-[0_1px_0_var(--color-linha)]" : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#inicio" className="shrink-0 rounded-md">
          <Assinatura />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {itens.slice(1).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center px-3 text-[0.9rem] font-semibold text-tinta-2 transition-colors hover:text-tinta after:absolute after:inset-x-3 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-ouro after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {CONFIG.secoes.agendar ? (
            <a href="#agendar" className="btn btn-tinta hidden !min-h-11 !px-5 sm:inline-flex">
              Agendar
            </a>
          ) : null}
          <button
            ref={botao}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-tinta/15 lg:hidden"
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
        className="h-[calc(100dvh-4.5rem-2rem)] overflow-y-auto border-t border-linha bg-marfim lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul className="flex flex-col">
            {itens.map((l, i) => (
              <li key={l.href} className="border-b border-linha/70">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between font-display text-2xl"
                >
                  {l.texto}
                  <span className="font-sans text-xs font-bold text-ouro-texto">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
          {CONFIG.secoes.agendar ? (
            <a href="#agendar" onClick={() => setAberto(false)} className="btn btn-tinta mt-8 w-full">
              Solicitar agendamento
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
