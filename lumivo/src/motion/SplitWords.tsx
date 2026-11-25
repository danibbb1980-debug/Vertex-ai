import { useRef } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useReducedMotion } from './useReducedMotion'

function Palavra({ texto, progresso, ini, fim }: { texto: string; progresso: MotionValue<number>; ini: number; fim: number }) {
  const opacity = useTransform(progresso, [ini, fim], [0.4, 1])
  return (
    <m.span aria-hidden="true" style={{ opacity }} className="palavra">
      {texto}{' '}
    </m.span>
  )
}

/** Parágrafo que acende palavra a palavra conforme o scroll. Texto completo segue acessível. */
export function SplitWords({ texto, className, as: Tag = 'p' }: { texto: string; className?: string; as?: 'p' | 'h2' }) {
  const ref = useRef<HTMLParagraphElement & HTMLHeadingElement>(null)
  const reduzido = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] })
  const palavras = texto.split(' ')

  if (reduzido)
    return (
      <Tag ref={ref} className={className}>
        {texto}
      </Tag>
    )

  const n = palavras.length
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{texto}</span>
      {palavras.map((p, i) => (
        <Palavra key={i} texto={p} progresso={scrollYProgress} ini={i / n} fim={Math.min(1, (i + 2) / n)} />
      ))}
    </Tag>
  )
}
