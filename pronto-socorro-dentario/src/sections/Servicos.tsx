import { useEffect, useRef, useState } from 'react'
import { useReduced } from '../lib/hooks'
import { ATENDIMENTOS, waLink } from '../config'
import { Arrow, Child, Moon, Phone, Pin, Shield, Spark, ToothPain, WhatsApp } from '../components/icons'
import { SectionHead } from '../components/ui'
import { trackSpot } from './Urgencia'

const ICONS = { emergencia: ToothPain, pediatrico: Child, estetica: Spark, sedacao: Moon } as const

export function Atendimentos() {
  return (
    <section aria-labelledby="atend-title" id="atendimentos" className="on-dark grain relative overflow-hidden bg-forest py-20 text-white lg:py-28">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            dark
            id="atend-title"
            eyebrow="Atendimentos"
            title="Da urgência ao cuidado de rotina"
            intro="Além da urgência, a clínica atende crianças, faz avaliação estética e trabalha com sedação quando indicada. Cada caso começa por uma avaliação individual."
          />
        </div>

        {/* Fonte: ficha do Google (aba Sobre, "Opções no menu") */}
        <ul onPointerMove={trackSpot} className="mt-12 grid gap-4 md:grid-cols-2">
          {ATENDIMENTOS.map((a, i) => {
            const Icon = ICONS[a.id]
            return (
              <li
                key={a.id}
                className="spot reveal group relative flex flex-col rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/25 sm:p-9"
                style={{ ['--d' as string]: `${(i % 2) * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-[#5fe08f] ring-1 ring-inset ring-brand/30">
                    <Icon size={28} />
                  </span>
                  <span className="font-display text-sm font-bold tracking-[0.14em] text-white/40">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-8 text-[1.75rem] font-semibold !text-paper sm:text-[2rem]">{a.titulo}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-white/72">{a.texto}</p>
                <p className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-3 py-1 text-[0.78rem] font-semibold text-white/70">
                  <Shield size={14} />
                  Depende de avaliação individual
                </p>
                <a
                  href={waLink(a.mensagem)}
                  target="_blank"
                  rel="noopener"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 self-start font-bold text-amber underline decoration-amber/40 underline-offset-[0.3em] transition-[gap,text-decoration-color] duration-300 hover:gap-3 hover:decoration-amber"
                >
                  {a.id === 'emergencia' ? 'Falar agora' : 'Perguntar pelo WhatsApp'}
                  <span className="sr-only">: {a.titulo} (abre o WhatsApp)</span>
                  <Arrow size={18} />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const ETAPAS = [
  { Icon: WhatsApp, t: 'Você chama pelo WhatsApp ou liga', d: 'Conte o que está acontecendo, do jeito que conseguir. Não precisa saber o nome do problema.' },
  { Icon: Phone, t: 'Conversamos sobre o seu caso e a disponibilidade', d: 'A equipe entende a situação e combina com você o horário para vir.' },
  { Icon: Pin, t: 'Avaliação presencial', d: 'O profissional examina com cuidado e explica o que encontrou.' },
  { Icon: Shield, t: 'Orientação do tratamento com clareza', d: 'Você entende as opções, as etapas e os cuidados, antes de qualquer decisão.' },
]

/** Linha do tempo com progresso ao rolar (adaptado do "Animated Progress Stepper" e do "Scroll Progress", 21st.dev). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const reduce = useReduced()
  const [ativo, setAtivo] = useState(-1)

  // Progresso ao rolar: só transform (scaleY), atualizado via rAF, sem re-render por quadro.
  useEffect(() => {
    const el = ref.current
    if (!el || !bar.current) return
    if (reduce) {
      bar.current.style.transform = 'scaleY(1)'
      setAtivo(ETAPAS.length - 1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.75
      const end = vh * 0.55
      // 0 quando o topo da lista chega a 75% da tela; 1 quando o fim chega a 55%
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)))
      bar.current!.style.transform = `scaleY(${p.toFixed(4)})`
      setAtivo(p <= 0 ? -1 : Math.min(ETAPAS.length - 1, Math.floor(p * ETAPAS.length + 0.15)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduce])

  return (
    <section aria-labelledby="como-title" id="como-funciona" className="py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHead
              id="como-title"
              eyebrow="Como funciona"
              title="Quatro passos, sem complicação"
              intro="Do primeiro contato à orientação do tratamento, você sabe o que está acontecendo em cada etapa."
            />
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-7">
          {/* trilho e progresso */}
          <span aria-hidden="true" className="absolute bottom-8 left-[1.4rem] top-8 w-px bg-line" />
          <span
            ref={bar}
            aria-hidden="true"
            className="absolute bottom-8 left-[calc(1.4rem-0.5px)] top-8 w-[2px] origin-top rounded-full bg-brand transition-transform duration-150 ease-out"
            style={{ transform: 'scaleY(0)' }}
          />
          {ETAPAS.map(({ Icon, t, d }, i) => {
            const on = reduce || i <= ativo
            return (
              <li key={t} className="relative flex gap-6 pb-10 last:pb-0 sm:gap-8">
                <span
                  className={`relative z-10 flex h-[2.8rem] w-[2.8rem] flex-none items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ${
                    on ? 'scale-100 border-brand bg-brand text-white' : 'scale-95 border-line bg-ivory text-muted'
                  }`}
                >
                  <Icon size={19} />
                </span>
                <div className={`flex-1 rounded-[1.25rem] border p-6 transition-[border-color,background-color] duration-500 sm:p-7 ${on ? 'border-line bg-paper' : 'border-transparent bg-transparent'}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Etapa {i + 1}</p>
                  <h3 className="mt-2 text-[1.4rem] font-semibold sm:text-[1.6rem]">{t}</h3>
                  <p className="mt-2 text-muted">{d}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
