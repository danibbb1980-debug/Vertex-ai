import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { Botao } from "../components/Botao";
import { CorteVertical } from "../components/CorteVertical";
import { IconeEstacionamento, IconeRelogio } from "../components/Icones";
import { Confirmar } from "../components/Confirmar";
import { Foto } from "../components/Foto";

function ComposicaoHero() {
  // Composição gráfica original enquanto não há foto do instituto.
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="luz" cx="62%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fbf6ee" />
          <stop offset="0.55" stopColor="#ece0cc" />
          <stop offset="1" stopColor="#d9c6a4" />
        </radialGradient>
        <linearGradient id="sombra" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0.55" stopColor="#1d1915" stopOpacity="0" />
          <stop offset="1" stopColor="#1d1915" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#luz)" />
      {/* arcos concêntricos: proporção e calma */}
      <g fill="none" stroke="#7a5a2a" strokeOpacity="0.22" strokeWidth="0.8">
        <circle cx="200" cy="520" r="150" />
        <circle cx="200" cy="520" r="210" />
        <circle cx="200" cy="520" r="270" />
        <circle cx="200" cy="520" r="330" strokeOpacity="0.12" />
      </g>
      {/* horizonte e ponto em equilíbrio */}
      <line x1="70" y1="318" x2="330" y2="318" stroke="#7a5a2a" strokeOpacity="0.45" strokeWidth="0.8" />
      <path d="M40 360 C 120 300, 160 300, 200 318 S 290 340, 360 280" fill="none" stroke="#b08a4a" strokeWidth="1.1" />
      <circle cx="200" cy="309" r="8" fill="#1d1915" />
      <circle cx="200" cy="309" r="17" fill="none" stroke="#1d1915" strokeOpacity="0.25" />
      <rect width="400" height="500" fill="url(#sombra)" />
    </svg>
  );
}

export function Hero() {
  const horario = CONFIG.horarios.linhas;
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative z-10 pt-[calc(var(--topo)+40px)] pb-20 md:pt-[calc(var(--topo)+56px)] md:pb-28">
      <div className="contem grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="hero-entra rotulo flex flex-wrap items-center gap-x-4 gap-y-2 text-bronze" style={{ ["--atraso" as string]: 60 }}>
            <span aria-hidden="true" className="filete hidden w-10 sm:block" />
            Odontologia e harmonização orofacial
            {CONFIG.cidade.confirmado && CONFIG.cidade.valor ? <span className="text-cinza">· {CONFIG.cidade.valor}</span> : null}
          </p>

          <div id="titulo-hero">
            <CorteVertical
              texto="Cuidado que respeita a *harmonia* de cada pessoa."
              className="titulo-display mt-7 text-[clamp(2.9rem,7vw,6rem)] leading-[0.98]"
            />
          </div>

          <p
            className="hero-entra texto-corrido mt-8 max-w-[46ch] text-[1.08rem] leading-relaxed text-suave md:text-[1.15rem]"
            style={{ ["--atraso" as string]: 650 }}
          >
            Odontologia estética, atendimento infantil e harmonização orofacial, com avaliação individual e explicações claras.
          </p>

          <div className="hero-entra mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ["--atraso" as string]: 800 }}>
            <Botao href={linkWhatsApp()} externo icone="whatsapp" magnetico>
              Agendar minha avaliação
            </Botao>
            <Botao href="#atendimentos" variante="secundario" icone="seta">
              Conhecer os atendimentos
            </Botao>
          </div>

          <ul
            className="hero-entra mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-linha pt-6 text-[0.88rem] text-cinza"
            style={{ ["--atraso" as string]: 950 }}
          >
            <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <IconeRelogio tamanho={18} className="text-bronze" />
              Seg a sex {horario[0].curto} · Sáb {horario[1].curto}
              <Confirmar mostrar={!CONFIG.horarios.confirmado} />
            </li>
            {CONFIG.comodidades.estacionamento && (
              <li className="flex items-center gap-2.5">
                <IconeEstacionamento tamanho={18} className="text-bronze" />
                Estacionamento no local
              </li>
            )}
          </ul>
        </div>

        <figure className="hero-entra relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none" style={{ ["--atraso" as string]: 300 }}>
          <div className="relative">
            {/* moldura editorial em arco */}
            <div aria-hidden="true" className="absolute -inset-3 rounded-t-[999px] rounded-b-[28px] border border-ouro/45 md:-inset-4" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[22px] bg-areia">
              {CONFIG.fotos.hero ? (
                <Foto
                  foto={CONFIG.fotos.hero}
                  prioridade
                  sizes="(min-width: 1024px) 40vw, (min-width: 500px) 460px, 92vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <ComposicaoHero />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-marfim/85 px-3 py-1 text-[0.7rem] tracking-[0.06em] whitespace-nowrap text-suave backdrop-blur-sm">
                    Foto do instituto (substituir)
                  </span>
                </>
              )}
            </div>
            <span data-curva-inicio aria-hidden="true" className="absolute -bottom-3 left-1/2 h-px w-px md:-bottom-4" />
          </div>
          <figcaption className="mt-8 flex items-center justify-between gap-4 text-[0.78rem] text-cinza">
            <span className="rotulo text-bronze">Fig. 01</span>
            <span className="h-px flex-1 bg-linha" aria-hidden="true" />
            <span>{CONFIG.fotos.hero ? "Recepção do instituto" : "Equilíbrio em movimento"}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
