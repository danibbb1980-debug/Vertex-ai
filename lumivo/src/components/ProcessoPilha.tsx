import { useRef } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'motion/react'
import { config } from '../config'
import { Reveal } from '../motion/Reveal'
import { useMediaQuery } from '../motion/useReducedMotion'

const { processo } = config

function Cartao({ i, total, progresso, item, grade }: { i: number; total: number; progresso: MotionValue<number>; item: (typeof processo.itens)[number]; grade: boolean }) {
  // Cada cartão começa a encolher quando o próximo começa a subir.
  const inicio = (i + 1) / total
  const escalaFinal = 1 - (total - 1 - i) * 0.04
  const scale = useTransform(progresso, [inicio - 1 / total, inicio + 0.05, 1], [1, 1, escalaFinal])
  const sombra = useTransform(progresso, [inicio - 1 / total, inicio + 0.05, 1], [0, 0, i === total - 1 ? 0 : 0.55])
  return (
    <div className="pilha__slot" style={{ '--i': i } as React.CSSProperties}>
      <m.article className="pilha__cartao" style={grade ? undefined : { scale }} data-i={i}>
        <span className="pilha__num">{item.numero}</span>
        <h3>{item.titulo}</h3>
        <p>{item.texto}</p>
        {!grade && <m.span className="pilha__sombra" style={{ '--s': sombra } as never} aria-hidden="true" />}
      </m.article>
    </div>
  )
}

export function ProcessoPilha() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.3', 'end end'] })
  // desktop: grade 2x2 com hover; mobile: pilha sticky
  const grade = useMediaQuery('(min-width: 1024px)')
  if (!processo.itens.length) return null
  return (
    <section id="processo" className="secao processo container" aria-labelledby="processo-titulo">
      <p className="rotulo">{processo.rotulo}</p>
      <Reveal>
        <h2 id="processo-titulo" className="titulo-secao">{processo.titulo}</h2>
      </Reveal>
      <div ref={ref} className="pilha">
        {processo.itens.map((item, i) => (
          <Cartao key={item.numero} i={i} total={processo.itens.length} progresso={scrollYProgress} item={item} grade={grade} />
        ))}
      </div>
    </section>
  )
}
