import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { CONFIG } from '../config'
import { whatsappLink } from '../lib/links'
import { Botao, CabecalhoSecao, IconWhatsApp, Pendente } from './ui'

const etapas = [
  {
    titulo: 'Contato pelo WhatsApp',
    texto:
      'Uma mensagem para apresentar o caso, tirar dúvidas e alinhar o que o laboratório precisa receber. A conversa é direta com o laboratório.',
  },
  {
    titulo: 'Envio do caso',
    texto:
      'Moldagem ou escaneamento, com a prescrição do trabalho, conforme combinado com o laboratório. Registros e referências ajudam a orientar cada etapa.',
    // CONFIRMAR COM O LABORATÓRIO: logística de retirada e entrega
    pendente: 'Logística de retirada e entrega',
  },
  {
    titulo: 'Confecção',
    texto:
      'O trabalho é executado na bancada a partir do modelo, dos registros e da prescrição enviados, etapa por etapa.',
  },
  {
    titulo: 'Entrega e ajustes',
    texto:
      'A peça volta ao consultório para a prova. Eventuais ajustes são alinhados com o dentista responsável pelo caso.',
    // CONFIRMAR COM O LABORATÓRIO: prazos
    pendente: 'Prazos por tipo de trabalho',
  },
]

/**
 * Linha do tempo com progresso ao rolar (padrão "scroll timeline", adaptado).
 * Com reduced-motion a linha aparece inteira, sem animação.
 */
export function ComoEnviar() {
  const ref = useRef<HTMLOListElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="como-enviar" aria-labelledby="titulo-como-enviar" className="milimetrado border-y border-linha bg-marfim py-24 sm:py-28 lg:py-36">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--faixa)+7rem)]">
            <CabecalhoSecao
              id="titulo-como-enviar"
              numero="02"
              rotulo="Como enviar um caso"
              titulo={
                <>
                  Quatro etapas, <em className="font-normal text-petroleo-700">uma conversa</em> por vez.
                </>
              }
              texto="Prazos e logística são combinados caso a caso, antes do início do trabalho."
            />
            <div className="mt-9">
              <Botao href={whatsappLink(CONFIG.mensagens.enviarCaso)} externoLink icone={<IconWhatsApp size={18} />}>
                Enviar um caso
              </Botao>
            </div>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-7">
          {/* trilho e progresso */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.4375rem] w-px bg-linha" />
          <m.span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[1.4375rem] w-px origin-top bg-petroleo-700"
            style={{ scaleY: reduzir ? 1 : progresso }}
          />
          {etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[3rem_1fr] gap-6 pb-14 last:pb-0 sm:gap-8">
              <span
                className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-full border border-petroleo-700/40 bg-perola font-serif text-[1.0625rem] text-petroleo-700 tabular-nums"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[1.625rem] leading-tight font-light text-petroleo-900 sm:text-[1.875rem]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.titulo}
                </h3>
                <p className="mt-3 max-w-lg text-[1rem] leading-relaxed text-cinza">{e.texto}</p>
                {e.pendente && (
                  <p className="mt-4 text-[0.8125rem]">
                    <Pendente>{e.pendente}</Pendente>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
