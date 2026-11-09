import { TODAS } from './orquideaLinhas'

interface Props {
  className?: string
  /** desenha o traço ao carregar (CSS), com atraso escalonado */
  desenhar?: boolean
  espessura?: number
  atraso?: number
}

/** Orquídea em traço fino, derivada do logo. `espessura` está em unidades do viewBox (200 de largura). */
export function OrquideaTraco({ className, desenhar = false, espessura = 1.1, atraso = 0.2 }: Props) {
  return (
    <svg viewBox="0 0 200 140" className={`${desenhar ? 'traco-desenha' : ''} ${className ?? ''}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={espessura} strokeLinecap="round">
      {TODAS.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={desenhar ? { animationDelay: `${atraso + i * 0.12}s` } : undefined} />
      ))}
    </svg>
  )
}
