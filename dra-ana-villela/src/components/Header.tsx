import { useEffect, useRef, useState } from "react";
import { CONFIG, whatsappLink } from "../config";
import { IconWhatsapp } from "./Icons";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#tratamentos", label: "Tratamentos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-tinta px-3 text-center text-[0.63rem] tracking-[0.02em] sm:text-[0.72rem] sm:tracking-[0.04em] text-porcelana/85"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-display text-[1.45rem] italic tracking-[-0.01em] ${light ? "text-porcelana" : "text-tinta"}`}>
        {CONFIG.nomeCurto}
      </span>
      <span className={`eyebrow mt-1.5 !text-[0.6rem] !tracking-[0.32em] ${light ? "text-porcelana/70" : "text-grafite"}`}>
        {CONFIG.descritor}
      </span>
    </span>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>("a,button");
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
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const top = CONFIG.rascunho ? "top-8" : "top-0";

  return (
    <header
      className={`fixed inset-x-0 ${top} z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solid || open ? "bg-porcelana/92 shadow-[0_1px_0_rgba(27,37,54,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-porcelana"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio">
          <Logo />
          <span className="sr-only">, voltar ao início</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.92rem] text-tinta/80">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-sublinhado pb-1 transition-colors hover:text-tinta">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-tinta px-5 text-[0.88rem] font-medium text-porcelana transition-colors hover:bg-tinta-2 sm:inline-flex"
          >
            <IconWhatsapp width={18} height={18} />
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-tinta/15 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className={`absolute h-px w-5 bg-tinta transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
            <span aria-hidden className={`absolute h-px w-5 bg-tinta transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={menuRef}
        hidden={!open}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-tinta/8 bg-porcelana lg:hidden"
      >
        <nav aria-label="Menu móvel" className="container-site flex flex-col pt-6 pb-10">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-tinta/8 py-5 font-display text-3xl text-tinta"
            >
              <span className="eyebrow text-rose-ink">0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-tinta px-6 text-porcelana"
          >
            <IconWhatsapp width={18} height={18} />
            Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
