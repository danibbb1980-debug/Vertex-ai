import { ArrowDown, CalendarClock, MapPin, MessagesSquare } from "lucide-react";
import { CONFIG } from "../config";
import type { CSSProperties } from "react";
import { Magnetic } from "../components/Magnetic";
import { GLYPH_PATH, WhatsAppIcon } from "../components/icons";
import { waLink } from "../lib/whatsapp";

export function Hero() {
  const p = CONFIG.profissional;
  // Entrada em CSS puro: aparece já no HTML pré-renderizado, antes do JavaScript
  const fade = (delay: number) => ({ className: "hero-in", style: { animationDelay: `${delay}s` } as CSSProperties });
  const palavras = "Cuidado individual, explicado com *clareza*.".split(" ");

  return (
    <section id="topo" className="on-dark relative isolate overflow-hidden bg-navy-900 text-pearl">
      {/* Fundo: grade fina e um brilho rosê muito discreto */}
      <div aria-hidden="true" className="grid-fine absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_70%)]" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(228,141,157,0.16), transparent 62%)" }}
      />

      <div className="container-site relative grid min-h-[calc(100svh-var(--banner-h))] grid-cols-1 items-center gap-10 pb-20 pt-[calc(var(--header-h)+48px)] md:grid-cols-[1.25fr_0.75fr] md:pb-28">
        <div className="relative z-[2] max-w-[40rem]">
          <p {...fade(0.05)} className="hero-in eyebrow mb-7 text-rose-300">
            Estética facial e corporal · {CONFIG.cidade} - {CONFIG.uf}
          </p>

          {p.registro && p.titulo && (
            <p
              {...fade(0.1)}
              className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-rose-300/30 px-4 py-1.5 font-label text-xs tracking-[0.14em] text-pearl/90"
            >
              {p.titulo} {p.nome} · {p.registro}
            </p>
          )}

          <h1 className="title text-[3.1rem] sm:text-[4.2rem] lg:text-[5.4rem]">
            {palavras.map((w, i) => {
              const em = w.startsWith("*");
              const t = w.replace(/\*/g, "");
              const [word, punct] = em ? [t.replace(/[.,]$/, ""), t.match(/[.,]$/)?.[0] ?? ""] : [t, ""];
              return (
                <span key={i}>
                  <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                    <span className="hero-word inline-block" style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
                      {em ? <em>{word}</em> : word}
                      {punct}
                    </span>
                  </span>
                  {i < palavras.length - 1 ? " " : ""}
                </span>
              );
            })}
          </h1>

          <p {...fade(0.6)} className="hero-in mt-7 max-w-[32rem] text-[1.08rem] leading-relaxed text-mist">
            Avaliação individual, tecnologias explicadas com transparência e atendimento com hora marcada.
          </p>

          <div {...fade(0.75)} className="hero-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
                <WhatsAppIcon />
                Agendar minha avaliação
              </a>
            </Magnetic>
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="btn btn-ghost">
                Ver atendimentos
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            )}
          </div>

          <ul {...fade(0.9)} className="hero-in mt-14 grid gap-4 border-t border-rose-300/15 pt-7 text-sm text-mist sm:grid-cols-3">
            <li className="flex items-center gap-3">
              <MessagesSquare size={18} className="shrink-0 text-rose-300" aria-hidden="true" strokeWidth={1.4} />
              Avaliação individual
            </li>
            <li className="flex items-center gap-3">
              <CalendarClock size={18} className="shrink-0 text-rose-300" aria-hidden="true" strokeWidth={1.4} />
              Hora marcada
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="shrink-0 text-rose-300" aria-hidden="true" strokeWidth={1.4} />
              {CONFIG.endereco.rua}
            </li>
          </ul>
        </div>

        {/* O traço que acolhe: o contorno do glifo, desenhado em linha */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[4%] top-[calc(var(--header-h)+118px)] w-[30%] max-w-[9rem] opacity-80 md:relative md:right-auto md:top-auto md:w-full md:max-w-[26rem] md:justify-self-center md:opacity-100"
        >
          <svg data-line-start viewBox="0 0 110 170" className="block aspect-[110/170] w-full overflow-visible">
            <defs>
              <linearGradient id="glyph-grad" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0" stopColor="#F4CDD0" />
                <stop offset="0.55" stopColor="#EFB1B6" />
                <stop offset="1" stopColor="#E48D9D" />
              </linearGradient>
            </defs>
            <path
              d={GLYPH_PATH}
              pathLength={1}
              className="glyph-draw"
              fill="none"
              stroke="url(#glyph-grad)"
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
