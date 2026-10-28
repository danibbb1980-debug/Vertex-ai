import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { Logo } from "./Logo";
import { Botao } from "./Botao";
import { IconeFechar, IconeInstagram, IconeMenu } from "./Icones";

export const LINKS_NAV = [
  { href: "#instituto", rotulo: "Instituto", secao: "instituto" },
  { href: "#atendimentos", rotulo: "Atendimentos", secao: "atendimentos" },
  { href: "#profissionais", rotulo: "Profissionais", secao: "profissionais" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "contato" },
] as const;

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativa, setAtiva] = useState<string>("");
  const painelRef = useRef<HTMLDivElement>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const links = LINKS_NAV.filter((l) => CONFIG.secoes[l.secao]);

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // destaca no menu a seção que está na tela
  useEffect(() => {
    const secoes = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setAtiva(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // menu do celular: trava a rolagem, fecha com Esc e mantém o foco dentro
  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    const focaveis = () =>
      Array.from(painelRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focaveis()[0]?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenuRef.current?.focus();
      }
      if (e.key === "Tab") {
        const f = [botaoMenuRef.current!, ...focaveis()];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      html.style.overflow = "";
      lenis?.start();
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const fundo = solido || aberto;

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
        fundo ? "border-b border-linha bg-marfim/88 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
      style={{ top: "var(--faixa-h)" }}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-10">
        <a href="#inicio" className="shrink-0 rounded-sm" aria-label="Instituto Harmoniza, voltar ao início">
          <span className="block md:hidden">
            <Logo largura={128} prioridade />
          </span>
          <span className="hidden md:block">
            <Logo largura={150} prioridade />
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9rem] text-suave">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={ativa === l.href ? "true" : undefined}
                  className="group relative py-2 transition-colors hover:text-tinta aria-[current=true]:text-tinta"
                >
                  {l.rotulo}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ouro transition-transform duration-500 ease-[var(--ease-suave)] group-hover:scale-x-100 group-aria-[current=true]:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex">
            <Botao href={linkWhatsApp()} externo icone="whatsapp" className="min-h-[46px] text-[0.88rem]">
              Agendar avaliação
            </Botao>
          </span>
          <button
            ref={botaoMenuRef}
            type="button"
            className="grid size-12 place-items-center rounded-full text-tinta lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar tamanho={24} /> : <IconeMenu tamanho={24} />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-var(--topo))] overflow-y-auto border-t border-linha bg-marfim px-5 pt-6 pb-10 lg:hidden"
      >
        <nav aria-label="Menu do celular">
          <ul className="divide-y divide-linha">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    // fecha o menu (libera a rolagem) e só então vai até a seção
                    e.preventDefault();
                    setAberto(false);
                    document.documentElement.style.overflow = "";
                    requestAnimationFrame(() => {
                      const alvo = document.querySelector<HTMLElement>(l.href);
                      if (!alvo) return;
                      const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
                      const top = alvo.getBoundingClientRect().top + window.scrollY - margem;
                      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                      window.scrollTo({ top, behavior: suave ? "smooth" : "auto" });
                      history.replaceState(null, "", l.href);
                    });
                  }}
                  className="flex items-baseline gap-4 py-4 font-display text-[2rem] leading-none"
                >
                  <span className="rotulo w-6 text-bronze">{String(i + 1).padStart(2, "0")}</span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <Botao href={linkWhatsApp()} externo icone="whatsapp">
            Agendar avaliação
          </Botao>
          <a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 text-suave"
          >
            <IconeInstagram tamanho={18} /> {CONFIG.instagramUsuario}
          </a>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {aberto ? "Menu aberto" : ""}
      </span>
    </header>
  );
}
