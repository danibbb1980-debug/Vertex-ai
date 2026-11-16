/**
 * Adaptado de "Vertical Cut Reveal" (21st.dev, @danielpetho):
 * cada palavra sobe de dentro de uma máscara (overflow hidden), em sequência.
 * Adaptações: suporte à palavra em ênfase (*palavra*), respeito a prefers-reduced-motion,
 * motion/react em vez de framer-motion e texto acessível único (sr-only).
 */
import { m, useReducedMotion } from 'motion/react'

export function CorteVertical({ texto, atraso = 0, passo = 0.07 }: { texto: string; atraso?: number; passo?: number }) {
  const reduzir = useReducedMotion()
  // Cada palavra pode ter pedaços em ênfase e pedaços sem (ex.: "*lugar*." = "lugar" itálico + "." colado).
  const palavras: { p: string; em: boolean }[][] = []
  let nova = true
  for (const parte of texto.split(/(\*[^*]+\*)/)) {
    if (!parte) continue
    const em = parte.startsWith('*')
    const bruto = em ? parte.slice(1, -1) : parte
    bruto.split(/( )/).forEach((p) => {
      if (p === ' ') return void (nova = true)
      if (!p) return
      if (nova || !palavras.length) palavras.push([])
      palavras[palavras.length - 1].push({ p, em })
      nova = false
    })
  }
  const limpo = texto.replace(/\*/g, '')
  return (
    <>
      <span className="sr-only">{limpo}</span>
      <span aria-hidden="true">
        {palavras.map((pedacos, i) => (
          <span key={i} className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <m.span
              className="inline-block"
              initial={reduzir ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 26, delay: atraso + i * passo }}
            >
              {pedacos.map(({ p, em }, j) => (em ? <em key={j} className="italic">{p}</em> : <span key={j}>{p}</span>))}
            </m.span>
            {i < palavras.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </span>
    </>
  )
}
