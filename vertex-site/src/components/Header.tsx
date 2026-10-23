import { useEffect, useRef, useState } from "react";
import { waLink } from "../config";
import { Logo } from "./VMark";
import { IconClose, IconMenu, IconWhatsApp } from "./Icons";

const links = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#segmentos", label: "Segmentos" },
  { href: "#planos", label: "Planos" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid || open
          ? "border-b border-gold/15 bg-ink-0/95 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-v flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#topo" className="shrink-0 rounded-md" aria-label="Vertex Web Studios: início">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-u py-2 font-display text-[0.92rem] text-mist hover:text-pearl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className="btn btn-gold hidden !min-h-11 !px-5 !py-2.5 !text-[0.9rem] sm:inline-flex"
          >
            <IconWhatsApp className="size-[18px]" />
            Quero ver meu rascunho
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-pearl/15 text-pearl lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-gold/10 bg-ink-0 lg:hidden"
      >
        <nav aria-label="Menu" className="container-v flex flex-col pt-6 pb-10">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-pearl/8 py-5 font-display text-2xl text-pearl"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener" className="btn btn-gold mt-8 w-full">
            <IconWhatsApp />
            Quero ver meu rascunho
          </a>
        </nav>
      </div>
    </header>
  );
}
