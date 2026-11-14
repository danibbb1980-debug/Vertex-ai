import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { agendarCanal } from '../lib/links'

/**
 * Linha do tempo vertical com números grandes e progresso ao rolar.
 * Inspirada no "Scroll animated timeline" (21st.dev, ibrandify) — reescrita:
 * só transform (scaleY) no fio de progresso, sem cartões.
 */
export function ComoFunciona() {
  const lista = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 70%', 'end 60%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  const etapas = [
    {
      titulo: 'Contato e agendamento',
      texto: `Você escolhe um horário de preferência pelo ${agendarCanal()}. A equipe confirma a disponibilidade.`,
    },
    {
      titulo: 'Avaliação individual',
      texto: 'Conversa sobre o que você procura e análise das características do seu rosto e da sua pele.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto: 'Quando há indicação, você recebe um plano com as etapas, os cuidados e o que esperar de cada uma.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'As etapas seguintes são acompanhadas conforme o plano combinado com você.',
    },
  ]

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="bg-osso py-24 md:py-36">
      <div className="container-b grid gap-14 md:grid-cols-12">
        <header className="md:col-span-5">
          <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
            <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
            Como funciona
          </p>
          <h2 id="como-titulo" className="titulo mt-6 text-[clamp(2.4rem,5.4vw,4.25rem)]">
            Do primeiro contato ao <span className="enfase">acompanhamento</span>.
          </h2>
        </header>

        <ol ref={lista} className="relative md:col-span-7 md:col-start-6">
          <span aria-hidden="true" className="absolute bottom-0 left-[1.5rem] top-0 w-px bg-filete md:left-[3.25rem]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progresso }}
            className="absolute bottom-0 left-[1.5rem] top-0 w-px origin-top bg-champanhe-escuro md:left-[3.25rem]"
          />
          {etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[3rem_1fr] gap-x-6 pb-16 last:pb-0 md:grid-cols-[6.5rem_1fr] md:gap-x-10">
              <div className="relative flex justify-center bg-osso py-1">
                <motion.span
                  aria-hidden="true"
                  className="titulo num text-[2.25rem] leading-none md:text-[4.5rem]"
                  initial={{ color: '#8A8178' }}
                  whileInView={{ color: '#76603F' }}
                  viewport={{ once: true, margin: '0px 0px -40% 0px' }}
                  transition={{ duration: 0.6 }}
                >
                  {i + 1}
                </motion.span>
              </div>
              <div className="pt-1 md:pt-3">
                <h3 className="text-[1.5rem] font-normal leading-snug tracking-[-0.01em] md:text-[1.875rem]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.titulo}
                </h3>
                <p className="mt-3 max-w-md text-pedra">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
