import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { crmTexto, waLink } from "../lib";
import { Brain } from "./Brain";
import { Conversa } from "./Icons";

export const NAV = [
  { href: "#medico", label: "O médico", on: CONFIG.secoes.medico },
  { href: "#atendimentos", label: "Atendimentos", on: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
].filter((n) => n.on);

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const crm = crmTexto();
  return (
    <span className="flex items-center gap-3">
      <Brain className={`h-9 w-auto shrink-0 ${tone === "dark" ? "text-ink" : "text-paper"}`} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-medium tracking-[-0.01em] whitespace-nowrap">
          <span className={tone === "dark" ? "text-graphite" : "text-paper/80"}>Dr. </span>
          <span className={tone === "dark" ? "text-emerald" : "text-leaf"}>Melqui Massa</span>
        </span>
        {crm && (
          <span className={`label mt-1 !text-[0.65rem] ${tone === "dark" ? "text-stone" : "text-paper/70"}`}>{crm}</span>
        )}
      </span>
    </span>
  );
}

export function DraftBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--draft-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (!CONFIG.rascunho) return null;
  return (
    <div
      ref={ref}
      role="note"
      className="fixed inset-x-0 top-0 z-[60] border-b border-rule bg-paper-2 px-4 py-1.5 text-center font-display text-[0.78rem] leading-snug tracking-[0.01em] text-stone"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,box-shadow] duration-500 ${
        solid || open ? "bg-paper/95 shadow-[0_1px_0_var(--color-rule)] backdrop-blur-[2px]" : "bg-transparent"
      }`}
      style={{ top: "var(--draft-h, 0px)" }}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1280px] items-center justify-between gap-6 px-5 md:px-10 lg:px-14">
        <a href="#inicio" className="-m-2 p-2" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 font-display text-[0.95rem]">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="relative py-3 text-graphite transition-colors duration-300 hover:text-emerald-deep"
                >
                  {n.label}
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
            className="chamfer hidden h-12 w-12 items-center justify-center text-ink transition-colors hover:text-emerald-deep md:inline-flex"
            aria-label="Conversar pelo WhatsApp (abre em nova aba)"
          >
            <Conversa size={22} />
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-primary chamfer hidden !min-h-12 md:inline-flex">
              Agendar consulta
            </a>
          )}
          <button
            ref={btnRef}
            type="button"
            className="chamfer inline-flex h-12 items-center gap-2 px-3 font-display text-[0.95rem] text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h)-var(--draft-h,0px))] overflow-y-auto border-t border-rule bg-paper px-5 pb-10 pt-4 md:px-10 lg:hidden"
      >
        <nav aria-label="Menu">
          <ul className="flex flex-col">
            {NAV.concat(CONFIG.secoes.agendar ? [{ href: "#agendar", label: "Solicitar agendamento", on: true }] : []).map(
              (n) => (
                <li key={n.href} className="border-b border-rule">
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center font-display text-[1.6rem] tracking-[-0.01em] text-ink"
                  >
                    {n.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary chamfer mt-8 w-full"
        >
          <Conversa /> Agendar pelo WhatsApp
        </a>
      </div>
    </header>
  );
}
