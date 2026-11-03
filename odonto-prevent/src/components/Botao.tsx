import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { ReactNode, PointerEvent, AnchorHTMLAttributes } from 'react'

type Variante = 'menta' | 'grafite' | 'contorno-claro' | 'contorno-escuro'

const estilos: Record<Variante, string> = {
  menta: 'bg-menta text-grafite-950 hover:bg-menta-claro shadow-[0_10px_30px_-12px_rgba(117,206,190,0.55)]',
  grafite: 'bg-grafite-900 text-white hover:bg-grafite-700 shadow-[0_10px_30px_-14px_rgba(23,24,26,0.6)]',
  'contorno-claro': 'border border-white/30 text-white hover:border-menta hover:text-menta',
  'contorno-escuro': 'border border-grafite-900/25 text-tinta hover:border-menta-texto hover:text-menta-texto',
}

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  href: string
  variante?: Variante
  icone?: ReactNode
  children: ReactNode
  externo?: boolean
  className?: string
}

/**
 * Botão-link com leve efeito magnético (inspirado no "Magnetic Button" do 21st.dev),
 * só em mouse/trackpad e sem movimento reduzido. Anima apenas transform.
 */
export function Botao({ href, variante = 'menta', icone, children, externo, className = '', ...rest }: Props) {
  const reduzir = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  function mover(e: PointerEvent<HTMLAnchorElement>) {
    if (reduzir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25)
  }
  function soltar() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.a
      href={href}
      onPointerMove={mover}
      onPointerLeave={soltar}
      style={{ x: sx, y: sy }}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 font-display text-[0.98rem] font-medium tracking-[-0.005em] transition-colors duration-200 ${estilos[variante]} ${className}`}
      {...rest}
    >
      {icone && <span className="shrink-0 transition-transform duration-300 ease-suave group-hover:-rotate-6">{icone}</span>}
      <span>{children}</span>
    </m.a>
  )
}
