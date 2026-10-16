"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site, whatsappUrl, hoursSummary } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * Header transparente sobre o hero, que ganha fundo escuro ao rolar.
 * Menu mobile: aria-expanded/aria-controls, fecha com Esc, ao tocar num link
 * ou ao voltar para o desktop, trava o scroll da página e devolve o foco ao
 * botão que o abriu.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
      // Mantém o foco dentro do painel enquanto ele está aberto.
      if (event.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a, button");
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
      className={`fixed inset-x-0 z-50 ${site.rascunho ? "top-7" : "top-0"} transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-soft ${
        solid ? "border-b border-white/8 bg-ink/92 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-site flex items-center justify-between transition-[height] duration-500 ease-out-soft ${
          scrolled ? "h-16" : "h-18 lg:h-22"
        }`}
      >
        <a href="#inicio" className="relative z-10 -m-1 p-1" aria-label={`${site.name} — voltar ao início`}>
          <Logo compact={scrolled} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative py-2 text-sm font-medium text-white/80 transition-colors hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-orange after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl("visit")}
            target="_blank"
            rel="noopener noreferrer"
            className="chamfer-sm hidden min-h-11 items-center bg-orange px-5 text-xs font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-orange-hot sm:inline-flex"
          >
            Quero conhecer
            <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-white lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Painel mobile — sempre no DOM para animar; inert quando fechado. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!open}
        className={`texture-grid fixed inset-x-0 top-0 -z-0 flex flex-col ${site.rascunho ? "h-[calc(100dvh-1.75rem)]" : "h-dvh"} bg-ink px-5 pt-24 pb-8 transition-[opacity,visibility] duration-300 ease-out-soft lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto">
          <ol className="border-t border-white/10">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                className={`border-b border-white/10 transition-[opacity,transform] duration-500 ease-out-soft ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <a
                  href={link.href}
                  onClick={() => close(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-3xl font-bold tracking-tight text-white uppercase active:text-orange"
                >
                  <span className="font-sans text-xs font-semibold tracking-widest text-orange">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 space-y-5">
          <a
            href={whatsappUrl("visit")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close(false)}
            className="chamfer-sm flex min-h-13 items-center justify-center gap-2.5 bg-orange text-sm font-bold tracking-[0.12em] text-ink uppercase"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Quero conhecer
            <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
          </a>
          <div className="flex items-center justify-between text-sm text-mist">
            <p>
              {hoursSummary[0].label}: <span className="text-white">{hoursSummary[0].value}</span>
            </p>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da VIP Shape (abre em nova aba)"
              className="-m-2 flex h-11 w-11 items-center justify-center text-white"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
