import { useRef, type ReactNode, type PointerEvent } from 'react'
import { cn } from '../lib/cn'

/**
 * Cartão com luz que acompanha o cursor (inspirado nos cartões "spotlight" do 21st.dev),
 * reduzido a um brilho menta muito suave e marcas de canto, sem sombra pesada.
 */
export function SpotlightCard({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <article
      id={id}
      ref={ref}
      onPointerMove={move}
      className={cn(
        'group relative isolate overflow-hidden border border-ink/10 bg-paper transition-colors duration-500 hover:border-teal-deep/35',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--color-mint) 75%, transparent), transparent 65%)',
        }}
      />
      <span aria-hidden="true" className="absolute left-0 top-0 size-2.5 border-l border-t border-teal-deep/50" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 size-2.5 border-b border-r border-teal-deep/50" />
      {children}
    </article>
  )
}
