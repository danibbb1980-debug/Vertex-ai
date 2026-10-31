import { useEffect, useRef, useState } from "react";
import { CONFIG, profissionaisVisiveis } from "../config";
import { Brand } from "./Brand";
import { CloseIcon, MenuIcon, WhatsIcon } from "./Icons";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-night whitespace-nowrap px-2 text-center text-[11px] font-medium sm:text-xs text-[#DCE7F2]" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const top = CONFIG.rascunho ? "top-8" : "top-0";

  const links = [
    CONFIG.secoes.areas && { href: "#areas", label: "Áreas" },
    CONFIG.secoes.profissionais && profissionaisVisiveis().length > 0 && { href: "#profissionais", label: "Profissionais" },
    CONFIG.secoes.comoFunciona && { href: "#como-funciona", label: "Como funciona" },
    CONFIG.secoes.duvidas && { href: "#duvidas", label: "Dúvidas" },
    CONFIG.secoes.contato && { href: "#contato", label: "Contato" },
  ].filter(Boolean) as { href: string; label: string }[];

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 ${top} z-50 transition-[background-color,box-shadow] duration-300 ${solid || open ? "bg-white/90 shadow-soft backdrop-blur-md" : "bg-transparent"}`}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-4">
        <a href="#inicio" className="rounded-xl">
          <Brand />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-lg px-3 py-2 text-[0.94rem] font-medium text-graphite transition-colors hover:text-brand-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={CONFIG.secoes.agendar ? "#agendar" : "#contato"} className="btn-primary hidden !min-h-[44px] !py-2 sm:inline-flex">
            <WhatsIcon width={18} height={18} /> Agendar
          </a>
          <button
            ref={btnRef}
            type="button"
            className="grid h-12 w-12 place-items-center rounded-xl text-night hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>
      <div id="menu-movel" hidden={!open} className="border-t border-night/5 bg-white lg:hidden">
        <nav aria-label="Menu do celular" className="wrap py-4">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-[48px] items-center rounded-xl px-3 font-display text-lg font-medium text-night hover:bg-mist">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href={CONFIG.secoes.agendar ? "#agendar" : "#contato"} onClick={() => setOpen(false)} className="btn-primary w-full">
                <WhatsIcon /> Agendar atendimento
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
