import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CONFIG, temWhatsapp, waLink } from '../config'
import { IconeInstagram, IconeWhatsapp } from './Icones'

const ARCOS = [
  'M20 600 V300 A280 280 0 0 1 580 300 V600',
  'M70 600 V320 A230 230 0 0 1 530 320 V600',
  'M120 600 V350 A180 180 0 0 1 480 350 V600',
  'M170 600 V390 A130 130 0 0 1 430 390 V600',
]

export function CtaFinal() {
  const reduz = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const visto = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  return (
    <section aria-labelledby="titulo-cta" className="no-escuro relative overflow-hidden bg-cafe-fundo text-creme">
      <div ref={ref} className="mx-auto grid max-w-[1320px] items-end gap-12 px-5 pt-24 sm:px-8 lg:grid-cols-12 lg:pt-36">
        <div className="pb-20 lg:col-span-7 lg:pb-36">
          <h2 id="titulo-cta" className="text-[clamp(2.8rem,8vw,6rem)] leading-[0.95]">
            Sua avaliação é o primeiro <em className="not-italic text-caramelo">passo</em>.
          </h2>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
            {temWhatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-caramelo">
                <IconeWhatsapp />
                Agendar pelo WhatsApp
              </a>
            )}
            <a href="#agendar" className="botao botao-linha-claro">
              Solicitar agendamento
            </a>
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-linha-claro">
                <IconeInstagram />
                Ver no Instagram
              </a>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 600 600"
          aria-hidden="true"
          className="-mb-px mx-auto w-full max-w-[34rem] lg:col-span-5"
        >
          {ARCOS.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#D7A675"
              strokeWidth={1.4}
              initial={reduz ? false : { pathLength: 0 }}
              animate={visto || reduz ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: i * 0.18 }}
            />
          ))}
        </svg>
      </div>
    </section>
  )
}
