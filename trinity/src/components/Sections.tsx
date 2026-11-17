import { useEffect, useId, useRef, useState } from 'react'
import { CONFIG, wa, type Foto } from '../config'
import { useChapter, useInView, useReducedMotion } from '../hooks'
import { Knot } from './Knot'
import { Logo } from './Logo'

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const
const wrap = 'mx-auto w-full max-w-[1360px] px-4 sm:px-8'

/* ——— rótulo de capítulo com o laço correspondente ——— */
function Chapter({ n, label, tone = 'light' }: { n: number; label: string; tone?: 'light' | 'dark' | 'bronze' }) {
  const chapter = useChapter()
  const c =
    tone === 'light'
      ? { gap: 'var(--paper)', ink: 'var(--ink)', on: 'var(--bronze)' }
      : tone === 'bronze'
        ? { gap: 'var(--bronze)', ink: 'var(--ink)', on: 'var(--paper)' }
        : { gap: 'var(--ink)', ink: 'var(--paper)', on: 'var(--bronze-soft)' }
  return (
    <p className="label flex items-center gap-3">
      <Knot idPrefix={`ch${n}-${label}`} {...c} width={22} widthOn={34} circle={false} active={chapter === n ? n : null} className="h-8 w-8" />
      <span>{label}</span>
    </p>
  )
}

/* ——— HERO ——— */
export function Hero() {
  const chapter = useChapter()
  return (
    <section id="topo" aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--bar-h)+72px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-30vw] top-[calc(var(--bar-h)+52px)] w-[90vw] max-w-none sm:right-[-22vw] sm:w-[78vw] lg:right-[-7vw] lg:top-1/2 lg:w-[min(54vw,820px)] lg:-translate-y-[46%]"
      >
        <Knot idPrefix="hero" draw gap="var(--paper)" ink="var(--ink)" on="var(--bronze)" width={9} widthOn={15} active={chapter} />
      </div>
      <div className={`${wrap} relative grid min-h-[min(100svh,980px)] items-end pb-16 pt-[70vw] sm:pt-[44vw] lg:items-center lg:pb-24 lg:pt-10`}>
        <div className="max-w-[44rem] lg:max-w-[50%]">
          <p className="label mb-6 text-bronze">
            Atendimentos e cursos em estética · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <h1 id="hero-title" className="display text-[clamp(2.75rem,8.4vw,6.4rem)] text-balance">
            Atendimentos e cursos de <em className="text-bronze">estética</em>, em {CONFIG.cidade}.
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.12rem] leading-relaxed text-stone">
            Estética facial e corporal com horário marcado, e cursos para quem quer atuar na área. No {CONFIG.endereco.bairro}.
          </p>
          <div className="mt-10 grid gap-3 xs:grid-cols-2 sm:max-w-[34rem]">
            <a href={wa(CONFIG.mensagens.geral)} {...ext} className="btn btn-ink">
              Agendar avaliação
            </a>
            {CONFIG.cursos.length > 0 && (
              <a href={wa(CONFIG.mensagens.cursos)} {...ext} className="btn btn-line">
                Perguntar sobre os cursos
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ——— DOIS CAMINHOS ——— */
export function Caminhos() {
  return (
    <section aria-label="Dois caminhos: atendimentos e cursos" className="grain overflow-hidden bg-bronze text-paper on-dark">
      <div className={`${wrap} py-16 sm:py-24`}>
        <div className="grid gap-6 border-b border-paper/30 pb-12 lg:grid-cols-12 lg:items-end">
          <h2 className="display text-[clamp(3.2rem,10.5vw,7.4rem)] lg:col-span-9">Atendimentos</h2>
          <div className="lg:col-span-3 lg:pb-4">
            <p className="max-w-[24rem] text-[1.05rem] leading-relaxed">
              Para quem quer se atender: estética facial e corporal, a partir de uma avaliação individual.
            </p>
            <a href="#atendimentos" className="link-u mt-4 inline-flex min-h-12 items-center font-medium">
              Ver os atendimentos
            </a>
          </div>
        </div>
        {CONFIG.cursos.length > 0 && (
          <div className="grid gap-6 pt-10 lg:grid-cols-12 lg:items-end">
            <div className="order-2 lg:order-1 lg:col-span-4 lg:pb-6">
              <p className="max-w-[24rem] text-[1.05rem] leading-relaxed">
                Para quem quer aprender a atuar na área: cursos de estética facial e corporal.
              </p>
              <a href="#cursos" className="link-u mt-4 inline-flex min-h-12 items-center font-medium">
                Ver os cursos
              </a>
            </div>
            <p aria-hidden="true" className="display order-1 text-[clamp(5rem,21vw,15rem)] italic leading-[0.85] text-ink lg:order-2 lg:col-span-8 lg:text-right">
              Cursos
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ——— ATENDIMENTOS ——— */
export function Atendimentos() {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <section id="atendimentos" data-chapter="0" aria-labelledby="at-title" className="border-b border-ink/15">
      <div className={`${wrap} grid gap-10 py-20 sm:py-28 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--bar-h)+110px)]">
            <Chapter n={0} label="Atendimentos" />
            <h2 id="at-title" className="display mt-6 text-[clamp(2.4rem,5vw,3.8rem)]">
              Estética facial e corporal, com <em className="text-bronze">avaliação</em> antes.
            </h2>
            <p className="mt-6 max-w-[26rem] text-stone">
              A indicação de cada cuidado depende de avaliação individual por profissional habilitado. Nada é sugerido antes dessa conversa.
            </p>
          </div>
        </div>
        <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
          {CONFIG.atendimentos.map((a, i) => (
            <IndexRow
              key={a.nome}
              i={i}
              id={`${base}-${i}`}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              titulo={a.nome}
            >
              <p className="max-w-[34rem] text-[1.08rem] leading-relaxed">{a.descricao}</p>
              <p className="mt-3 max-w-[34rem] text-[0.95rem] text-stone">
                A indicação depende de avaliação individual por profissional habilitado.
              </p>
              <a href={wa(CONFIG.mensagens.atendimento(a.nome))} {...ext} className="btn btn-ink mt-6">
                Agendar avaliação de {a.nome.toLowerCase()}
              </a>
            </IndexRow>
          ))}
        </ol>
      </div>
    </section>
  )
}

function IndexRow({
  i,
  id,
  open,
  onToggle,
  titulo,
  children,
}: {
  i: number
  id: string
  open: boolean
  onToggle: () => void
  titulo: string
  children: React.ReactNode
}) {
  const [ref, lit] = useInView<HTMLLIElement>()
  return (
    <li ref={ref} className="border-b border-ink/25">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={onToggle}
          className="group grid w-full grid-cols-[3.2rem_1fr_auto] items-baseline gap-3 py-7 text-left sm:grid-cols-[5rem_1fr_auto] sm:py-9"
        >
          <span className={`num-lit display tnum text-[1.6rem] sm:text-[2.2rem] ${lit ? 'is-lit' : ''}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="display text-[clamp(2.1rem,6vw,4.4rem)] transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transition-none">
            {titulo}
          </span>
          <span className="acc-mark self-center" aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acc-panel" data-open={open}>
        <div>
          <div className={`pb-10 pl-[3.95rem] sm:pl-[5.75rem] ${open ? '' : 'invisible'}`}>{children}</div>
        </div>
      </div>
    </li>
  )
}

/* ——— REGISTROS (fotos publicadas pela Trinity) ——— */
function Figure({ f, className = '', imgClass = '', sizes }: { f: Foto; className?: string; imgClass?: string; sizes?: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <img
        src={f.src}
        alt={f.alt}
        width={f.largura}
        height={f.altura}
        loading="lazy"
        decoding="async"
        srcSet={`${f.src.replace('.webp', '-600.webp')} 600w, ${f.src} ${f.largura}w`}
        sizes={sizes}
        className={`block h-auto w-full bg-paper-2 object-cover ${imgClass}`}
      />
      {f.legenda && <figcaption className="mt-3 text-[0.88rem] text-stone">{f.legenda}</figcaption>}
    </figure>
  )
}

export function Registros() {
  const fotos = CONFIG.fotosRegistros
  if (!fotos.length) return null
  return (
    <section data-chapter="0" aria-labelledby="reg-title" className="bg-paper-2">
      <div className={`${wrap} py-20 sm:py-28`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="reg-title" className="display text-[clamp(2.2rem,4.6vw,3.6rem)] lg:col-span-6">
            Registros de atendimentos de <em className="text-bronze">estética facial</em>
          </h2>
          <p className="max-w-[30rem] text-[0.95rem] text-stone lg:col-span-5 lg:col-start-8">
            Imagens publicadas pela própria Trinity. Cada caso é individual: a indicação depende de avaliação por profissional habilitado, e as imagens não são promessa de efeito para outras pessoas.
          </p>
        </div>
        <div className="scroller -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0 lg:pb-0" tabIndex={0} aria-label="Galeria de registros, role para o lado">
          {fotos.map((f, i) => (
            <Figure
              key={f.src}
              f={f}
              sizes="(min-width:1024px) 40vw, 80vw"
              className={`w-[78vw] max-w-[420px] shrink-0 snap-start lg:w-auto lg:max-w-none ${
                ['lg:col-span-4 lg:row-span-2', 'lg:col-span-8', 'lg:col-span-4 lg:col-start-5', 'lg:col-span-4'][i % 4]
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ——— CURSOS ——— */
export function Cursos() {
  if (!CONFIG.cursos.length) return null
  return (
    <section id="cursos" data-chapter="1" aria-labelledby="cu-title" className="border-b border-ink/15">
      <div className={`${wrap} py-20 sm:py-32`}>
        <Chapter n={1} label="Cursos" />
        {CONFIG.cursos.map((c, i) => (
          <div key={c.nome} className="mt-8 grid gap-10 lg:grid-cols-12">
            <h2 id={i === 0 ? 'cu-title' : undefined} className="display text-[clamp(2.8rem,8.2vw,7.4rem)] lg:col-span-11">
              Cursos de estética <em className="text-bronze">facial</em> e corporal
            </h2>
            <div className="border-t border-ink pt-6 lg:col-span-5 lg:col-start-7">
              <p className="text-[1.15rem] leading-relaxed">{c.descricao}</p>
              <a href={wa(CONFIG.mensagens.cursos)} {...ext} className="btn btn-ink mt-7">
                Perguntar sobre os cursos
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ——— ESPAÇO E EQUIPE ——— */
export function Espaco() {
  const [rec, eq, at] = CONFIG.fotosEspaco
  if (!CONFIG.fotosEspaco.length) return null
  return (
    <section aria-labelledby="es-title">
      <div className={`${wrap} py-20 sm:py-28`}>
        <h2 id="es-title" className="display max-w-[40rem] text-[clamp(2.2rem,4.6vw,3.6rem)]">
          O espaço no Parque Catanduvas e a <em className="text-bronze">equipe</em>
        </h2>
        <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-6">
          {eq && <Figure f={eq} sizes="(min-width:1024px) 60vw, 100vw" className="col-span-12 lg:col-span-7" />}
          {rec && <Figure f={rec} sizes="(min-width:1024px) 30vw, 60vw" className="col-span-7 lg:col-span-4 lg:col-start-9 lg:mt-24" />}
          {at && <Figure f={at} sizes="(min-width:1024px) 30vw, 45vw" className="col-span-5 mt-20 lg:col-span-3 lg:col-start-4 lg:-mt-40" />}
        </div>
      </div>
    </section>
  )
}

/* ——— COMO FUNCIONA ——— */
const etapas = [
  ['Contato e agendamento', 'Você chama no WhatsApp, conta o que procura e escolhe um dia de segunda a sexta. A equipe confirma a disponibilidade.'],
  ['Avaliação individual', 'Na primeira visita, uma conversa e uma avaliação para entender o seu caso, sem compromisso de iniciar nada.'],
  ['Plano explicado com clareza', 'Se houver indicação, você recebe a proposta explicada passo a passo, antes de decidir.'],
  ['Acompanhamento', 'Sessões e retornos são combinados com você, e cada etapa é conversada antes de acontecer.'],
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    const bar = fill.current
    if (!el || !bar) return
    if (reduce) {
      bar.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    let visible = false
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.75
      const end = vh * 0.55
      const p = (start - r.top) / (r.height - (end - start) || 1)
      bar.style.transform = `scaleY(${Math.min(1, Math.max(0, p))})`
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) update()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduce])
  return (
    <section id="como-funciona" aria-labelledby="cf-title" className="grain bg-ink text-paper on-dark">
      <div className={`${wrap} grid gap-12 py-20 sm:py-28 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <h2 id="cf-title" className="display text-[clamp(2.4rem,5vw,3.8rem)] lg:sticky lg:top-[calc(var(--bar-h)+110px)]">
            Como <em className="text-bronze-soft">funciona</em> o atendimento
          </h2>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-2 left-[1.1rem] top-2 w-px bg-paper/20 sm:left-[1.6rem]" />
          <span
            ref={fill}
            aria-hidden="true"
            style={{ transform: 'scaleY(0)' }}
            className="timeline-fill absolute bottom-2 left-[1.1rem] top-2 w-[2px] -translate-x-[0.5px] bg-bronze-soft sm:left-[1.6rem]"
          />
          {etapas.map(([t, d], i) => (
            <Step key={t} i={i} t={t} d={d} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function Step({ i, t, d }: { i: number; t: string; d: string }) {
  const [ref, lit] = useInView<HTMLLIElement>('0px 0px -40% 0px')
  return (
    <li ref={ref} className="relative grid grid-cols-[2.2rem_1fr] gap-5 pb-14 last:pb-0 sm:grid-cols-[3.2rem_1fr] sm:gap-8">
      <span
        className={`relative z-10 flex h-[2.2rem] w-[2.2rem] items-center justify-center border bg-ink text-[0.85rem] tnum transition-colors duration-700 sm:h-[3.2rem] sm:w-[3.2rem] sm:text-base ${
          lit ? 'border-bronze-soft text-bronze-soft' : 'border-paper/30 text-stone-light'
        }`}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
      <div className="pt-0.5 sm:pt-2">
        <h3 className="display text-[clamp(1.7rem,3.4vw,2.6rem)]">{t}</h3>
        <p className="mt-3 max-w-[32rem] text-stone-light">{d}</p>
      </div>
    </li>
  )
}

/* ——— DÚVIDAS ——— */
const end = CONFIG.endereco
const faq: [string, React.ReactNode][] = [
  ['Como agendar?', <>Pelo WhatsApp {CONFIG.whatsappExibicao} ou pelo formulário desta página, que monta a mensagem para você. A equipe confirma a disponibilidade na conversa.</>],
  ['Como é a primeira avaliação?', 'É uma conversa individual sobre o que você procura, seguida de uma avaliação. A partir dela, a equipe explica se há indicação e quais caminhos são possíveis.'],
  ['O que levar?', 'Um documento com foto. Se você usa medicamentos, tem alguma condição de saúde ou já fez procedimentos estéticos, conte durante a avaliação, pessoalmente.'],
  ['Quais atendimentos a Trinity oferece?', 'Estética facial e estética corporal. O que é indicado para cada pessoa é definido na avaliação.'],
  ['Todo tratamento serve para todas as pessoas?', 'Não. A indicação depende de avaliação individual por profissional habilitado. Por isso nenhuma sugestão é feita antes dessa conversa.'],
  ['Quais são os horários?', `De segunda a sexta, das 9h às 18h. ${CONFIG.avisoHorarios}`],
  ['Atendem aos sábados e domingos?', 'Não. Aos sábados e domingos a Trinity fica fechada.'],
  ['Onde fica?', <>{end.rua}, {end.bairro}, {end.cidade} - {end.uf}, CEP {end.cep}. <a className="link-u" href={CONFIG.rota} {...ext}>Abrir rota no Google Maps</a>.</>],
  ['Como saber sobre os cursos de estética?', 'Pelo WhatsApp. As informações sobre os cursos são passadas diretamente na conversa.'],
  ['Posso agendar pelo site?', 'O formulário desta página monta uma mensagem com o dia e o horário de sua preferência e abre o WhatsApp. O horário só fica reservado depois que a equipe confirma a disponibilidade.'],
]

export function Duvidas() {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()
  return (
    <section id="duvidas" aria-labelledby="dv-title" className="border-b border-ink/15">
      <div className={`${wrap} grid gap-10 py-20 sm:py-28 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <h2 id="dv-title" className="display text-[clamp(2.4rem,5vw,3.8rem)] lg:sticky lg:top-[calc(var(--bar-h)+110px)]">
            Dúvidas <em className="text-bronze">frequentes</em>
          </h2>
        </div>
        <ul className="border-t border-ink lg:col-span-7 lg:col-start-6">
          {faq.map(([q, a], i) => {
            const id = `${base}-${i}`
            const isOpen = open === i
            return (
              <li key={q} className="border-b border-ink/25">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`${id}-b`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-p`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.12rem] font-medium hover:text-bronze"
                  >
                    {q}
                    <span className="acc-mark" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acc-panel" data-open={isOpen}>
                  <div>
                    <p className={`max-w-[38rem] pb-6 text-stone ${isOpen ? '' : 'invisible'}`}>{a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ——— LOCALIZAÇÃO E CONTATO ——— */
export function Local() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(new Date().getDay()), [])
  // segunda a domingo
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  return (
    <section id="contato" data-chapter="2" aria-labelledby="lc-title" className="bg-paper-2">
      <div className={`${wrap} py-20 sm:py-28`}>
        <Chapter n={2} label="Contato" />
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="lc-title" className="display text-[clamp(2.6rem,6vw,4.6rem)]">
              Venha nos <em className="text-bronze">visitar</em>
            </h2>
            <address className="mt-8 not-italic text-[1.15rem] leading-relaxed">
              {end.rua}
              <br />
              {end.bairro}, {end.cidade} - {end.uf}
              <br />
              CEP {end.cep}
            </address>
            <table className="mt-10 w-full max-w-[26rem] border-t border-ink text-[0.98rem]">
              <caption className="label pb-3 text-left text-stone">Horários</caption>
              <tbody>
                {ordem.map((d) => {
                  const h = CONFIG.horarios[d]
                  return (
                    <tr key={h.dia} className={`border-b border-ink/15 ${d === hoje ? 'font-medium' : ''}`}>
                      <th scope="row" className="py-2.5 text-left font-[inherit]">
                        {h.dia}
                        {d === hoje && <span className="ml-2 text-[0.8rem] text-bronze">hoje</span>}
                      </th>
                      <td className="tnum py-2.5 text-right">{h.abre && h.fecha ? `${h.abre.replace(':', 'h')} às ${h.fecha.replace(':', 'h')}` : 'Fechado'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-3 text-[0.9rem] text-stone">{CONFIG.avisoHorarios}</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href={CONFIG.rota} {...ext} className="btn btn-ink">
                Como chegar
              </a>
              <a href={wa(CONFIG.mensagens.geral)} {...ext} className="btn btn-line">
                Agendar pelo WhatsApp
              </a>
              <a href={CONFIG.instagram} {...ext} className="btn btn-line sm:col-span-2">
                Ver no Instagram
              </a>
            </div>
          </div>
          <div className="min-h-[340px] lg:col-span-6 lg:col-start-7">
            <iframe
              title={`Mapa: ${end.rua}, ${end.bairro}, ${end.cidade}`}
              src={CONFIG.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[340px] w-full border border-ink/20 grayscale-[35%] sepia-[15%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ——— CTA FINAL ——— */
export function CtaFinal() {
  return (
    <section data-chapter="2" aria-labelledby="cta-title" className="grain relative overflow-hidden bg-ink text-paper on-dark">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[30vw] -top-[10vw] w-[90vw] opacity-90 sm:-right-[12vw] sm:w-[60vw] lg:-right-[6vw] lg:top-1/2 lg:w-[min(46vw,640px)] lg:-translate-y-1/2">
        <Knot idPrefix="cta" gap="var(--ink)" ink="var(--paper)" on="var(--bronze-soft)" width={5} widthOn={12} active={2} />
      </div>
      <div className={`${wrap} relative py-24 pt-[80vw] sm:pt-[50vw] lg:py-36`}>
        <h2 id="cta-title" className="display max-w-[14ch] text-[clamp(2.8rem,7vw,6rem)]">
          O primeiro passo é uma <em className="text-bronze-soft">conversa</em>.
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={wa(CONFIG.mensagens.geral)} {...ext} className="btn btn-paper">
            Agendar avaliação
          </a>
          {CONFIG.cursos.length > 0 && (
            <a href={wa(CONFIG.mensagens.cursos)} {...ext} className="btn btn-line-paper">
              Perguntar sobre os cursos
            </a>
          )}
          <a href={CONFIG.instagram} {...ext} className="btn btn-line-paper">
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

/* ——— PROFISSIONAIS (só aparece com dados) ——— */
export function Profissionais() {
  const ps = CONFIG.profissionais.filter((p) => p.nome && p.registro)
  if (!ps.length) return null
  return (
    <section aria-labelledby="pf-title">
      <div className={`${wrap} py-20`}>
        <h2 id="pf-title" className="display text-[clamp(2.2rem,4.6vw,3.6rem)]">Quem atende</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {ps.map((p) => (
            <li key={p.nome} className="border-t border-ink pt-5">
              {p.foto && <img src={p.foto} alt={p.nome} loading="lazy" className="mb-5 w-full object-cover" />}
              <p className="display text-[1.8rem]">{p.nome}</p>
              <p className="text-stone">
                {p.profissao} · {p.registro}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ——— RODAPÉ ——— */
export function Footer() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="bg-ink pb-24 text-paper on-dark md:pb-10">
      <div className={`${wrap} grid gap-12 border-t border-paper/15 py-16 lg:grid-cols-12`}>
        <div className="lg:col-span-3">
          <Logo tone="dark" layout="stack" idPrefix="ft" className="w-[200px]" />
        </div>
        <div className="text-[0.98rem] leading-relaxed text-paper/85 lg:col-span-4 lg:col-start-5">
          <address className="not-italic">
            {end.rua}
            <br />
            {end.bairro}, {end.cidade} - {end.uf}, CEP {end.cep}
          </address>
          <p className="mt-4">Segunda a sexta, 9h às 18h</p>
        </div>
        <ul className="space-y-1 text-[0.98rem] lg:col-span-3 lg:col-start-10">
          <li>
            <a className="link-u inline-flex min-h-12 items-center" href={wa(CONFIG.mensagens.geral)} {...ext}>
              WhatsApp {CONFIG.whatsappExibicao}
            </a>
          </li>
          <li>
            <a className="link-u inline-flex min-h-12 items-center" href={CONFIG.instagram} {...ext}>
              Instagram {CONFIG.instagramUsuario}
            </a>
          </li>
          <li>
            <a className="link-u inline-flex min-h-12 items-center" href="/privacidade.html">
              Privacidade
            </a>
          </li>
        </ul>
        <div className="border-t border-paper/15 pt-8 text-[0.85rem] leading-relaxed text-stone-light lg:col-span-12">
          <p className="max-w-[52rem]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação individual por profissional habilitado.
          </p>
          {rt.nome && rt.registro && (
            <p className="mt-2">
              Responsável técnico: {rt.nome}, {rt.registro}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
