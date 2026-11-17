import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { waUrl } from "../lib/whatsapp";
import Logotipo from "./Logotipo";

const LINKS = [
  { href: "#tratamentos", rotulo: "Tratamentos", secao: "tratamentos" },
  { href: "#profissional", rotulo: "Profissional", secao: "profissional" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
] as const;

export default function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const links = LINKS.filter((l) => {
    if (l.secao === "profissional") return CONFIG.secoes.profissional && CONFIG.profissionais.length > 0;
    return CONFIG.secoes[l.secao];
  });

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
        botaoRef.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const fundo = solido || aberto ? "bg-gesso/95 backdrop-blur-[2px] border-b border-tinta/10" : "bg-transparent border-b border-transparent";

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-colors duration-300 ${fundo}`}
      style={{ top: "var(--draft-h)" }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#inicio" className="-ml-1 inline-flex min-h-12 items-center px-1" aria-label={`${CONFIG.nome}, ${CONFIG.descritor}, início`}>
          <Logotipo tom="claro" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-sub inline-flex min-h-12 items-center text-[13px] uppercase tracking-[0.16em] text-texto">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {CONFIG.usarWhatsapp && (
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primario hidden !min-h-11 !px-5 sm:inline-flex"
            >
              Agendar avaliação
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center gap-3 px-2 text-[13px] uppercase tracking-[0.16em] lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((a) => !a)}
          >
            <span>{aberto ? "Fechar" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        hidden={!aberto}
        className="h-[calc(100dvh-72px-var(--draft-h))] overflow-y-auto border-t border-tinta/10 bg-gesso px-4 pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Menu do celular">
          <ol className="divide-y divide-tinta/10 border-y border-tinta/10">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-16 items-baseline gap-5 py-3"
                >
                  <span className="num text-[12px] text-champanhe-escuro">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[34px]">{l.rotulo}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {CONFIG.usarWhatsapp && (
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-8 w-full">
            Agendar avaliação <span className="seta" aria-hidden="true" />
          </a>
        )}
      </div>
    </header>
  );
}
