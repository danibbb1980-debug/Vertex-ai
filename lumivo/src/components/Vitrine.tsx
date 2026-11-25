import { m } from 'motion/react'
import { config } from '../config'
import { dur, ease } from '../motion/tokens'
import { Marquee } from './Marquee'
import { Reveal } from '../motion/Reveal'

/** Notebook com o esquema de um rascunho (ilustração, não é projeto de cliente) + marquee de tecnologias. */
export function Vitrine() {
  const { tecnologia } = config
  return (
    <section id="tecnologia" className="secao vitrine" aria-labelledby="tecnologia-titulo">
      <div className="container">
        <p className="rotulo">{tecnologia.rotulo}</p>
        <Reveal>
          <h2 id="tecnologia-titulo" className="titulo-secao">{tecnologia.titulo}</h2>
        </Reveal>
        <div className="notebook-cena">
          <m.figure
            className="notebook"
            initial={{ opacity: 0, rotateX: 12, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: dur.longa, ease: ease.outExpo }}
          >
            <div className="notebook__tela">
              <div className="esboco">
                <div className="esboco__nav"><i /><i /><i /></div>
                <div className="esboco__hero">
                  <b className="esboco__t1" />
                  <b className="esboco__t2" />
                  <b className="esboco__p" />
                  <span className="esboco__botao" />
                </div>
                <div className="esboco__grade"><i /><i /><i /></div>
              </div>
            </div>
            <div className="notebook__base" />
            <figcaption className="rotulo">Esquema de um rascunho: chamada, prova e botão do WhatsApp</figcaption>
          </m.figure>
          <div className="notebook-sombra" aria-hidden="true" />
        </div>
      </div>
      <Marquee itens={tecnologia.itens} />
    </section>
  )
}
