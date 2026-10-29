import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { CONFIG } from '../config'
import { MSG_FASE, waLink } from '../lib/whatsapp'
import { linhasHorario } from '../lib/horarios'
import { Blob, Brilho, CoracaoTraco, Estrela, IlustraCoracao, IlustraEscova, IlustraEstrela, IlustraLua, Laco } from './Decor'
import {
  IconAproximacao,
  IconBroto,
  IconCadeira,
  IconCalendario,
  IconCartao,
  IconCheck,
  IconConversa,
  IconCoracao,
  IconInsta,
  IconLupa,
  IconRelogio,
  IconSeta,
  IconWhats,
} from './Icons'
import { Revela, TextReveal, type Parte } from './TextReveal'

export function Cabecalho({
  id,
  rotulo,
  titulo,
  intro,
  centro,
  claro,
}: {
  id: string
  rotulo?: string
  titulo: Parte[]
  intro?: ReactNode
  centro?: boolean
  claro?: boolean
}) {
  return (
    <div className={`max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
      {rotulo && (
        <p className={`rotulo ${claro ? '!text-ceu-100' : ''}`}>
          {rotulo}
        </p>
      )}
      <h2 id={id} className={`mt-3 text-[2.15rem] sm:text-5xl lg:text-[3.3rem] ${claro ? '!text-creme' : ''}`}>
        <TextReveal partes={titulo} />
      </h2>
      {intro && (
        <Revela delay={0.15}>
          <p className={`mt-5 text-lg ${claro ? 'text-creme/80' : 'text-tinta-2'}`}>{intro}</p>
        </Revela>
      )}
    </div>
  )
}

/* ---------------- O consultório / filosofia ---------------- */

export function Consultorio() {
  const pilares = [
    {
      icon: <IconCoracao size={26} />,
      t: 'Acolhimento',
      d: 'Um ambiente pensado para que a criança se sinta segura e a família, bem recebida, desde a chegada.',
    },
    {
      icon: <IconConversa size={26} />,
      t: 'Explicação clara aos pais',
      d: 'Você entende o que foi observado, o que se recomenda e por quê. Perguntas são sempre bem-vindas.',
    },
    {
      icon: <IconBroto size={26} />,
      t: 'Cuidado em cada fase',
      d: 'Do primeiro dentinho à adolescência, orientações que acompanham o crescimento do seu filho.',
    },
  ]
  return (
    <section id="consultorio" aria-labelledby="t-consultorio" className="relative py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Cabecalho id="t-consultorio" rotulo="o consultório da Tia" titulo={['Um consultório que respeita o', { em: 'tempo' }, 'da criança.']} />
          <Revela delay={0.1}>
            <div className="mt-6 space-y-4 text-lg text-tinta-2">
              <p>
                Cada criança chega de um jeito: curiosa, tímida, cansada, cheia de perguntas. Por isso, o atendimento começa com calma,
                conversa e tempo para conhecer o espaço.
              </p>
              <p>
                A Dra. Jessika explica cada passo para a criança, com palavras que ela entende, e para os pais, com clareza e sem pressa.
              </p>
            </div>
          </Revela>
          <Laco className="mt-8 w-48 text-framboesa/60" />
        </div>
        <ul className="grid gap-4">
          {pilares.map((p, i) => (
            <Revela as="li" key={p.t} delay={i * 0.08}>
              <div className="cartao flex flex-col gap-4 p-6 sm:flex-row sm:gap-5 md:p-7">
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ceu-50 text-ceu-700">{p.icon}</span>
                <div>
                  <h3 className="text-2xl">{p.t}</h3>
                  <p className="mt-1.5 text-tinta-2">{p.d}</p>
                </div>
              </div>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Atendimento por fase ---------------- */

/** Cartão com brilho suave que segue o ponteiro (adaptado da ideia "Spotlight", 21st.dev) */
function CartaoLuz({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onPointerMove={move}
      className={`group cartao relative h-full overflow-hidden transition-[transform,box-shadow] duration-500 ease-[var(--ease-suave)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(28_41_67/0.35)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), rgb(222 104 126 / 0.10), transparent 60%)' }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  )
}

export function Fases() {
  const fases = [
    {
      t: 'Bebês',
      il: <IlustraLua className="size-20 text-ceu-700" />,
      d: 'Os primeiros dentes trazem muitas dúvidas: higiene da boca, alimentação e hábitos como chupeta e mamadeira. A consulta é um momento de orientação para a família começar com tranquilidade.',
      msg: MSG_FASE.bebes,
      cor: 'bg-ceu-50',
    },
    {
      t: 'Crianças',
      il: <IlustraEstrela className="size-20 text-framboesa-600" />,
      d: 'Fase de descobertas e de criar hábitos. O atendimento acontece no ritmo da criança, com explicações simples e incentivo para que ela participe do próprio cuidado.',
      msg: MSG_FASE.criancas,
      cor: 'bg-framboesa-50',
    },
    {
      t: 'Adolescentes',
      il: <IlustraEscova className="size-20 text-ceu-700" />,
      d: 'Com mais autonomia, chegam novas rotinas e preocupações. A conversa é direta e respeitosa, envolvendo o adolescente nas decisões sobre a própria saúde bucal.',
      msg: MSG_FASE.adolescentes,
      cor: 'bg-ceu-50',
    },
  ]
  return (
    <section id="atendimento" aria-labelledby="t-atendimento" className="relative bg-papel/70 py-20 md:py-28">
      <div className="container-site">
        <Cabecalho
          id="t-atendimento"
          rotulo="atendimento por fase"
          titulo={['Um cuidado para cada', { em: 'fase', }, 'do crescimento.']}
          intro="Cada idade tem as próprias necessidades. Veja, de forma geral, como o cuidado acompanha o crescimento do seu filho."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {fases.map((f, i) => (
            <Revela as="li" key={f.t} delay={i * 0.08}>
              <CartaoLuz className="p-7">
                <span className={`inline-flex size-24 items-center justify-center rounded-[2rem] ${f.cor}`}>{f.il}</span>
                <h3 className="mt-6 text-3xl">{f.t}</h3>
                <p className="mt-3 text-tinta-2">{f.d}</p>
                <p className="mt-4 text-sm font-semibold text-tinta-3">A indicação de cada cuidado depende de avaliação individual.</p>
                <a
                  href={waLink(f.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex min-h-12 items-center gap-2 pt-6 font-extrabold text-framboesa-600 hover:text-framboesa-700"
                >
                  Conversar sobre esta fase
                  <IconSeta size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="sr-only"> ({f.t}, abre o WhatsApp)</span>
                </a>
              </CartaoLuz>
            </Revela>
          ))}
        </ul>

        <Revela className="mt-5">
          <CartaoLuz className="p-7 md:p-10">
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
              <span className="inline-flex size-24 items-center justify-center rounded-[2rem] bg-framboesa-50">
                <IlustraCoracao className="size-20 text-framboesa-600" />
              </span>
              <div>
                <h3 className="text-3xl">Acompanhamento do desenvolvimento dos maxilares</h3>
                <p className="mt-3 max-w-3xl text-tinta-2">
                  A Ortopedia Funcional dos Maxilares observa como os ossos da face e a mordida se desenvolvem durante o crescimento, junto de
                  funções como respirar, mastigar e engolir. Na avaliação, a doutora verifica se há algo a acompanhar e explica aos pais, com
                  calma, o que foi observado.
                </p>
                <p className="mt-3 text-sm font-semibold text-tinta-3">A indicação depende de avaliação individual.</p>
              </div>
              <a href={waLink(MSG_FASE.maxilares)} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                Conversar sobre isso
                <span className="sr-only"> (abre o WhatsApp)</span>
              </a>
            </div>
          </CartaoLuz>
        </Revela>
      </div>
    </section>
  )
}

/* ---------------- Para os pais ---------------- */

export function Pais() {
  const dicas = [
    'Conte com naturalidade: “Vamos conhecer a dentista que cuida dos dentinhos.”',
    'Fale a verdade, de forma simples e sem fazer promessas. Dizer que a doutora vai explicar cada passo ajuda mais.',
    'Evite usar a consulta como ameaça ou castigo, e evite contar experiências ruins perto da criança.',
    'Prefira um horário em que ela esteja descansada e alimentada.',
    'Responda às perguntas dela com calma. O que você não souber, a doutora explica na consulta.',
  ]
  return (
    <section id="pais" aria-labelledby="t-pais" className="relative py-20 md:py-28">
      <div className="container-site">
        <Cabecalho
          id="t-pais"
          rotulo="para os pais"
          titulo={['Um passo de cada vez, sem', { em: 'pressa.' }]}
          intro="É normal sentir um pouco de ansiedade antes da primeira consulta, tanto a criança quanto a família. Algumas orientações ajudam."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Revela className="grid gap-5">
            <div className="cartao p-7 md:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-ceu-50 text-ceu-700">
                <IconLupa size={24} />
              </span>
              <h3 className="mt-5 text-2xl md:text-[1.75rem]">O que esperar da primeira visita</h3>
              <p className="mt-3 text-tinta-2">
                Uma conversa sobre a história e a rotina da criança, tempo para conhecer o consultório e uma avaliação feita com calma. No
                final, você recebe as orientações e pode tirar suas dúvidas.
              </p>
            </div>
            <div className="cartao p-7 md:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-framboesa-50 text-framboesa-600">
                <IconCoracao size={24} />
              </span>
              <h3 className="mt-5 text-2xl md:text-[1.75rem]">A sua presença ajuda</h3>
              <p className="mt-3 text-tinta-2">
                Uma família tranquila transmite segurança. {CONFIG.paisAcompanham ? CONFIG.paisAcompanham : 'Ao agendar, a equipe explica como a família participa do atendimento, de acordo com a idade da criança.'}
              </p>
            </div>
          </Revela>
          <Revela delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-[var(--radius-xl2)] bg-ceu-100/70 p-7 md:p-10">
              <Blob className="absolute -right-24 -top-24 w-72 text-white/45" d={1} />
              <Estrela className="absolute right-8 top-8 hidden size-10 text-framboesa/70 sm:block" />
              <h3 className="relative text-2xl md:text-[1.75rem]">Como preparar a criança</h3>
              <ul className="relative mt-6 space-y-4">
                {dicas.map((d) => (
                  <li key={d} className="flex gap-3.5">
                    <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-ceu-700">
                      <IconCheck size={16} />
                    </span>
                    <span className="text-tinta">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Revela>
        </div>
      </div>
    </section>
  )
}

/* ---------------- A primeira consulta (linha do tempo) ---------------- */

export function PrimeiraConsulta() {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })
  const etapas = [
    { t: 'Contato pelo WhatsApp e agendamento', d: 'Você conta um pouco sobre seu filho, e a equipe combina com você o melhor dia e horário.' },
    { t: 'Conversa e conhecimento do espaço', d: 'A criança chega, conhece o ambiente e a doutora com calma, antes de qualquer etapa.' },
    { t: 'Avaliação no ritmo da criança', d: 'Cada passo é explicado antes de acontecer, respeitando o tempo e o jeito de cada um.' },
    { t: 'Orientação clara aos pais', d: 'Você entende o que foi observado, recebe orientações de cuidado em casa e conhece os próximos passos, se houver.' },
  ]
  return (
    <section id="primeira-consulta" aria-labelledby="t-primeira" className="relative overflow-hidden bg-papel/70 py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho
            id="t-primeira"
            rotulo="como funciona"
            titulo={['A primeira', { em: 'consulta.' }]}
            intro="Quatro momentos simples, pensados para que a criança se sinta segura e a família saia sabendo exatamente o que foi feito."
          />
          <Revela delay={0.2}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-8">
              <IconWhats size={20} />
              Agendar a primeira consulta
            </a>
          </Revela>
        </div>
        <ol ref={ref} className="relative ml-1 space-y-6 pl-12 md:pl-16">
          <span aria-hidden="true" className="absolute bottom-4 left-[1.1rem] top-4 w-[2px] rounded-full bg-tinta/10 md:left-[1.35rem]" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-4 left-[1.1rem] top-4 w-[2px] origin-top rounded-full bg-framboesa md:left-[1.35rem]"
            style={reduced ? undefined : { scaleY }}
          />
          {etapas.map((e, i) => (
            <Revela as="li" key={e.t} className="relative" delay={0.05}>
              <span className="absolute -left-12 top-5 inline-flex size-9 items-center justify-center rounded-full border-2 border-framboesa bg-creme font-display text-lg font-semibold text-framboesa-600 md:-left-16 md:size-11 md:text-xl">
                {i + 1}
              </span>
              <div className="cartao p-6 md:p-7">
                <h3 className="text-2xl">{e.t}</h3>
                <p className="mt-2 text-tinta-2">{e.d}</p>
              </div>
            </Revela>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- A profissional ---------------- */

export function Profissional() {
  const foto = CONFIG.fotos.doutora
  const esp = CONFIG.mostrarEspecialidades ? CONFIG.formacao.especialidades : []
  return (
    <section id="profissional" aria-labelledby="t-profissional" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Revela className="relative mx-auto w-full max-w-md">
            <Blob className="absolute -inset-[10%] text-ceu-100/80" d={1} />
            <Brilho className="absolute -left-4 top-6 z-10 size-10 text-framboesa" />
            <CoracaoTraco className="absolute -right-5 bottom-10 z-10 w-14 text-ceu" />
            {foto ? (
              <img
                src={foto.src}
                srcSet={foto.srcSet}
                sizes="(min-width: 1024px) 420px, 88vw"
                width={foto.width}
                height={foto.height}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                className="relative aspect-[4/5] w-full rounded-[2.75rem] object-cover shadow-[0_30px_60px_-36px_rgb(28_41_67/0.5)]"
              />
            ) : (
              <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-[2.75rem] bg-creme shadow-[0_30px_60px_-36px_rgb(28_41_67/0.4)]">
                <span className="font-mao text-[9rem] font-semibold leading-none" aria-hidden="true">
                  <span className="text-ceu">T</span>
                  <span className="text-framboesa">J</span>
                </span>
                <span className="sr-only">Monograma Tia Jessika</span>
              </div>
            )}
          </Revela>

          <div>
            <p className="rotulo">quem cuida</p>
            <h2 id="t-profissional" className="mt-3 text-[2.15rem] sm:text-5xl lg:text-[3.3rem]">
              <TextReveal partes={['Conheça a', { em: 'Tia Jessika.' }]} />
            </h2>
            <Revela delay={0.1}>
              <p className="mt-6 text-lg text-tinta-2">
                {CONFIG.nome} é cirurgiã-dentista e dedica o seu trabalho ao cuidado de bebês, crianças e adolescentes. Para as crianças, ela é
                a <span className="font-mao text-[1.45em] font-semibold leading-none text-framboesa-600">Tia Jessika</span>, alguém que conversa,
                explica e respeita o tempo de cada uma. Para os pais, uma profissional que esclarece cada etapa do cuidado.
              </p>
              <div className="cartao mt-8 p-6 md:p-8">
                <p className="font-display text-2xl" style={{ fontVariationSettings: "'SOFT' 100" }}>
                  {CONFIG.nome}
                </p>
                <p className="mt-1 font-bold text-tinta-2">
                  {CONFIG.titulo} · {CONFIG.cro}
                </p>
                <ul className="mt-5 space-y-3 border-t border-tinta/10 pt-5">
                  <li className="flex gap-3">
                    <Estrela className="mt-1 size-5 shrink-0 text-ceu-700" strokeWidth={2.6} />
                    <span>{CONFIG.formacao.graduacao}</span>
                  </li>
                  {esp.map((e) => (
                    <li key={e.nome} className="flex gap-3">
                      <Estrela className="mt-1 size-5 shrink-0 text-framboesa-600" strokeWidth={2.6} />
                      <span>
                        <strong className="block font-extrabold">{e.nome}</strong>
                        <span className="text-sm text-tinta-2">
                          {e.instituicao ? `${e.instituicao} · ` : ''}
                          <span className="whitespace-nowrap">{CONFIG.cro}</span>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 items-center gap-2.5 font-extrabold text-tinta hover:text-framboesa-600"
              >
                <IconInsta size={22} />
                Acompanhe no Instagram: {CONFIG.instagramUsuario}
              </a>
            </Revela>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Estrutura e conforto ---------------- */

export function Estrutura() {
  const pagIcons = [<IconCartao key="c" size={22} />, <IconCartao key="d" size={22} />, <IconAproximacao key="a" size={22} />]
  const grupos = [
    {
      t: 'Acessibilidade',
      icon: <IconCadeira size={26} />,
      itens: CONFIG.estrutura.acessibilidade.map((x) => ({ x, i: <IconCheck size={20} /> })),
    },
    {
      t: 'Atendimento com hora marcada',
      icon: <IconCalendario size={26} />,
      itens: CONFIG.horaMarcada
        ? [
            { x: 'Recomendamos agendar antes da visita', i: <IconCheck size={20} /> },
            ...linhasHorario().map((l) => ({ x: `${l.dias}: ${l.horas}`, i: <IconRelogio size={20} /> })),
          ]
        : [],
    },
    {
      t: 'Formas de pagamento',
      icon: <IconCartao size={26} />,
      itens: CONFIG.estrutura.pagamento.map((x, k) => ({ x, i: pagIcons[k] ?? <IconCheck size={20} /> })),
    },
  ].filter((g) => g.itens.length)
  if (!grupos.length) return null
  return (
    <section id="estrutura" aria-labelledby="t-estrutura" className="relative bg-papel/70 py-20 md:py-28">
      <div className="container-site">
        <Cabecalho id="t-estrutura" rotulo="estrutura e conforto" titulo={['Pensado para receber bem', { em: 'toda' }, 'a família.']} centro />
        <ul className={`mt-12 grid gap-5 ${grupos.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {grupos.map((g, k) => (
            <Revela as="li" key={g.t} delay={k * 0.08}>
              <div className="cartao h-full p-7">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-ceu-50 text-ceu-700">{g.icon}</span>
                <h3 className="mt-5 text-2xl">{g.t}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.itens.map((it) => (
                    <li key={it.x} className="flex items-start gap-3 text-tinta-2">
                      <span className="mt-0.5 shrink-0 text-framboesa-600">{it.i}</span>
                      {it.x}
                    </li>
                  ))}
                </ul>
              </div>
            </Revela>
          ))}
        </ul>
        {CONFIG.fotos.consultorio.length > 0 && (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.fotos.consultorio.map((f) => (
              <li key={f.src}>
                <img src={f.src} srcSet={f.srcSet} alt={f.alt} width={f.width} height={f.height} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[var(--radius-xl2)] object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/* ---------------- Marquee discreto ---------------- */

/** Inspirado no "Marquee" (kevingirelli, 21st.dev): pausa no hover, fora da tela e com movimento reduzido. Decorativo. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.setAttribute('data-pausado', String(!e.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const itens = ['Bebês', 'Crianças', 'Adolescentes', 'Acolhimento', 'Explicação clara aos pais', 'No tempo da criança', 'Alfenas - MG']
  const lista = (copia: boolean) => (
    <ul className={`flex shrink-0 items-center ${copia ? 'marquee-copia' : ''}`}>
      {itens.map((t) => (
        <li key={t} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-2xl italic text-tinta-2 md:text-3xl" style={{ fontVariationSettings: "'SOFT' 100" }}>
            {t}
          </span>
          <Brilho className="size-5 text-framboesa" strokeWidth={2.4} onMount />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className="marquee relative overflow-hidden border-y border-tinta/10 bg-creme py-5" aria-hidden="true" data-pausado="false">
      <div className="marquee-trilho">
        {lista(false)}
        {lista(true)}
      </div>
    </div>
  )
}
