import { useEffect, useRef } from 'react'
import { Clock, MapPin, MessageCircle } from 'lucide-react'
import { CONFIG, MSG_GERAL, waLink } from '../config'
import { Arrow, DialParts, useOpening } from '../ui'

const LINES = ['Estética automotiva', 'em Poços de Caldas.', 'Peça o seu horário.']
const H1_TEXT = 'Chronos | Estética Automotiva: estética automotiva em Poços de Caldas. Peça o seu horário.'

/** Uma linha do título: letras que sobem em cascata de 0,03 s, dentro de uma máscara */
const HeroLine = ({ text, index, accent }: { text: string; index: number; accent?: boolean }) => (
  <span className='hero-mask' aria-hidden='true'>
    <span className={`hero-line${accent ? ' is-accent' : ''}`} style={{ ['--li' as string]: index }}>
      {text.split('').map((ch, i) => (
        <span key={i} className='hero-ch' style={{ ['--ci' as string]: i }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  </span>
)

/** O traço: linha fina de circuito com curvas de 45° que termina no mostrador */
const Trace = () => (
  <svg className='hero-trace-svg' viewBox='0 0 520 560' aria-hidden='true' focusable='false'>
    <path className='trace-path' pathLength={1} d='M36 520 H180 L260 440 V310 L336.4 233.6' />
    <circle className='trace-node' cx='28' cy='520' r='8' />
    <g className='trace-dial'>
      <svg x='310' y='80' width='180' height='180' viewBox='0 0 100 100' overflow='visible'>
        <g className='trace-dial-rot'>
          <DialParts ticks={60} />
        </g>
      </svg>
    </g>
    <g className='trace-ticks'>
      <line x1='180' y1='532' x2='180' y2='544' />
      <line x1='260' y1='452' x2='260' y2='464' />
    </g>
  </svg>
)

export default function Hero() {
  const { opened } = useOpening()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flags = useRef({ still: false, fine: false, lit: false, mobile: true })
  const syncRef = useRef<() => void>(() => {})

  useEffect(() => {
    flags.current.lit = opened
    syncRef.current()
  }, [opened])

  // A luz em WebGL entra num chunk separado, depois da primeira pintura
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mq = (q: string) => window.matchMedia(q).matches
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = !!conn?.saveData
    flags.current = {
      still: mq('(prefers-reduced-motion: reduce)') || saveData,
      fine: mq('(pointer: fine)'),
      lit: flags.current.lit,
      mobile: mq('(max-width: 1023.98px)')
    }
    let destroy = () => {}
    let cancelled = false
    const run = () => {
      import('./light').then(({ startLight }) => {
        if (cancelled) return
        const handle = startLight(canvas, () => flags.current)
        syncRef.current = handle.sync
        destroy = handle.destroy
      })
    }
    const idle = 'requestIdleCallback' in window
    const id = idle ? window.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 400)
    const onResize = () => {
      flags.current.mobile = mq('(max-width: 1023.98px)')
      syncRef.current()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      if (idle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      destroy()
    }
  }, [])

  return (
    <section className='hero' id='topo' data-go={opened ? '' : undefined} aria-labelledby='hero-title'>
      <div className='hero-bg' aria-hidden='true'>
        <div className='hero-fallback' />
        <canvas ref={canvasRef} className='hero-canvas' />
      </div>

      <div className='wrap hero-grid'>
        <div className='hero-copy'>
          <p className='hero-eyebrow hero-fade' style={{ ['--fd' as string]: '100ms' }}>
            <span className='eyebrow-rule' aria-hidden='true' />
            Estética automotiva · Poços de Caldas/MG
          </p>

          <h1 className='hero-title' id='hero-title'>
            <span className='sr-only'>{H1_TEXT}</span>
            {LINES.map((l, i) => (
              <HeroLine key={i} text={l} index={i} accent={i === LINES.length - 1} />
            ))}
          </h1>

          <p className='hero-sub hero-fade' style={{ ['--fd' as string]: '900ms' }}>
            Veja onde fica, quando atendemos e peça o seu horário pelo WhatsApp.
          </p>

          <div className='hero-ctas hero-fade' style={{ ['--fd' as string]: '1020ms' }}>
            <a className='btn btn--primary' href={waLink(MSG_GERAL)} target='_blank' rel='noopener noreferrer'>
              <span>Pedir horário</span>
              <Arrow />
              <span className='sr-only'> pelo WhatsApp (abre em nova aba)</span>
            </a>
            <a className='btn btn--ghost' href='#estetica'>
              Ver o atendimento
            </a>
          </div>
        </div>

        <div className='hero-trace'>
          <Trace />
        </div>
      </div>

      <div className='wrap'>
        <ul className='trust hero-fade' style={{ ['--fd' as string]: '1150ms' }} aria-label='Endereço, horários e atendimento'>
          <li>
            <MapPin aria-hidden='true' strokeWidth={1.25} size={18} />
            <span>{CONFIG.endereco.linhaCurta}</span>
          </li>
          <li>
            <Clock aria-hidden='true' strokeWidth={1.25} size={18} />
            <span>
              Seg a qui 08h–17h <span className='trust-dot' aria-hidden='true'>·</span> Sex e sáb 08h–16h
            </span>
          </li>
          <li>
            <MessageCircle aria-hidden='true' strokeWidth={1.25} size={18} />
            <span>Horário combinado pelo WhatsApp</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
