import { useRef } from 'react'
import { m, useInView, useScroll } from 'motion/react'
import { config } from '../config'
import { IconeMetodo } from './IconeMetodo'

function Passo({ i, passo, ultimo }: { i: number; passo: (typeof config.metodo.passos)[number]; ultimo: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  const ativo = useInView(ref, { once: true, margin: '0px 0px -40% 0px' })
  return (
    <li ref={ref} className={`passo ${ativo ? 'passo--ativo' : ''} ${ultimo ? 'passo--final' : ''}`}>
      <span className="passo__marcador" aria-hidden="true" />
      <div className="passo__cartao">
        <IconeMetodo tipo={passo.icone} />
        <div>
          <span className="passo__num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{passo.titulo}</h3>
          <p>{passo.texto}</p>
        </div>
      </div>
    </li>
  )
}

export function Metodo() {
  const { metodo } = config
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  if (!metodo.passos.length) return null
  return (
    <section id="metodo" className="secao metodo container" aria-labelledby="metodo-titulo">
      <p className="rotulo">{metodo.rotulo}</p>
      <h2 id="metodo-titulo" className="titulo-secao">{metodo.titulo}</h2>
      <ol ref={ref} className="linha-tempo">
        <span className="linha-tempo__trilho" aria-hidden="true">
          <m.span className="linha-tempo__fill" style={{ scaleY: scrollYProgress }} />
        </span>
        {metodo.passos.map((p, i) => (
          <Passo key={p.titulo} i={i} passo={p} ultimo={i === metodo.passos.length - 1} />
        ))}
      </ol>
    </section>
  )
}
