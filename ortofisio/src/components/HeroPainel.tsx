import { useState, type FormEvent, type ReactNode } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { CONFIG, waLink } from '../config'
import { IconeWhatsApp } from './icones'

// Hero em painel arredondado (referência enviada pelo cliente), traduzido para a marca:
// sem foto de banco, a figura é uma ilustração original de traço contínuo na mesma pose,
// com o ponto e a órbita do símbolo do logo. Ela se desenha uma única vez (≈2,5 s).

// Recorte do desenho (viewBox)
const VB_X = 20
const VB_Y = 24
const VB_W = 680
const VB_H = 540

// Traços da figura (afundo lateral com um braço alto)
const tracos = [
  // traço contínuo: pé de trás → quadril → tronco → mão no alto
  'M 60 540 C 150 515 250 458 332 404 C 362 362 398 326 428 292 C 438 222 416 140 392 62',
  // perna da frente
  'M 332 404 C 380 390 436 392 472 408 C 482 452 476 500 468 540 L 514 545',
]

// Anotações: ponto na figura → fio → rótulo
const notas = [
  { x: 392, y: 62, lx: 452, ly: 40, texto: 'Avaliação individual antes de começar' },
  { x: 332, y: 404, lx: 70, ly: 318, texto: 'Fisioterapia e pilates', esquerda: true },
  { x: 472, y: 408, lx: 540, ly: 432, texto: `No Centro de ${CONFIG.cidade}` },
]

const ease = [0.45, 0.05, 0.25, 1] as const

function Figura() {
  const reduzir = useReducedMotion()
  const inicio = reduzir ? false : { pathLength: 0, opacity: 0 }
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true" focusable="false">
          {/* Órbita do símbolo do logo */}
          <m.ellipse
            cx="330"
            cy="330"
            rx="300"
            ry="112"
            transform="rotate(-16 330 330)"
            stroke="var(--color-teal-claro)"
            strokeOpacity="0.4"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            initial={inicio}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { delay: 0.3, duration: 2.5, ease }, opacity: { delay: 0.3, duration: 0.01 } }}
          />
          {tracos.map((d, i) => (
            <m.path
              key={d}
              d={d}
              stroke="#f3f1ea"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={inicio}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { delay: i ? 1.6 : 0.4, duration: i ? 1.2 : 2.5, ease },
                opacity: { delay: i ? 1.6 : 0.4, duration: 0.01 },
              }}
            />
          ))}
          {/* Tapete */}
          <m.path
            d="M 30 550 L 650 550"
            stroke="var(--color-teal-claro)"
            strokeOpacity="0.55"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            initial={inicio}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { delay: 0.2, duration: 1.2, ease }, opacity: { delay: 0.2, duration: 0.01 } }}
          />
          {/* Cabeça: o ponto do logo */}
          <m.circle
            cx="456"
            cy="262"
            r="16"
            fill="var(--color-teal-claro)"
            initial={reduzir ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ transformOrigin: '456px 262px' }}
            transition={{ delay: 2.4, duration: 0.5, ease: [0.22, 0.61, 0.24, 1] }}
          />
          {/* Fios e pontos das anotações */}
          <m.g
            className="hidden md:block"
            initial={reduzir ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.6 }}
          >
            {notas.map((n) => (
              <g key={n.texto}>
                <path
                  d={`M ${n.x} ${n.y} L ${n.esquerda ? n.lx + 196 : n.lx - 8} ${n.ly + 10}`}
                  stroke="#f3f1ea"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={n.x} cy={n.y} r="11" stroke="#f3f1ea" strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <circle cx={n.x} cy={n.y} r="4.5" fill="#f3f1ea" />
              </g>
            ))}
          </m.g>
        </svg>

        {/* Rótulos em HTML para texto nítido */}
        <m.ul
          className="hidden md:block"
          initial={reduzir ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9, duration: 0.6 }}
        >
          {notas.map((n) => (
            <li
              key={n.texto}
              className={`absolute max-w-[11rem] text-[0.9rem] font-medium leading-snug text-linho ${n.esquerda ? 'text-right' : ''}`}
              style={{
                left: `${((n.lx - VB_X) / VB_W) * 100}%`,
                top: `${((n.ly - VB_Y) / VB_H) * 100}%`,
                width: n.esquerda ? `${(190 / VB_W) * 100}%` : undefined,
              }}
            >
              {n.texto}
            </li>
          ))}
        </m.ul>
      </div>
    </LazyMotion>
  )
}

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-linho/30 bg-linho/10 text-linho md:h-12 md:w-12">
    {children}
  </span>
)

export function HeroPainel() {
  const [nome, setNome] = useState('')
  const hora = (h: string) => h.replace(':00', 'h').replace(/^0/, '')

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const n = nome.trim()
    const msg = n ? `${CONFIG.mensagens.geral} Meu nome é ${n}.` : CONFIG.mensagens.geral
    const janela = window.open(waLink(msg), '_blank')
    if (janela) janela.opener = null
    else window.location.href = waLink(msg)
  }

  return (
    <section id="topo" aria-labelledby="titulo-hero" className={`px-3 pb-6 md:px-5 ${CONFIG.rascunho ? 'pt-[6.75rem] md:pt-[7.5rem]' : 'pt-[4.75rem] md:pt-[5.5rem]'}`}>
      <div className="painel-hero bg-escuro relative isolate overflow-hidden rounded-[2rem] text-linho md:rounded-[2.75rem]">
        {/* Piso com textura fina, como um tapete */}
        <div aria-hidden="true" className="piso-hero absolute inset-x-0 bottom-0 -z-10 hidden h-[22%] md:block" />

        <div className="mx-auto grid max-w-[86rem] gap-6 px-6 pb-8 pt-12 md:grid-cols-12 md:gap-x-6 md:px-12 md:pb-12 md:pt-20 lg:gap-x-8">
          <div className="relative z-10 md:col-span-7 lg:col-span-6">
            <p className="rotulo !text-linho/75">
              Fisioterapia e pilates <span aria-hidden="true">·</span>{' '}
              <span className="whitespace-nowrap">
                {CONFIG.cidade} - {CONFIG.uf}
              </span>
            </p>
            <h1 id="titulo-hero" className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] font-normal leading-[0.98] tracking-[-0.035em] !text-linho">
              <span className="linha-mascara">
                <span>Cuidado</span>
              </span>
              <span className="linha-mascara">
                <span className="enfase" style={{ animationDelay: '0.08s' }}>
                  individualizado
                </span>
              </span>
              <span className="linha-mascara">
                <span style={{ animationDelay: '0.16s' }}>para o seu</span>
              </span>
              <span className="linha-mascara">
                <span className="flex flex-wrap items-center gap-x-4 gap-y-3" style={{ animationDelay: '0.24s' }}>
                  movimento.
                  <span className="inline-flex gap-1.5 align-middle" aria-hidden="true">
                    <Chip>
                      {/* movimento */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <circle cx="15.5" cy="5" r="1.8" fill="currentColor" />
                        <path d="M4 19c3-.6 6-2.6 8-5.6 1.6-2.4 3-4.6 5.5-5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Chip>
                    <Chip>
                      {/* local */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </Chip>
                    <Chip>
                      {/* agenda */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                        <rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Chip>
                  </span>
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-[36ch] text-lg leading-relaxed text-linho/90 md:text-xl">
              Fisioterapia e pilates em {CONFIG.cidade}, com atendimento pensado para cada pessoa.
            </p>

            {CONFIG.whatsapp && (
              <form onSubmit={enviar} className="mt-9 max-w-[32rem]">
                <div className="flex flex-col gap-2 rounded-[1.75rem] border border-linho/25 bg-linho/10 p-2 sm:flex-row sm:items-center sm:rounded-full">
                  <label htmlFor="hero-nome" className="sr-only">
                    Seu nome (opcional)
                  </label>
                  <input
                    id="hero-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="given-name"
                    placeholder="Seu nome (opcional)"
                    className="campo-hero min-h-12 flex-1 rounded-full bg-transparent px-4 text-base text-linho placeholder:text-linho/65"
                  />
                  <button type="submit" className="btn btn-claro !min-h-12 shrink-0">
                    <IconeWhatsApp />
                    Agendar pelo WhatsApp
                  </button>
                </div>
              </form>
            )}
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="link-fino mt-5 inline-flex min-h-12 items-center font-semibold text-linho">
                Conhecer os atendimentos
              </a>
            )}
          </div>

          <div className="relative md:col-span-5 lg:col-span-6 md:self-end">
            <div className="mx-auto w-full max-w-[30rem] md:-ml-[12%] md:w-[112%] md:max-w-none lg:-ml-[6%] lg:w-[110%]">
              <Figura />
            </div>
          </div>

          {/* Base do painel: dados reais no lugar de prova social */}
          <dl className="relative z-10 grid gap-y-4 border-t border-linho/20 pt-6 text-[0.95rem] sm:grid-cols-2 md:col-span-12 md:grid-cols-3 md:gap-x-8">
            <div>
              <dt className="rotulo !text-linho/70">Endereço</dt>
              <dd className="mt-1">
                {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
              </dd>
            </div>
            {CONFIG.horarios.length > 0 && (
              <div>
                <dt className="rotulo !text-linho/70">Horários</dt>
                <dd className="tabular mt-1">
                  {CONFIG.horarios
                    .map((h) => `${h.rotulo.replace('Segunda a quinta', 'Seg. a qui.').replace('Sexta', 'Sex.')} ${hora(h.abre)} às ${hora(h.fecha)}`)
                    .join('  /  ')}
                </dd>
              </div>
            )}
            {CONFIG.telefoneExibicao && (
              <div>
                <dt className="rotulo !text-linho/70">Telefone</dt>
                <dd className="tabular mt-1">
                  <a href={`tel:${CONFIG.telefone}`} className="link-fino">
                    {CONFIG.telefoneExibicao}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  )
}
