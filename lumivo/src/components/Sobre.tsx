import { m } from 'motion/react'
import { config } from '../config'
import { SplitWords } from '../motion/SplitWords'
import { ease } from '../motion/tokens'

export function Sobre() {
  const { sobre } = config
  if (!sobre.texto) return null
  return (
    <section id="sobre" className="secao sobre container" aria-labelledby="sobre-rotulo">
      <h2 id="sobre-rotulo" className="rotulo">{sobre.rotulo}</h2>
      {sobre.foto && (
        <m.div
          className="sobre__foto"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: ease.outExpo }}
        >
          <m.img
            src={sobre.foto}
            alt="Pedro, da Lumivo Web"
            loading="lazy"
            width={800}
            height={1000}
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: ease.outExpo }}
          />
        </m.div>
      )}
      <SplitWords texto={sobre.texto} className="texto-grande" />
    </section>
  )
}
