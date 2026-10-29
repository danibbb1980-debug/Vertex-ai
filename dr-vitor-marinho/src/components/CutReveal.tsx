import type { CSSProperties, ReactNode } from 'react'

/**
 * Adaptado do componente "Vertical Cut Reveal" (21st.dev, cnippet-dev):
 * mesma ideia de dividir por palavras e revelar com um corte vertical em cascata,
 * mas feito com CSS para o título aparecer sem esperar o JavaScript.
 * Palavras entre *asteriscos* ficam em itálico.
 */
export function CutReveal({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  const out: ReactNode[] = []
  words.forEach((w, i) => {
    const italic = w.startsWith('*')
    const clean = w.replace(/\*/g, '')
    const m = clean.match(/^(.*?)([,.;:!?]?)$/)!
    out.push(
      <span key={i} className="cut-word" aria-hidden="true">
        <span style={{ '--i': i + start } as CSSProperties}>
          {italic ? <em className="text-teal-deep">{m[1]}</em> : m[1]}
          {m[2]}
        </span>
      </span>,
    )
    if (i < words.length - 1) out.push(' ')
  })
  return (
    <>
      <span className="sr-only">{text.replace(/\*/g, '')}</span>
      {out}
    </>
  )
}
