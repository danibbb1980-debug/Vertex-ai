import { useEffect, useRef, useState } from "react";
import { CONFIG, temWhatsapp } from "../config";
import { Monograma } from "./Marca";
import { IconeTelefone } from "./ui";

const LINKS = [
  { href: "#escritorio", rotulo: "O escritório", secao: "escritorio" },
  { href: "#areas", rotulo: "Áreas de atuação", secao: "areas" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
] as const;

export function Header({ topo }: { topo: string }) {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const agendaWhats = temWhatsapp() && CONFIG.secoes.agendar;

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);
  const fundo = solido || aberto ? "bg-osso border-fio" : "bg-transparent border-transparent";

  return (
    <header className={`fixed inset-x-0 z-40 border-b transition-colors duration-300 ${fundo}`} style={{ top: topo }}>
      <div className="mx-auto flex h-[4.5rem] max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a href="#inicio" className="flex min-h-12 items-center gap-3 no-underline text-tinta" aria-label={`${CONFIG.nome}, início`}>
          <Monograma className="h-7 w-auto" />
          <span className="font-display text-[0.9rem] tracking-[0.1em] uppercase sm:text-[1.05rem] sm:tracking-[0.12em]">{CONFIG.nomeCurto}</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a className="link py-3" href={l.href}>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={agendaWhats ? "#agendar" : CONFIG.telefoneHref}
            className="btn btn-cheio hidden !min-h-11 !px-4 text-[0.95rem] sm:inline-flex"
          >
            {!agendaWhats && <IconeTelefone />}
            Agendar atendimento
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="flex h-12 w-12 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span className={`absolute left-0 h-px w-6 bg-tinta transition-transform duration-300 ${aberto ? "top-2 rotate-45" : "top-0.5"}`} />
              <span className={`absolute left-0 h-px w-6 bg-tinta transition-transform duration-300 ${aberto ? "top-2 -rotate-45" : "top-3.5"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-movel" hidden={!aberto} className="lg:hidden border-t border-fio bg-osso">
        <nav aria-label="Menu" className="mx-auto max-w-[84rem] px-5 pb-8 pt-4 sm:px-8">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-fio">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-baseline gap-4 py-3 font-display text-[1.6rem] no-underline text-tinta"
                >
                  <span className="num font-sans text-xs text-pedra">{String(i + 1).padStart(2, "0")}</span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a href={CONFIG.telefoneHref} className="btn btn-cheio mt-6 w-full">
            <IconeTelefone />
            Ligar {CONFIG.telefone}
          </a>
        </nav>
      </div>
    </header>
  );
}
