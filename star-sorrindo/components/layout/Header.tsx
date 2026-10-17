"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks, site, whatsappUrl, hoursSummary } from "@/lib/site-data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * Header leve sobre o hero, que ganha fundo sólido ao rolar.
 * Menu mobile: aria-expanded/aria-controls, fecha com Esc, ao tocar num link
 * ou ao voltar para o desktop, trava o scroll e mantém o foco no painel.
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-out-soft ${
        solid
          ? "border-b border-line/80 bg-ivory/90 shadow-[0_10px_30px_-24px_rgb(14_29_54/0.4)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-site flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-soft ${
          scrolled ? "h-[4.25rem]" : "h-20 lg:h-24"
        }`}
      >
        <Link href="/" className="relative z-10 -m-1 rounded p-1" aria-label={`${site.name} — página inicial`}>
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative py-2 text-[0.88rem] font-medium text-navy/80 transition-colors hover:text-navy after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-ink after:transition-transform after:duration-500 after:ease-out-soft hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl("default")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-navy px-5 text-[0.88rem] font-semibold text-ivory transition-[background-color,box-shadow] duration-300 hover:bg-navy-3 hover:shadow-[0_12px_28px_-14px_rgb(14_29_54/0.6)] sm:inline-flex"
          >
            Agendar avaliação
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-navy lg:hidden"
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
        className={`fixed inset-x-0 top-0 -z-0 flex h-dvh flex-col bg-ivory px-5 pt-24 pb-8 transition-[opacity,visibility] duration-400 ease-out-soft lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto">
          <ul className="border-t border-line">
            {[{ label: "Início", href: "/" }, ...navLinks].map((link, i) => (
              <li
                key={link.href}
                className={`border-b border-line transition-[opacity,transform] duration-500 ease-out-soft ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              >
                <a href={link.href} onClick={() => close(false)} className="serif flex items-center justify-between py-4 text-[2rem]">
                  {link.label}
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-5 pt-6">
          <a
            href={whatsappUrl("default")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-navy text-[0.95rem] font-semibold text-ivory"
          >
            <WhatsAppIcon className="h-5 w-5" /> Agendar avaliação
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <div className="flex items-center justify-between text-sm text-mineral">
            <span>
              {hoursSummary[0].label} · {hoursSummary[0].value}
            </span>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy"
              aria-label={`Instagram ${site.links.instagramHandle} (abre em nova aba)`}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
