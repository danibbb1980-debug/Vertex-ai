import { Fragment, type ReactNode } from 'react'

/**
 * Adaptado do componente "Text Reveal" (21st.dev, @ddoemonn).
 * Mudanças: a animação roda em CSS (funciona já no HTML pré-renderizado, sem esperar o JS),
 * só com opacity + transform, e aceita trechos em ênfase (itálico) dentro do título.
 */
export type Trecho = string | { enfase: string }

interface Props {
  trechos: Trecho[]
  className?: string
  /** atraso inicial em segundos */
  atraso?: number
  passo?: number
}

export function TextReveal({ trechos, className = '', atraso = 0.05, passo = 0.05 }: Props) {
  const palavras: { texto: string; enfase: boolean }[] = []
  for (const t of trechos) {
    const enfase = typeof t !== 'string'
    const texto = typeof t === 'string' ? t : t.enfase
    for (const p of texto.trim().split(/\s+/)) palavras.push({ texto: p, enfase })
  }
  const textoPlano = trechos.map((t) => (typeof t === 'string' ? t : t.enfase)).join(' ').replace(/\s+/g, ' ')
  let nodes: ReactNode[] = []
  nodes = palavras.map((p, i) => (
    <Fragment key={i}>
      {i > 0 ? ' ' : null}
      <span className="tr-palavra" style={{ animationDelay: `${atraso + i * passo}s` }}>
        {p.enfase ? <em className="text-vinho-600">{p.texto}</em> : p.texto}
      </span>
    </Fragment>
  ))
  return (
    <span className={className}>
      <span className="sr-only">{textoPlano}</span>
      <span aria-hidden="true">{nodes}</span>
    </span>
  )
}
