import { useMemo, type CSSProperties } from 'react'
import { helice } from '../lib/helice'

export type Tom = 'claro' | 'escuro'

export const CORES: Record<Tom, { a: string; b: string; degrau: string }> = {
  claro: { a: 'var(--color-agua)', b: 'var(--color-agua-escura)', degrau: 'var(--color-agua)' },
  escuro: { a: 'var(--color-agua-clara)', b: 'var(--color-agua)', degrau: 'var(--color-agua-clara)' },
}

/**
 * Hélice grande que se desenha (stroke-dashoffset), fita por fita.
 * Com prefers-reduced-motion, as animações CSS são zeradas e ela aparece pronta.
 */
export function HeliceDesenho({
  tom = 'claro',
  voltas = 1.75,
  className = '',
  atraso = 0.2,
  inclinacao = 9,
  desenhar = true,
}: {
  tom?: Tom
  voltas?: number
  className?: string
  atraso?: number
  inclinacao?: number
  desenhar?: boolean
}) {
  const L = 360
  const H = 1000
  const g = useMemo(() => helice({ largura: L, altura: H, voltas, amp: 112, fita: 34, degraus: 0, fase: 0.35 }), [voltas])
  const c = CORES[tom]
  const sw = 2
  const estilo = (i: number, dur = 2.4): CSSProperties =>
    ({ '--atraso': `${atraso + i}s`, '--dur': `${dur}s` }) as CSSProperties
  const classe = desenhar ? 'traco' : ''
  const pronto = desenhar ? undefined : { strokeDasharray: 'none', strokeDashoffset: 0 }
  return (
    <svg
      viewBox={`-40 -20 ${L + 80} ${H + 40}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={`rotate(${inclinacao} ${L / 2} ${H / 2})`} fill="none" strokeLinecap="round">
        {g.degraus.map((d, i) => (
          <path
            key={`d${i}`}
            d={d}
            stroke={c.degrau}
            strokeWidth={1.2}
            strokeOpacity={0.55}
            className={desenhar ? 'degrau' : ''}
            style={{ '--atraso': `${atraso + 1.7 + i * 0.05}s` } as CSSProperties}
          />
        ))}
        {g.a.map((d, i) => (
          <path key={`a${i}`} d={d} pathLength={1} stroke={c.a} strokeWidth={sw} className={classe} style={{ ...estilo(i * 0.15), ...pronto }} />
        ))}
        {g.b.map((d, i) => (
          <path key={`b${i}`} d={d} pathLength={1} stroke={c.b} strokeWidth={sw} className={classe} style={{ ...estilo(0.7 + i * 0.15), ...pronto }} />
        ))}
      </g>
    </svg>
  )
}

