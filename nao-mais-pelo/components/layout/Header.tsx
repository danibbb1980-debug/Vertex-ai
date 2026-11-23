"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/primitives";
import { centralWhatsappHref, nav, site } from "@/lib/site";

/**
 * Header transparente sobre o hero; ao rolar, vira uma barra compacta clara.
 * `over` diz o que está atrás dele no topo da página:
 *  - "light": imagem/fundo claro → texto escuro;
 *  - "dark": imagem/fundo escuro → texto claro;
 *  - "none": sem hero → barra sólida desde o início.
 */
export function Header({ over = "light" }: { over?: "light" | "dark" | "none" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // O menu fica aberto apenas na rota em que foi aberto: trocar de página o fecha.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (value: boolean | ((v: boolean) => boolean)) => {
    const next = typeof value === "function" ? value(open) : value;
    setOpenPath(next ? pathname : null);
  };
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava a rolagem e fecha com Esc enquanto o menu mobile está aberto.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenPath(null);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || over === "none";
  const onDark = !solid && !open && over === "dark";

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,height,box-shadow,backdrop-filter] duration-700 ease-[var(--ease-out-expo)] ${
          open
            ? "text-bone"
            : solid
              ? "bg-bone/85 text-ink shadow-[0_1px_0_rgb(18_17_15/0.08)] backdrop-blur-xl"
              : onDark
                ? "text-bone"
                : "text-ink"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between gap-6 transition-[height] duration-700 ease-[var(--ease-out-expo)] ${
            scrolled ? "h-16" : "h-20 md:h-24"
          }`}
        >
          <Link href="/" className="relative z-10 shrink-0" aria-label="Não+Pelo — página inicial">
            <Logo className={`w-auto transition-[height] duration-700 ease-[var(--ease-out-expo)] ${scrolled ? "h-[22px]" : "h-[26px] md:h-[30px]"}`} />
          </Link>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-8 text-[0.8125rem] tracking-[0.04em]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`link-line ${onDark ? "text-bone/85 hover:text-bone" : "text-ink/75 hover:text-ink"}`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <a
              href={centralWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn hidden min-h-11 px-5 sm:inline-flex ${onDark || open ? "btn-outline-light" : "btn-solid-dark"}`}
            >
              <span>Agendar</span>
              <Arrow />
            </a>
            <button
              ref={menuButton}
              type="button"
              className="group -mr-2 inline-flex h-11 w-11 items-center justify-center xl:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-7" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 right-0 h-px bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    open ? "w-full -translate-y-[5px] -rotate-45" : "w-4"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile: tela cheia, links grandes em serifa com entrada escalonada. */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 flex flex-col bg-ink text-bone transition-[clip-path,visibility] duration-700 ease-[var(--ease-in-out-soft)] xl:hidden ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Menu" className="container-x flex flex-1 flex-col justify-center pt-24">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline gap-4 py-2 font-display text-[clamp(2.1rem,9vw,3.5rem)] leading-[1.05] transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" } as CSSProperties}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="eyebrow w-6 text-gold">0{i + 1}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={`container-x grid gap-6 border-t border-bone/10 py-8 transition-opacity duration-700 ${open ? "opacity-100 delay-500" : "opacity-0"}`}
        >
          <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid-light w-full">
            <span>Agendar pelo WhatsApp</span>
            <Arrow />
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
            {site.social.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
