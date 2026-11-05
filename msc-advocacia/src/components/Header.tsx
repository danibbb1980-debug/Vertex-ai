import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CONFIG, MSG, NAV, waLink } from "../config";
import { EXPO_OUT, IconWhats, useReducedMotion } from "./ui";

export function Logo({
  className = "",
  forceLight = false,
  sizes = "72px",
  lazy = false,
}: {
  className?: string;
  forceLight?: boolean;
  sizes?: string;
  lazy?: boolean;
}) {
  // O arquivo oficial é branco; para fundos claros usamos a versão recolorida em grafite.
  return (
    <span className={`relative block aspect-[1172/816] ${className}`}>
      <img
        src="/logo-msc-branco-320.webp"
        srcSet="/logo-msc-branco-160.webp 160w, /logo-msc-branco-320.webp 320w"
        sizes={sizes}
        alt=""
        width={320}
        height={223}
        className={`absolute inset-0 h-full w-full ${forceLight ? "" : "logo-light"}`}
        decoding="async"
        loading={lazy ? "lazy" : undefined}
      />
      {!forceLight && (
        <img
          src="/logo-msc-grafite-320.webp"
          srcSet="/logo-msc-grafite-160.webp 160w, /logo-msc-grafite-320.webp 320w"
          sizes={sizes}
          alt=""
          width={320}
          height={223}
          className="logo-dark absolute inset-0 h-full w-full"
          decoding="async"
        />
      )}
    </span>
  );
}

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="bg-[#2c2a26] px-4 py-1.5 text-center text-[0.75rem] leading-snug tracking-[0.02em] text-[#d9d3c7]">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Menu: Esc fecha, foco preso no painel, rolagem da página pausada.
  useEffect(() => {
    if (!open) return;
    navigated.current = false;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button");
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
      lenis?.start();
      if (!navigated.current) menuBtn.current?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <DraftBanner />
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_84%,transparent)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="wrap flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <a href="#inicio" className="shrink-0" aria-label={`${CONFIG.nome}, voltar ao início`}>
            <Logo className="h-[44px] md:h-[50px]" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.9375rem]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link py-3">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waLink(MSG.geral)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !hidden !min-h-[46px] !px-5 text-[0.9375rem] sm:!inline-flex"
            >
              <IconWhats className="h-[18px] w-[18px]" />
              <span>Falar pelo WhatsApp</span>
            </a>
            <a
              href={waLink(MSG.geral)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar pelo WhatsApp"
              className="grid h-12 w-12 place-items-center rounded-full bg-[var(--btn-bg)] text-[var(--btn-fg)] sm:hidden"
            >
              <IconWhats className="h-5 w-5" />
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)] lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="tone-dark fixed inset-0 z-[60] flex flex-col bg-[var(--bg)] text-[var(--fg)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EXPO_OUT }}
          >
            <div className="wrap flex h-[68px] items-center justify-between">
              <Logo className="h-[44px]" forceLight />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)]"
                aria-label="Fechar menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav aria-label="Menu principal" className="wrap mt-8 flex-1">
              <ul>
                {NAV.map((n, i) => (
                  <li key={n.href} className="border-b border-[var(--line)]">
                    <a
                      href={n.href}
                      onClick={() => {
                        navigated.current = true;
                        setOpen(false);
                      }}
                      className="flex items-baseline gap-5 py-5 font-serif text-[2rem] leading-none"
                    >
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="wrap pb-10">
              <a
                href={waLink(MSG.geral)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <IconWhats className="h-5 w-5" />
                <span>Falar pelo WhatsApp</span>
              </a>
              <p className="muted mt-4 text-center text-sm">
                {CONFIG.horario.dias}, {CONFIG.horario.periodos.join(" e ")}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
