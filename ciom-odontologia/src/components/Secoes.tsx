import { useId, useRef, useState } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { CONFIG, enderecoTexto } from '../config'
import { faixaHorario } from '../lib/util'
import { Reveal, SectionHead } from './Base'
import {
  IconCard,
  IconCheck,
  IconEar,
  IconHeart,
  IconParking,
  IconPlus,
  IconRestroom,
  IconSeat,
  IconWheelchair,
} from './Icons'

const ETAPAS = [
  {
    titulo: 'Contato e agendamento',
    texto: 'Você fala com a clínica pelo WhatsApp ou pelo formulário e combina um horário para a avaliação.',
  },
  {
    titulo: 'Avaliação e escuta',
    texto: 'Na consulta, a equipe ouve o que você procura, examina com calma e, se for preciso, solicita exames.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'Você conhece as opções indicadas para o seu caso, etapa por etapa, e tira suas dúvidas antes de decidir.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Durante o tratamento, as consultas de retorno acompanham cada fase do que foi planejado.',
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  if (!CONFIG.secoes.comoFunciona) return null
  return (
    <section id="como-funciona" aria-labelledby="t-como" className="sec on-dark relative isolate overflow-hidden bg-ink text-ivory">
      <div aria-hidden="true" className="blueprint-dark absolute inset-0 -z-10 opacity-80" />
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(108 171 148 / 0.18), transparent 65%)' }}
      />
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <SectionHead
              dark
              id="t-como"
              numero="04"
              rotulo="Como funciona"
              titulo={
                <>
                  Do primeiro contato ao <em>acompanhamento</em>.
                </>
              }
              intro="Quatro etapas para você saber o que esperar, sem pressa e com cada decisão explicada."
            />
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-7 lg:pt-4">
          <div aria-hidden="true" className="absolute bottom-6 left-[23px] top-6 w-px bg-ivory/15" />
          <m.div
            aria-hidden="true"
            className="absolute bottom-6 left-[23px] top-6 w-px origin-top bg-sage"
            data-anim=""
            style={{ scaleY: p }}
          />
          {ETAPAS.map((e, i) => (
            <Reveal as="li" key={e.titulo} delay={0.05} className="relative pb-12 pl-20 last:pb-0 md:pb-16">
              <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-sage/60 bg-ink font-serif text-lg italic text-sage-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="pt-1.5 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ivory">{e.titulo}</h3>
              <p className="mt-3 max-w-lg text-ivory/75">{e.texto}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

const ICONES_ACESS: Record<string, typeof IconSeat> = {
  entrada: IconWheelchair,
  assento: IconSeat,
  banheiro: IconRestroom,
  estacionamento: IconParking,
  aro: IconEar,
}

export function Acolhimento() {
  if (!CONFIG.secoes.acolhimento) return null
  const temAcess = CONFIG.acessibilidade.length > 0
  return (
    <section aria-labelledby="t-acolhimento" className="sec">
      <div className="wrap">
        <SectionHead
          id="t-acolhimento"
          numero="05"
          rotulo="Acolhimento e acessibilidade"
          titulo={
            <>
              Um lugar para <em>todo mundo</em>.
            </>
          }
        />

        {CONFIG.mostrarAcolhimento && (
          <Reveal className="relative mt-12 overflow-hidden rounded-[28px] bg-sand/70 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <blockquote className="md:col-span-8">
                <p className="font-serif text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.08] text-ink">
                  {CONFIG.acolhimento.frase.replace(/como é\.$/, '')}
                  <em className="text-sage-deep">como é.</em>
                </p>
              </blockquote>
              <ul className="flex flex-col gap-2 md:col-span-4">
                {CONFIG.acolhimento.atributos.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-full border border-ink/10 bg-ivory/80 px-4 py-2.5 text-[0.95rem] text-ink">
                    <IconHeart size={18} className="shrink-0 text-sage-deep" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {temAcess && (
            <Reveal className="rounded-[24px] border border-line bg-paper p-7 lg:col-span-2 md:p-9">
              <h3 className="eyebrow text-sage-deep">Acessibilidade</h3>
              <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {CONFIG.acessibilidade.map((a) => {
                  const I = ICONES_ACESS[a.id] ?? IconCheck
                  return (
                    <li key={a.id} className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-deep">
                        <I size={22} />
                      </span>
                      <span className="pt-2.5 text-text">{a.texto}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          )}
          <div className="grid gap-4">
            {CONFIG.estrutura.length > 0 && (
              <Reveal delay={0.06} className="rounded-[24px] border border-line bg-paper p-7">
                <h3 className="eyebrow text-sage-deep">Estrutura</h3>
                <ul className="mt-4 space-y-2.5">
                  {CONFIG.estrutura.map((e) => (
                    <li key={e} className="flex items-center gap-3 text-text">
                      <IconCheck size={18} className="shrink-0 text-sage-deep" /> {e}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {CONFIG.pagamentos.length > 0 && (
              <Reveal delay={0.12} className="rounded-[24px] border border-line bg-paper p-7">
                <h3 className="eyebrow text-sage-deep">Formas de pagamento</h3>
                <ul className="mt-4 space-y-2.5">
                  {CONFIG.pagamentos.map((e) => (
                    <li key={e} className="flex items-center gap-3 text-text">
                      <IconCard size={18} className="shrink-0 text-sage-deep" /> {e}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function faqs() {
  const semana = CONFIG.horarios.filter((h) => h.abre && h.fecha)
  const fechados = CONFIG.horarios.filter((h) => !h.abre)
  const horarioTxt =
    semana.length === 5 && semana.every((h) => faixaHorario(h) === faixaHorario(semana[0]))
      ? `De segunda a sexta, das ${faixaHorario(semana[0]).replace('–', ' às ')}.`
      : semana.map((h) => `${h.nome}: ${faixaHorario(h)}`).join('; ') + '.'
  const fechadoTxt = fechados.length ? ` ${fechados.map((h, i) => (i ? h.nome.toLowerCase() : h.nome)).join(' e ')}: fechado.` : ''
  const lista = [
    {
      q: 'Preciso agendar?',
      a: 'Sim. O atendimento é feito com hora marcada, e o agendamento é recomendado antes de ir à clínica. Você pode pedir um horário pelo WhatsApp ou pelo formulário desta página.',
    },
    {
      q: 'Como é a avaliação?',
      a: 'É o primeiro encontro com a equipe. Conversamos sobre o que você procura, fazemos o exame clínico e, se for necessário, solicitamos exames complementares. Depois, as opções indicadas são explicadas com clareza.',
    },
    {
      q: 'Quais atendimentos existem?',
      a: `${CONFIG.atendimentos.map((a) => a.nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}. A indicação de cada um depende de avaliação individual.`,
      so: CONFIG.atendimentos.length > 0,
    },
    {
      q: 'Qual a diferença entre lentes de contato dental e facetas?',
      a: 'As lentes de contato dental são mais finas e costumam ser indicadas para pequenas correções de cor e forma. As facetas são um pouco mais espessas e podem ser indicadas em casos de desgaste ou de alinhamento a corrigir. Não existe uma opção melhor que a outra: a escolha depende da avaliação.',
      so: CONFIG.atendimentos.some((a) => a.id === 'lentes-facetas'),
    },
    {
      q: 'Quando o siso costuma ser avaliado?',
      a: 'Costuma ser avaliado quando há dor ou incômodo no fundo da boca, ou quando outro profissional já indicou a extração. Só a avaliação, muitas vezes com exame de imagem, mostra se há indicação de cirurgia.',
      so: CONFIG.atendimentos.some((a) => a.id === 'siso'),
    },
    { q: 'Quais são os horários?', a: `${horarioTxt}${fechadoTxt} ${CONFIG.avisoHorario}`.trim(), so: semana.length > 0 },
    {
      q: 'Onde fica a clínica?',
      a: `${enderecoTexto()}. O botão “Como chegar”, na seção de contato, abre a rota no Google Maps.`,
    },
    {
      q: 'Há acessibilidade?',
      a: 'Sim. A clínica tem entrada, assento, banheiro e estacionamento acessíveis para cadeirantes, além de aro de indução magnética para quem usa aparelho auditivo. Na rua, o estacionamento é pago.',
      so: CONFIG.acessibilidade.length > 0,
    },
    {
      q: 'Quais são as formas de pagamento?',
      a: `${CONFIG.pagamentos.join(' e ')}. Para outras dúvidas sobre pagamento, fale com a clínica pelo WhatsApp.`,
      so: CONFIG.pagamentos.length > 0,
    },
    {
      q: 'O formulário do site já marca a consulta?',
      a: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp da clínica. A equipe confirma a disponibilidade pela conversa.',
      so: CONFIG.secoes.agendar,
    },
  ]
  return lista.filter((f) => f.so !== false)
}

function ItemFaq({ q, a, n }: { q: string; a: string; n: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-r`}
          id={`${id}-b`}
          onClick={() => setOpen((v) => !v)}
          className="group flex min-h-16 w-full items-center gap-5 py-5 text-left"
        >
          <span className="w-7 shrink-0 font-sans text-sm tabular-nums text-sage-deep">{String(n).padStart(2, '0')}</span>
          <span className="flex-1 font-serif text-[1.3rem] leading-snug text-ink md:text-[1.5rem]">{q}</span>
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,color,border-color] duration-300 ${
              open ? 'rotate-45 border-ink bg-ink text-ivory' : 'border-ink/20 text-ink group-hover:border-ink'
            }`}
          >
            <IconPlus size={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!open}>
        <p className="faq-in max-w-2xl pb-7 pl-12 text-muted">{a}</p>
      </div>
    </li>
  )
}

export function Duvidas() {
  if (!CONFIG.secoes.duvidas) return null
  const lista = faqs()
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="sec bg-shell">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <SectionHead
              id="t-duvidas"
              numero="06"
              rotulo="Dúvidas frequentes"
              titulo={
                <>
                  Perguntas que <em>costumam</em> aparecer.
                </>
              }
            />
          </div>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="border-t border-line">
            {lista.map((f, i) => (
              <ItemFaq key={f.q} q={f.q} a={f.a} n={i + 1} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

