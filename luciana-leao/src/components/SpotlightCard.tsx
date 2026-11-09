import { useRef, type PointerEvent, type ReactNode } from 'react'

/**
 * Inspirado no "Spotlight Card" (21st.dev, @preetsuthar17): uma luz suave segue o ponteiro.
 * Adaptado: luz rosé quase imperceptível, só em dispositivos com mouse, atualizada via
 * variáveis CSS (sem re-render do React).
 */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--sx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onPointerMove={mover} className={`cartao-luz group relative ${className}`}>
      {children}
    </div>
  )
}
