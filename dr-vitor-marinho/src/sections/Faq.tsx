import { useId, useState } from 'react'
import { CONFIG, enderecoLinha } from '../config'
import { resumoHorarios } from '../lib/horarios'
import { SectionHeading } from '../components/SectionHeading'
import { IconPlus } from '../components/Icons'
import { cn } from '../lib/cn'

const horas = () =>
  resumoHorarios()
    .filter((h) => h.horas !== 'Fechado')
    .map((h) => `${h.dias.toLowerCase()}, das ${h.horas}`)
    .join('; ')

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Como funciona a avaliação?',
    a: `É a primeira consulta. O ${CONFIG.nomeCurto} conversa sobre o que você sente e o que deseja, examina os dentes e explica o que foi observado. Em seguida, apresenta as possibilidades de tratamento e responde às suas dúvidas. Exames complementares podem ser pedidos quando necessário.`,
  },
  {
    q: 'O que é Dentística?',
    a: 'É a área da odontologia dedicada à restauração dos dentes, para devolver forma, função e aparência. Inclui, por exemplo, as restaurações e procedimentos de estética dental.',
  },
  {
    q: 'O que são restaurações diretas?',
    a: 'De forma geral, são restaurações feitas e modeladas diretamente no dente, no consultório, sem etapa de laboratório. São usadas para recuperar dentes com cárie, fratura ou desgaste. O material e a técnica dependem de cada caso.',
  },
  {
    q: 'O que é uma prótese fixa?',
    a: 'É uma prótese cimentada sobre dentes preparados, como coroas e pontes, que o paciente não remove. Serve para recuperar estrutura perdida ou repor dentes ausentes. A indicação é definida na avaliação.',
  },
  {
    q: 'Como funciona uma prótese sobre implante?',
    a: 'De forma geral, o implante funciona como uma base fixada no osso, e sobre ele é instalada a prótese, que pode ser uma coroa, uma ponte ou uma prótese que repõe vários dentes. Cada etapa depende da avaliação individual.',
  },
  {
    q: 'Qual a diferença entre prótese removível e total?',
    a: 'As duas são colocadas e retiradas pelo próprio paciente. A removível repõe alguns dentes e se apoia nos que permanecem. A total, conhecida como dentadura, repõe todos os dentes de uma arcada. Qual delas faz sentido para você é definido na avaliação.',
  },
  {
    q: 'Como agendar?',
    a: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário desta página, que monta a mensagem para você. A equipe confirma o dia e o horário disponíveis.`,
  },
  {
    q: 'Onde fica e quais os horários?',
    a: `${enderecoLinha()}. Atendimento com agendamento: ${horas()}. ${CONFIG.observacaoHorarios}`,
  },
  {
    q: 'Há estacionamento?',
    a: 'Sim. Há estacionamento descoberto gratuito e vagas gratuitas na rua.',
  },
  {
    q: 'Quais as formas de pagamento?',
    a: `${CONFIG.estrutura.pagamentos.join(', ').replace(/, ([^,]*)$/, ' e $1')}. Para outras dúvidas, fale com a equipe pelo WhatsApp.`,
  },
]

function Item({ q, a, open, onToggle, n }: { q: string; a: string; open: boolean; onToggle: () => void; n: number }) {
  const id = useId()
  return (
    <li className="border-b border-ink/15">
      <h3 className="font-sans">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={onToggle}
          className="group flex min-h-16 w-full items-center gap-5 py-6 text-left"
        >
          <span className="hidden w-8 shrink-0 font-display text-sm italic text-teal-deep sm:block">{String(n).padStart(2, '0')}</span>
          <span className="flex-1 font-display text-[1.3rem] leading-snug text-ink transition-colors group-hover:text-teal-deep sm:text-[1.5rem]">{q}</span>
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex size-10 shrink-0 items-center justify-center border transition-[background-color,color,border-color] duration-500',
              open ? 'border-teal-deep bg-teal-deep text-paper' : 'border-ink/20 text-ink',
            )}
          >
            <IconPlus className={cn('size-4 transition-transform duration-500', open && 'rotate-45')} />
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!open}>
        <p className="faq-answer max-w-2xl pb-8 text-[1.02rem] leading-relaxed text-ink-soft sm:pl-[3.25rem]"
            >
          {a}
        </p>
      </div>
    </li>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="duvidas" aria-labelledby="titulo-faq" className="relative bg-ivory-2/70 py-24 lg:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <SectionHeading id="titulo-faq" label="Dúvidas frequentes" title="Perguntas que *costumam* surgir.">
              <p>Respostas gerais e informativas. As particularidades de cada caso são conversadas na avaliação.</p>
            </SectionHeading>
          </div>
        </div>
        <ul className="border-t border-ink/15 lg:col-span-8">
          {FAQ.map((f, i) => (
            <Item key={f.q} n={i + 1} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
