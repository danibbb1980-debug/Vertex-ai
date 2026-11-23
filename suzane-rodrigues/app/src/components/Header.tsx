import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { AgendarBtn, Lockup } from "./ui";

const LINKS = [
  { href: "#atendimentos", t: "Atendimentos", on: CONFIG.secoes.atendimentos },
  { href: "#profissional", t: "A profissional", on: CONFIG.secoes.profissional },
  { href: "#como-funciona", t: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", t: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", t: "Contato", on: CONFIG.secoes.local },
].filter((l) => l.on);

export default function Header() {
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
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a,button"));
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
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <header className={`hdr ${solid || open ? "is-solid" : ""} ${CONFIG.rascunho ? "has-draft" : ""}`}>
      <div className="hdr__in wrap">
        <a href="#topo" className="hdr__brand">
          <Lockup size={56} />
        </a>
        <nav className="hdr__nav" aria-label="Seções">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.t}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hdr__cta">
          <AgendarBtn className="btn--sm" />
        </div>
        <button
          ref={btnRef}
          type="button"
          className="hdr__menu"
          aria-expanded={open}
          aria-controls="menu-celular"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hdr__burger" aria-hidden="true" data-open={open} />
          <span>{open ? "Fechar" : "Menu"}</span>
        </button>
      </div>
      <div id="menu-celular" ref={panelRef} className="mnav" hidden={!open}>
        <nav aria-label="Seções (celular)">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <AgendarBtn />
      </div>
    </header>
  );
}
