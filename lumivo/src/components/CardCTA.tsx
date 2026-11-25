import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { config } from '../config'
import { useAbrirQuiz } from '../quizContexto'
import { Seta } from './Seta'

export function CardCTA() {
  const { cta, contato } = config
  const ref = useRef<HTMLElement>(null)
  const abrirQuiz = useAbrirQuiz()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1])
  const raio = useTransform(scrollYProgress, [0.4, 0.9], [28, 16])
  const secundario = useTransform(scrollYProgress, [0.35, 0.75], [0.3, 1])
  const tituloY = useTransform(scrollYProgress, [0, 0.6], ['30%', '0%'])

  return (
    <section ref={ref} id="contato" className="cta" aria-labelledby="cta-titulo">
      <div className="cta__fixo">
        <m.div className="cta__cartao" style={{ scale, borderRadius: raio }}>
          <span className="cta__ponto-luz" aria-hidden="true" />
          <m.h2 id="cta-titulo" className="cta__titulo" style={{ y: tituloY }}>{cta.titulo}</m.h2>
          <m.div className="cta__resto" style={{ '--o': secundario } as never}>
            <p>{cta.texto}</p>
            {config.mostrarPreco && <p className="rotulo">{config.preco}</p>}
            <button className="botao botao--primario botao--largo" onClick={(e) => abrirQuiz(e.currentTarget)}>
              {cta.botao}
              <Seta className="botao__seta" />
            </button>
            <p className="cta__contato">
              Prefere escrever direto? <a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener noreferrer">{contato.whatsappExibicao}</a>
              {' '}ou <a href={`mailto:${contato.email}`}>{contato.email}</a>
            </p>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
