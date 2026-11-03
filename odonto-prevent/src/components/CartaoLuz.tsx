import { useRef, type ReactNode, type PointerEvent } from 'react'

/**
 * Cartão com luz que segue o cursor e borda acesa
 * (adaptado de "Spotlight Card" do 21st.dev, sem dependências).
 * A luz usa variáveis CSS; nenhuma re-renderização do React.
 */
export function CartaoLuz({
  children,
  className = '',
  escuro = false,
  como: Tag = 'article',
}: {
  children: ReactNode
  className?: string
  escuro?: boolean
  como?: 'article' | 'li' | 'div'
}) {
  const ref = useRef<HTMLElement>(null)
  function mover(e: PointerEvent<HTMLElement>) {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--lx', `${e.clientX - r.left}px`)
    el.style.setProperty('--ly', `${e.clientY - r.top}px`)
  }
  const luz = escuro ? 'rgba(117,206,190,0.14)' : 'rgba(117,206,190,0.22)'
  return (
    <Tag
      ref={ref as never}
      onPointerMove={mover}
      className={`group relative isolate overflow-hidden rounded-[1.75rem] border transition-[border-color,transform,box-shadow] duration-500 ease-suave hover:-translate-y-1 ${
        escuro
          ? 'border-white/10 bg-grafite-800/60 hover:border-menta/40'
          : 'border-linha bg-white hover:border-menta-texto/30 hover:shadow-[0_24px_60px_-30px_rgba(35,36,39,0.35)]'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(380px circle at var(--lx, 50%) var(--ly, 0%), ${luz}, transparent 65%)` }}
      />
      {children}
    </Tag>
  )
}
