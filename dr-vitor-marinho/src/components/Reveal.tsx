import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../lib/useInView'
import { cn } from '../lib/cn'

/** Entrada suave ao rolar (opacity + transform, via CSS). Sem JS, o conteúdo aparece normalmente. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: C = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <C
      ref={ref as never}
      className={cn('reveal', className)}
      data-in={inView}
      style={delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </C>
  )
}
