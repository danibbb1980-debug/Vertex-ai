import { Fragment } from 'react'

/**
 * Revelação palavra por palavra com corte vertical (adaptado da ideia do
 * "Vertical Cut Reveal" do 21st.dev, refeito em CSS puro para não depender
 * de JS no carregamento). Use *palavra* para itálico e "\n" para quebrar
 * linha: com quebras fixas, a troca da fonte de fallback pela web font não
 * muda o número de linhas (sem deslocamento de layout).
 */
export function TextReveal({ text }: { text: string }) {
  let n = 0
  return (
    <>
      {text.split('\n').map((line, li) => {
        const start = n
        n += line.split(' ').length
        return (
          <span key={li} className="block">
            <Words text={line} start={start} />
          </span>
        )
      })}
    </>
  )
}

function Words({ text, start }: { text: string; start: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => {
        const italic = w.startsWith('*')
        const clean = w.replace(/\*/g, '')
        const trailing = clean.match(/[,.;:!?]+$/)?.[0] ?? ''
        const core = italic ? clean.slice(0, clean.length - trailing.length) : clean
        return (
          <Fragment key={i}>
            <span className="cut">
              <span style={{ ['--i' as string]: i + start }}>
                {italic ? (
                  <>
                    <em>{core}</em>
                    {trailing}
                  </>
                ) : (
                  core
                )}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </>
  )
}
