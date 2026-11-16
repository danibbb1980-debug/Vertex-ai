/**
 * Adaptado de "Scroll animated timeline" (21st.dev, @ibrandify): linha vertical que se preenche ao rolar
 * e marcos que se ativam quando a linha os alcança. Adaptações: progresso por transform (scaleY) com
 * motion/useScroll em vez de height + listener manual, numerais grandes em serifa, layout em coluna
 * deslocada, sem cartões, e estado estático com prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from 'react'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { CONFIG } from '../config'
import { Enfase } from './ui'

const etapas = [
  {
    titulo: 'Você escolhe o atendimento e o horário.',
    texto: 'Pelo WhatsApp ou pelo formulário deste site, com o dia e o horário que preferir.',
  },
  {
    titulo: 'A equipe confirma a disponibilidade pelo WhatsApp.',
    texto: 'O horário fica reservado depois dessa confirmação.',
  },
  {
    titulo: 'Atendimento no endereço combinado.',
    texto: `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}.`,
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [ativo, setAtivo] = useState(reduzir ? etapas.length : 0)
  useEffect(() => {
    if (reduzir) setAtivo(etapas.length)
  }, [reduzir])
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduzir) setAtivo(Math.min(etapas.length, Math.floor(v * etapas.length + 0.35)))
  })

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="border-t border-fio bg-areia-2">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-14 px-5 py-24 sm:px-8 lg:py-36">
        <div className="col-span-12 lg:col-span-5">
          <p className="rotulo text-terracota-escuro">Como funciona</p>
          <h2 id="titulo-como" className="mt-6 text-[clamp(2.4rem,5vw,3.9rem)] tracking-[-0.03em]">
            <Enfase texto="Do primeiro contato ao *atendimento*." />
          </h2>
        </div>
        <ol ref={ref} className="relative col-span-12 lg:col-span-6 lg:col-start-7">
          <span className="absolute bottom-3 left-[0.5rem] top-3 w-px bg-fio" aria-hidden="true" />
          <m.span
            className="absolute bottom-3 left-[0.5rem] top-3 w-px origin-top bg-terracota-escuro"
            style={{ scaleY: reduzir ? 1 : progresso }}
            aria-hidden="true"
          />
          {etapas.map((e, i) => {
            const on = ativo > i
            return (
              <li key={i} className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-14 pl-10 last:pb-0 sm:pl-14">
                <span
                  aria-hidden="true"
                  className={`absolute left-[0.5rem] top-3 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border transition-colors duration-500 ${
                    on ? 'border-terracota-escuro bg-terracota-escuro' : 'border-grafite-2 bg-areia-2'
                  }`}
                />
                <span
                  className={`num font-display text-[3.4rem] leading-[0.85] tracking-[-0.04em] transition-colors duration-500 sm:text-[4.6rem] ${
                    on ? 'text-grafite' : 'text-apagado'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="text-[1.5rem] leading-[1.15] tracking-[-0.015em] sm:text-[1.75rem]">{e.titulo}</h3>
                  <p className="mt-3 max-w-[40ch] text-grafite-2">{e.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
