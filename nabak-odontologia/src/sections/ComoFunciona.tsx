import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

const ETAPAS = [
  {
    titulo: 'Contato e agendamento',
    texto: 'Você fala com a clínica pelo WhatsApp ou pelo formulário do site e combina o dia e o horário que funcionam para você.',
  },
  {
    titulo: 'Avaliação e escuta',
    texto: 'Na consulta, ouvimos o que você procura e fazemos o exame clínico com calma. Se forem necessários exames complementares, explicamos o motivo.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'Você conhece as opções indicadas para o seu caso, com as etapas apresentadas em linguagem simples, para decidir com segurança.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Durante o tratamento e depois dele, a equipe acompanha a evolução e orienta os cuidados do dia a dia.',
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="relative overflow-hidden bg-sand/45 py-24 md:py-36">
      <div className="container-n grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <SectionHead eyebrow="Como funciona" id="como-titulo" title="Do primeiro contato ao *acompanhamento*.">
            <p>Um percurso simples, em quatro etapas, para você saber o que esperar em cada momento.</p>
          </SectionHead>
        </div>

        <ol ref={ref} className="relative">
          {/* trilho e progresso */}
          <span aria-hidden className="absolute bottom-6 left-[1.4375rem] top-6 w-px bg-taupe/70 md:left-[1.9375rem]" />
          <m.span
            aria-hidden
            className="absolute bottom-6 left-[1.4375rem] top-6 w-px origin-top bg-gradient-to-b from-copper-light via-copper to-copper-ink md:left-[1.9375rem]"
            style={{ scaleY: reduce ? 1 : scaleY }}
          />
          {ETAPAS.map((e, i) => (
            <Reveal as="li" key={e.titulo} delay={0.05} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-14 last:pb-0 md:grid-cols-[4rem_1fr] md:gap-8">
              <span className="relative z-10 flex h-[3.75rem] w-12 items-center justify-center bg-transparent md:h-20 md:w-16">
                <svg viewBox="0 0 64 80" className="absolute inset-0 h-full w-full" aria-hidden>
                  <ellipse cx="32" cy="40" rx="31" ry="39" fill="#F7F3EC" stroke="#C49A6C" strokeWidth="1" />
                </svg>
                <span className="relative font-serif text-[1.375rem] italic text-copper-ink md:text-[1.75rem]">{i + 1}</span>
              </span>
              <div className="pt-2 md:pt-4">
                <p className="eyebrow text-[0.6875rem]">Etapa {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-serif text-[1.875rem] leading-tight text-espresso md:text-[2.25rem]">{e.titulo}</h3>
                <p className="mt-3 max-w-lg text-ink">{e.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
