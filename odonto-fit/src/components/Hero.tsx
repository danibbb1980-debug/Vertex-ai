import { m, useReducedMotion } from 'motion/react'
import { Clock, MapPin } from 'lucide-react'
import { CONFIG } from '../config'
import { horariosAgrupados } from '../lib/horarios'
import { BotaoWhatsApp, Swoosh } from './ui'

const EASE = [0.22, 1, 0.36, 1] as const

/** Revelação palavra por palavra (adaptado de "Text Reveal"): cada palavra sobe de dentro de uma máscara. */
function Palavras({ texto, inicio = 0, reduce }: { texto: string; inicio?: number; reduce: boolean | null }) {
  return (
    <>
      {texto.split(' ').map((p, i, arr) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <m.span
              className="anim inline-block"
              initial={reduce ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: inicio + i * 0.06, ease: EASE }}
            >
              {p}
            </m.span>
          </span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

/** Ilustração original: um dente medido como peça sob medida (régua, cotas e a curva do logo). */
function Ilustracao() {
  const reduce = useReducedMotion()
  const draw = (delay: number, duration = 1.1) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.01, delay } },
        }
  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay } }

  const ticks = Array.from({ length: 27 }, (_, i) => i)
  return (
    <svg viewBox="0 0 480 420" className="h-auto w-full" role="img" aria-label="Ilustração de um dente com linhas de medida, representando o planejamento sob medida">
      <defs>
        <pattern id="grade" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="var(--color-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="480" height="420" rx="28" fill="url(#grade)" opacity=".7" />

      {/* Régua inferior */}
      <m.g className="anim" {...fade(0.2)}>
        <path d="M60 372H420" stroke="var(--color-navy)" strokeWidth="1.5" opacity=".5" />
        {ticks.map((i) => (
          <path
            key={i}
            d={`M${70 + i * 13} 372V${i % 5 === 0 ? 356 : 364}`}
            stroke="var(--color-navy)"
            strokeWidth="1.2"
            opacity={i % 5 === 0 ? 0.55 : 0.3}
          />
        ))}
      </m.g>

      {/* Dente */}
      <m.path className="anim-draw"
        d="M160 128C160 86 196 74 226 88C240 95 252 95 266 88C298 72 332 86 332 128C332 166 322 196 312 232C304 262 300 304 284 304C268 304 266 266 256 240C251 228 241 228 236 240C226 266 224 304 208 304C192 304 188 262 180 232C170 196 160 166 160 128Z"
        fill="white"
        stroke="var(--color-navy)"
        strokeWidth="3"
        strokeLinejoin="round"
        {...draw(0.35, 1.6)}
      />

      {/* Cota horizontal */}
      <m.path className="anim-draw" d="M160 52V70M332 52V70M160 61H332" stroke="var(--color-aqua-ink)" strokeWidth="1.6" strokeLinecap="round" {...draw(1.4, 0.7)} />
      <m.g className="anim" {...fade(1.9)}>
        <rect x="200" y="34" width="92" height="22" rx="11" fill="var(--color-ice)" />
        <text x="246" y="49.5" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" letterSpacing="1.6" fill="var(--color-aqua-ink)">
          SOB MEDIDA
        </text>
      </m.g>

      {/* Cota vertical */}
      <m.path className="anim-draw" d="M362 88H378M362 304H378M370 88V304" stroke="var(--color-aqua-ink)" strokeWidth="1.6" strokeLinecap="round" {...draw(1.6, 0.7)} />

      {/* Ponto de encaixe */}
      <m.circle className="anim" cx="246" cy="160" r="5" fill="var(--color-peach)" {...fade(2.1)} />
      <m.path className="anim-draw" d="M246 160L292 196" stroke="var(--color-navy)" strokeWidth="1" strokeDasharray="3 4" opacity=".5" {...draw(2.1, 0.5)} />
      <m.g className="anim" {...fade(2.3)}>
        <rect x="290" y="186" width="118" height="44" rx="14" fill="white" stroke="var(--color-line)" />
        <text x="304" y="204" fontFamily="var(--font-sans)" fontSize="10" fontWeight="600" letterSpacing="1.4" fill="var(--color-muted)">
          PLANO
        </text>
        <text x="304" y="221" fontFamily="var(--font-display)" fontSize="14" fontWeight="600" fill="var(--color-navy)">
          individual
        </text>
      </m.g>

      {/* A curva do logo */}
      <m.path className="anim-draw" d="M84 336C170 352 300 350 404 312" fill="none" stroke="var(--color-aqua)" strokeWidth="6" strokeLinecap="round" {...draw(1.1, 1.2)} />
    </svg>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const semana = horariosAgrupados().find((h) => h.aberto)
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className={`relative overflow-hidden ${CONFIG.rascunho ? 'pt-[6.5rem]' : 'pt-[4.5rem]'}`}>
      {/* Fundo: formas arredondadas suaves */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-mist" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-sand/50 blur-2xl" />

      <div className="wrap relative grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-24 lg:pt-16">
        <div>
          <m.p
            className="anim eyebrow"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Odontologia · {CONFIG.cidade} - {CONFIG.uf}
          </m.p>
          <h1 id="titulo-hero" className="mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.35rem]">
            <Palavras texto="Um plano de cuidado feito" reduce={reduce} />{' '}
            <span className="relative inline-block whitespace-nowrap text-aqua-ink">
              <Palavras texto="sob medida" inicio={0.3} reduce={reduce} />
              <Swoosh delay={0.75} className="!w-[96%]" />
            </span>{' '}
            <Palavras texto="para você." inicio={0.42} reduce={reduce} />
          </h1>
          <m.p
            className="anim mt-7 max-w-[33rem] text-lg sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          >
            Avaliação individual, explicações claras e atendimento com hora marcada.
          </m.p>
          <m.div
            className="anim mt-9 flex flex-col gap-3 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          >
            <BotaoWhatsApp className="btn-primary">Agendar minha avaliação</BotaoWhatsApp>
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="btn btn-ghost">
                Ver atendimentos
              </a>
            )}
          </m.div>

          <m.ul
            className="anim mt-10 flex flex-col gap-3 text-[0.95rem] text-muted sm:flex-row sm:flex-wrap sm:gap-x-7"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {semana && (
              <li className="flex items-center gap-2">
                <Clock size={18} className="text-aqua-ink" aria-hidden="true" />
                {semana.dias}, {semana.texto}
              </li>
            )}
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-aqua-ink" aria-hidden="true" />
              {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}
            </li>
          </m.ul>
        </div>

        <div className="relative mx-auto w-full max-w-[32rem]">
          <div className="card overflow-hidden p-3 sm:p-5">
            <Ilustracao />
          </div>
        </div>
      </div>
    </section>
  )
}
