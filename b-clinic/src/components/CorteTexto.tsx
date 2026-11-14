import { motion } from 'motion/react'
import { Fragment } from 'react'

/**
 * Revelação de título em "corte vertical".
 * Adaptado do componente Vertical Cut Reveal (21st.dev, danielpetho):
 * cada palavra sobe de dentro de uma máscara reta, sem fade.
 * Aceita segmentos para manter a palavra em ênfase (serifa itálica).
 */
type Segmento = { texto: string; enfase?: boolean }

type Props = {
  segmentos: Segmento[]
  animar?: boolean
  atraso?: number
  passo?: number
}

export function CorteTexto({ segmentos, animar = true, atraso = 0.2, passo = 0.07 }: Props) {
  const palavras = segmentos.flatMap((s) =>
    s.texto
      .split(' ')
      .filter(Boolean)
      .map((p) => ({ p, enfase: !!s.enfase })),
  )
  const textoCompleto = segmentos.map((s) => s.texto).join('')

  return (
    <>
      <span className="sr-only">{textoCompleto}</span>
      <span aria-hidden="true">
        {palavras.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-flex overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
              <motion.span
                className={`inline-block ${w.enfase ? 'enfase pr-[0.06em]' : ''}`}
                initial={animar ? { y: '105%' } : false}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 170, damping: 26, delay: atraso + i * passo }}
              >
                {w.p}
              </motion.span>
            </span>
            {i < palavras.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </>
  )
}
