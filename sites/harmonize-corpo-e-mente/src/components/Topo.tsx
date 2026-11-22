import { useEffect, useRef, useState } from "react";
import { CONFIG, linkWhatsapp } from "../config";
import { Afinacao } from "./Afinacao";
import { useReduzMovimento } from "../hooks";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center justify-center bg-tinta px-4 text-center font-sans text-[0.72rem] leading-tight text-areia/90"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

const LINKS = [
  { href: "#atendimentos", rotulo: "Atendimentos", secao: "atendimentos" },
  { href: "#espaco", rotulo: "O espaço", secao: "espaco" },
  { href: "#como-funciona", rotulo: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", rotulo: "Dúvidas", secao: "duvidas" },
  { href: "#contato", rotulo: "Contato", secao: "local" },
] as const;

export function Cabecalho() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const top = CONFIG.rascunho ? "top-7" : "top-0";

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
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

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);

  return (
    <header
      className={`fixed inset-x-0 ${top} z-50 transition-colors duration-500 ${
        solido || aberto ? "border-b border-tinta/15 bg-areia/95 backdrop-blur-[2px]" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" className="block shrink-0" aria-label="Harmonize Corpo e Mente, voltar ao início">
          <img
            src="/img/logo-tinta-sm.webp"
            alt=""
            width={300}
            height={93}
            className="h-11 w-auto sm:h-12"
            decoding="async"
          />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a className="py-3 hover:text-terracota-esc" href={l.href}>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {CONFIG.usarWhatsapp && (
            <a
              className="btn btn-tinta hidden sm:inline-flex"
              href={linkWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar atendimento
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="flex h-12 w-12 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((a) => !a)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span
                className={`absolute left-0 h-px w-7 bg-tinta transition-transform duration-300 ${aberto ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-7 bg-terracota transition-transform duration-300 ${aberto ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>
      <div
        id="menu-celular"
        hidden={!aberto}
        className="h-[calc(100dvh-72px-1.75rem)] overflow-y-auto border-t border-tinta/15 bg-areia lg:hidden"
      >
        <nav aria-label="Menu" className="wrap py-6">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-tinta/15">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="block py-4 font-serif text-[2rem] leading-none tracking-[-0.02em]"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
            {CONFIG.secoes.agendar && CONFIG.usarWhatsapp && (
              <li className="border-b border-tinta/15">
                <a
                  href="#agendar"
                  onClick={() => setAberto(false)}
                  className="block py-4 font-serif text-[2rem] leading-none tracking-[-0.02em]"
                >
                  Solicitar agendamento
                </a>
              </li>
            )}
          </ul>
          {CONFIG.usarWhatsapp && (
            <a className="btn btn-tinta mt-8 w-full" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
              Agendar pelo WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  const linhasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduz = useReduzMovimento();

  // Ao rolar pelo hero, a onda se acalma até virar reta.
  useEffect(() => {
    const linhas = linhasRef.current;
    const hero = heroRef.current;
    if (!linhas || !hero) return;
    if (reduz) {
      linhas.style.setProperty("--amp", "0.35");
      return;
    }
    let raf = 0;
    let ativo = true;
    const atualiza = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const t = Math.min(Math.max(-r.top / (r.height * 0.7), 0), 1);
      const suave = 1 - t * t * (3 - 2 * t);
      linhas.style.setProperty("--amp", suave.toFixed(3));
    };
    const onScroll = () => {
      if (ativo && !raf) raf = requestAnimationFrame(atualiza);
    };
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting;
      if (ativo) onScroll();
    });
    io.observe(hero);
    window.addEventListener("scroll", onScroll, { passive: true });
    atualiza();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduz]);

  return (
    <section
      id="inicio"
      ref={heroRef}
      aria-labelledby="titulo-hero"
      className={`relative ${CONFIG.rascunho ? "pt-[calc(72px+1.75rem)]" : "pt-[72px]"}`}
    >
      <div className="wrap pb-10 pt-12 sm:pt-16 lg:pb-14 lg:pt-24">
        <p className="rotulo text-terracota-esc">
          Harmonize Corpo e Mente <span aria-hidden="true">·</span> {CONFIG.cidade}/{CONFIG.uf}
        </p>
        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1
            id="titulo-hero"
            className="text-[clamp(2.9rem,12.4vw,7.4rem)] lg:text-[clamp(4rem,8.4vw,7.4rem)] leading-[0.93] lg:col-span-8"
          >
            Corpo e mente, cuidados no mesmo <em className="text-terracota-esc">lugar</em>.
          </h1>
          <div className="max-w-[30rem] lg:col-span-4 lg:pb-3">
            <p className="text-[1.125rem] leading-relaxed text-apoio">
              Estética, psicanálise clínica e perícias, com atendimento individual e somente com hora marcada, no
              Centro de {CONFIG.cidade}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 lg:flex-col lg:items-start">
              {CONFIG.usarWhatsapp && (
                <a className="btn btn-tinta" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                  Agendar atendimento
                </a>
              )}
              {CONFIG.secoes.local && (
                <a className="btn btn-linha" href="#contato">
                  Conhecer o espaço
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative pb-6 pt-4">
        <Afinacao ref={linhasRef} modo="afinar" rotulos={false} />
        <div className="wrap mt-5 flex justify-between font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
          <span className="text-terracota-esc">Corpo</span>
          <span className="text-tinta">Mente</span>
        </div>
      </div>
    </section>
  );
}
