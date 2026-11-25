import { useEffect, useRef, useState } from 'react'
import { animate, m, useInView } from 'motion/react'
import { config } from '../config'
import { dur, ease } from '../motion/tokens'
import { useReducedMotion } from '../motion/useReducedMotion'

const DISPOSITIVOS = [
  { id: 'desktop', nome: 'Desktop' },
  { id: 'tablet', nome: 'Tablet' },
  { id: 'celular', nome: 'Celular' },
] as const
type Disp = (typeof DISPOSITIVOS)[number]['id']

export function SeletorDispositivo() {
  const { seletorDispositivo: s } = config
  const [atual, setAtual] = useState<Disp>('desktop')
  const [tocou, setTocou] = useState(false)
  const secaoRef = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const visivel = useInView(secaoRef, { amount: 0.4 })
  const reduzido = useReducedMotion()

  // Contagem 0 → numeral, uma vez.
  const contou = useRef(false)
  useEffect(() => {
    if (!visivel || contou.current || !numRef.current) return
    contou.current = true
    if (reduzido) return
    const el = numRef.current
    const ctrl = animate(0, s.numeral, {
      duration: dur.longa,
      ease: ease.outExpo,
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    })
    return () => ctrl.stop()
  }, [visivel, reduzido, s.numeral])

  // Troca automática a cada 3s enquanto visível e sem interação.
  useEffect(() => {
    if (!visivel || tocou || reduzido) return
    const id = window.setInterval(() => {
      setAtual((a) => DISPOSITIVOS[(DISPOSITIVOS.findIndex((d) => d.id === a) + 1) % DISPOSITIVOS.length].id)
    }, 3000)
    return () => window.clearInterval(id)
  }, [visivel, tocou, reduzido])

  const transicao = { layout: { duration: dur.morph, ease: ease.inOut } }

  return (
    <section ref={secaoRef} id="telas" className="secao telas container" aria-labelledby="telas-titulo">
      <p className="rotulo">{s.rotulo}</p>
      <h2 id="telas-titulo" className="telas__titulo">
        <span ref={numRef} className="telas__numeral">{s.numeral}</span>
        <span className="telas__texto-titulo">{s.titulo}</span>
      </h2>
      <p className="texto-corpo telas__texto">{s.texto}</p>

      <div className="chips" role="group" aria-label="Ver a página em">
        {DISPOSITIVOS.map((d) => (
          <button
            key={d.id}
            className={`chip ${atual === d.id ? 'chip--ativo' : ''}`}
            aria-pressed={atual === d.id}
            onClick={() => {
              setTocou(true)
              setAtual(d.id)
            }}
          >
            {d.nome}
          </button>
        ))}
      </div>

      <div className="telas__palco">
        <m.div layout transition={transicao} className={`dispositivo dispositivo--${atual}`} style={{ borderRadius: atual === 'desktop' ? 14 : atual === 'tablet' ? 22 : 30 }}>
          <m.div layout transition={transicao} className="dispositivo__tela">
            <m.div layout="position" transition={transicao} className="d-nav" />
            <m.div layout transition={transicao} className="d-corpo">
              <m.i layout transition={transicao} className="d-t1" />
              <m.i layout transition={transicao} className="d-t2" />
              <m.i layout transition={transicao} className="d-img" />
              <m.i layout transition={transicao} className="d-p" />
              <m.i layout transition={transicao} className="d-p d-p--curto" />
            </m.div>
            <m.span layout="position" transition={transicao} className="d-whats" />
          </m.div>
        </m.div>
        <p className="rotulo telas__legenda">{DISPOSITIVOS.find((d) => d.id === atual)?.nome}</p>
      </div>
    </section>
  )
}
