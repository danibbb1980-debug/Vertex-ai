import { useEffect, useRef, useState } from "react";
import { CONFIG, modoAtual, profissionaisAtivas } from "../config";
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

/** Logos reais das profissionais ativas (no lugar de uma assinatura de texto). */
export function Logos({ altura = 44, className = "" }: { altura?: number; className?: string }) {
  const ativas = profissionaisAtivas();
  return (
    <span className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {ativas.map((p, i) => (
        <span key={p.id} className="flex items-center gap-3 sm:gap-4">
          {i > 0 ? <span className="h-8 w-px bg-ouro/50" aria-hidden="true" /> : null}
          <img
            src={p.logo.src}
            alt={p.logo.alt}
            width={p.logo.largura}
            height={p.logo.altura}
            decoding="async"
            style={{ height: altura, width: "auto" }}
          />
        </span>
      ))}
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
        solido || aberto ? "bg-marfim shadow-[0_1px_0_var(--color-linha)]" : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#inicio" className="shrink-0 rounded-md" aria-label="Início">
          <Logos altura={46} />
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
