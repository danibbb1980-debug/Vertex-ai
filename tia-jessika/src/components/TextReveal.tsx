import { Fragment, useMemo, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'

/**
 * Adaptado de "Text Reveal" (ddoemonn, 21st.dev).
 * Mudanças: só anima transform + opacity (sem blur), aceita palavras em ênfase
 * (itálico framboesa) e usa a curva da marca.
 */

const EASE = [0.23, 1, 0.32, 1] as const
const DURATION = 0.75

export type Parte = string | { em: string }

export function TextReveal({
  partes,
  className = '',
  stagger = 0.07,
  delay = 0,
  startOnView = true,
}: {
  partes: Parte[]
  className?: string
  stagger?: number
  delay?: number
  startOnView?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const started = !startOnView || inView

  const { palavras, textoPlano } = useMemo(() => {
    const out: { t: string; em: boolean }[] = []
    for (const p of partes) {
      const em = typeof p !== 'string'
      const txt = typeof p === 'string' ? p : p.em
      txt
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .forEach((t) => out.push({ t, em }))
    }
    return { palavras: out, textoPlano: out.map((w) => w.t).join(' ') }
  }, [partes])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{textoPlano}</span>
      <span aria-hidden="true">
        {palavras.map((w, i) => {
          const conteudo = w.em ? <em className="enfase">{w.t}</em> : w.t
          return (
            <Fragment key={i}>
              {i > 0 ? ' ' : null}
              <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                {reduced ? (
                  <span className="inline-block">{conteudo}</span>
                ) : (
                  <m.span
                    className="inline-block will-change-transform"
                    initial={{ opacity: 0, y: '0.6em' }}
                    animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.6em' }}
                    transition={{ duration: DURATION, ease: EASE, delay: started ? delay + i * stagger : 0 }}
                  >
                    {conteudo}
                  </m.span>
                )}
              </span>
            </Fragment>
          )
        })}
      </span>
    </span>
  )
}

/** Revelação simples (fade + sobe) para blocos */
export function Revela({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article'
}) {
  const reduced = useReducedMotion()
  const C = m[as]
  if (reduced) {
    const T = as
    return <T className={className}>{children}</T>
  }
  return (
    <C
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </C>
  )
}
