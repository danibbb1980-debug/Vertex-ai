import { m } from 'motion/react'
import { config } from '../config'
import { dur, ease, entrada } from '../motion/tokens'
import { Ilustracao } from './ilustracoes/Ilustracao'

export function Servicos() {
  const { servicos } = config
  if (!servicos.itens.length) return null
  return (
    <section id="servicos" className="secao servicos container" aria-labelledby="servicos-titulo">
      <p className="rotulo">{servicos.rotulo}</p>
      <h2 id="servicos-titulo" className="titulo-secao">{servicos.titulo}</h2>
      <ol className="servicos__lista">
        {servicos.itens.map((s) => (
          <m.li
            key={s.numero}
            className="servico"
            initial="oculto"
            whileInView="visivel"
            viewport={{ once: true, amount: 0.4 }}
          >
            <m.span
              className="servico__divisoria"
              aria-hidden="true"
              variants={{ oculto: { scaleX: 0 }, visivel: { scaleX: 1, transition: { duration: 0.8, ease: ease.outExpo } } }}
            />
            <m.div className="servico__corpo" variants={entrada} transition={{ delay: 0.1, duration: dur.media }}>
              <span className="servico__num">{s.numero}</span>
              <div>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
              <Ilustracao tipo={s.ilustracao} />
            </m.div>
          </m.li>
        ))}
      </ol>
    </section>
  )
}
