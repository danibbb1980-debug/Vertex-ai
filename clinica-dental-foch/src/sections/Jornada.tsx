import { useRef, useState, type CSSProperties } from 'react'
import { Accessibility, CalendarClock, ChevronDown, Clock, CreditCard, Nfc, Wallet } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { enderecoLinha } from '../lib/whatsapp'
import { resumoHorarios } from '../lib/horarios'
import { moverLuz, useProgressoRolagem } from '../lib/hooks'
import { Cabecalho } from '../components/Titulo'

const atraso = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/* ---------------- Como funciona: linha do tempo com progresso ao rolar ---------------- */
const ETAPAS = [
  {
    titulo: 'Contato pelo WhatsApp e agendamento',
    texto: 'Você manda uma mensagem, conta o que procura e combina com a equipe o dia e o horário que funcionam para você.',
  },
  {
    titulo: 'Avaliação e escuta',
    texto: 'Na consulta, a conversa vem primeiro: histórico, incômodos e expectativas. Depois, uma avaliação cuidadosa.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'As possibilidades são apresentadas de forma simples, com tempo para perguntas. A decisão é sempre sua.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Retornos combinados para acompanhar a evolução e manter o cuidado em dia.',
  },
]

export function ComoFunciona() {
  const linha = useRef<HTMLSpanElement>(null)
  const [ativo, setAtivo] = useState(-1)
  const ref = useProgressoRolagem<HTMLOListElement>(
    (v) => {
      if (linha.current) linha.current.style.transform = `scaleY(${v})`
      setAtivo(v <= 0.02 ? -1 : Math.min(ETAPAS.length - 1, Math.floor(v * ETAPAS.length + 0.2)))
    },
    { modo: 'passagem', inicio: 0.75, fim: 0.55 },
  )

  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="bg-ice py-20 sm:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho
            id="titulo-como-funciona"
            rotulo="Como funciona"
            titulo="Do primeiro contato ao *acompanhamento*."
            intro={<p>Quatro passos simples, sempre com hora marcada e conversa clara.</p>}
          />
        </div>
        <ol ref={ref} className="relative">
          {/* trilho e progresso */}
          <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-teal-800/15" />
          <span
            ref={linha}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top scale-y-0 bg-teal-600 transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
          {ETAPAS.map((e, i) => {
            const feito = i <= ativo
            return (
              <li key={e.titulo} className="relative pb-12 pl-20 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border font-display text-lg transition-[background-color,color,border-color,transform] duration-500 ${
                    feito
                      ? 'scale-105 border-teal-700 bg-teal-800 text-white'
                      : 'border-teal-800/20 bg-white text-teal-800'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="reveal" style={atraso(80)}>
                  <p className="rotulo text-teal-700">Etapa {i + 1}</p>
                  <h3 className="mt-2 text-2xl sm:text-[1.75rem]">{e.titulo}</h3>
                  <p className="mt-3 max-w-lg text-ink-soft">{e.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Estrutura e conforto ---------------- */
export function Estrutura() {
  const { unidade } = useUnidade()
  const horarios = resumoHorarios(unidade.horarios)
  const pagIcones = [CreditCard, Wallet, Nfc]
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="bg-sand py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho
          id="titulo-estrutura"
          rotulo="Estrutura e conforto"
          titulo="Detalhes que facilitam a sua *visita*."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {CONFIG.estrutura.acessibilidade.length > 0 && (
            <article onPointerMove={moverLuz} className="cartao reveal p-7 sm:p-8 lg:col-span-3">
              <span className="icone-circulo">
                <Accessibility aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <h3 className="mt-6 text-2xl">Acessibilidade</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {CONFIG.estrutura.acessibilidade.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                    {a}
                  </li>
                ))}
              </ul>
            </article>
          )}
          {CONFIG.estrutura.horaMarcada && (
            <article onPointerMove={moverLuz} className="cartao reveal p-7 sm:p-8 lg:col-span-3" style={atraso(100)}>
              <span className="icone-circulo">
                <CalendarClock aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <h3 className="mt-6 text-2xl">Hora marcada</h3>
              <p className="mt-4 text-ink-soft">
                O atendimento é feito com horário agendado, e a clínica recomenda marcar antes de vir. Assim, a agenda
                se organiza e a sua visita também.
              </p>
            </article>
          )}
          {CONFIG.estrutura.pagamentos.length > 0 && (
            <article onPointerMove={moverLuz} className="cartao reveal p-7 sm:p-8 lg:col-span-4">
              <h3 className="text-2xl">Formas de pagamento</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {CONFIG.estrutura.pagamentos.map((p, i) => {
                  const Icone = pagIcones[i % pagIcones.length]
                  return (
                    <li key={p} className="flex items-center gap-3 rounded-2xl bg-ice px-4 py-4 text-[0.95rem] text-ink">
                      <Icone aria-hidden="true" size={20} strokeWidth={1.7} className="shrink-0 text-teal-700" />
                      {p}
                    </li>
                  )
                })}
              </ul>
            </article>
          )}
          <article className="reveal relative overflow-hidden rounded-[var(--radius-card)] bg-teal-800 p-7 text-white sm:p-8 lg:col-span-2" style={atraso(100)}>
            <Clock aria-hidden="true" size={22} strokeWidth={1.7} className="text-aqua-300" />
            <h3 className="mt-5 text-2xl text-white">Horários</h3>
            <dl className="mt-4 space-y-2">
              {horarios.map((h) => (
                <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 border-b border-white/10 pb-2 last:border-0">
                  <dt className="text-aqua-100">{h.dias}</dt>
                  <dd className="font-semibold">{h.horario}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-aqua-100/85">{unidade.observacaoHorarios}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Dúvidas frequentes ---------------- */
export function Faq() {
  const { unidade } = useUnidade()
  const h = resumoHorarios(unidade.horarios)
    .map((x) => `${x.dias}: ${x.horario.toLowerCase()}`)
    .join('; ')
  const itens: { p: string; r: string }[] = [
    {
      p: 'Como funciona a avaliação?',
      r: 'É o primeiro passo. A conversa começa pelo seu histórico e pelo que você procura; em seguida vem a avaliação individual. A partir dela, as possibilidades são explicadas com clareza, e você decide com calma.',
    },
    {
      p: 'Preciso agendar?',
      r: 'Sim, é recomendado. O atendimento é feito com hora marcada, o que ajuda a organizar a agenda da clínica e o seu dia.',
    },
    {
      p: 'A clínica atende crianças e adultos?',
      r: 'A proposta da Clínica Dental é a odontologia para toda a família. Fale com a equipe pelo WhatsApp para combinar o atendimento de cada pessoa da casa.',
    },
    {
      p: 'Como agendar?',
      r: `Pelo WhatsApp ${unidade.telefoneExibicao} ou pelo formulário desta página, que monta a mensagem para você. A equipe confirma a disponibilidade de dia e horário.`,
    },
    { p: 'Onde fica?', r: `${enderecoLinha(unidade)}.` },
    { p: 'Quais são os horários?', r: `${h}. ${unidade.observacaoHorarios}` },
    CONFIG.estrutura.pagamentos.length > 0 && {
      p: 'Quais são as formas de pagamento?',
      r: `${CONFIG.estrutura.pagamentos.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`,
    },
    CONFIG.estrutura.acessibilidade.length > 0 && {
      p: 'Há acessibilidade?',
      r: 'Sim. A clínica tem entrada e banheiro acessíveis para cadeirantes.',
    },
    {
      p: 'O que levar na primeira consulta?',
      r: 'De forma geral, um documento com foto e, se tiver, exames recentes, informações de tratamentos anteriores e a lista de medicamentos em uso. Na dúvida, pergunte à equipe pelo WhatsApp.',
    },
    {
      p: 'Preciso informar dados de saúde pelo site?',
      r: 'Não. O formulário apenas monta uma mensagem de WhatsApp e o site não guarda nenhum dado. Questões de saúde são conversadas com calma na consulta.',
    },
  ].filter(Boolean) as { p: string; r: string }[]

  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-white py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho
            id="titulo-duvidas"
            rotulo="Dúvidas frequentes"
            titulo="Perguntas que *sempre* aparecem."
            intro={<p>Não encontrou a sua? Pergunte pelo WhatsApp. A equipe responde com prazer.</p>}
          />
        </div>
        <div className="reveal border-t border-teal-800/12" style={atraso(120)}>
          {itens.map((it, i) => (
            <details key={it.p} name="faq" className="faq-item group border-b border-teal-800/12" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-xl text-teal-800 transition-colors hover:text-teal-600 sm:text-[1.4rem]">
                {it.p}
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-teal-800/15 transition-colors group-open:border-teal-700 group-open:bg-teal-800 group-open:text-white">
                  <ChevronDown aria-hidden="true" size={20} className="faq-chevron" />
                </span>
              </summary>
              <div className="faq-resposta pb-6 pr-14 text-ink-soft">
                <p>{it.r}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
