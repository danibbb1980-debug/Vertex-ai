import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Abertura: o splash segura o hero até entregar a palavra ao header   */
/* ------------------------------------------------------------------ */

type Opening = { opened: boolean; open: () => void }
const OpeningContext = createContext<Opening>({ opened: true, open: () => {} })

export const OpeningProvider = ({ children }: { children: ReactNode }) => {
  // Falso no HTML pré-renderizado; o CSS mostra o hero pronto quando não há splash
  const [opened, setOpened] = useState(false)
  const open = useCallback(() => setOpened(true), [])
  const value = useMemo(() => ({ opened, open }), [opened, open])
  return <OpeningContext.Provider value={value}>{children}</OpeningContext.Provider>
}

export const useOpening = () => useContext(OpeningContext)

/* ------------------------------------------------------------------ */
/* Marca: CHRONOS em texto vivo, com o mostrador sobre o último O       */
/* ------------------------------------------------------------------ */

export const DialParts = ({ ticks = 48 }: { ticks?: number }) => {
  const marks = []
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2
    const long = i % 4 === 0
    const r1 = long ? 37 : 43
    marks.push(
      <line
        key={i}
        x1={(50 + r1 * Math.cos(a)).toFixed(2)}
        y1={(50 + r1 * Math.sin(a)).toFixed(2)}
        x2={(50 + 48 * Math.cos(a)).toFixed(2)}
        y2={(50 + 48 * Math.sin(a)).toFixed(2)}
      />
    )
  }
  return (
    <>
      <circle cx='50' cy='50' r='48' className='dial-outer' />
      <circle cx='50' cy='50' r='30' className='dial-inner' />
      <g className='dial-ticks'>{marks}</g>
      <circle cx='50' cy='50' r='1.8' className='dial-hub' />
    </>
  )
}

export const Dial = ({ className = '', ticks = 48 }: { className?: string; ticks?: number }) => (
  <svg viewBox='0 0 100 100' className={className} aria-hidden='true' focusable='false'>
    <DialParts ticks={ticks} />
  </svg>
)

const LETTERS = 'CHRONOS'.split('')

/** Estrutura idêntica no header e no splash, para o pouso ser exato */
export const Wordmark = ({ className = '', letterClass = '', ringClass = '' }: { className?: string; letterClass?: string; ringClass?: string }) => (
  <span className={`wordmark ${className}`} aria-hidden='true'>
    {LETTERS.map((l, i) => (
      <span key={i} className={`wm-l ${letterClass}`} data-i={i}>
        {i === 5 && <Dial className={`wm-ring ${ringClass}`} />}
        <span className='wm-g'>{l}</span>
      </span>
    ))}
  </span>
)

/* ------------------------------------------------------------------ */
/* Ícones tipográficos (sem pacote de ícones fora do hero)              */
/* ------------------------------------------------------------------ */

export const Arrow = () => (
  <svg viewBox='0 0 20 20' className='ico' aria-hidden='true' focusable='false'>
    <path d='M3 10h13M11 5l5 5-5 5' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='square' />
  </svg>
)

export const ExtLink = ({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className={className}>
    {children}
    <span className='sr-only'> (abre em nova aba)</span>
  </a>
)

export const SectionNum = ({ n, label, tone = 'dark' }: { n: string; label: string; tone?: 'dark' | 'light' }) => (
  <p className={`sec-num sec-num--${tone}`}>
    <Dial className='sec-ring' ticks={24} />
    <span className='sec-n'>{n}</span>
    <span className='sec-l'>{label}</span>
  </p>
)

/** Título revelado por linha, com máscara (mecanismo recorrente a) */
export const Lines = ({ lines, as: Tag = 'h2', className = '', id }: { lines: ReactNode[]; as?: 'h2' | 'h3' | 'p'; className?: string; id?: string }) => (
  <Tag className={`lines ${className}`} id={id}>
    {lines.map((line, i) => (
      <span key={i} className='line-mask'>
        <span className='line' style={{ transitionDelay: `${i * 90}ms` }}>
          {line}
        </span>{' '}
      </span>
    ))}
  </Tag>
)

/* ------------------------------------------------------------------ */
/* Observadores: revelação ao entrar na tela e progresso pela rolagem  */
/* ------------------------------------------------------------------ */

export const useRevealObserver = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Progresso da linha (O traço e linha do tempo): só escreve uma variável CSS por quadro
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scrub]'))
    if (!els.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.style.setProperty('--p', '1'))
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) continue
        const start = vh * 0.85
        const end = vh * 0.35 - r.height
        const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
        el.style.setProperty('--p', p.toFixed(4))
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
}
