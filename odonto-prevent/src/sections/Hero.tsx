import { m, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { linkWhatsapp } from '../lib/whatsapp'
import { textoHorario } from '../lib/horarios'
import { Botao } from '../components/Botao'
import { TextoRevelado } from '../components/TextoRevelado'
import { IconeSeta, IconeWhatsapp } from '../components/Icones'

/** Ilustração original de traço: arcos de acompanhamento, escudo e dente. */
function Ilustracao() {
  const reduzir = useReducedMotion()
  const desenho = (atraso: number) =>
    reduzir
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const, delay: atraso },
        }
  return (
    <svg viewBox="0 0 520 520" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="arco" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#75CEBE" />
          <stop offset="1" stopColor="#75CEBE" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {[240, 196, 152].map((r, i) => (
        <circle key={r} cx="260" cy="260" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray={i === 1 ? '2 7' : undefined} />
      ))}
      <m.path d="M260 20 A240 240 0 0 1 500 260" fill="none" stroke="url(#arco)" strokeWidth="2" strokeLinecap="round" {...desenho(0.5)} />
      <m.path d="M72 300 A196 196 0 0 0 300 452" fill="none" stroke="#75CEBE" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" {...desenho(0.8)} />
      {/* escudo */}
      <m.path
        d="M260 150 196 176v58c0 46 27 85 64 102 37-17 64-56 64-102v-58L260 150Z"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        {...desenho(0.3)}
      />
      {/* dente */}
      <m.path
        d="M238 198c-15 0-24 11-24 26 0 14 6 22 9 36 3 14 5 30 13 30 9 0 8-22 16-31a10 10 0 0 1 16 0c8 9 7 31 16 31 8 0 10-16 13-30 3-14 9-22 9-36 0-15-9-26-24-26-10 0-13 5-22 5s-12-5-22-5Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
        {...desenho(0.1)}
      />
      <m.path d="M206 252c30 18 72 18 112-10" fill="none" stroke="#75CEBE" strokeWidth="2.2" strokeLinecap="round" {...desenho(1)} />
      {/* marcos do ciclo */}
      {[
        [260, 20],
        [500, 260],
        [72, 300],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#232427" stroke="#75CEBE" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="3" fill="#75CEBE" />
        </g>
      ))}
    </svg>
  )
}

const fade = (atraso: number) => ({ className: 'entrada', style: { animationDelay: `${atraso}s` } })

export function Hero() {

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className={`relative isolate overflow-hidden bg-grafite-900 text-white ${CONFIG.rascunho ? 'pt-[6.5rem]' : 'pt-[4.5rem]'}`}
    >
      <div aria-hidden="true" className="grade-calendario absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full bg-menta/[0.07] blur-3xl" />
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute -right-44 top-24 -z-10 w-[26rem] sm:hidden">
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.07)" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 7" />
        <path d="M200 10 A190 190 0 0 1 390 200" fill="none" stroke="#75CEBE" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="200" cy="10" r="6" fill="#232427" stroke="#75CEBE" strokeWidth="1.5" />
      </svg>

      <div className="container-site grid min-h-[calc(100svh-6.5rem)] items-center gap-10 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20">
        <div>
          <p {...fade(0)} className="entrada rotulo flex items-center gap-3 text-menta max-sm:tracking-[0.14em]">
            <span aria-hidden="true" className="hidden h-px w-8 bg-menta/70 sm:inline-block" />
            <span>
              Odontologia · <span className="whitespace-nowrap">{CONFIG.cidade} - {CONFIG.uf}</span>
            </span>
          </p>
          <h1 id="titulo-hero" className="mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            <TextoRevelado texto="Cuidar hoje ajuda a *prevenir* amanhã." aoVer={false} atraso={0.1} passo={0.07} />
          </h1>
          <p {...fade(0.4)} className="entrada mt-7 max-w-xl text-lg leading-relaxed text-grafite-200 sm:text-xl">
            Avaliação individual, informação clara e acompanhamento com hora marcada.
          </p>
          <div {...fade(0.55)} className="entrada mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Botao href={linkWhatsapp()} externo variante="menta" icone={<IconeWhatsapp tamanho={20} />}>
              Agendar minha avaliação
            </Botao>
            <Botao href="#prevencao" variante="contorno-claro" icone={<IconeSeta tamanho={18} />}>
              Conhecer a prevenção
            </Botao>
          </div>

          <dl {...fade(0.7)} className="entrada mt-12 grid max-w-xl grid-cols-2 gap-5 border-t border-white/10 pt-7 text-sm">
            {CONFIG.horarios.map((h) => (
              <div key={h.rotulo}>
                <dt className="rotulo text-[0.66rem] text-grafite-300">{h.rotulo}</dt>
                <dd className="mt-1 font-display text-lg text-white">{textoHorario(h)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[32rem] sm:block">
          <Ilustracao />
          <p
            {...fade(1.2)}
            className="entrada absolute left-[54%] top-[1%] rounded-full border border-white/12 bg-grafite-800/90 px-4 py-2 text-xs text-grafite-200 backdrop-blur"
          >
            <span className="text-menta">Avaliação</span> individual
          </p>
          <p
            {...fade(1.35)}
            className="entrada absolute right-[-2%] top-[56%] rounded-full border border-white/12 bg-grafite-800/90 px-4 py-2 text-xs text-grafite-200 backdrop-blur"
          >
            <span className="text-menta">Hora</span> marcada
          </p>
          <p
            {...fade(1.5)}
            className="entrada absolute bottom-[26%] left-[-4%] rounded-full border border-white/12 bg-grafite-800/90 px-4 py-2 text-xs text-grafite-200 backdrop-blur"
          >
            <span className="text-menta">Retorno</span> conforme orientação
          </p>
        </div>
      </div>
    </section>
  )
}
