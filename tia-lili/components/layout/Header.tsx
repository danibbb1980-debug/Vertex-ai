"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site, whatsappUrl } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * Header fixo que ganha fundo ao rolar.
 * Menu mobile: aria-expanded/aria-controls, fecha com Esc, ao tocar num link
 * ou ao passar para o desktop, trava o scroll e devolve o foco ao botão.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      // Mantém o foco entre o botão do menu e os itens do painel.
      if (event.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a");
        const first = toggleRef.current;
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        solid ? "border-line bg-cream/95 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-18 items-center justify-between gap-4">
        <a href="#inicio" className="relative z-10 -m-1 p-1" aria-label={`${site.name} — voltar ao início`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="py-2 text-[0.95rem] font-medium text-muted transition-colors hover:text-teal">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-teal px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Agendar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Painel mobile: sempre no DOM para animar; inert quando fechado. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!open}
        className={`fixed inset-x-0 top-18 flex h-[calc(100dvh-4.5rem)] flex-col bg-cream px-5 pt-6 pb-8 transition-[opacity,visibility,transform] duration-300 ease-out-soft lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-line">
                <a href={link.href} onClick={() => close(false)} className="block py-4 font-display text-3xl text-ink active:text-teal">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close(false)}
            className="flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-teal font-semibold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Agendar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close(false)}
            className="flex min-h-13 items-center justify-center gap-2.5 rounded-full border border-ink/15 font-semibold text-ink"
          >
            <InstagramIcon className="h-5 w-5" />
            Instagram
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
