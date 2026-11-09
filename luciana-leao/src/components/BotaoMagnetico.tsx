import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from 'react'

/**
 * Inspirado no "Magnetic Button" (21st.dev, @mohammadshehadeh): o botão se aproxima levemente
 * do cursor e volta com suavidade. Adaptado: no máximo 6px, só com mouse, sem biblioteca
 * (transform + transição CSS) e desligado com movimento reduzido.
 */
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; forca?: number }

export function BotaoMagnetico({ children, forca = 0.18, className = '', ...rest }: Props) {
  const mover = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) * forca))
    const y = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * forca))
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }
  const sair = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty('--mx', '0px')
    e.currentTarget.style.setProperty('--my', '0px')
  }
  return (
    <a {...rest} className={`magnetico ${className}`} onPointerMove={mover} onPointerLeave={sair}>
      {children}
    </a>
  )
}
