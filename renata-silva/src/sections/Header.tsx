import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { CONFIG } from "../config";
import { Logo } from "../components/Logo";
import { WhatsAppIcon } from "../components/icons";
import { waLink } from "../lib/whatsapp";

const LINKS = [
  { href: "#atendimentos", label: "Atendimentos", on: CONFIG.secoes.atendimentos },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
  { href: "#agendar", label: "Solicitar horário", on: CONFIG.secoes.agendamento },
].filter((l) => l.on);

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = btnRef.current!;
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
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <header
      className={`on-dark fixed inset-x-0 top-[var(--banner-h)] z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solid || open ? "bg-navy-900/92 shadow-[0_1px_0_rgba(239,177,182,0.12)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-rose-300 focus:px-4 focus:py-2 focus:text-navy-900"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#topo" className="-ml-1 rounded-md p-1" aria-label={`${CONFIG.nome}, início`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline whitespace-nowrap font-label text-[0.76rem] uppercase tracking-[0.16em] text-pearl/85 hover:text-pearl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !min-h-[46px] whitespace-nowrap !px-5 sm:inline-flex">
            <WhatsAppIcon size={16} />
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="grid size-12 place-items-center rounded-full text-pearl xl:hidden"
            aria-expanded={open}
            aria-controls="menu-celular"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-var(--banner-h)-var(--header-h))] overflow-y-auto border-t border-rose-300/10 bg-navy-900 xl:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site py-8">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-rose-300/10">
                <a href={l.href} onClick={() => setOpen(false)} className="title flex min-h-16 items-center text-[1.9rem] text-pearl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10 w-full">
            <WhatsAppIcon size={16} />
            Agendar avaliação
          </a>
        </nav>
      </div>
    </header>
  );
}
