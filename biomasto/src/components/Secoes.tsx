import { useId, useRef, useState } from 'react'
import { m, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { FOTOS } from '../fotos'
import { acaoContato, enderecoLinha, hora } from '../lib'
import {
  IcAlerta,
  IcBroto,
  IcCalendario,
  IcConversa,
  IcFolha,
  IcMais,
  IcTelefone,
  IcWhatsapp,
  IlusBotao,
  IlusBroto,
  IlusRamo,
  Tulipa,
} from './icones'
import { CabecalhoSecao, Enfase, Revela } from './ui'

/* =========================== A CLÍNICA =========================== */

export function Clinica() {
  const equipe = CONFIG.mostrarEquipe ? CONFIG.equipe.filter((p) => p.nome && p.crm) : []
  const pilares = [
    { Icone: IcConversa, titulo: 'Avaliação individual', texto: 'Cada consulta parte da sua história e das suas dúvidas.' },
    { Icone: IcFolha, titulo: 'Conversa com clareza', texto: 'Explicações em linguagem simples, com tempo para perguntas.' },
    { Icone: IcCalendario, titulo: 'Hora marcada', texto: 'Atendimento agendado, de segunda a sexta.' },
  ]
  return (
    <section id="clinica" aria-labelledby="titulo-clinica" data-fio="clinica" className="relative py-24 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <CabecalhoSecao id="titulo-clinica" rotulo="A clínica" titulo="Um cuidado que *acompanha* você." />
          <Revela atraso={0.1}>
            <div className="mt-6 space-y-4 text-lg text-tinta-2">
              <p>
                Na {CONFIG.nome}, o atendimento em mastologia, ginecologia e obstetrícia acontece com hora marcada e
                avaliação individual. Cada consulta começa com uma conversa: o que trouxe você até aqui, sua história e
                suas dúvidas.
              </p>
              <p>
                Cada passo é explicado com clareza, para que você saia da consulta entendendo o que foi conversado e o
                que vem a seguir.
              </p>
            </div>
          </Revela>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0">
            {pilares.map((p, i) => (
              <li key={p.titulo} className="h-full">
                <Revela atraso={0.1 + i * 0.08} className="h-full border-t border-ameixa/12 pt-5 lg:grid lg:grid-cols-[2.25rem_1fr] lg:gap-x-3 lg:pb-5">
                  <p.Icone size={22} className="text-salvia-tinta lg:row-span-2 lg:mt-0.5" />
                  <h3 className="mt-3 font-sans text-[1.02rem] font-semibold tracking-normal text-ameixa lg:mt-0">{p.titulo}</h3>
                  <p className="mt-1.5 text-[0.97rem] leading-relaxed text-tinta-2">{p.texto}</p>
                </Revela>
              </li>
            ))}
          </ul>
        </div>

        {FOTOS.length > 0 ? <ComposicaoFotos /> : <ComposicaoOrnamento />}
      </div>

      <GaleriaFotos />

      {equipe.length > 0 && (
        <div className="container-site mt-20">
          <h3 className="text-2xl">Equipe</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((p) => (
              <li key={p.crm} className="rounded-3xl bg-white/70 p-6 ring-1 ring-ameixa/8">
                <p className="font-serif text-xl text-ameixa">{p.nome}</p>
                {p.area && <p className="mt-1 text-tinta-2">{p.area}</p>}
                <p className="mt-3 text-sm text-tinta-2">
                  CRM-MG {p.crm}
                  {p.rqe && <> · RQE {p.rqe}</>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function ComposicaoFotos() {
  const [a, b] = FOTOS
  return (
    <Revela className="relative pb-12 lg:pb-0">
      <div className="relative mx-auto max-w-md lg:max-w-none">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-areia ring-1 ring-ameixa/8 sombra-suave">
          <img src={a.src} alt={a.alt} loading="lazy" decoding="async" width={1170} height={768} className="h-full w-full object-cover object-[42%_50%]" />
        </figure>
        {b && (
          <figure className="absolute -bottom-12 -left-3 w-[58%] overflow-hidden rounded-[1.75rem] bg-areia ring-[6px] ring-marfim sombra-suave sm:-left-10">
            <img src={b.src} alt={b.alt} loading="lazy" decoding="async" width={1170} height={768} className="aspect-[4/3] h-full w-full object-cover" />
          </figure>
        )}
        <Tulipa className="absolute -right-2 -top-4 h-16 w-16 text-lilas-tinta sm:h-20 sm:w-20" sw={1.6} />
      </div>
    </Revela>
  )
}

/** Demais fotos (da terceira em diante), em grade simples. Sem carrossel. */
function GaleriaFotos() {
  const resto = FOTOS.slice(2)
  if (resto.length === 0) return null
  return (
    <div className="container-site mt-24 lg:mt-28">
      <ul className={`grid gap-5 ${resto.length > 1 ? 'md:grid-cols-[1.6fr_1fr]' : ''}`}>
        {resto.map((f, i) => (
          <li key={f.nome}>
            <Revela atraso={i * 0.08}>
              <figure className="group overflow-hidden rounded-[2rem] bg-areia ring-1 ring-ameixa/8">
                <div className="overflow-hidden">
                  <img
                    src={f.src}
                    alt={f.alt}
                    loading="lazy"
                    decoding="async"
                    width={1170}
                    height={768}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-suave)] group-hover:scale-[1.03] md:aspect-auto md:h-[22rem]"
                  />
                </div>
                {f.legenda && (
                  <figcaption className="flex items-center gap-3 bg-marfim px-6 py-4 text-[0.95rem] font-medium text-ameixa">
                    <span aria-hidden="true" className="h-px w-6 bg-salvia" />
                    {f.legenda}
                  </figcaption>
                )}
              </figure>
            </Revela>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ComposicaoOrnamento() {
  return (
    <Revela className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-lilas-suave" />
      <div className="absolute inset-8 rounded-full ring-1 ring-lilas/60" />
      <Tulipa className="absolute inset-[24%] text-lilas-tinta" sw={1} />
      <svg viewBox="0 0 400 120" className="absolute inset-x-0 bottom-6" aria-hidden="true">
        <path d="M10 40c40 70 120 80 180 50 70-36 120-70 200-30" fill="none" stroke="var(--color-salvia)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </Revela>
  )
}

/* =========================== ATENDIMENTOS =========================== */

const ILUS: Record<string, (p: { className?: string }) => JSX.Element> = {
  mastologia: IlusBotao,
  ginecologia: IlusRamo,
  obstetricia: IlusBroto,
}

export function Atendimentos() {
  if (CONFIG.atendimentos.length === 0) return null
  return (
    <section
      id="atendimentos"
      aria-labelledby="titulo-atendimentos"
      data-fio="atendimentos"
      className="relative bg-marfim-2 py-24 lg:py-32"
    >
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-atendimentos"
          rotulo="Atendimentos"
          titulo="Três áreas, um mesmo *cuidado*."
          texto="Atendimento em mastologia, ginecologia e obstetrícia. Em todos os casos, a indicação depende de avaliação médica individual."
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {CONFIG.atendimentos.map((a, i) => {
            const Ilus = ILUS[a.id] ?? IlusRamo
            const acao = acaoContato({
              mensagem: CONFIG.mensagens.porAtendimento(a.nome.toLowerCase()),
              labelWa: `Falar sobre ${a.nome.toLowerCase()}`,
              labelTel: 'Ligar para agendar',
            })
            return (
              <li key={a.id} className="h-full">
              <Revela atraso={i * 0.1} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-marfim p-7 ring-1 ring-ameixa/8 transition-[transform,box-shadow] duration-500 ease-[var(--ease-suave)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(75_48_69/0.35)] sm:p-8">
                  {/* faixa lilás que sobe no hover (só transform) */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom scale-y-0 bg-gradient-to-t from-lilas-suave to-transparent transition-transform duration-700 ease-[var(--ease-suave)] group-hover:scale-y-100"
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="font-serif text-sm italic text-lilas-tinta">0{i + 1}</span>
                    <Ilus className="-mr-2 -mt-2 h-28 w-28 transition-transform duration-700 ease-[var(--ease-suave)] group-hover:-translate-y-1 group-hover:rotate-[-3deg]" />
                  </div>
                  <h3 className="relative mt-2 text-[1.9rem]">{a.nome}</h3>
                  <p className="relative mt-2 font-medium text-ameixa/90">{a.resumo}</p>
                  <p className="relative mt-3 text-[0.98rem] leading-relaxed text-tinta-2">{a.texto}</p>
                  <p className="relative mt-4 text-[0.9rem] text-tinta-2">
                    A indicação depende de avaliação médica individual.
                  </p>
                  <div className="relative mt-auto pt-7">
                    <a
                      href={acao.href}
                      {...(acao.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={acao.tipo === 'tel' ? `Ligar para agendar ${a.nome.toLowerCase()}: ${CONFIG.telefone}` : undefined}
                      className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ameixa/[0.06] px-5 text-[0.95rem] font-semibold text-ameixa ring-1 ring-inset ring-ameixa/15 transition-colors duration-300 hover:bg-ameixa hover:text-marfim"
                    >
                      {acao.tipo === 'whatsapp' ? <IcWhatsapp size={18} /> : <IcTelefone size={18} />}
                      {acao.label}
                      {acao.externo && <span className="sr-only"> (abre em nova aba)</span>}
                    </a>
                  </div>
                </div>
              </Revela>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* =========================== QUANDO PROCURAR =========================== */

export function QuandoProcurar() {
  const itens = [
    {
      Icone: IcCalendario,
      titulo: 'Acompanhamento de rotina',
      texto: 'Consultas periódicas ajudam a acompanhar a sua saúde ao longo do tempo, mesmo quando está tudo bem.',
    },
    {
      Icone: IcConversa,
      titulo: 'Uma mudança que gerou dúvida',
      texto: 'Se algo chamou a sua atenção e deixou dúvida, a consulta é o lugar para conversar sobre isso com calma.',
    },
    {
      Icone: IcBroto,
      titulo: 'Planejamento e gestação',
      texto: 'Para conversar sobre o planejamento de uma gestação ou acompanhar uma gestação em andamento.',
    },
  ]
  return (
    <section aria-labelledby="titulo-quando" data-fio="quando" className="relative py-24 lg:py-32">
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-quando"
          rotulo="Quando procurar atendimento"
          titulo="Não é preciso esperar um *motivo* grande."
          texto="Algumas situações em que vale agendar uma consulta. Em cada caso, a orientação vem da avaliação individual."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-ameixa/10 ring-1 ring-ameixa/10 md:grid-cols-3">
          {itens.map((it, i) => (
            <li key={it.titulo} className="bg-marfim p-7 sm:p-9">
              <Revela atraso={i * 0.08}>
                <div className="flex size-12 items-center justify-center rounded-full bg-salvia-suave text-salvia-tinta">
                  <it.Icone size={22} />
                </div>
                <h3 className="mt-6 text-[1.45rem]">{it.titulo}</h3>
                <p className="mt-3 leading-relaxed text-tinta-2">{it.texto}</p>
              </Revela>
            </li>
          ))}
        </ol>
        <Revela atraso={0.1}>
          <div
            role="note"
            className="mt-8 flex gap-4 rounded-[1.5rem] bg-lilas-suave/70 p-6 text-ameixa ring-1 ring-inset ring-lilas/60 sm:items-center sm:p-7"
          >
            <IcAlerta size={24} className="mt-0.5 shrink-0 text-lilas-tinta sm:mt-0" />
            <p className="text-[1rem] leading-relaxed">
              <strong className="font-semibold">Sangramento intenso, dor forte, febre, desmaio ou outros sinais de gravidade:</strong>{' '}
              procure um pronto atendimento ou ligue{' '}
              <a href="tel:192" className="font-semibold underline decoration-lilas-tinta underline-offset-4">
                192 (SAMU)
              </a>
              .
            </p>
          </div>
        </Revela>
      </div>
    </section>
  )
}

/* =========================== COMO FUNCIONA =========================== */
/* Linha do tempo com progresso ao rolar (adaptada do "Animated Progress Stepper" do 21st.dev). */

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduz = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  const [ativo, setAtivo] = useState(reduz ? 3 : -1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduz) setAtivo(v < 0.03 ? -1 : Math.min(3, Math.floor(v * 3.4)))
  })

  const etapas = [
    {
      titulo: 'Contato e agendamento',
      texto: CONFIG.usarWhatsapp
        ? 'Você fala com a clínica por telefone ou WhatsApp e escolhe o melhor dia e horário entre os disponíveis.'
        : 'Você liga para a clínica e escolhe o melhor dia e horário entre os disponíveis.',
    },
    {
      titulo: 'Consulta e avaliação',
      texto: 'Uma conversa com calma sobre o motivo da visita, seu histórico e suas dúvidas, com avaliação individual.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto: 'Os próximos passos são explicados em linguagem simples, com espaço para perguntas.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Quando indicado, o retorno é combinado para acompanhar você ao longo do tempo.',
    },
  ]

  return (
    <section
      id="como-funciona"
      aria-labelledby="titulo-como"
      data-fio="como"
      className="relative bg-marfim-2 py-24 lg:py-32"
    >
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <CabecalhoSecao
            id="titulo-como"
            rotulo="Como funciona"
            titulo="Do primeiro contato ao *acompanhamento*."
            texto="Um caminho simples, explicado a cada etapa."
          />
        </div>
        <ol ref={ref} className="relative">
          {/* trilho e progresso: só transform (scaleY) */}
          <div aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-ameixa/12" />
          <m.div
            aria-hidden="true"
            style={{ scaleY: reduz ? 1 : progresso }}
            className="absolute bottom-6 left-[1.4rem] top-6 w-[2px] -translate-x-[0.5px] origin-top bg-salvia"
          />
          {etapas.map((e, i) => {
            const feito = i <= ativo
            return (
              <li key={e.titulo} className="relative pb-12 pl-20 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 flex size-11 items-center justify-center rounded-full font-serif text-lg transition-[background-color,color,box-shadow] duration-500 ${
                    feito
                      ? 'bg-ameixa text-marfim shadow-[0_0_0_6px_var(--color-marfim-2),0_0_0_7px_rgb(132_187_162/0.6)]'
                      : 'bg-marfim text-ameixa ring-1 ring-ameixa/20 shadow-[0_0_0_6px_var(--color-marfim-2)]'
                  }`}
                >
                  {i + 1}
                </span>
                <Revela atraso={0.05}>
                  <p className="rotulo !text-[0.7rem] !text-tinta-2">Etapa {i + 1}</p>
                  <h3 className="mt-1.5 text-[1.6rem]">{e.titulo}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-tinta-2">{e.texto}</p>
                </Revela>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* =========================== DÚVIDAS =========================== */
/* Acordeão acessível (inspirado no "FAQ Accordion Reveal" do 21st.dev). */

export function Duvidas() {
  const contato = CONFIG.usarWhatsapp
    ? `pelo telefone ${CONFIG.telefone} ou pelo WhatsApp`
    : `pelo telefone ${CONFIG.telefone}`
  const diasAbertos = CONFIG.horarios.filter((d) => d.periodos.length)
  const resumoHorarios = diasAbertos
    .map((d) => `${d.nome}: ${d.periodos.map((p) => `${hora(p.inicio)} às ${hora(p.fim)}`).join(' e ')}`)
    .join('; ')

  const perguntas: { p: string; r: string }[] = [
    { p: 'Preciso agendar a consulta?', r: `Sim. O atendimento é com hora marcada. Para agendar, fale com a clínica ${contato}.` },
    {
      p: 'Quais atendimentos a clínica oferece?',
      r: 'Atendimento em mastologia, ginecologia e obstetrícia. Em cada caso, a indicação depende de avaliação médica individual.',
    },
    {
      p: 'Como é a primeira consulta?',
      r: 'É um momento de conversa. Você conta o motivo da visita, seu histórico e suas dúvidas, e a avaliação é feita de forma individual. Ao final, os próximos passos são explicados com clareza.',
    },
    {
      p: 'O que levar na primeira consulta?',
      r: 'Se houver, leve exames anteriores, receitas e relatórios de outros atendimentos. Anotar suas dúvidas antes também ajuda a aproveitar a conversa. Ao agendar, você pode perguntar à clínica se há algo mais a levar.',
    },
    {
      p: 'Posso ir acompanhada?',
      r: 'Se quiser levar alguém de confiança, avise ao agendar para que a clínica oriente como funciona.',
    },
    { p: 'Quais são os horários de atendimento?', r: `${resumoHorarios}. ${CONFIG.avisoHorarios}` },
    { p: 'Onde fica a clínica?', r: `${enderecoLinha()}.` },
    {
      p: 'Com que frequência devo fazer acompanhamento?',
      r: 'A frequência varia de pessoa para pessoa e é definida em consulta, após avaliação individual.',
    },
    {
      p: 'A clínica atende urgências?',
      r: 'Não. O atendimento é com hora marcada. Em caso de sangramento intenso, dor forte, febre, desmaio ou outros sinais de gravidade, procure um pronto atendimento ou ligue 192 (SAMU).',
    },
  ]

  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" data-fio="duvidas" className="relative py-24 lg:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <CabecalhoSecao
            id="titulo-duvidas"
            rotulo="Dúvidas frequentes"
            titulo="Perguntas que costumam *surgir*."
            texto="Informações gerais, sem finalidade de diagnóstico. Dúvidas sobre a sua saúde são conversadas na consulta."
          />
        </div>
        <Revela>
          <ul className="border-t border-ameixa/12">
            {perguntas.map((q) => (
              <ItemDuvida key={q.p} pergunta={q.p} resposta={q.r} />
            ))}
          </ul>
        </Revela>
      </div>
    </section>
  )
}

function ItemDuvida({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-ameixa/12">
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={() => setAberto((v) => !v)}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.08rem] font-semibold text-ameixa"
        >
          <span>{pergunta}</span>
          <span
            aria-hidden="true"
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-[transform,background-color,color] duration-500 ease-[var(--ease-suave)] ${
              aberto ? 'rotate-45 bg-ameixa text-marfim ring-ameixa' : 'text-ameixa ring-ameixa/20 group-hover:bg-lilas-suave'
            }`}
          >
            <IcMais size={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-b`}
        hidden={!aberto}
        data-aberto={aberto}
        className="faq-resposta"
      >
        <div className="max-w-2xl pb-6 pr-12 leading-relaxed text-tinta-2">
          <Enfase texto={resposta} />
        </div>
      </div>
    </li>
  )
}
