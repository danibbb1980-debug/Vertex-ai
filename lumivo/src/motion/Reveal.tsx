import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { entrada } from './tokens'

/** Entrada única (fade + sobe) ao cruzar 85% da viewport. Desligada por MotionConfig em movimento reduzido. */
export function Reveal({ children, className, atraso = 0 }: { children: ReactNode; className?: string; atraso?: number }) {
  return (
    <m.div
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -15% 0px' }}
      variants={entrada}
      transition={{ delay: atraso }}
    >
      {children}
    </m.div>
  )
}
