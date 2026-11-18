import { useEffect, useRef, useState } from "react";
import { CONFIG, waLink } from "../config";
import { Wordmark } from "./Logo";

export const LINKS = [
  { href: "#instituto", rotulo: "O instituto", secao: "instituto" },
  { href: "#atendimentos", rotulo: "Atendimentos", secao: "atendimentos" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
] as const;

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setRolou(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // menu do celular: trava a rolagem, Esc fecha, foco preso no painel
  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const primeiro = painel.current?.querySelector<HTMLElement>("a,button");
    primeiro?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
      if (e.key === "Tab" && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>("a,button");
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
    document.addEventListener("keydown", tecla);
    return () => {
      html.style.overflow = "";
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#conteudo"
        className="sr-only-focusable absolute left-4 top-2 z-[60] bg-grafite px-4 py-3 text-pedra"
      >
        Ir para o conteúdo
      </a>
      {CONFIG.rascunho && (
        <p className="m-0 bg-grafite px-4 py-1.5 text-center text-[0.8125rem] leading-snug text-pedra" role="note">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      <div
        className={`border-b transition-colors duration-300 ${
          rolou || aberto ? "border-pedra-3 bg-pedra" : "border-transparent bg-pedra/0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <a href="#topo" className="-ml-1 flex min-h-12 items-center px-1" aria-label={`${CONFIG.nome}, início`}>
            <Wordmark className="h-[26px] w-auto text-grafite" />
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-7 p-0">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-nav py-3 text-[0.9375rem] text-grafite">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {CONFIG.usarWhatsapp && (
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="botao botao-cheio hidden !min-h-11 sm:inline-flex"
              >
                Agendar avaliação
              </a>
            )}
            <button
              ref={botaoMenu}
              type="button"
              className="flex min-h-12 min-w-12 items-center justify-center gap-3 px-2 text-[0.9375rem] font-semibold lg:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              onClick={() => setAberto((v) => !v)}
            >
              <span>{aberto ? "Fechar" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                    aberto ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${
                    aberto ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* painel do celular */}
      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="escuro absolute inset-x-0 top-full h-[100dvh] overflow-y-auto bg-grafite text-pedra lg:hidden"
      >
        <nav aria-label="Menu" className="px-5 pb-40 pt-6">
          <ul className="m-0 list-none p-0">
            {links.map((l) => (
              <li key={l.href} className="border-b border-white/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-16 items-center font-display text-[2rem] leading-none tracking-tight"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            {CONFIG.usarWhatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                Agendar avaliação
              </a>
            )}
            <a href={CONFIG.telefoneLink} className="botao botao-linha">
              Ligar {CONFIG.telefone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
