import { useEffect, useRef, useState } from "react";
import { m, useScroll, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import type Lenis from "lenis";
import { CONFIG, type Tema } from "../config";
import { waEscritorio, waLumivo } from "../lib/whatsapp";
import { useFinePointer, useReducedMotion } from "../lib/useClient";
import { ChatIcon } from "./ui";

/* ---------------- Rolagem suave (Lenis, carregado sob demanda) ---------------- */

export const scroller: { lenis: Lenis | null } = { lenis: null };

export function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let alive = true;
    import("lenis").then(({ default: L }) => {
      if (!alive) return;
      const lenis = new L({ duration: 1.15, anchors: { offset: -84 }, autoRaf: false });
      scroller.lenis = lenis;
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      scroller.lenis?.destroy();
      scroller.lenis = null;
    };
  }, [reduced]);
  return null;
}

/* ---------------- Barra de progresso fina ---------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

/* ---------------- Cursor discreto (só mouse, sem reduced-motion) ---------------- */

export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setHover(!!t?.closest?.("a, button, summary, select, label, [data-cursor]"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [active, x, y]);

  if (!active) return null;
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] -mt-2 -ml-2 size-4 rounded-full border border-white mix-blend-difference"
      style={{ x: sx, y: sy }}
      animate={{ scale: hover ? 2.6 : 1, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
    />
  );
}

/* ---------------- Faixa de modelo + seletor de tema ---------------- */

const TEMAS: { id: Tema; nome: string; cores: [string, string] }[] = [
  { id: "papel-e-tinta", nome: "Papel e tinta", cores: ["#f4f0e8", "#7a2c27"] },
  { id: "verde-profundo", nome: "Verde profundo", cores: ["#13261d", "#bfd3a6"] },
  { id: "grafite-e-cobre", nome: "Grafite e cobre", cores: ["#222326", "#e3a881"] },
];

function ThemeSwitch() {
  const [tema, setTema] = useState<Tema>(CONFIG.tema);
  useEffect(() => {
    const t = document.documentElement.dataset.theme as Tema | undefined;
    if (t) setTema(t);
  }, []);
  const escolher = (t: Tema) => {
    setTema(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("tema", t);
    } catch {
      /* sem armazenamento: tudo bem */
    }
  };
  return (
    <div role="radiogroup" aria-label="Tema de demonstração" className="flex items-center gap-1">
      <span className="mr-1 hidden lg:inline">Tema</span>
      {TEMAS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={tema === t.id}
          aria-label={`Tema ${t.nome}`}
          title={t.nome}
          onClick={() => escolher(t.id)}
          className="group grid size-8 place-items-center rounded-full"
        >
          <span
            className={`block size-3.5 rounded-full ring-1 ring-offset-2 ring-offset-[var(--dark)] transition ${
              tema === t.id ? "ring-[var(--on-dark)]" : "ring-transparent group-hover:ring-[var(--on-dark-soft)]"
            }`}
            style={{ background: `linear-gradient(135deg, ${t.cores[0]} 50%, ${t.cores[1]} 50%)` }}
          />
        </button>
      ))}
    </div>
  );
}

function ModelBanner() {
  return (
    <div className="on-dark">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-1 text-[0.75rem] leading-snug md:px-10">
        <p className="py-1 text-[var(--on-dark-soft)]">
          <span className="text-[var(--on-dark)]">Modelo demonstrativo da Lumivo Web.</span>{" "}
          Nome, textos e dados deste escritório são fictícios.
        </p>
        <ThemeSwitch />
      </div>
    </div>
  );
}

/* ---------------- Cabeçalho ---------------- */

const LINKS = [
  { href: "#areas", label: "Áreas" },
  { href: "#como-atendemos", label: "Como atendemos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 shrink-0 place-items-center rounded-full border border-current font-serif text-[0.95rem] italic ${className}`}
      style={{ fontVariationSettings: '"opsz" 24' }}
    >
      {CONFIG.escritorio.monograma}
    </span>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    scroller.lenis?.stop();
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      scroller.lenis?.start();
      menuBtn.current?.focus();
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {CONFIG.modelo && <ModelBanner />}
      <header
        className={`transition-[background-color,border-color] duration-500 ${
          solid ? "border-b border-rule bg-[color-mix(in_srgb,var(--paper)_93%,transparent)] backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-[4.5rem] md:px-10">
          <a href="#inicio" className="flex items-center gap-3">
            <Monogram />
            <span className="font-serif text-[1.05rem] leading-tight tracking-[-0.01em]" style={{ fontVariationSettings: '"opsz" 24' }}>
              {CONFIG.escritorio.nomeCurto}
              <span className="block text-[0.7rem] font-sans tracking-[0.16em] uppercase text-ink-soft">Advocacia</span>
            </span>
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.95rem]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-draw">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={waEscritorio()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid hidden !min-h-11 !px-5 text-[0.9rem] sm:inline-flex"
            >
              <ChatIcon />
              Falar pelo WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="grid size-12 place-items-center rounded-full border border-rule lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movel"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-movel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="on-dark fixed inset-0 z-[90] flex flex-col overflow-y-auto px-5 pt-5 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Monogram />
                <span className="font-serif">{CONFIG.escritorio.nomeCurto}</span>
              </span>
              <button
                type="button"
                className="grid size-12 place-items-center rounded-full border border-[var(--on-dark-rule)]"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
            <nav aria-label="Menu móvel" className="mt-14 flex-1">
              <ol className="space-y-1">
                {LINKS.map((l, i) => (
                  <m.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="border-b border-[var(--on-dark-rule)]"
                  >
                    <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4">
                      <span className="label text-[var(--accent-on-dark)]">0{i + 1}</span>
                      <span className="font-display text-[2.4rem]">{l.label}</span>
                    </a>
                  </m.li>
                ))}
              </ol>
            </nav>
            <a href={waEscritorio()} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-10 w-full">
              <ChatIcon /> Falar pelo WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Botão flutuante ---------------- */

export function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const modelo = CONFIG.modelo;
  return (
    <m.a
      href={modelo ? waLumivo() : waEscritorio()}
      target="_blank"
      rel="noopener noreferrer"
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="fixed right-4 bottom-4 z-40 inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[var(--on-dark-rule)] bg-[var(--dark)] py-2 pr-5 pl-2 text-[0.875rem] text-[var(--on-dark)] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)] md:right-6 md:bottom-6"
    >
      <span className="grid size-8 place-items-center rounded-full bg-[var(--on-dark)] text-[var(--dark)]">
        {modelo ? (
          <span className="font-serif text-[0.8rem] italic" aria-hidden="true">
            L
          </span>
        ) : (
          <ChatIcon />
        )}
      </span>
      {modelo ? "Quero um site assim" : "WhatsApp"}
      <span className="sr-only">{modelo ? " (abre o WhatsApp da Lumivo Web em nova aba)" : " (abre em nova aba)"}</span>
    </m.a>
  );
}
