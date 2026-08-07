"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LinkButton } from "./Button";
import { Logo } from "./Logo";
import { nav } from "@/lib/content";

/**
 * Sticky navigation with an always-visible CTA.
 *
 * The header is transparent over the hero and gains a background once scrolled,
 * so the primary action is reachable from any point on a long page without
 * competing with the hero on first paint.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scrolling while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex min-h-11 items-center gap-2.5"
          aria-label="Vertex Web Studios — início"
        >
          <Logo className="size-7 shrink-0" />
          <span className="font-display text-[0.95rem] font-semibold tracking-tight whitespace-nowrap">
            Vertex <span className="hidden text-mist-dim sm:inline">Web Studios</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-mist transition-colors duration-200 hover:text-cloud"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapper carries the responsive display: putting `hidden` on the
              button itself loses to the base `inline-flex` in the cascade. */}
          <div className="hidden sm:block">
            <LinkButton href="#planos" trackAs="nav">
              {nav.cta}
            </LinkButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-cloud transition-colors duration-200 hover:bg-white/5 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-ink/95 px-5 py-6 backdrop-blur-xl lg:hidden"
          aria-label="Principal (mobile)"
        >
          <ul className="flex flex-col gap-1">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-lg px-3 text-base text-mist transition-colors duration-200 hover:bg-white/5 hover:text-cloud"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LinkButton
            href="#planos"
            size="lg"
            className="mt-4 w-full"
            onClick={() => setOpen(false)}
            trackAs="nav-mobile"
          >
            {nav.cta}
          </LinkButton>
        </nav>
      )}
    </header>
  );
}
