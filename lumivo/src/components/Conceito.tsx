import { config } from '../config'
import { SplitWords } from '../motion/SplitWords'

export function Conceito() {
  const { conceito } = config
  if (!conceito.texto) return null
  return (
    <section id="conceito" className="secao conceito container" aria-labelledby="conceito-rotulo">
      <h2 id="conceito-rotulo" className="rotulo">{conceito.rotulo}</h2>
      <SplitWords texto={conceito.texto} className="texto-grande" />
    </section>
  )
}
