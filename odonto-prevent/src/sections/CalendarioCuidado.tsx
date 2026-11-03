import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { CabecalhoSecao } from '../components/CabecalhoSecao'

const ETAPAS = [
  {
    titulo: 'Avaliação inicial',
    texto: 'O ponto de partida. Uma conversa sobre sua história e um retrato atual da sua saúde bucal.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Orientações explicadas com clareza e um plano conversado com você, no seu ritmo.',
  },
  {
    titulo: 'Retorno periódico',
    texto: 'Novas consultas conforme a orientação do dentista, para observar como tudo evolui. E o ciclo recomeça.',
  },
]

const R = 168
const CX = 200
const ANGULOS = [0, 120, 240]

function ponto(angulo: number, raio = R) {
  const a = ((angulo - 90) * Math.PI) / 180
  return { x: CX + raio * Math.cos(a), y: CX + raio * Math.sin(a) }
}

function Anel({ progresso, ativo, completo }: { progresso: ReturnType<typeof useSpring> | number; ativo: number; completo: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" role="img" aria-label="Anel do ciclo de prevenção: avaliação, acompanhamento e retorno">
      {/* marcas de relógio / calendário */}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i * 360) / 48
        const p1 = ponto(a, R + 18)
        const p2 = ponto(a, R + (i % 4 === 0 ? 28 : 23))
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.16)" strokeWidth={i % 4 === 0 ? 1.2 : 0.8} />
      })}
      <circle cx={CX} cy={CX} r={R - 46} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx={CX} cy={CX} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <m.circle
        cx={CX}
        cy={CX}
        r={R}
        fill="none"
        stroke="#75CEBE"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CX})`}
        style={{ pathLength: progresso }}
      />
      {ANGULOS.map((a, i) => {
        const p = ponto(a)
        const aceso = i <= ativo
        return (
          <g key={a}>
            <circle cx={p.x} cy={p.y} r="15" fill="#232427" stroke={aceso ? '#75CEBE' : 'rgba(255,255,255,0.25)'} strokeWidth="1.5" style={{ transition: 'stroke .4s' }} />
            <circle cx={p.x} cy={p.y} r="5.5" fill="#75CEBE" style={{ opacity: aceso ? 1 : 0, transition: 'opacity .4s' }} />
          </g>
        )
      })}
      {completo && (
        <circle cx={ponto(0).x} cy={ponto(0).y} r="22" fill="none" stroke="#75CEBE" strokeWidth="1" opacity="0.5" />
      )}
    </svg>
  )
}

function Rotulos({ ativo }: { ativo: number }) {
  // posições dos rótulos ao redor do anel (em % do quadrado)
  const pos = [
    'left-1/2 -top-2 -translate-x-1/2 -translate-y-full',
    'right-0 bottom-[14%] translate-x-[8%] translate-y-full sm:translate-x-[30%]',
    'left-0 bottom-[14%] -translate-x-[8%] translate-y-full sm:-translate-x-[30%]',
  ]
  return (
    <>
      {ETAPAS.map((e, i) => (
        <span
          key={e.titulo}
          aria-hidden="true"
          className={`rotulo absolute hidden whitespace-nowrap sm:block text-[0.62rem] transition-colors duration-500 sm:text-[0.7rem] ${pos[i]} ${i <= ativo ? 'text-menta' : 'text-grafite-300'}`}
        >
          {e.titulo}
        </span>
      ))}
    </>
  )
}

function Centro({ ativo, completo }: { ativo: number; completo: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
      <div>
        <p className="font-display text-6xl font-light tabular-nums tracking-tight text-white sm:text-7xl">
          {String(ativo + 1).padStart(2, '0')}
          <span className="text-2xl text-grafite-300 sm:text-3xl">/03</span>
        </p>
        <p className="rotulo mt-3 text-[0.65rem] text-menta sm:text-[0.7rem]">{completo ? 'A volta se fecha' : 'Ciclo de prevenção'}</p>
      </div>
    </div>
  )
}

export function CalendarioCuidado() {
  const reduzir = useReducedMotion()
  const trilho = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trilho, offset: ['start start', 'end end'] })
  const bruto = useTransform(scrollYProgress, [0.04, 0.9], [0.002, 1], { clamp: true })
  const progresso = useSpring(bruto, { stiffness: 120, damping: 26, mass: 0.4 })
  const [ativo, setAtivo] = useState(0)
  const [completo, setCompleto] = useState(false)

  useMotionValueEvent(bruto, 'change', (v) => {
    const novo = v < 1 / 3 ? 0 : v < 2 / 3 ? 1 : 2
    setAtivo((a) => (a === novo ? a : novo))
    const c = v >= 0.995
    setCompleto((x) => (x === c ? x : c))
  })

  const cabecalho = (
    <CabecalhoSecao id="titulo-calendario" rotulo="Calendário de cuidado" titulo="O cuidado que *se repete.*" claro={false}>
      <p>
        Prevenção acontece em ciclos. Cada volta começa com uma avaliação e segue com acompanhamento e retornos, no ritmo que o
        dentista indicar para você.
      </p>
    </CabecalhoSecao>
  )

  const lista = (atual: number, estatico: boolean) => (
    <ol className="space-y-3">
      {ETAPAS.map((e, i) => {
        const on = estatico || i === atual
        return (
          <li
            key={e.titulo}
            className={`rounded-2xl border p-5 transition-[opacity,border-color,background-color] duration-500 sm:p-6 ${
              on ? 'border-menta/35 bg-white/[0.04] opacity-100' : 'border-white/8 opacity-45'
            }`}
            aria-current={!estatico && i === atual ? 'step' : undefined}
          >
            <p className="rotulo text-[0.68rem] text-menta">Etapa {String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-2 text-xl text-white sm:text-2xl">{e.titulo}</h3>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-grafite-200">{e.texto}</p>
          </li>
        )
      })}
    </ol>
  )

  const nota = (
    <p className="mt-6 flex items-start gap-3 text-sm text-grafite-300">
      <span aria-hidden="true" className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-areia" />
      O intervalo entre as consultas é definido individualmente, na avaliação.
    </p>
  )

  return (
    <section aria-labelledby="titulo-calendario" id="calendario" className="relative bg-grafite-900 text-white">
      <div aria-hidden="true" className="grade-calendario pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {reduzir ? (
        <div className="container-site relative grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
          <div>
            {cabecalho}
            <div className="mt-10">{lista(2, true)}</div>
            {nota}
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
            <Anel progresso={1} ativo={2} completo />
            <Rotulos ativo={2} />
          </div>
        </div>
      ) : (
        <>
          <div className="container-site relative pt-24 lg:pt-32">{cabecalho}</div>
          <div ref={trilho} className="relative h-[260vh]">
            <div className="sticky top-0 flex h-svh items-center">
              <div className="container-site grid w-full items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <div className="order-2 lg:order-1">
                  <div className="hidden lg:block">{lista(ativo, false)}</div>
                  <ol className="sr-only lg:hidden">
                    {ETAPAS.map((e) => (
                      <li key={e.titulo}>
                        {e.titulo}: {e.texto}
                      </li>
                    ))}
                  </ol>
                  <div className="lg:hidden" aria-hidden="true">
                    <div className="min-h-[12.5rem] rounded-2xl border border-menta/35 bg-white/[0.04] p-5">
                      <p className="rotulo text-[0.68rem] text-menta">Etapa {String(ativo + 1).padStart(2, '0')}</p>
                      <h3 className="mt-2 text-xl text-white">{ETAPAS[ativo].titulo}</h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-grafite-200">{ETAPAS[ativo].texto}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block">{nota}</div>
                </div>
                <div className="relative order-1 mx-auto aspect-square w-[min(68vw,42vh)] lg:order-2 lg:w-full lg:max-w-[30rem]">
                  <Anel progresso={progresso} ativo={ativo} completo={completo} />
                  <Rotulos ativo={ativo} />
                  <Centro ativo={ativo} completo={completo} />
                </div>
              </div>
            </div>
          </div>
          <div className="container-site relative pb-16 lg:hidden">{nota}</div>
          <div className="h-8 lg:h-16" aria-hidden="true" />
        </>
      )}
    </section>
  )
}
