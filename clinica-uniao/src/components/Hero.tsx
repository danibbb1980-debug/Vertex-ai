import { Fragment } from 'react'
import { CONFIG } from '../config'
import { HERO } from '../content'
import { waLink } from '../lib/links'
import { IconeWhats } from './Icones'

/** Quebra o título em palavras para a revelação vertical. */
function PalavrasReveladas({ texto, inicio = 0 }: { texto: string; inicio?: number }) {
  return (
    <>
      {texto.split(' ').map((p, i) => (
        <Fragment key={i}>
          <span className="reveal-linha">
            <span className="reveal-palavra" style={{ ['--i' as string]: inicio + i }}>
              {p}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

/**
 * Anel das áreas: os dois arcos do logo formam um círculo e cada atendimento
 * vira um ponto ligado ao centro, "um só plano".
 */
function AnelAreas() {
  const areas = CONFIG.atendimentos
  const cx = 260
  const cy = 260
  const r = 225
  const n = areas.length
  const pontos = areas.map((a, i) => {
    const ang = ((-90 + (360 / n) * i) * Math.PI) / 180
    return { ...a, x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), i }
  })

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="arcoA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C9B094" />
            <stop offset="1" stopColor="#7C5D41" />
          </linearGradient>
          <linearGradient id="arcoB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9A7656" />
            <stop offset="1" stopColor="#D9C6AF" />
          </linearGradient>
          <radialGradient id="miolo" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#F4EDE3" />
            <stop offset="1" stopColor="#F4EDE3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={170} fill="url(#miolo)" />
        {pontos.map((p) => (
          <line
            key={`l-${p.id}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#BEA385"
            strokeWidth="1"
            strokeDasharray="2 5"
            className="fade-in"
            style={{ ['--d' as string]: `${900 + p.i * 90}ms` }}
          />
        ))}
        {/* os dois arcos, como no logo: um maior à direita, um menor à esquerda */}
        <path
          d={`M ${cx - 70} ${cy - 225} A 236 236 0 1 1 ${cx - 70} ${cy + 225}`}
          stroke="url(#arcoA)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          className="desenha"
          style={{ ['--d' as string]: '150ms' }}
        />
        <path
          d={`M ${cx + 6} ${cy - 208} A 208 208 0 0 0 ${cx + 6} ${cy + 208}`}
          stroke="url(#arcoB)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          className="desenha"
          style={{ ['--d' as string]: '450ms' }}
        />
        <g className="fade-in" style={{ ['--d' as string]: '700ms' }}>
          <circle cx={cx} cy={cy} r="70" fill="#FBF8F3" stroke="#BEA385" strokeWidth="1" />
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#7C5D41" fontFamily="Fraunces Variable, Georgia, serif" fontSize="25" fontStyle="italic">
            um só
          </text>
          <text x={cx} y={cy + 24} textAnchor="middle" fill="#3A2B1E" fontFamily="Fraunces Variable, Georgia, serif" fontSize="27">
            plano
          </text>
        </g>
      </svg>
      <ul aria-label="Áreas de atendimento reunidas em um só plano">
        {pontos.map((p) => (
          <li
            key={p.id}
            className="no-pill absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-choco-700/15 bg-ivory/95 py-1.5 pl-2 pr-3.5 text-[0.86rem] font-medium text-choco-800 shadow-soft"
            style={{ left: `${(p.x / 520) * 100}%`, top: `${(p.y / 520) * 100}%`, ['--d' as string]: `${800 + p.i * 90}ms` }}
          >
            <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 border-choco-700 bg-ivory" />
            {p.nome.replace(/ \(.+\)/, '')}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Hero() {
  const p1 = HERO.tituloAntes.split(' ').length
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative overflow-hidden pb-16 pt-[calc(var(--banner-h)+72px+40px)] sm:pb-20 lg:pb-28 lg:pt-[calc(var(--banner-h)+72px+72px)]">
      {/* arcos de fundo, discretos */}
      <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute -right-[26rem] -top-48 h-[760px] w-[760px] text-camel-400/25 lg:hidden" fill="none">
        <path d="M250 60a360 360 0 1 1 0 680" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <path d="M400 110a300 300 0 0 0 0 580" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="rotulo fade-in">{HERO.eyebrow}</p>
          <h1 id="titulo-hero" className="mt-6 text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.1rem] xl:text-[4.6rem]">
            <span>
              <PalavrasReveladas texto={HERO.tituloAntes} />
              <span className="reveal-linha">
                <em className="reveal-palavra" style={{ ['--i' as string]: p1 }}>
                  {HERO.enfase}
                </em>
              </span>{' '}
              <PalavrasReveladas texto={HERO.tituloDepois} inicio={p1 + 1} />
            </span>
          </h1>
          <p className="fade-in mt-6 max-w-[34rem] text-lg text-choco-700 sm:text-xl" style={{ ['--d' as string]: '500ms' }}>
            {HERO.subtitulo}
          </p>
          <div className="fade-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: '650ms' }}>
            {CONFIG.whatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario btn-brilho">
                <IconeWhats />
                Agendar minha avaliação
              </a>
            )}
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="btn btn-contorno">
                Ver atendimentos
              </a>
            )}
          </div>
          <p className="fade-in mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] text-choco-700" style={{ ['--d' as string]: '800ms' }}>
            <span>{CONFIG.endereco.logradouro}, {CONFIG.endereco.bairro}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-camel-500" />
            <span>Atendimento com hora marcada</span>
          </p>
        </div>

        {CONFIG.atendimentos.length > 0 && (
          <div className="hidden px-10 lg:col-span-6 lg:block xl:px-14">
            <AnelAreas />
          </div>
        )}
      </div>
    </section>
  )
}
