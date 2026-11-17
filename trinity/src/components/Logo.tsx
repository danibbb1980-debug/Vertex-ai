import wm from '../wordmark.json'
import { CONFIG } from '../config'
import { Knot } from './Knot'

const W = wm.trinity.w
const DS = (W * 0.9) / wm.desc.w // escala do descritor
const DX = (W - wm.desc.w * DS) / 2

/** "TRINITY" + "ESTÉTICA AVANÇADA" convertidos em contornos (Bodoni Moda e Schibsted Grotesk). */
export function Wordmark({ color, className = '', descritor = true }: { color: string; className?: string; descritor?: boolean }) {
  const h = descritor ? 2280 : 1560
  return (
    <svg viewBox={`-20 -1540 ${W + 40} ${h}`} className={className} aria-hidden="true" focusable="false" fill={color}>
      <path d={wm.trinity.d} />
      {descritor && <path d={wm.desc.d} transform={`translate(${DX} 660) scale(${DS})`} />}
    </svg>
  )
}

type LogoProps = {
  tone: 'light' | 'dark'
  layout?: 'row' | 'stack'
  active?: number | null
  className?: string
  idPrefix: string
}

export function Logo({ tone, layout = 'row', active = null, className = '', idPrefix }: LogoProps) {
  const ink = tone === 'light' ? 'var(--ink)' : 'var(--paper)'
  const gap = tone === 'light' ? 'var(--paper)' : 'var(--ink)'
  const emblem = tone === 'light' ? 'var(--bronze)' : 'var(--bronze-soft)'
  const label = `${CONFIG.nome} ${CONFIG.descritor}`

  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={label} className={className} />
  }

  if (layout === 'stack') {
    return (
      <span role="img" aria-label={label} className={`flex flex-col items-center ${className}`}>
        <Knot idPrefix={idPrefix} gap={gap} ink={emblem} on={emblem} width={16} widthOn={16} className="w-[38%]" active={active} />
        <Wordmark color={ink} className="mt-[6%] w-full" />
      </span>
    )
  }
  return (
    <span role="img" aria-label={label} className={`flex items-center gap-3 ${className}`}>
      <Knot
        idPrefix={idPrefix}
        gap={gap}
        ink={ink}
        on={emblem}
        width={20}
        widthOn={30}
        className="h-11 w-11 shrink-0"
        active={active}
      />
      <Wordmark color={ink} className="h-[30px] w-auto" />
    </span>
  )
}
