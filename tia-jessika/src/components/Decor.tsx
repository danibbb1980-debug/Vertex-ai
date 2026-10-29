import { m, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

/**
 * Traços desenhados à mão (originais), inspirados no clima da arte "Quem sou eu?".
 * Adaptado da ideia do componente "Line Draw SVG" (21st.dev): o traço se desenha ao entrar na tela.
 */

type DrawProps = {
  className?: string
  style?: CSSProperties
  delay?: number
  duration?: number
  strokeWidth?: number
  /** desenhar ao entrar na tela (padrão) ou ao montar */
  onMount?: boolean
}

function Traco({ d, delay = 0, duration = 1.2, onMount }: { d: string; delay?: number; duration?: number; onMount?: boolean }) {
  const reduced = useReducedMotion()
  if (reduced) return <path d={d} />
  const anim = { pathLength: 1, opacity: 1 }
  return (
    <m.path
      d={d}
      initial={{ pathLength: 0, opacity: 0 }}
      {...(onMount ? { animate: anim } : { whileInView: anim, viewport: { once: true, amount: 0.6 } })}
      transition={{ pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.2, delay } }}
    />
  )
}

const svgBase = (sw = 2) => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

/** Estrelinha de 4 pontas, traço único */
export function Brilho({ className, style, delay, duration = 0.9, strokeWidth = 2, onMount }: DrawProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} {...svgBase(strokeWidth)}>
      <Traco onMount={onMount} delay={delay} duration={duration} d="M20 3c1.2 9.5 5.5 14.6 16 17-10.5 2.4-14.8 7.5-16 17-1.2-9.5-5.5-14.6-16-17 10.5-2.4 14.8-7.5 16-17z" />
    </svg>
  )
}

/** Estrela de 5 pontas, traço levemente irregular */
export function Estrela({ className, style, delay, duration = 1.1, strokeWidth = 2, onMount }: DrawProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} {...svgBase(strokeWidth)}>
      <Traco onMount={onMount} delay={delay} duration={duration} d="M24 5.5l5.3 11.2 12.2 1.6-9 8.4 2.4 12.1L24 32.9l-10.9 5.9 2.4-12.1-9-8.4 12.2-1.6z" />
    </svg>
  )
}

/** Coração de traço com volta no final (como um rabisco) */
export function CoracaoTraco({ className, style, delay, duration = 1.4, strokeWidth = 2, onMount }: DrawProps) {
  return (
    <svg viewBox="0 0 64 56" className={className} style={style} {...svgBase(strokeWidth)}>
      <Traco onMount={onMount} delay={delay} duration={duration} d="M32 50C18 41 6 32 6 19.5 6 11.5 12 6 19 6c6 0 10.5 3.6 13 9 2.5-5.4 7-9 13-9 7 0 13 5.5 13 13.5C58 32 46 41 32 50c-1.5-1-2.5-2.3-2.2-3.6" />
    </svg>
  )
}

/** Risquinhos de "brilho" (como os do canto da arte) */
export function Riscos({ className, style, delay, duration = 0.6, strokeWidth = 2.2, onMount }: DrawProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} {...svgBase(strokeWidth)}>
      <Traco onMount={onMount} delay={delay} duration={duration} d="M10 30C14 22 18 16 24 9" />
      <Traco onMount={onMount} delay={(delay ?? 0) + 0.15} duration={duration} d="M18 36c6-4 12-8 22-11" />
      <Traco onMount={onMount} delay={(delay ?? 0) + 0.3} duration={duration} d="M27 42c5-1 10-1 15 0" />
    </svg>
  )
}

/** Laço/curva fina decorativa */
export function Laco({ className, style, delay, duration = 1.8, strokeWidth = 1.6, onMount }: DrawProps) {
  return (
    <svg viewBox="0 0 220 60" className={className} style={style} {...svgBase(strokeWidth)}>
      <Traco onMount={onMount} delay={delay} duration={duration} d="M4 44c30-2 52-14 70-30 10-9 26-10 26 2 0 14-26 18-24 4 2-14 30-14 52-2 24 13 50 20 88 12" />
    </svg>
  )
}

/* ------- Ilustrações originais simples (traço arredondado) ------- */

export function IlustraEscova({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgBase(2.4)}>
      <g transform="rotate(-30 60 60)">
        {/* cabo */}
        <path d="M14 68h56c3 0 5 2 5 5s-2 5-5 5H18c-3 0-5-2-5-5" fill="currentColor" fillOpacity=".08" />
        <path d="M24 73h22" strokeWidth="1.8" />
        {/* cabeça */}
        <path d="M70 68h30c3 0 5 2 5 5s-2 5-5 5H75" />
        {/* cerdas */}
        <path d="M74 66V52M80 66V50M86 66V50M92 66V50M98 66V52" />
        <path d="M72 50c8-3 20-3 28 0" />
      </g>
      {/* bolhinhas */}
      <circle cx="30" cy="34" r="5" />
      <circle cx="42" cy="22" r="3" />
      <path d="M96 92l1.5 3.5 3.5 1.5-3.5 1.5L96 102l-1.5-3.5L91 97l3.5-1.5z" />
    </svg>
  )
}

export function IlustraLua({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgBase(2.4)}>
      <path d="M74 20a40 40 0 1 0 26 58A34 34 0 0 1 74 20z" fill="currentColor" fillOpacity=".08" />
      <path d="M94 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      <path d="M100 52l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" />
      <path d="M50 64c2 3 6 3 8 0" />
    </svg>
  )
}

export function IlustraEstrela({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgBase(2.4)}>
      <path d="M60 18l11 23 25 3-18 17 5 25-23-12-23 12 5-25-18-17 25-3z" fill="currentColor" fillOpacity=".08" />
      <path d="M52 62c3 4 13 4 16 0" />
      <circle cx="50" cy="52" r="1.6" fill="currentColor" />
      <circle cx="70" cy="52" r="1.6" fill="currentColor" />
      <path d="M24 98c8-4 14-4 22 0M74 102c8-4 14-4 22 0" />
    </svg>
  )
}

export function IlustraCoracao({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgBase(2.4)}>
      <path d="M60 98C38 84 18 70 18 48c0-12 9-21 21-21 9 0 16 5 21 13 5-8 12-13 21-13 12 0 21 9 21 21 0 22-20 36-42 50z" fill="currentColor" fillOpacity=".08" />
      <path d="M36 46c0-6 4-9 9-9" />
      <path d="M96 20l1.6 4 4 1.6-4 1.6L96 31l-1.6-3.8-4-1.6 4-1.6z" />
    </svg>
  )
}

/** Forma orgânica (blob) para fundos */
export function Blob({ className, d = 0 }: { className?: string; d?: 0 | 1 | 2 }) {
  const paths = [
    'M421 312c-23 88-129 135-219 114S28 330 39 230 132 52 236 46s208 178 185 266z',
    'M396 120c52 64 40 180-26 240s-190 70-262 10S30 186 80 116 344 56 396 120z',
    'M118 64c70-46 196-32 250 34s34 186-36 238-196 36-252-26S48 110 118 64z',
  ]
  return (
    <svg viewBox="0 0 460 460" className={className} aria-hidden="true" focusable="false">
      <path d={paths[d]} fill="currentColor" />
    </svg>
  )
}

/** Divisória ondulada entre seções */
export function Onda({ className, invertida }: { className?: string; invertida?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={className}
      style={invertida ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 40c120-26 240-34 360-20s240 46 360 44 240-38 360-46 240 8 360 22v40H0z" fill="currentColor" />
    </svg>
  )
}
