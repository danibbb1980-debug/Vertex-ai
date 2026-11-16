import { useEffect, useRef, useState } from "react";
import { CONFIG, mensagens } from "../config";
import { temItens, waLink } from "../lib/util";
import { useNaVista, useRolou } from "../lib/hooks";
import { Logo } from "./Logo";
import { Pregas } from "./Pregas";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function links() {
  const s = CONFIG.secoes;
  return [
    s.atendimento && { href: "#atendimento", rotulo: "Atendimento" },
    s.formacao && temItens(CONFIG.formacao) && { href: "#formacao", rotulo: "Formação" },
    s.cursos && temItens(CONFIG.cursos) && { href: "#cursos", rotulo: "Cursos" },
    s.comoFunciona && { href: "#como-funciona", rotulo: "Como funciona" },
    s.duvidas && { href: "#duvidas", rotulo: "Dúvidas" },
    s.contato && { href: "#contato", rotulo: "Contato" },
  ].filter(Boolean) as { href: string; rotulo: string }[];
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center justify-center bg-tinta px-4 text-center text-pedra"
    >
      <p className="whitespace-nowrap text-[10.5px] text-pedra/85 sm:text-[11px] sm:tracking-[0.06em]">
        <span className="mr-2 hidden h-px w-4 translate-y-[-3px] bg-ouro align-middle sm:inline-block" aria-hidden="true" />
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </p>
    </div>
  );
}

/** A cortina se abre: 48 tiras de tinta sobem do centro para as bordas. Só CSS (transform). */
export function Cortina() {
  const [ativa, setAtiva] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setAtiva(false), 1400);
    return () => window.clearTimeout(t);
  }, []);
  if (!ativa) return null;
  const n = 48;
  const meio = (n - 1) / 2;
  return (
    <div className="cortina" style={{ position: "fixed", zIndex: 70 }} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ ["--d" as string]: (Math.abs(i - meio) / meio).toFixed(3) }} />
      ))}
    </div>
  );
}

export function Header() {
  const rolou = useRolou(20);
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const itens = links();

  useEffect(() => {
    if (!aberto) return;
    const primeiro = painel.current?.querySelector<HTMLElement>("a,button");
    primeiro?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
      if (e.key === "Tab" && painel.current) {
        const foc = painel.current.querySelectorAll<HTMLElement>("a,button");
        const a = foc[0];
        const z = foc[foc.length - 1];
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const solido = rolou || aberto;

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-colors duration-300 ${
        solido ? "bg-pedra border-b border-grafite/15" : "border-b border-transparent"
      }`}
      style={{ top: "var(--faixa)" }}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <a
          href="#inicio"
          className={`block w-[148px] shrink-0 transition-opacity duration-300 md:w-[168px] ${solido ? "opacity-100" : "invisible opacity-0"}`}
          aria-label={`${CONFIG.nome}, início`}
        >
          <Logo tom="grafite" className="h-auto w-full" />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {itens.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rotulo py-3 text-grafite hover:text-ouro-texto">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={waLink(mensagens.geral)} {...ext} className="btn btn-cheio hidden sm:inline-flex">
            Agendar avaliação
          </a>
          <button
            ref={botao}
            type="button"
            className="rotulo inline-flex min-h-[48px] min-w-[48px] items-center gap-3 px-2 text-grafite lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span className={`h-px bg-current transition-transform ${aberto ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`h-px bg-current transition-transform ${aberto ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </span>
            {aberto ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={painel}
        hidden={!aberto}
        className="fixed inset-x-0 bottom-0 overflow-y-auto bg-pedra lg:hidden"
        style={{ top: "calc(var(--faixa) + 72px)" }}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-70">
          <Pregas n={18} fase={1.3} />
        </div>
        <nav aria-label="Menu" className="container-site relative pt-8 pb-16">
          <ul className="border-t border-grafite/20">
            {itens.map((l, i) => (
              <li key={l.href} className="border-b border-grafite/20">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-[64px] items-baseline gap-5 py-3 font-serif text-[2rem] font-light leading-tight text-grafite"
                >
                  <span className="num rotulo text-ouro-texto">{String(i + 1).padStart(2, "0")}</span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={waLink(mensagens.geral)}
            {...ext}
            onClick={() => setAberto(false)}
            className="btn btn-cheio mt-10 w-full"
          >
            Agendar avaliação
          </a>
        </nav>
      </div>
    </header>
  );
}

/** Divisor entre seções: as pregas se abrem do centro quando entram na tela. */
export function Divisor({ fase = 0, tom = "pedra" }: { fase?: number; tom?: "pedra" | "funda" | "tinta" }) {
  const [ref, visivel] = useNaVista<HTMLDivElement>("0px 0px -10% 0px");
  const fundo = tom === "tinta" ? "bg-tinta" : tom === "funda" ? "bg-pedra-funda" : "bg-pedra";
  const cor = tom === "tinta" ? "rgba(177,156,113,0.35)" : "rgba(42,36,31,0.28)";
  const forte = tom === "tinta" ? "rgba(177,156,113,0.85)" : "rgba(110,90,51,0.7)";
  return (
    <div ref={ref} className={`${fundo} h-16 md:h-24`} aria-hidden="true">
      <div
        className="h-full transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
        style={{ clipPath: visivel ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)" }}
      >
        <Pregas n={72} fase={fase} freq={0.31} cor={cor} corForte={forte} cada={9} />
      </div>
    </div>
  );
}

/** Botão flutuante (desktop) e barra fixa (celular), visíveis depois do hero. */
export function AgendarFixo() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("inicio");
    const fim = document.getElementById("agendar");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    let heroVisivel = true;
    let formVisivel = false;
    const atualiza = () => setMostrar(!heroVisivel && !formVisivel);
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === hero) heroVisivel = e.isIntersecting;
        if (e.target === fim) formVisivel = e.isIntersecting;
      }
      atualiza();
    });
    io.observe(hero);
    if (fim) io.observe(fim);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ouro/40 bg-tinta px-4 py-2 transition-transform duration-300 sobre-tinta md:hidden ${
          mostrar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-hidden={!mostrar}
      >
        <a href={waLink(mensagens.geral)} {...ext} tabIndex={mostrar ? 0 : -1} className="btn btn-cheio w-full">
          Agendar avaliação pelo WhatsApp
        </a>
      </div>
      <a
        href={waLink(mensagens.geral)}
        {...ext}
        tabIndex={mostrar ? 0 : -1}
        aria-hidden={!mostrar}
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-3 border border-ouro/50 bg-tinta px-5 py-4 text-pedra transition-[opacity,transform] duration-300 md:flex ${
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span aria-hidden="true" className="flex h-4 items-stretch gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="w-px bg-ouro" />
          ))}
        </span>
        <span className="rotulo">Agendar avaliação</span>
      </a>
      {/* espaço para a barra fixa no celular não cobrir o rodapé */}
      <div className="h-[68px] bg-tinta md:hidden" aria-hidden="true" />
    </>
  );
}
