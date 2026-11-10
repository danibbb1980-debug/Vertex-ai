import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { IconClose, IconMenu } from "./Icons";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#medico", label: "O médico", on: CONFIG.secoes.medico },
  { href: "#atendimentos", label: "Atendimentos", on: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
].filter((l) => l.on);

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a,button"));
        const all = [btnRef.current!, ...f];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); all[all.length - 1].focus(); }
        else if (!e.shiftKey && i === all.length - 1) { e.preventDefault(); all[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const agendarHref = CONFIG.secoes.agendar ? "#agendar" : "#contato";

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${CONFIG.rascunho ? "top-8" : "top-0"} ${
        solid || open ? "border-b border-linha/70 bg-gelo/92 shadow-[0_6px_24px_-18px_rgb(15_44_54/0.4)] backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-4">
        <a href="#inicio" className="flex h-12 items-center py-1.5" aria-label="Dr. Palti Massa, ir para o início">
          <Logo className="h-full" />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-12 items-center rounded-full px-3.5 text-[0.95rem] font-medium text-grafite transition-colors hover:text-agua-700">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={agendarHref} className="btn btn-primario hidden !min-h-11 !px-5 text-[0.95rem] sm:inline-flex">
            Agendar consulta
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-petroleo-900 hover:bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>
      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="border-t border-linha/70 bg-gelo lg:hidden"
        style={{ height: "calc(100dvh - 4.25rem - " + (CONFIG.rascunho ? "2rem" : "0px") + ")" }}
      >
        <nav aria-label="Menu" className="container-site flex h-full flex-col py-6">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-linha/70">
                <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center font-display text-2xl font-semibold text-petroleo-900">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={agendarHref} onClick={() => setOpen(false)} className="btn btn-primario mt-8 w-full">
            Agendar consulta
          </a>
        </nav>
      </div>
    </header>
  );
}
