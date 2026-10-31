import { m, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'
import { CONFIG, enderecoCompleto } from '../config'
import { resumoHorarios } from '../lib/horarios'
import { waLink } from '../lib/whatsapp'
import { IconArrow, IconPlus } from '../components/Icons'
import { Reveal } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

const listar = (itens: string[]) =>
  itens.length <= 1 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`

function perguntas() {
  const horarios = resumoHorarios()
    .map((h) => `${h.dias}: ${h.horas.toLowerCase() === 'fechado' ? 'fechado' : `das ${h.horas.replace(' às ', ' às ')}`}`)
    .join('. ')
  const atend = CONFIG.atendimentos.map((a) => a.nome.toLowerCase())
  const lista: { q: string; a: string }[] = [
    {
      q: 'Preciso agendar antes de ir?',
      a: 'Sim, é recomendado marcar horário. O atendimento é feito com hora marcada, o que permite dedicar o tempo necessário a cada pessoa. Você pode solicitar pelo WhatsApp ou pelo formulário deste site, e a equipe confirma a disponibilidade.',
    },
    {
      q: 'Como é a primeira avaliação?',
      a: 'É uma conversa sobre o que você procura, seguida do exame clínico. Se forem necessários exames complementares, isso é explicado na consulta. Ao final, você recebe orientações sobre os caminhos possíveis para o seu caso.',
    },
  ]
  if (atend.length)
    lista.push({
      q: 'Quais atendimentos a clínica oferece?',
      a: `A clínica atende ${listar(atend)}. A indicação de cada tratamento depende de avaliação individual.`,
    })
  if (horarios)
    lista.push({
      q: 'Quais são os horários de atendimento?',
      a: `${horarios}. ${CONFIG.avisoHorarios}`,
    })
  lista.push({ q: 'Onde fica a clínica?', a: `${enderecoCompleto()}. Na seção de contato há o link para abrir a rota no Google Maps.` })
  if (CONFIG.acessibilidade.length)
    lista.push({
      q: 'A clínica tem acessibilidade?',
      a: 'Sim. A clínica tem entrada, assento e banheiro acessíveis para pessoas em cadeira de rodas. Se precisar de alguma orientação específica para a visita, fale com a equipe antes da consulta.',
    })
  if (CONFIG.pagamentos.length)
    lista.push({
      q: 'Quais são as formas de pagamento?',
      a: `${listar(CONFIG.pagamentos.map((p, i) => (i === 0 ? p : p.charAt(0).toLowerCase() + p.slice(1))))}. Outras dúvidas sobre pagamento podem ser tiradas diretamente com a equipe.`,
    })
  lista.push(
    {
      q: 'O que levar na primeira consulta?',
      a: 'De forma geral, vale levar um documento com foto, exames ou radiografias recentes, se tiver, e a lista de medicamentos que usa. Em caso de dúvida, a equipe orienta pelo WhatsApp.',
    },
    {
      q: 'Como funciona a solicitação de horário pelo site?',
      a: 'O formulário monta uma mensagem com o atendimento, o dia e o horário que você prefere e abre o WhatsApp da clínica. É só enviar. Os horários escolhidos são preferências: a equipe responde para confirmar a disponibilidade. O site não guarda nenhum dado.',
    },
  )
  return lista
}

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  const reduce = useReducedMotion()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={onToggle}
          className="group flex min-h-[4.5rem] w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.375rem] leading-snug text-espresso md:text-[1.625rem]"
        >
          <span>{q}</span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-soft)] ${
              open ? 'rotate-45 border-copper bg-copper-light/30 text-espresso' : 'border-line text-copper-ink group-hover:border-copper'
            }`}
            aria-hidden
          >
            <IconPlus size={16} />
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!open}>
        <m.p
          key={String(open)}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl pb-7 pr-14 text-ink"
        >
          {a}
        </m.p>
      </div>
    </li>
  )
}

export function Duvidas() {
  const lista = perguntas()
  const [aberto, setAberto] = useState<number | null>(0)
  const wa = waLink('Olá! Vi o site da Nabak Odontologia e tenho uma dúvida.')
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-cream py-24 md:py-36">
      <div className="container-n grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <SectionHead eyebrow="Dúvidas frequentes" id="duvidas-titulo" title="Dúvidas *comuns* antes da primeira consulta.">
            <p>Respostas gerais e informativas. Questões sobre o seu caso são tratadas na avaliação.</p>
          </SectionHead>
          {wa && (
            <Reveal delay={0.2}>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6">
                Enviar outra dúvida pelo WhatsApp <IconArrow />
              </a>
            </Reveal>
          )}
        </div>
        <Reveal>
          <ul className="border-t border-line">
            {lista.map((it, i) => (
              <Item key={it.q} {...it} open={aberto === i} onToggle={() => setAberto(aberto === i ? null : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
