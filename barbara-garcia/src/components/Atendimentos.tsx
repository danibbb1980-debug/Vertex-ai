import { useEffect, useRef, type PointerEvent } from 'react'
import { CONFIG } from '../config'
import { linkWhatsapp, mensagemAtendimento, temWhatsapp } from '../lib/dados'
import { IconeSetaFora, IconeWhatsapp } from './Icones'
import { MONOGRAMA } from '../lib/brand-paths'

/** Ornamentos abstratos, um por atendimento (sem figura humana). */
function Ornamento({ id }: { id: string }) {
  if (id === 'massagens')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M10 ${44 + i * 14} C 35 ${30 + i * 14}, 55 ${58 + i * 14}, 80 ${44 + i * 14} S 110 ${36 + i * 14}, 112 ${44 + i * 14}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={1 - i * 0.2}
          />
        ))}
      </svg>
    )
  if (id === 'terapias')
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <g transform="translate(6 18) scale(0.62)" fill="none" stroke="currentColor" strokeWidth={3.2}>
          <path d={MONOGRAMA.hexa} />
        </g>
        <g transform="translate(52 44) scale(0.56)" fill="currentColor" opacity={0.28}>
          <path d={MONOGRAMA.hexa} />
        </g>
        <g transform="translate(52 44) scale(0.56)" fill="none" stroke="currentColor" strokeWidth={3.4}>
          <path d={MONOGRAMA.hexa} />
        </g>
      </svg>
    )
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <path d="M14 24 H106" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M30 24 C30 44 36 52 36 64 a6 6 0 0 1 -12 0 c0 -12 6 -20 6 -40Z" fill="currentColor" opacity={0.85} />
      <path d="M60 24 C60 54 68 66 68 82 a8 8 0 0 1 -16 0 c0 -16 8 -28 8 -58Z" fill="currentColor" />
      <path d="M88 24 C88 38 92 44 92 52 a4 4 0 0 1 -8 0 c0 -8 4 -14 4 -28Z" fill="currentColor" opacity={0.6} />
    </svg>
  )
}

function Cartao({ a, i }: { a: (typeof CONFIG.atendimentos)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null)
  const onMove = (e: PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const cores = ['text-mel', 'text-argila', 'text-oliva']
  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      className="revela cartao-luz group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-oliva/10 bg-aveia-2 p-7 shadow-[var(--shadow-macia)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-mel)] hover:-translate-y-1.5 md:p-8"
      style={{ ['--atraso' as string]: `${i * 110}ms` }}
      aria-labelledby={`at-${a.id}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-[0.95rem] italic text-mel-texto">0{i + 1}</span>
        <div className={`h-20 w-20 transition-transform duration-700 ease-[var(--ease-mel)] group-hover:-translate-y-1 group-hover:rotate-[-4deg] ${cores[i % 3]}`}>
          <Ornamento id={a.id} />
        </div>
      </div>
      <h3 id={`at-${a.id}`} className="mt-6 text-[clamp(1.6rem,3vw,2rem)]">
        {a.nome}
      </h3>
      <p className="mt-3 text-[1.04rem] text-grafite/90">{a.descricao}</p>
      <p className="mt-3 text-[0.98rem] text-suave">Começa com uma conversa rápida para entender o que você procura.</p>
      <p className="mt-5 border-t border-oliva/12 pt-4 text-[0.9rem] font-medium text-oliva">A indicação depende de avaliação individual.</p>
      {temWhatsapp && (
        <a
          href={linkWhatsapp(mensagemAtendimento(a.mensagem))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex min-h-12 items-center gap-2 self-start pt-6 font-semibold text-oliva underline decoration-mel decoration-2 underline-offset-[6px] transition-colors hover:decoration-oliva"
        >
          Pedir informações
          <IconeSetaFora tamanho={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only"> sobre {a.nome.toLowerCase()} pelo WhatsApp (abre em nova aba)</span>
        </a>
      )}
    </article>
  )
}

/** Botão onde o fio de mel termina: o preenchimento sobe com a rolagem (--enche). */
function BotaoGota() {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    // sem JS do fio (ex.: movimento reduzido), o botão já aparece preenchido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current?.style.setProperty('--enche', '1')
  }, [])
  if (!temWhatsapp) return null
  return (
    <a
      ref={ref}
      data-fio="fim"
      href={linkWhatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      className="group/gota relative isolate inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full border-[1.5px] border-mel bg-areia px-8 py-3.5 text-[1.05rem] font-semibold text-grafite shadow-[var(--shadow-mel)] transition-transform duration-300 hover:-translate-y-0.5"
      style={{ ['--enche' as string]: 0 }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom bg-mel transition-transform duration-150 [.js_&]:scale-y-[var(--enche)] group-hover/gota:!scale-y-100"
      />
      <IconeWhatsapp /> Agendar pelo WhatsApp
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

export function Atendimentos() {
  if (!CONFIG.secoes.atendimentos || CONFIG.atendimentos.length === 0) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative py-20 md:py-28">
      <div className="container-site">
        <div data-fio="margem" className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="rotulo revela">Atendimentos</p>
            <h2 id="titulo-atendimentos" className="revela mt-4 text-[clamp(2.1rem,5vw,3.4rem)]" style={{ ['--atraso' as string]: '80ms' }}>
              Três formas de <em>cuidado</em>.
            </h2>
          </div>
          <p className="revela max-w-[30rem] text-[1.08rem] text-suave md:justify-self-end" style={{ ['--atraso' as string]: '160ms' }}>
            Conheça os atendimentos em linhas gerais. Os detalhes de cada um são conversados no atendimento, e a indicação depende de avaliação individual.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {CONFIG.atendimentos.map((a, i) => (
            <Cartao key={a.id} a={a} i={i} />
          ))}
        </div>

        <div data-fio="margem" aria-hidden="true" className="h-0" />
        <div className="mt-16 flex flex-col items-center gap-4 text-center md:mt-20">
          <BotaoGota />
          <p className="max-w-[30rem] text-[0.98rem] text-suave">Se ainda não sabe qual escolher, conte pelo WhatsApp o que você procura.</p>
        </div>
      </div>
    </section>
  )
}

export function Faixa() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([en]) => el.setAttribute('data-pausado', String(!en.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (!CONFIG.secoes.faixa) return null
  const itens = [...CONFIG.atendimentos.map((a) => a.nome), `${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade}`, 'Com hora marcada']
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6 font-serif text-[clamp(1.3rem,3vw,1.9rem)] italic text-oliva md:px-10">
          {t}
          <svg viewBox="0 0 100 100" className="ml-12 h-4 w-4 text-mel md:ml-20" aria-hidden="true">
            <path d={MONOGRAMA.hexa} fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-y border-oliva/12 bg-areia-2 py-6" aria-label="Atendimentos e localização">
      <div ref={ref} className="marquee-trilho" data-pausado="true">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}
