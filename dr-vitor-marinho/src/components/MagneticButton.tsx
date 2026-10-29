import type { ReactNode, PointerEvent } from 'react'

/** Botão com leve atração ao cursor (só com mouse; teclado e toque não mudam nada). */
export function MagneticLink({
  href,
  children,
  className,
  external,
  strength = 0.22,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
  strength?: number
}) {
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
  }
  const reset = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = ''
  }
  return (
    <a
      href={href}
      className={`magnetic ${className ?? ''}`}
      onPointerMove={move}
      onPointerLeave={reset}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
