import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { CONFIG, atendimentosVisiveis, waLink } from "../config";
import { LOGO } from "../brand/logo-paths";
import { Icone, IconeAtendimento } from "./ui";

const hora = (h: string) => h.replace(":00", "h").replace(/^0/, "");

/* Revelação palavra por palavra (adaptado do padrão "Text Reveal" do 21st.dev):
   cada palavra sobe de dentro de uma máscara. Feito em CSS para animar já no
   HTML pré-renderizado, antes do JavaScript, sem atrasar o LCP. */
function TituloRevelado({ partes }: { partes: { t: string; enfase?: boolean }[] }) {
  let i = 0;
  return (
    <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem] lg:leading-[0.98]">
      {partes.map((p, pi) =>
        p.t.split(" ").map((palavra, wi) => {
          const n = i++;
          return (
            <span key={`${pi}-${wi}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span
                className={`palavra inline-block ${p.enfase ? "font-serif italic text-mel-texto" : ""}`}
                style={{ animationDelay: `${80 + n * 55}ms` }}
              >
                {palavra}
              </span>
              {"\u00A0"}
            </span>
          );
        }),
      )}
    </h1>
  );
}

function ArteHero() {
  const reduzir = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* Anéis concêntricos derivados do símbolo */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full overflow-visible" fill="none" strokeLinecap="round">
        <circle cx="24" cy="24" r="23.4" stroke="#0F3A40" strokeOpacity=".07" strokeWidth=".25" />
        <circle cx="24" cy="24" r="16" stroke="#0F3A40" strokeOpacity=".07" strokeWidth=".25" />
        <m.path
          d={LOGO.anel}
          stroke="#C98A3B"
          strokeWidth=".9"
          initial={{ pathLength: reduzir ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        />
      </svg>
      {/* Ilustração de traço: arcada com dentes simplificados */}
      <svg viewBox="0 0 200 200" className="absolute inset-[17%] size-[66%]" fill="none" stroke="#0F3A40" strokeLinecap="round" strokeLinejoin="round">
        
        {[-84, -63, -42, -21, 0, 21, 42, 63, 84].map((ang, k) => {
          const r = (ang * Math.PI) / 180;
          const x = 100 + Math.sin(r) * 64;
          const y = 128 - Math.cos(r) * 60;
          const esc = 0.78 + Math.abs(ang) / 300;
          return (
            <g key={k} transform={`translate(${x} ${y}) rotate(${ang}) scale(${esc}) translate(-16 -16)`}>
              <path d="M9 6c2.5-1.6 4.6-1.2 7 0 2.4-1.2 4.5-1.6 7 0 2.6 1.7 2.8 5.3 1.8 8.6-.8 2.6-1.4 4.8-1.8 8.2-.3 2.6-1 4.2-2.3 4.2-1.6 0-1.9-2.4-2.3-5-.3-2-.9-3.5-2.4-3.5s-2.1 1.5-2.4 3.5c-.4 2.6-.7 5-2.3 5-1.3 0-2-1.6-2.3-4.2-.4-3.4-1-5.6-1.8-8.2C6.2 11.3 6.4 7.7 9 6z" fill="#FAF7F1" strokeWidth={1.25 / esc} strokeOpacity={k === 4 ? 1 : 0.7} />
            </g>
          );
        })}
      </svg>
      {/* Cartões de informação real */}
      <div className="absolute top-[8%] -left-2 rounded-2xl border border-petroleo-900/10 bg-papel/90 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(15,58,64,0.6)] backdrop-blur sm:left-0">
        <p className="rotulo !text-[0.65rem] text-salvia-escura">Hora marcada</p>
        <p className="mt-1 font-serif text-lg text-petroleo-900">
          Seg a sex · {hora(CONFIG.horarios[0].abre)} às {hora(CONFIG.horarios[0].fecha)}
        </p>
      </div>
      {CONFIG.horarios[1] && (
        <div className="absolute right-0 bottom-[14%] rounded-2xl bg-petroleo-900 px-4 py-3 text-linho shadow-[0_18px_40px_-24px_rgba(15,58,64,0.9)]">
          <p className="rotulo !text-[0.65rem] text-mel-claro">Também aos sábados</p>
          <p className="mt-1 font-serif text-lg">
            {hora(CONFIG.horarios[1].abre)} às {hora(CONFIG.horarios[1].fecha)}
          </p>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-36" : "pt-28"} pb-16 md:pb-24`}>
      {/* textura de fundo: arco amplo e grade editorial fina */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-linho)_0%,var(--color-papel)_100%)]" />
      <svg className="pointer-events-none absolute -top-40 -right-56 -z-10 h-[900px] w-[900px] text-petroleo-900/[0.05]" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth=".2" />
      </svg>

      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <p className="rotulo mb-6 flex items-center gap-3 text-mel-texto">
            <span className="hidden h-px w-8 bg-mel sm:block" aria-hidden="true" />
            <span>
              Odontologia · <span className="whitespace-nowrap">{CONFIG.endereco.cidade} - {CONFIG.endereco.uf}</span>
            </span>
          </p>
          <div id="titulo-hero">
            <TituloRevelado
              partes={[{ t: "Seu atendimento começa por uma" }, { t: "avaliação", enfase: true }, { t: "de verdade." }]}
            />
          </div>
          <div className="surgir" style={{ animationDelay: "520ms" }}>
            <p className="mt-7 max-w-xl text-lg text-tinta-suave sm:text-xl">
              Planejamento individual, explicações claras e atendimento com hora marcada, no centro de {CONFIG.endereco.cidade}.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario group">
                <Icone nome="whatsapp" className="size-5" />
                Agendar minha avaliação
              </a>
              {CONFIG.secoes.atendimentos && (
                <a href="#atendimentos" className="btn btn-contorno group">
                  Ver atendimentos
                  <Icone nome="seta" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              )}
            </div>
            <p className="mt-8 flex items-start gap-2 text-[0.95rem] text-tinta-suave">
              <Icone nome="pin" className="mt-0.5 size-4 shrink-0 text-mel" />
              {CONFIG.endereco.rua} · {CONFIG.endereco.bairro}
            </p>
          </div>
        </div>
        <ArteHero />
      </div>
    </section>
  );
}

/* Marquee discreto com os atendimentos (padrão "Infinite Text Marquee" do
   21st.dev, refeito em CSS puro). Pausa fora da viewport e no hover. */
export function FaixaAtendimentos() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.setAttribute("data-pausado", String(!e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const itens = atendimentosVisiveis();
  if (!itens.length) return null;
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((a) => (
        <li key={a.id} className="flex items-center gap-5 px-6 font-serif text-xl whitespace-nowrap text-linho/90 sm:text-2xl">
          <IconeAtendimento tipo={a.icone} className="size-7 text-linho/60" />
          {a.nome}
          <span className="ml-6 size-1.5 rounded-full bg-mel-claro" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div ref={ref} className="marquee relative overflow-hidden bg-petroleo-900 py-6" data-pausado="true">
      <p className="sr-only">Atendimentos: {itens.map((a) => a.nome).join(", ")}.</p>
      <div className="marquee-trilho flex w-max" aria-hidden="true">
        {grupo(false)}
        {grupo(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-petroleo-900 sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-petroleo-900 sm:w-28" />
    </div>
  );
}
