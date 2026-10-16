"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/studio-vip/logo.png";
import { WhatsAppLink } from "./ui";

const links = [
  { href: "#diferenciais", label: "Método" },
  { href: "#estudio", label: "O Studio" },
  { href: "#nutricao", label: "Nutrição" },
  { href: "#equipe", label: "Equipe" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

/**
 * Cabeçalho fixo. Transparente sobre o hero e sólido depois de rolar.
 * No mobile, o menu abre num painel; o CTA de WhatsApp fica sempre visível.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`vip-header fixed inset-x-0 top-0 z-50 ${scrolled || open ? "is-scrolled" : ""}`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <a
          href="#inicio"
          className="flex shrink-0 items-center gap-3"
          aria-label="Studio VIP — início"
        >
          <Image src={logo} alt="" width={42} height={45} priority className="h-11 w-auto" />
          <span className="hidden font-vip-display text-xl leading-none font-extrabold tracking-wide uppercase italic sm:block">
            Studio <span className="text-vip-green">VIP</span>
          </span>
        </a>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.82rem] font-semibold">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="vip-link text-white/85 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink
            message="hero"
            trackAs="header"
            className="min-h-11 px-4 py-2 text-[0.75rem]"
          >
            <span className="sm:hidden">Agendar</span>
            <span className="hidden sm:inline">Aula experimental</span>
          </WhatsAppLink>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-white lg:hidden"
            aria-expanded={open}
            aria-controls="vip-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M10 17h10" />}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="vip-menu"
        aria-label="Menu"
        className={`vip-menu absolute inset-x-0 top-full border-t border-white/10 bg-vip-950/95 lg:hidden ${open ? "is-open" : ""}`}
        // Fechado, o painel some também para leitores de tela e teclado.
        inert={!open}
      >
        <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between border-b border-white/8 font-vip-display text-2xl font-extrabold uppercase italic"
              >
                {link.label}
                <span className="text-vip-green" aria-hidden="true">
                  ›
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
