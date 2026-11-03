import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { Revelar } from '../components/Revelar'
import { IconeCalendario, IconeConversa, IconeEscudo, IconeRelogio } from '../components/Icones'

const ETAPAS = [
  {
    icone: <IconeCalendario tamanho={22} />,
    titulo: 'Contato e agendamento',
    texto: 'Você fala com a clínica pelo WhatsApp, pelo telefone ou pelo formulário desta página e combina um horário.',
  },
  {
    icone: <IconeConversa tamanho={22} />,
    titulo: 'Avaliação e escuta',
    texto: 'A primeira consulta começa com conversa: sua história, o que você sente e as dúvidas que trouxe.',
  },
  {
    icone: <IconeEscudo tamanho={22} />,
    titulo: 'Plano explicado com clareza',
    texto: 'O dentista apresenta o que observou e os caminhos possíveis, em linguagem simples, para você decidir com informação.',
  },
  {
    icone: <IconeRelogio tamanho={22} />,
    titulo: 'Acompanhamento',
    texto: 'Os retornos seguem o ritmo indicado na avaliação, para que o cuidado continue depois da primeira consulta.',
  },
]

/** Linha do tempo com progresso ao rolar (scaleY, só transform). */
export function ComoFunciona() {
  const reduzir = useReducedMotion()
  const lista = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 75%', 'end 55%'] })
  const escala = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="sobre-claro bg-gelo py-24 lg:py-36">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <CabecalhoSecao id="titulo-como" rotulo="Como funciona" titulo="Do primeiro contato ao *acompanhamento.*">
            <p>Quatro passos simples. Sem pressa, com hora marcada e com espaço para as suas perguntas.</p>
          </CabecalhoSecao>
        </div>

        <ol ref={lista} className="relative space-y-6 pl-16 sm:pl-20">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-linha sm:left-[1.65rem]" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-menta-texto sm:left-[1.65rem]"
            style={reduzir ? undefined : { scaleY: escala }}
          />
          {ETAPAS.map((e, i) => (
            <Revelar key={e.titulo} como="li" atraso={0.05} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-16 top-1 grid size-12 place-items-center rounded-full border border-linha bg-white text-menta-texto shadow-sm sm:-left-20 sm:size-[3.3rem]"
              >
                {e.icone}
              </span>
              <div className="rounded-[1.5rem] border border-linha bg-white p-6 sm:p-8">
                <p className="rotulo text-[0.68rem] text-menta-texto">Passo {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-2xl text-tinta">{e.titulo}</h3>
                <p className="mt-3 leading-relaxed text-tinta-suave">{e.texto}</p>
              </div>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  )
}
