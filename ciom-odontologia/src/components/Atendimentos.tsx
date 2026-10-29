import { useRef, type PointerEvent } from 'react'
import { CONFIG, type Atendimento } from '../config'
import { waAssunto } from '../lib/util'
import { PlanNode, Reveal, SectionHead } from './Base'
import { IconArrowUpRight, IconChat } from './Icons'
import { Ilustracao } from './Ilustracoes'

function Cartao({ a, i }: { a: Atendimento; i: number }) {
  const blob = useRef<HTMLDivElement>(null)
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !blob.current) return
    const r = e.currentTarget.getBoundingClientRect()
    blob.current.style.transform = `translate(${e.clientX - r.left - 200}px, ${e.clientY - r.top - 200}px)`
  }
  return (
    <Reveal as="li" delay={0.04} className="relative">
      <PlanNode className="top-10 md:top-12" />
      <article
        onPointerMove={onMove}
        className="group relative isolate overflow-hidden rounded-[26px] border border-line bg-paper/70 p-6 transition-colors duration-500 hover:border-sage-deep/40 hover:bg-paper sm:p-8 md:p-10"
      >
        <div
          ref={blob}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -z-10 h-[400px] w-[400px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle, rgb(108 171 148 / 0.16), transparent 65%)' }}
        />
        <span className="crosshair left-3 top-3 text-sage-deep opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
        <span className="crosshair bottom-3 right-3 text-sage-deep opacity-0 transition-opacity duration-500 group-hover:opacity-70" />

        <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow text-sage-deep">
              Atendimento <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            </p>
            <h3 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-ink">{a.nome}</h3>
            <p className="mt-3 text-muted">{a.resumo}</p>
          </div>
          <div className="md:col-span-5">
            <p className="text-[1.02rem] text-text">{a.descricao}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage-deep" />
              A indicação depende de avaliação individual.
            </p>
            <a
              href={waAssunto(a.assunto)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/20 px-5 font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
            >
              <IconChat size={18} />
              Falar sobre {a.cta}
              <IconArrowUpRight size={16} className="opacity-70" />
            </a>
          </div>
          <div className="order-first w-28 text-sage-deep transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1 md:order-none md:col-span-2 md:w-full">
            <Ilustracao tipo={a.ilustracao} />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function Comparativo() {
  const temLentes = CONFIG.atendimentos.some((a) => a.id === 'lentes-facetas')
  if (!CONFIG.secoes.comparativo || !temLentes) return null
  const colunas = [
    {
      nome: 'Lentes de contato dental',
      espessura: 'Mais finas',
      itens: ['Costumam ser indicadas para pequenas correções de cor e de forma.'],
      camada: 3,
    },
    {
      nome: 'Facetas',
      espessura: 'Um pouco mais espessas',
      itens: ['Podem ser indicadas em casos de desgaste ou quando há alinhamento a corrigir.'],
      camada: 8,
    },
  ]
  return (
    <div className="mt-20 md:mt-28">
      <div className="relative">
        <PlanNode className="top-[6px]" />
        <Reveal>
          <p className="eyebrow text-sage-deep">Para entender</p>
          <h3 className="mt-3 font-serif text-[clamp(1.8rem,3.4vw,2.7rem)] leading-tight text-ink">
            Lentes de contato dental ou <em className="text-sage-deep">facetas</em>?
          </h3>
          <p className="mt-4 max-w-2xl text-muted">
            As duas são finas camadas aplicadas na parte da frente do dente. A diferença principal está na espessura e no tipo de
            caso em que costumam ser consideradas.
          </p>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {colunas.map((c, i) => (
          <Reveal key={c.nome} delay={i * 0.08} className="rounded-[24px] border border-line bg-sand/50 p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h4 className="font-serif text-2xl text-ink">{c.nome}</h4>
                <p className="eyebrow mt-2 !text-[0.7rem] text-sage-deep">{c.espessura}</p>
              </div>
              <svg viewBox="0 0 80 90" className="h-20 w-auto shrink-0 text-ink" aria-hidden="true">
                <path d="M30 6c10-2 26 0 32 6 6 10 6 46 0 62-4 8-12 10-20 10s-14-4-16-12c-4-16-6-54 4-66Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d={`M30 6c-${c.camada} 4-${c.camada + 6} 30-${c.camada + 4} 52s${c.camada} 18 ${c.camada + 4} 20`}
                  fill="none"
                  stroke="#2c6b5a"
                  strokeWidth={c.camada > 4 ? 3 : 1.6}
                  strokeLinecap="round"
                />
                <path d="M4 46h14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity=".5" />
              </svg>
            </div>
            <ul className="mt-5 space-y-2">
              {c.itens.map((t) => (
                <li key={t} className="text-text">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-5 text-sm text-muted">
          Não há uma opção melhor que a outra: a indicação depende do que a avaliação mostrar em cada caso.
        </p>
      </Reveal>
    </div>
  )
}

export function Atendimentos() {
  if (!CONFIG.secoes.atendimentos || CONFIG.atendimentos.length === 0) return null
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="sec bg-shell">
      <div className="wrap">
        <SectionHead
          id="t-atendimentos"
          numero="02"
          rotulo="Atendimentos"
          titulo={
            <>
              Tratamentos explicados <em>com clareza</em>.
            </>
          }
          intro="Conheça os atendimentos da clínica. Cada descrição é informativa: o que faz sentido para você é definido na avaliação."
        />
        <ul className="mt-14 space-y-4 md:space-y-5">
          {CONFIG.atendimentos.map((a, i) => (
            <Cartao key={a.id} a={a} i={i} />
          ))}
        </ul>
        <Comparativo />
      </div>
    </section>
  )
}

const SINAIS = [
  {
    id: 'siso',
    titulo: 'Dente do siso: quando o dentista costuma avaliar',
    texto:
      'Quando surge dor ou incômodo no fundo da boca, quando a gengiva da região fica sensível, ou quando outro profissional já indicou a extração.',
  },
  {
    id: 'implantes',
    titulo: 'Perda de dente',
    texto:
      'Quando um dente foi perdido ou extraído e o espaço ficou vazio. A falta dele pode afetar a mastigação e a fala, e vale conversar sobre as alternativas.',
  },
  {
    id: 'ortodontia',
    titulo: 'Alinhamento',
    texto:
      'Quando há dentes tortos, apinhados ou com espaços, ou incômodo ao morder. A avaliação ajuda a entender se há indicação de tratamento ortodôntico.',
  },
  {
    id: 'lentes-facetas',
    titulo: 'Cor e forma dos dentes',
    texto:
      'Quando há vontade de ajustar cor, forma ou proporção, ou quando existe desgaste. A conversa inicial mostra quais caminhos podem ser considerados.',
  },
]

export function QuandoProcurar() {
  if (!CONFIG.secoes.quandoProcurar) return null
  const ids = new Set(CONFIG.atendimentos.map((a) => a.id))
  const sinais = SINAIS.filter((s) => ids.has(s.id))
  if (sinais.length === 0) return null
  return (
    <section aria-labelledby="t-quando" className="sec">
      <div className="wrap">
        <SectionHead
          id="t-quando"
          numero="03"
          rotulo="Quando procurar"
          titulo={
            <>
              Sinais que merecem uma <em>conversa</em>.
            </>
          }
          intro="Algumas situações comuns em que vale marcar uma avaliação. São orientações gerais, que não substituem a consulta."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[26px] border border-line bg-line md:grid-cols-2">
          {sinais.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.06} className="group relative bg-ivory p-7 transition-colors duration-500 hover:bg-paper md:p-10">
              <span className="font-serif text-5xl italic leading-none text-sage-deep/35 transition-colors duration-500 group-hover:text-sage-deep/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-serif text-[1.6rem] leading-tight text-ink">{s.titulo}</h3>
              <p className="mt-3 text-muted">{s.texto}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
