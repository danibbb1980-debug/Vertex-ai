import { m, useReducedMotion } from 'motion/react'
import { Fragment } from 'react'

/**
 * Revelação de texto palavra por palavra com corte vertical
 * (adaptado da ideia de "Text Reveal" / "Vertical Cut Reveal" do 21st.dev).
 * Use *palavra* para a ênfase em serif itálica. Anima só transform e opacity.
 */
export function TextoRevelado({
  texto,
  aoVer = true,
  atraso = 0,
  passo = 0.055,
}: {
  texto: string
  aoVer?: boolean
  atraso?: number
  passo?: number
}) {
  const reduzir = useReducedMotion()
  // Divide em palavras e marca as que estão entre *asteriscos* (ênfase pode ter várias palavras).
  let dentro = false
  const palavras = texto.split(' ').map((bruta) => {
    let w = bruta
    const abre = w.startsWith('*')
    if (abre) {
      dentro = true
      w = w.slice(1)
    }
    const enfase = dentro
    let pont = ''
    const fecha = w.match(/\*([.,!?:;]?)$/)
    if (fecha) {
      w = w.slice(0, fecha.index)
      pont = fecha[1]
      dentro = false
    }
    return { w, enfase, pont }
  })

  return (
    <>
      {palavras.map(({ w, enfase, pont }, i) => {
        const conteudo = enfase ? (
          <>
            <span className="enfase">{w}</span>
            {pont}
          </>
        ) : (
          w + pont
        )
        if (!aoVer) {
          // Modo CSS (hero): anima já na primeira pintura, inclusive no HTML pré-renderizado.
          return (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <span className="revela-palavra inline-block" style={{ animationDelay: `${atraso + i * passo}s` }}>
                  {conteudo}
                </span>
              </span>
              {i < palavras.length - 1 ? ' ' : ''}
            </Fragment>
          )
        }
        if (reduzir) {
          return (
            <Fragment key={i}>
              {conteudo}
              {i < palavras.length - 1 ? ' ' : ''}
            </Fragment>
          )
        }
        const anim = { y: '0%', opacity: 1 }
        return (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <m.span
                className="inline-block will-change-transform"
                initial={{ y: '105%', opacity: 0 }}
                whileInView={anim}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: atraso + i * passo }}
              >
                {conteudo}
              </m.span>
            </span>
            {i < palavras.length - 1 ? ' ' : ''}
          </Fragment>
        )
      })}
    </>
  )
}
