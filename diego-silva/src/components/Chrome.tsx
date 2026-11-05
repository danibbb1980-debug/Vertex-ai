import { m, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CONFIG, temAdvogado } from "../config";
import { Emblem } from "./Emblem";
import { waLink } from "../lib/whatsapp";

import { getLenis } from "../lib/lenisStore";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-ink px-3 text-center text-[0.72rem] tracking-[0.02em] text-paper/85 sm:text-[0.78rem]"
    >
      <span className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" aria-hidden />
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden
      style={{ scaleX, top: CONFIG.rascunho ? "2rem" : 0 }}
      className="fixed inset-x-0 z-[61] h-[2px] origin-left bg-wine"
    />
  );
}

const links = [
  { href: "#areas", label: "Áreas" },
  { href: "#como-funciona", label: "Como funciona" },
  ...(temAdvogado ? [{ href: "#sobre", label: "Sobre" }] : []),
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
  { href: "#agendar", label: "Pré-atendimento" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Emblem className="h-10 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.3rem] tracking-[-0.01em] ${dark ? "text-paper" : "text-ink"}`}>{CONFIG.marca}</span>{" "}
        <span className={`mt-1 whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.07em] sm:text-[0.62rem] sm:tracking-[0.16em] ${dark ? "text-paper/70" : "text-ink-soft"}`}>
          {CONFIG.submarca}
        </span>
      </span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 24);
      const probe = CONFIG.rascunho ? 72 : 40;
      setOverDark(
        Array.from(document.querySelectorAll("[data-dark]")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        }),
      );
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const all = [btnRef.current!, ...f];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          all[all.length - 1].focus();
        } else if (!e.shiftKey && i === all.length - 1) {
          e.preventDefault();
          all[0].focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  const top = CONFIG.rascunho ? "top-8" : "top-0";
  return (
    <header className={`fixed inset-x-0 ${top} z-50`}>
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          open
            ? "bg-transparent"
            : overDark
              ? "on-dark bg-ink/80 text-paper shadow-[0_1px_0_rgba(245,240,230,0.08)] backdrop-blur-md"
              : scrolled
                ? "bg-paper/85 shadow-[0_1px_0_rgba(27,23,21,0.08)] backdrop-blur-md"
                : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <a href="#inicio" className="relative z-[2] -m-1 rounded p-1">
            <Logo dark={open || overDark} />
            <span className="sr-only">, voltar ao início</span>
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.94rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="ulink py-2">
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
              rel="noopener noreferrer"
              className={`group hidden min-h-12 items-center gap-2 rounded-full px-5 text-[0.92rem] font-medium transition-colors sm:inline-flex ${overDark ? "bg-paper text-ink hover:bg-white" : "bg-wine text-paper hover:bg-wine-deep"}`}
            >
              Falar pelo WhatsApp
            </a>
            <button
              ref={btnRef}
              type="button"
              className={`relative z-[2] inline-flex h-12 w-12 items-center justify-center rounded-full lg:hidden ${open || overDark ? "text-paper" : "text-ink"}`}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="on-dark fixed inset-0 z-[1] overflow-y-auto bg-ink text-paper lg:hidden"
      >
        <div className="wrap flex min-h-full flex-col pb-10 pt-36">
          <nav aria-label="Menu">
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="fade-up" style={{ animationDelay: `${0.04 * i}s` }}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-paper/10 py-4 font-serif text-[2rem] leading-tight"
                  >
                    <span className="font-sans text-xs tracking-[0.18em] text-gold-light">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-14 items-center justify-center rounded-full bg-paper px-7 font-medium text-ink"
          >
            Falar pelo WhatsApp
          </a>
          <p className="mt-6 text-sm text-paper/70">
            {CONFIG.whatsappExibicao} · Seg. a sex., 09h às 18h
          </p>
        </div>
      </div>
    </header>
  );
}
