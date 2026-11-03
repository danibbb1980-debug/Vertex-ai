import { useEffect, useRef, type PointerEvent } from 'react'
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { Accessibility, CalendarCheck, CalendarClock, ClipboardList, CreditCard, Ruler, Toilet, Users } from 'lucide-react'
import { CONFIG } from '../config'
import { FOTOS } from '../fotos'
import { horariosAgrupados } from '../lib/horarios'
import { BotaoWhatsApp, Reveal, SectionTitle } from './ui'
import { DenteSimples, IconeAtendimento } from './icons'

/* ---------- Marquee discreto (adaptado de "Infinite Text Marquee"): pausa fora da tela e no hover ---------- */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      el.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = [...CONFIG.atendimentos.map((a) => a.nome), 'Hora marcada', `${CONFIG.cidade} - ${CONFIG.uf}`]
  const linha = (
    <ul className="flex shrink-0 items-center">
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-8 pr-8 font-display text-2xl text-navy/80 sm:text-[1.9rem]">
          {t}
          <DenteSimples size={20} className="text-aqua" />
        </li>
      ))}
    </ul>
  )
  return (
    <div aria-hidden="true" className="group overflow-hidden border-y border-line bg-white py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div ref={ref} className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {linha}
        {linha}
      </div>
    </div>
  )
}

/* ---------- A clínica ---------- */
export function Clinica() {
  const semana = horariosAgrupados().find((h) => h.aberto)
  const pilares = [
    {
      icone: Ruler,
      titulo: 'Planejamento caso a caso',
      texto: 'Cada tratamento parte de uma avaliação individual e é planejado para a sua situação.',
    },
    {
      icone: CalendarClock,
      titulo: 'Hora marcada',
      texto: semana
        ? `Atendimento com agendamento, de ${semana.dias.toLowerCase()}, das ${semana.texto.replace(' às ', ' às ')}.`
        : 'Atendimento com agendamento recomendado.',
    },
    {
      icone: Accessibility,
      titulo: 'Acessibilidade',
      texto: 'Assento e banheiro acessíveis para cadeirantes, além de banheiro de gênero neutro.',
    },
  ]
  return (
    <section id="clinica" aria-labelledby="t-clinica" className="py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionTitle id="t-clinica" eyebrow="A clínica" titulo="Cuidado que se" enfase="ajusta" depois=" a você." />
          <Reveal className="mt-7 space-y-4 text-lg">
            <p>
              A {CONFIG.nome} fica no {CONFIG.endereco.bairro}, em {CONFIG.cidade}. O nome fala de encaixe: cada plano é
              ajustado a quem está na cadeira, depois de ouvir, examinar e explicar.
            </p>
            <p>
              Antes de qualquer tratamento, você entende o que foi observado, quais são as opções e como cada etapa
              acontece. Sem pressa e com hora marcada.
            </p>
          </Reveal>
        </div>
        <ul className="grid content-start gap-4">
          {pilares.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={i * 0.08} className="card flex gap-5 p-6 sm:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aqua-soft text-aqua-ink">
                <p.icone size={24} aria-hidden="true" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="text-xl">{p.titulo}</h3>
                <p className="mt-1.5">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Atendimentos (grade com luz que segue o ponteiro) ---------- */
export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  const mover = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="bg-mist py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            id="t-atendimentos"
            eyebrow="Atendimentos"
            titulo="Várias áreas,"
            enfase="um plano"
            depois=" para você."
            intro="Conheça as áreas de atendimento da clínica. Em todas elas, o primeiro passo é uma avaliação."
          />
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => {
            const Icone = IconeAtendimento[a.id] ?? DenteSimples
            return (
              <Reveal as="li" key={a.id} delay={(i % 3) * 0.07} className="h-full">
                <article
                  onPointerMove={mover}
                  className="spot card group flex h-full flex-col p-7 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ice text-navy ring-1 ring-line transition-colors duration-300 group-hover:bg-aqua-soft group-hover:text-aqua-ink">
                      <Icone size={30} />
                    </span>
                    <span className="font-display text-sm text-muted" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl">{a.nome}</h3>
                  <p className="mt-3 flex-1">{a.descricao}</p>
                  <p className="mt-4 text-[0.92rem] text-muted">A indicação depende de avaliação individual.</p>
                  <div className="mt-6 border-t border-line pt-5">
                    <BotaoWhatsApp
                      className="btn-ghost w-full justify-between !px-5"
                      mensagem={CONFIG.mensagens.atendimento(a.nome)}
                      rotulo={`Perguntar sobre ${a.nome} pelo WhatsApp (abre em nova aba)`}
                    >
                      Perguntar pelo WhatsApp
                    </BotaoWhatsApp>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Equipe: só aparece se houver dentistas no config ---------- */
export function Equipe() {
  const lista = CONFIG.dentistas.filter((d) => d.nome && d.cro)
  if (!lista.length) return null
  return (
    <section id="equipe" aria-labelledby="t-equipe" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionTitle id="t-equipe" eyebrow="Equipe" titulo="Quem cuida do seu" enfase="plano" depois="." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((d, i) => (
            <Reveal as="li" key={d.cro} delay={i * 0.07} className="card overflow-hidden">
              {d.foto && <img src={d.foto} alt={`Foto de ${d.nome}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
              <div className="p-7">
                <h3 className="text-2xl">{d.nome}</h3>
                <p className="mt-1 text-sm font-semibold tracking-wide text-aqua-ink">CRO {d.cro}</p>
                {d.formacao && <p className="mt-3">{d.formacao}</p>}
                {d.especialidadeRegistrada && <p className="mt-2 text-sm text-muted">{d.especialidadeRegistrada}</p>}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Quando procurar ---------- */
export function QuandoProcurar() {
  const itens = [
    {
      t: 'Revisões periódicas',
      d: 'Consultas regulares ajudam a acompanhar a saúde da boca, mesmo quando nada incomoda. A frequência é combinada com o dentista.',
    },
    {
      t: 'Gengiva sensível ou com sangramento',
      d: 'Sangramento ao escovar, inchaço ou sensibilidade na gengiva são sinais para procurar uma avaliação.',
    },
    {
      t: 'Perda de um dente',
      d: 'Quando um dente é perdido, vale conversar sobre as opções de reposição e sobre os cuidados com os dentes vizinhos.',
    },
    {
      t: 'Alinhamento dos dentes',
      d: 'Dentes desalinhados ou dificuldade no encaixe da mordida podem ser avaliados para entender se há indicação de tratamento.',
    },
  ]
  return (
    <section id="quando-procurar" aria-labelledby="t-quando" className="py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionTitle
          id="t-quando"
          eyebrow="Quando procurar"
          titulo="Alguns sinais para"
          enfase="conversar"
          depois=" com o dentista."
          intro="Informações gerais, para ajudar você a decidir quando marcar uma avaliação. Só a consulta indica o que é adequado para o seu caso."
        />
        <ol className="divide-y divide-line border-y border-line">
          {itens.map((it, i) => (
            <Reveal as="li" key={it.t} delay={i * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 py-7">
              <span className="font-display text-2xl text-aqua-ink" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl">{it.t}</h3>
                <p className="mt-2">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Como funciona: linha do tempo com progresso ao rolar (adaptado de "Animated Progress Stepper") ---------- */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const etapas = [
    { t: 'Contato e agendamento', d: 'Você fala com a equipe pelo WhatsApp ou pelo telefone e escolhe um dia e horário dentro da agenda.' },
    { t: 'Avaliação e escuta', d: 'Na consulta, o dentista ouve suas queixas e expectativas e faz o exame clínico.' },
    { t: 'Plano explicado com clareza', d: 'Você conhece as opções indicadas para o seu caso, com cada etapa explicada em linguagem simples, para decidir com tranquilidade.' },
    { t: 'Acompanhamento', d: 'Os retornos são combinados para acompanhar cada etapa, durante e depois do tratamento.' },
  ]
  return (
    <section id="como-funciona" aria-labelledby="t-como" className="on-dark relative overflow-hidden bg-navy py-20 text-white/80 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-32 h-56 w-56 rounded-full border border-white/10" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionTitle
            id="t-como"
            escuro
            eyebrow="Como funciona"
            titulo="Do primeiro contato ao"
            enfase="acompanhamento"
            depois="."
            intro="Quatro etapas simples. Você sabe o que acontece em cada uma."
          />
        </div>
        <ol ref={ref} className="relative">
          <div aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-white/15" />
          <m.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : progresso }}
            className="anim absolute bottom-6 left-[1.4rem] top-6 w-[3px] -translate-x-px origin-top rounded-full bg-aqua"
          />
          {etapas.map((e, i) => (
            <Reveal as="li" key={e.t} delay={0.05} className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg font-semibold text-aqua ring-2 ring-aqua">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-2xl !text-white sm:text-[1.7rem]">{e.t}</h3>
                <p className="mt-2 max-w-[34rem]">{e.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Estrutura ---------- */
const ICONES_ESTRUTURA: Record<string, typeof Accessibility> = {
  assento: Accessibility,
  banheiro: Toilet,
  neutro: Users,
  hora: CalendarCheck,
}
export function Estrutura() {
  const itens = CONFIG.estrutura
  const pag = CONFIG.pagamentos
  if (!itens.length && !pag.length) return null
  return (
    <section id="estrutura" aria-labelledby="t-estrutura" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionTitle id="t-estrutura" eyebrow="Estrutura" titulo="Detalhes que deixam a visita mais" enfase="tranquila" depois="." />
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {itens.map((it, i) => {
              const I = ICONES_ESTRUTURA[it.id] ?? ClipboardList
              return (
                <Reveal as="li" key={it.id} delay={i * 0.06} className="card p-6">
                  <I size={26} strokeWidth={1.6} className="text-aqua-ink" aria-hidden="true" />
                  <h3 className="mt-4 text-xl">{it.titulo}</h3>
                  <p className="mt-1.5">{it.texto}</p>
                </Reveal>
              )
            })}
          </ul>
          {pag.length > 0 && (
            <Reveal className="relative overflow-hidden rounded-[var(--radius-card)] bg-sand p-7 sm:p-8">
              <CreditCard size={26} strokeWidth={1.6} className="text-navy" aria-hidden="true" />
              <h3 className="mt-4 text-2xl">Formas de pagamento</h3>
              <ul className="mt-5 space-y-3">
                {pag.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-navy">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-aqua-ink" />
                    {p}
                  </li>
                ))}
              </ul>
              <svg aria-hidden="true" viewBox="0 0 200 60" className="absolute -bottom-2 right-0 w-48 opacity-70">
                <path d="M4 50C60 58 130 54 196 24" fill="none" stroke="var(--color-peach)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Galeria: só aparece se houver fotos em ./referencias/fotos ---------- */
export function Galeria() {
  if (!FOTOS.length) return null
  return (
    <section id="galeria" aria-labelledby="t-galeria" className="pb-20 sm:pb-28">
      <div className="wrap">
        <SectionTitle id="t-galeria" eyebrow="Ambiente" titulo="Conheça o" enfase="espaço" depois="." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOTOS.map((f) => (
            <li key={f.src} className="overflow-hidden rounded-[var(--radius-card)] bg-mist">
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
