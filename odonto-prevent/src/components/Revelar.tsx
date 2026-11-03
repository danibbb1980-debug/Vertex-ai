import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Entrada suave ao rolar (opacity + translateY). */
export function Revelar({
  children,
  atraso = 0,
  className = '',
  como = 'div',
}: {
  children: ReactNode
  atraso?: number
  className?: string
  como?: 'div' | 'li' | 'article'
}) {
  const reduzir = useReducedMotion()
  const M = m[como]
  if (reduzir) {
    const Tag = como
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: atraso }}
    >
      {children}
    </M>
  )
}
