import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { resumoHorarios } from "../../lib/horarios";
import { Botao } from "../ui/Botao";
import { IconePino, IconeRelogio, IconeSeta, IconeWhatsApp } from "../ui/Icones";
import { Ondas } from "../ui/Ondas";
import { TextoRevelado } from "../ui/TextoRevelado";

const DENTE_GRANDE =
  "M95 40c-36 0-56 29-56 66 0 28 11 47 17 71 8 33 12 89 41 89 20 0 21-33 26-57 5-20 13-32 30-32s25 12 30 32c5 24 6 57 26 57 29 0 33-56 41-89 6-24 17-43 17-71 0-37-20-66-56-66-24 0-37 12-58 12S119 40 95 40Z";

function Composicao() {
  const { unidade } = useUnidade();
  const desenho = (atraso: number) => ({
    pathLength: 1,
    className: "desenhar",
    style: { animationDelay: `${atraso}s` },
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden="true">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="160" cy="160" r="150" stroke="var(--color-gold-400)" strokeOpacity=".35" strokeWidth=".8" />
        <circle cx="160" cy="160" r="122" stroke="var(--color-teal-400)" strokeOpacity=".18" strokeWidth=".8" strokeDasharray="2 6" />
        <g transform="translate(25 15) scale(0.86)">
          <path d={DENTE_GRANDE} stroke="var(--color-teal-300)" strokeWidth="2.2" strokeLinejoin="round" {...desenho(0.4)} />
          <path
            d="M70 104c34-22 74 10 128-14"
            stroke="var(--color-gold-400)"
            strokeWidth="2"
            strokeLinecap="round"
            {...desenho(1.6)}
          />
        </g>
        <path
          d="M18 214c40-22 80 16 140-6s100-34 146-6"
          stroke="var(--color-gold-400)"
          strokeOpacity=".7"
          strokeWidth="1"
          {...desenho(1.2)}
        />
      </svg>

      <div
        style={{ animationDelay: "1.1s" }}
        className="surgir absolute -left-2 bottom-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-800/80 p-3 pr-5 shadow-2xl backdrop-blur-sm sm:left-0"
      >
        <img src={unidade.logo} alt="" width={72} height={72} className="size-[72px] rounded-xl" />
        <div className="leading-tight">
          <p className="font-serif text-lg text-white">{CONFIG.marca}</p>
          <p className="rotulo mt-1 text-[0.62rem] text-teal-300">{unidade.nome}</p>
        </div>
      </div>

      {CONFIG.atendimentos.length > 0 && (
        <ul
          style={{ animationDelay: "1.35s" }}
          className="surgir absolute -right-2 top-8 space-y-1.5 rounded-2xl border border-white/10 bg-navy-800/80 px-5 py-4 text-sm text-white/85 shadow-2xl backdrop-blur-sm sm:right-0"
        >
          {CONFIG.atendimentos.map((a) => (
            <li key={a.id} className="flex items-center gap-2.5">
              <span className="size-1 rotate-45 bg-gold-400" />
              {a.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Hero() {
  const { unidade } = useUnidade();
  const horarios = resumoHorarios(unidade.horarios).filter((h) => !h.fechado);
  const surgir = (atraso: number) => ({ style: { animationDelay: `${atraso}s` } });

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className="escuro relative isolate overflow-hidden bg-navy-900 text-white"
    >
      {/* luz ambiente */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(96_160_165/0.22),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-60 top-1/3 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(11_59_87/0.9),transparent_65%)]"
      />

      {/* versão leve da ilustração para telas menores */}
      <svg aria-hidden="true" viewBox="0 0 320 320" fill="none" className="absolute -right-24 top-28 -z-10 size-[300px] opacity-25 sm:-right-10 sm:size-[380px] lg:hidden">
        <circle cx="160" cy="160" r="150" stroke="var(--color-gold-400)" strokeWidth="1" />
        <g transform="translate(25 15) scale(0.86)">
          <path d={DENTE_GRANDE} stroke="var(--color-teal-300)" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M70 104c34-22 74 10 128-14" stroke="var(--color-gold-400)" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>

      <div
        className={`container-site grid items-center gap-12 pb-40 sm:pb-48 lg:grid-cols-[1.15fr_1fr] lg:gap-8 ${
          CONFIG.rascunho ? "pt-40 sm:pt-44" : "pt-32 sm:pt-36"
        }`}
      >
        <div>
          {unidade.inauguracao && (
            <p className="mb-6 inline-flex rounded-full border border-gold-400/50 px-4 py-1.5 text-sm text-gold-300">
              {unidade.inauguracao}
            </p>
          )}
          <p {...surgir(0)} className="surgir rotulo flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] text-gold-300 sm:text-xs">
            <span aria-hidden="true" className="h-px w-8 bg-gold-400" />
            {CONFIG.marca} · {unidade.nomeCurto} · {unidade.endereco.cidade} - {unidade.endereco.uf}
          </p>

          <TextoRevelado
            className="mt-6 max-w-[14ch] text-[2.75rem] leading-[1.02] font-[350] sm:text-6xl lg:text-[4.6rem]"
            atraso={0.15}
            id="titulo-hero"
          >
            {"Planejamento e cuidado para o seu *sorriso*."}
          </TextoRevelado>

          <p {...surgir(0.7)} className="surgir mt-6 max-w-[34rem] text-lg leading-relaxed text-white/80 sm:text-xl">
            Avaliação individual, explicações claras e atendimento com hora marcada.
          </p>

          <div {...surgir(0.85)} className="surgir mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Botao
              href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)}
              externo
              variante="claro"
              icone={<IconeWhatsApp tamanho={19} className="text-teal-600" />}
              className="min-h-14 px-7"
            >
              Agendar minha avaliação
            </Botao>
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <Botao href="#atendimentos" variante="contornoClaro" iconeFim={<IconeSeta tamanho={18} />} className="min-h-14 px-7">
                Ver atendimentos
              </Botao>
            )}
          </div>

          <ul {...surgir(1)} className="surgir mt-10 flex flex-col gap-3 text-sm text-white/75 sm:flex-row sm:gap-8">
            {horarios.map((h) => (
              <li key={h.rotulo} className="flex items-center gap-2.5">
                <IconeRelogio tamanho={18} className="text-teal-300" />
                {h.rotulo} · {h.texto}
              </li>
            ))}
            <li className="flex items-center gap-2.5">
              <IconePino tamanho={18} className="text-teal-300" />
              {unidade.endereco.cidade} - {unidade.endereco.uf}
            </li>
          </ul>
        </div>

        <div className="hidden px-6 lg:block">
          <Composicao />
        </div>
      </div>

      <Ondas className="absolute inset-x-0 bottom-0 h-28 sm:h-36" />
    </section>
  );
}
