import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { CONFIG, linkWhatsApp, secaoAtiva, type ChaveSecao } from "../config";
import { Logo } from "./Foto";
import { WhatsApp } from "./Icones";
import { Botao } from "./Botoes";

const LINKS: { rotulo: string; href: string; secao: ChaveSecao }[] = [
  { rotulo: "O consultório", href: "#consultorio", secao: "consultorio" },
  { rotulo: "Atendimento", href: "#atendimento", secao: "atendimento" },
  { rotulo: "Para os pais", href: "#para-os-pais", secao: "paraOsPais" },
  { rotulo: "Primeira consulta", href: "#primeira-consulta", secao: "primeiraConsulta" },
  { rotulo: "Dúvidas", href: "#duvidas", secao: "duvidas" },
  { rotulo: "Contato", href: "#contato", secao: "contato" },
];

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="bg-cacau px-3 py-1.5 text-center text-[0.7rem] font-semibold sm:text-[0.8rem] tracking-[0.01em] text-creme">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const links = LINKS.filter((l) => secaoAtiva(l.secao));

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painel.current?.querySelector<HTMLElement>("a")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
      if (e.key === "Tab" && painel.current) {
        const focaveis = [botaoMenu.current!, ...painel.current.querySelectorAll<HTMLElement>("a")];
        const i = focaveis.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          focaveis.at(-1)!.focus();
        } else if (!e.shiftKey && i === focaveis.length - 1) {
          e.preventDefault();
          focaveis[0].focus();
        }
      }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <FaixaRascunho />
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solido ? "bg-creme/92 shadow-[0_1px_0_rgba(58,46,40,0.08),0_12px_30px_-20px_rgba(58,46,40,0.35)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <a href="#inicio" className="flex shrink-0 items-center gap-3 rounded-xl" aria-label={`${CONFIG.apelido}, ${CONFIG.nome}: voltar ao início`}>
            <Logo largura={52} prioridade className="h-auto w-[46px] md:w-[52px]" />
            <span className="hidden leading-tight sm:block xl:hidden 2xl:block">
              <span className="block font-display text-[1.05rem] font-medium">{CONFIG.nome}</span>
              <span className="block text-[0.78rem] font-semibold text-taupe-texto">
                {CONFIG.apelido} · {CONFIG.profissao}
              </span>
            </span>
          </a>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-0.5 whitespace-nowrap">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-full px-3 py-2.5 text-[0.94rem] font-semibold text-cacau-2 transition-colors hover:bg-menta-claro hover:text-cacau"
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:block">
              <Botao href={linkWhatsApp()} externo className="!min-h-11 whitespace-nowrap !px-5 text-[0.92rem]" icone={<WhatsApp tamanho={18} />}>
                Agendar avaliação
              </Botao>
            </span>
            <button
              ref={botaoMenu}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-cacau ring-1 ring-inset ring-cacau/15 transition-colors hover:bg-white/70 xl:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-cacau/10 bg-creme xl:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-cacau/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center font-display text-2xl font-medium text-cacau"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Botao href={linkWhatsApp()} externo icone={<WhatsApp tamanho={19} />}>
              Agendar avaliação pelo WhatsApp
            </Botao>
            <p className="text-center text-sm text-taupe-texto">
              {CONFIG.nome} · {CONFIG.cro}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
