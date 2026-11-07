import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { Logo } from "./Logo";
import { IconeFechar, IconeMenu, IconeWhatsapp } from "./Icones";

const links = [
  { href: "#atendimentos", label: "Atendimentos", on: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: "#horarios", label: "Horários", on: CONFIG.secoes.horarios && CONFIG.horarios.length > 0 },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.faq },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
].filter((l) => l.on);

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const agendarHref = CONFIG.secoes.agendar && temWhatsapp ? "#agendar" : linkWhatsapp();
  const agendarExterno = !(CONFIG.secoes.agendar && temWhatsapp);

  // Fecha o menu e só então rola até a seção (o menu trava a rolagem enquanto está aberto).
  const irPara = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.body.style.overflow = "";
    setAberto(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    });
  };

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const el = painel.current;
    el?.querySelector<HTMLElement>("a")?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
      if (e.key === "Tab" && el) {
        const f = [...el.querySelectorAll<HTMLElement>("a,button")];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  return (
    <header
      className={`fixed inset-x-0 top-(--faixa-h) z-40 transition-[background-color,box-shadow] duration-500 ${
        solido || aberto ? "bg-porcelana/92 shadow-[0_1px_0_var(--color-linha)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#inicio" className="rounded-lg">
          <Logo compacto />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-12 items-center rounded-full px-4 text-[0.95rem] font-medium text-grafite/80 transition-colors hover:text-ameixa"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {temWhatsapp ? (
            <a
              href={agendarHref}
              {...(agendarExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn-brilho hidden min-h-12 items-center gap-2 rounded-full bg-ameixa px-5 text-[0.95rem] font-semibold text-porcelana transition-colors hover:bg-[#3e2b4b] sm:inline-flex"
            >
              <IconeWhatsapp className="size-[1.15rem]" />
              Agendar
            </a>
          ) : null}
          <button
            ref={botaoMenu}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-ameixa hover:bg-nevoa/70 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            {aberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100dvh-var(--faixa-h)-4.5rem)] overflow-y-auto border-t border-linha bg-porcelana px-4 pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Menu do celular">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-linha">
                <a
                  href={l.href}
                  onClick={(e) => irPara(e, l.href)}
                  className="flex min-h-14 items-center font-serif text-2xl text-grafite"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {temWhatsapp ? (
          <a
            href={agendarHref}
            onClick={(e) => (agendarExterno ? setAberto(false) : irPara(e, agendarHref))}
            {...(agendarExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-8 flex min-h-13 items-center justify-center gap-2 rounded-full bg-ameixa font-semibold text-porcelana"
          >
            <IconeWhatsapp /> Agendar
          </a>
        ) : null}
      </div>
    </header>
  );
}
