import { useId, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { CONFIG } from '../config'
import { enderecoLinha } from '../lib/contato'
import { horariosAgrupados } from '../lib/horarios'
import { Reveal, SectionTitle } from './ui'

function listaHumana(itens: string[]) {
  if (itens.length <= 1) return itens.join('')
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

export function perguntas() {
  const at = CONFIG.atendimentos.map((a) => a.nome.toLowerCase())
  const h = horariosAgrupados()
    .map((g) => `${g.dias}: ${g.aberto ? g.texto : 'fechado'}`)
    .join('. ')
  const out: { q: string; a: string }[] = [
    {
      q: 'Preciso agendar antes de ir?',
      a: 'Sim, é recomendado marcar hora. Assim a agenda se organiza e você é atendido no horário combinado. O agendamento pode ser solicitado pelo WhatsApp ou pelo telefone.',
    },
    {
      q: 'Como é a primeira avaliação?',
      a: 'De forma geral, é uma conversa seguida de exame clínico. O dentista ouve o que você sente e o que deseja, examina a boca e, se for preciso, solicita exames complementares. Depois, explica as opções possíveis para o seu caso.',
    },
  ]
  if (at.length)
    out.push({
      q: 'Quais atendimentos a clínica oferece?',
      a: `A clínica tem atendimento em ${listaHumana(at)}. A indicação de cada tratamento depende de avaliação individual.`,
    })
  out.push(
    { q: 'Qual é o horário de atendimento?', a: `${h}. ${CONFIG.avisoHorarios}` },
    { q: 'Onde fica a clínica?', a: `${enderecoLinha()}. O botão "Como chegar", na seção de contato, abre a localização no Google Maps.` },
  )
  if (CONFIG.pagamentos.length)
    out.push({
      q: 'Quais formas de pagamento são aceitas?',
      a: `${listaHumana(CONFIG.pagamentos)}. Para outras dúvidas sobre pagamento, fale com a equipe pelo WhatsApp.`,
    })
  out.push(
    {
      q: 'O que levar na primeira consulta?',
      a: 'De forma geral: um documento com foto, exames ou radiografias anteriores, se você tiver, e a lista de medicamentos que usa. Se tiver dúvida, pergunte à equipe ao agendar.',
    },
    {
      q: 'A clínica tem acessibilidade?',
      a: 'Há assento e banheiro com acessibilidade para cadeirantes, além de banheiro de gênero neutro. Se precisar de alguma orientação para a sua visita, avise a equipe ao agendar.',
    },
    {
      q: 'O formulário do site já marca a consulta?',
      a: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp da clínica. A equipe responde e confirma a disponibilidade do horário.',
    },
  )
  return out
}

/** Acordeão acessível (adaptado de "FAQ Accordion Reveal"): botões com aria-expanded, painéis rotulados. */
export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0)
  const reduce = useReducedMotion()
  const base = useId()
  const lista = perguntas()
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="bg-mist py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionTitle
          id="t-duvidas"
          eyebrow="Dúvidas frequentes"
          titulo="Perguntas que"
          enfase="chegam"
          depois=" até nós."
          intro="Respostas gerais. Para o seu caso, a orientação vem na avaliação."
        />
        <Reveal>
          <ul className="space-y-3">
            {lista.map((it, i) => {
              const open = aberto === i
              const bid = `${base}-b${i}`
              const pid = `${base}-p${i}`
              return (
                <li key={it.q} className={`rounded-2xl bg-white ring-1 transition-shadow duration-300 ${open ? 'shadow-soft ring-aqua/50' : 'ring-line'}`}>
                  <h3 className="!font-sans !text-[1.05rem] !tracking-normal">
                    <button
                      id={bid}
                      type="button"
                      aria-expanded={open}
                      aria-controls={pid}
                      onClick={() => setAberto(open ? null : i)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-semibold text-navy sm:px-6"
                    >
                      {it.q}
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-300 ${
                          open ? 'rotate-45 bg-aqua-ink text-white' : 'bg-mist text-navy'
                        }`}
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <m.div
                        id={pid}
                        role="region"
                        className="anim"
                        aria-labelledby={bid}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-6 sm:px-6">{it.a}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
