"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site, whatsappUrl, hoursSummary } from "@/lib/site-data";
import { Wordmark } from "@/components/ui/Wordmark";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * Header transparente sobre o hero, que ganha fundo off-white ao rolar.
 * Menu mobile: aria-expanded/aria-controls, fecha com Esc, ao tocar num link
 * ou ao voltar para o desktop, trava o scroll e devolve o foco ao botão.
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

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-soft ${
        open
          ? "border-b border-transparent bg-transparent"
          : scrolled
            ? "border-b border-graphite/10 bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-site flex items-center justify-between transition-[height] duration-500 ease-out-soft ${
          scrolled ? "h-16" : "h-20 lg:h-24"
        }`}
      >
        <a href="#inicio" className="relative z-10 -m-1 p-1">
          <Wordmark tone={open ? "light" : "dark"} className="transition-colors duration-300" />
          <span className="sr-only"> — voltar ao início</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative py-2 text-[0.8rem] font-medium tracking-[0.04em] text-graphite/75 transition-colors hover:text-graphite after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-graphite after:transition-transform after:duration-500 after:ease-out-soft hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl("schedule")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2.5 rounded-[2px] border border-graphite/25 px-5 text-[0.75rem] font-semibold tracking-[0.1em] text-graphite uppercase transition-colors duration-300 hover:border-graphite hover:bg-graphite hover:text-paper sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Agendar
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className={`relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden ${
              open ? "text-paper" : "text-graphite"
            }`}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ease-out-soft ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ease-out-soft ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Painel mobile — sempre no DOM para animar; inert quando fechado. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!open}
        className={`on-dark fixed inset-x-0 top-0 -z-0 flex h-dvh flex-col bg-graphite px-5 pt-28 pb-8 transition-[opacity,visibility] duration-300 ease-out-soft lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto">
          <ol className="border-t border-paper/10">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                className={`border-b border-paper/10 transition-[opacity,transform] duration-500 ease-out-soft ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <a
                  href={link.href}
                  onClick={() => close(false)}
                  className="flex items-baseline gap-5 py-4 font-serif text-[2.1rem] leading-tight text-paper active:text-champagne"
                >
                  <span className="font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-champagne tabular-nums">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 space-y-5">
          <a
            href={whatsappUrl("schedule")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close(false)}
            className="flex min-h-13 items-center justify-center gap-2.5 rounded-[2px] bg-paper text-[0.8rem] font-semibold tracking-[0.1em] text-graphite uppercase"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Agendar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <div className="flex items-center justify-between text-sm text-mineral">
            <p>
              {hoursSummary[0].label}: <span className="text-paper">{hoursSummary[0].value}</span>
            </p>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Matheus Tonon (abre em nova aba)"
              className="-m-2 flex h-11 w-11 items-center justify-center text-paper"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
