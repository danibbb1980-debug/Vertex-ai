import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../lib/movimento'

/** Título com uma palavra em ênfase (itálico camelo). */
export function Titulo({
  antes,
  enfase,
  depois,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  antes: string
  enfase?: string
  depois?: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  const fim = depois ?? ''
  const espacoDepois = fim && !/^[.,;:!?]/.test(fim) ? ' ' : ''
  return (
    <Tag id={id} className={className}>
      {antes}
      {enfase && (
        <>
          {' '}
          <em>{enfase}</em>
        </>
      )}
      {espacoDepois}
      {fim}
    </Tag>
  )
}

/** Entrada suave ao rolar (opacidade + deslocamento). */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 18,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
  as?: 'div' | 'li' | 'article'
}) {
  const ref = useReveal<HTMLElement>()
  const Comp = as as 'div'
  const estilo = { '--rd': `${Math.round(delay * 1000)}ms`, '--ry': `${y}px` } as CSSProperties
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} data-reveal="" className={className} style={estilo}>
      {children}
    </Comp>
  )
}

/** Cabeçalho padrão de seção: rótulo + título + intro opcional. */
export function CabecalhoSecao({
  rotulo,
  antes,
  enfase,
  depois,
  intro,
  id,
  className = '',
  claro = false,
}: {
  rotulo: string
  antes: string
  enfase?: string
  depois?: string
  intro?: string
  id: string
  className?: string
  claro?: boolean
}) {
  return (
    <Reveal className={className}>
      <p className="rotulo">{rotulo}</p>
      <Titulo
        id={id}
        antes={antes}
        enfase={enfase}
        depois={depois}
        className={`titulo-secao mt-4 ${claro ? '!text-ivory' : ''}`}
      />
      {intro && (
        <p className={`mt-5 max-w-xl text-lg ${claro ? 'text-camel-300' : 'text-choco-700'}`}>{intro}</p>
      )}
    </Reveal>
  )
}

/** Filete com dois arcos: pequeno ornamento entre blocos. */
export function Filete({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={`h-3 w-28 ${className}`} aria-hidden="true" fill="none">
      <path d="M2 6h44" stroke="currentColor" strokeWidth="1" />
      <path d="M52 10a8 8 0 0 1 14-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M68 2a8 8 0 0 1-14 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
      <path d="M74 6h44" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
