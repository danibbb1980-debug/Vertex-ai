import { Suspense, lazy, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CONFIG, enderecoLinha1, enderecoLinha2, hora, temTexto, type Procedimento } from '../config'
import { helice } from '../lib/helice'
import { FOTOS } from '../fotos'
import { HeliceDesenho } from './helice'
import { BotaoLink, BotaoWa, Enfase, Logo, useEmVista, useMontado } from './ui'

// movimento (lib motion) em um bloco separado, carregado depois do conteúdo
const ProgressoLinha = lazy(() => import('./movimento').then((m) => ({ default: m.ProgressoLinha })))

const insta = () => temTexto(CONFIG.instagram.url)

/* ---------------------------------------------------------------- fitas */

/** Par de fitas horizontais, fio condutor entre blocos. */
function FitasHorizontais({ tom = 'claro', className = '', voltas = 2.4 }: { tom?: 'claro' | 'escuro'; className?: string; voltas?: number }) {
  const g = useMemo(() => helice({ largura: 60, altura: 1440, voltas, amp: 18, passos: 120, fase: 1.1 }), [voltas])
  const [a, b] = tom === 'claro' ? ['var(--color-agua)', 'var(--color-agua-escura)'] : ['var(--color-agua-clara)', 'var(--color-agua)']
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block h-[60px] w-full ${className}`} aria-hidden="true" focusable="false">
      <g transform="translate(0 60) rotate(-90)" fill="none">
        <path d={g.a[0]} stroke={a} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <path d={g.b[0]} stroke={b} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- hero */

export function Hero() {
  const algumHorario = CONFIG.horarios.filter((d) => d.abre)
  return (
    <section id="topo" className="relative isolate overflow-hidden pt-[7.5rem] md:pt-[9rem]">
      <div
        className="pointer-events-none absolute -right-[52%] top-[6.5rem] -z-10 h-[36rem] w-[30rem] opacity-60 sm:-right-[22%] sm:opacity-80 md:right-[-8%] md:top-[5rem] md:h-[calc(100%-3rem)] md:w-[42vw] md:opacity-100 lg:right-[-3%] xl:right-[2%]"
      >
        <HeliceDesenho className="h-full w-full" />
      </div>

      <div className="moldura grid grid-cols-12 content-center gap-y-8 pb-14 pt-6 md:min-h-[min(44rem,calc(100svh-9rem))] md:pb-16 md:pt-0">
        <div className="col-span-12 md:col-span-10 lg:col-span-9">
          <p className="rotulo mb-7 text-agua-escura">Estética facial · Varginha - MG</p>
          <h1 className="text-[clamp(2.9rem,9.4vw,6.1rem)] leading-[0.98] tracking-[-0.03em] text-petroleo md:whitespace-nowrap">
            <span className="linha-titulo"><span>Cada rosto pede</span></span>
            <span className="linha-titulo"><span style={{ '--atraso': '0.22s' } as CSSProperties}>uma avaliação</span></span>
            <span className="linha-titulo">
              <span style={{ '--atraso': '0.34s' } as CSSProperties}>
                <em className="font-light text-agua-escura">individual</em>.
              </span>
            </span>
          </h1>
          <p className="mt-8 max-w-[30ch] text-[1.125rem] leading-relaxed text-grafite md:text-[1.25rem]">
            Atendimento com horário marcado, no bairro {CONFIG.endereco.bairro}, em {CONFIG.endereco.cidade}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWa>Agendar avaliação</BotaoWa>
            {CONFIG.secoes.procedimentos && CONFIG.procedimentos.length > 0 && (
              <BotaoLink href="#procedimentos">Conhecer os procedimentos</BotaoLink>
            )}
          </div>
        </div>
      </div>

      {/* faixa de dados reais, só do cliente */}
      <div className="moldura">
        <dl className="relative grid grid-cols-1 border-t border-filete bg-perola text-[0.95rem] sm:grid-cols-3">
          <div className="border-b border-filete py-5 sm:border-b-0 sm:pr-6">
            <dt className="rotulo mb-1.5 text-grafite-2">Endereço</dt>
            <dd>
              {enderecoLinha1()}, {CONFIG.endereco.bairro}
            </dd>
          </div>
          {algumHorario.length > 0 && (
            <div className="border-b border-filete py-5 sm:border-b-0 sm:border-l sm:px-6">
              <dt className="rotulo mb-1.5 text-grafite-2">Atendimento</dt>
              <dd className="num">
                {resumoDias()}, a partir das {hora(algumHorario[0].abre)}
              </dd>
            </div>
          )}
          {CONFIG.usarWhatsapp && (
            <div className="py-5 sm:border-l sm:border-filete sm:pl-6">
              <dt className="rotulo mb-1.5 text-grafite-2">WhatsApp</dt>
              <dd className="num">
                <a className="sublinha inline-flex min-h-11 items-center" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagens.geral)}`} target="_blank" rel="noopener noreferrer">
                  {CONFIG.whatsappExibicao}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}

function resumoDias() {
  const abertos = CONFIG.horarios.filter((d) => d.abre).sort((a, b) => a.dow - b.dow)
  if (!abertos.length) return ''
  const seguidos = abertos.every((d, i) => i === 0 || d.dow === abertos[i - 1].dow + 1)
  if (seguidos && abertos.length > 2) return `${abertos[0].nome.split('-')[0]} a ${abertos[abertos.length - 1].nome.split('-')[0].toLowerCase()}`
  return abertos.map((d) => d.curto).join(', ')
}

/* ---------------------------------------------------------------- o atendimento */

const TEMPOS = [
  {
    titulo: 'Avaliação individual',
    texto: 'Antes de qualquer procedimento, uma conversa para entender o que você procura e o seu histórico.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'Indicação, cuidados, limites e possíveis efeitos apresentados de forma direta. A decisão é sua.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Orientações para os dias seguintes e um canal aberto pelo WhatsApp para tirar dúvidas.',
  },
]

export function Atendimento() {
  return (
    <section
      id="atendimento"
      data-tom="escuro"
      aria-labelledby="t-atendimento"
      className="escuro grao relative overflow-hidden bg-petroleo py-24 text-perola md:py-36"
    >
      <div className="moldura grid grid-cols-12 gap-y-6">
        <p className="rotulo col-span-12 text-agua-clara md:col-span-3 md:pt-4">O atendimento</p>
        <h2 id="t-atendimento" className="col-span-12 text-[clamp(2.4rem,6vw,5rem)] md:col-span-9 lg:col-span-8">
          <Enfase texto="Primeiro, a conversa. Depois, a *decisão*." />
        </h2>
      </div>

      <FitasHorizontais tom="escuro" className="my-14 md:my-20" />

      <ol className="moldura">
        {TEMPOS.map((t, i) => (
          <li
            key={t.titulo}
            className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-nevoa/25 py-9 last:border-b md:py-12"
          >
            <span className="num col-span-2 font-serif text-[1rem] italic text-agua-clara md:col-span-1" aria-hidden="true">
              {['i.', 'ii.', 'iii.'][i] ?? `${i + 1}.`}
            </span>
            <h3
              className={`col-span-10 text-[clamp(2rem,5.2vw,4.25rem)] md:col-span-6 ${i % 2 === 1 ? 'md:col-start-3' : ''}`}
            >
              {t.titulo}
            </h3>
            <p className={`col-span-12 max-w-[38ch] text-nevoa md:col-span-4 ${i % 2 === 1 ? 'md:col-start-9' : 'md:col-start-8'} col-start-1 sm:col-start-3`}>
              {t.texto}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------------------------------------------------------------- procedimentos */

function ItemProcedimento({ p, i }: { p: Procedimento; i: number }) {
  const [aberto, setAberto] = useState(i === 0)
  const [ref, visto] = useEmVista<HTMLLIElement>('0px 0px -30% 0px')
  const id = `proc-${p.id}`
  return (
    <li ref={ref} className="border-t border-filete last:border-b">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          id={`${id}-botao`}
          onClick={() => setAberto((v) => !v)}
          className="group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-5 py-7 text-left md:gap-x-10 md:py-10"
        >
          <span
            aria-hidden="true"
            className={`acende num font-serif text-[clamp(3rem,8vw,6.5rem)] font-light leading-none tracking-[-0.04em] ${
              visto ? 'text-agua-escura' : 'text-bruma'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-serif text-[clamp(1.8rem,4.4vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em] text-petroleo transition-transform duration-500 group-hover:translate-x-2">
            {p.nome}
          </span>
          <span className="cruz text-grafite" aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-painel`} role="region" aria-labelledby={`${id}-botao`} className="painel" data-aberto={aberto}>
        <div>
          <div className="grid gap-6 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 md:pb-12 md:pl-[calc(clamp(3rem,8vw,6.5rem)*1.25+2.5rem)]" inert={!aberto}>
            <div className="max-w-[46ch]">
              <p className="text-[1.0625rem]">{p.descricao}</p>
              <p className="mt-4 text-[0.9rem] text-grafite-2">
                A indicação depende de avaliação individual por profissional habilitado.
              </p>
            </div>
            <BotaoWa mensagem={CONFIG.mensagens.procedimento(p.nome)} rotuloAcessivel={`Agendar avaliação sobre ${p.nome.toLowerCase()} pelo WhatsApp`}>
              Agendar avaliação
            </BotaoWa>
          </div>
        </div>
      </div>
    </li>
  )
}

export function Procedimentos() {
  if (!CONFIG.procedimentos.length) return null
  return (
    <section id="procedimentos" aria-labelledby="t-procedimentos" className="py-24 md:py-36">
      <div className="moldura grid grid-cols-12 gap-y-12 lg:gap-x-10">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="rotulo mb-6 text-agua-escura">Procedimentos</p>
            <h2 id="t-procedimentos" className="text-[clamp(2.4rem,5vw,4rem)] text-petroleo">
              <Enfase texto="Cada indicação é *individual*." />
            </h2>
            <p className="mt-6 max-w-[34ch] text-grafite-2">
              Todo procedimento começa por uma avaliação. Abra cada item para ler uma descrição geral.
            </p>
          </div>
        </div>
        <ol className="col-span-12 lg:col-span-8">
          {CONFIG.procedimentos.map((p, i) => (
            <ItemProcedimento key={p.id} p={p} i={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- profissional */

/** <img> responsiva: usa a variante "-640.webp" quando o arquivo é .webp. */
function Foto({ src, alt, className = '', sizes }: { src: string; alt: string; className?: string; sizes: string }) {
  const pequena = src.endsWith('.webp') ? src.replace(/\.webp$/, '-640.webp') : ''
  return (
    <img
      src={src}
      srcSet={pequena ? `${pequena} 640w, ${src} 1100w` : undefined}
      sizes={pequena ? sizes : undefined}
      width={1100}
      height={1375}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`aspect-[4/5] w-full object-cover ${className}`}
    />
  )
}

export function Profissional() {
  const lista = CONFIG.profissionais.filter((p) => temTexto(p.nome))
  if (!lista.length) return null
  return (
    <section id="profissional" aria-labelledby="t-profissional" className="relative overflow-hidden bg-perola-2 pb-20 pt-24 md:pb-28 md:pt-32">
      {lista.map((p, idx) => {
        const fotos = [...p.fotos.filter(temTexto), ...(idx === 0 ? FOTOS : [])]
        const [principal, segunda] = fotos
        const partes = p.nome.trim().split(/\s+/)
        const ultimo = partes.length > 1 ? partes.pop() : undefined
        const linhaRegistro = [p.profissao, p.registro].filter(temTexto).join(' · ')
        const nome = (
          <h2
            id={idx === 0 ? 't-profissional' : undefined}
            className={`relative leading-[0.9] tracking-[-0.045em] text-petroleo ${
              principal
                ? 'text-[clamp(4.4rem,22vw,6.5rem)] md:text-[clamp(5rem,10.5vw,10rem)]'
                : 'text-[clamp(4.6rem,24vw,7rem)] sm:text-[clamp(4rem,14.5vw,12.5rem)]'
            }`}
          >
            <span className={principal ? 'block' : 'block sm:inline'}>{partes.join(' ')}</span>
            {ultimo && (
              <>
                {' '}
                <em className={`block pl-[0.6em] font-light text-agua-escura ${principal ? '' : 'sm:inline sm:pl-0'}`}>{ultimo}</em>
              </>
            )}
          </h2>
        )
        const rodape = (
          <div className="flex flex-col gap-2 border-t border-filete pt-6">
            {temTexto(linhaRegistro) && <p className="num text-[1.0625rem] text-grafite">{linhaRegistro}</p>}
            <p className="text-grafite-2">
              Atendimento em {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, com horário marcado.
            </p>
            {insta() && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="sublinha inline-flex min-h-12 items-center self-start text-agua-escura">
                {CONFIG.instagram.usuario}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            )}
          </div>
        )

        if (!principal)
          return (
            <div key={p.nome} className="moldura relative">
              <p className="rotulo mb-10 text-agua-escura">{lista.length > 1 ? 'Profissionais' : 'A profissional'}</p>
              <div className="relative">
                <FitasHorizontais className="pointer-events-none absolute -left-5 -right-5 top-1/2 -translate-y-1/2 !h-[90px] w-[calc(100%+2.5rem)] md:-left-8 md:-right-8 md:!h-[140px] md:w-[calc(100%+4rem)]" voltas={1.6} />
                {nome}
              </div>
              <div className="mt-10">{rodape}</div>
            </div>
          )

        // com fotos: retrato à direita, nome sobreposto à esquerda, segunda foto menor
        return (
          <div key={p.nome} className="moldura relative grid grid-cols-12 gap-x-6 gap-y-10 md:gap-x-10">
            <div className="relative z-10 col-span-12 flex flex-col md:col-span-6 md:pt-6 lg:col-span-6">
              <p className="rotulo mb-8 text-agua-escura md:mb-12">{lista.length > 1 ? 'Profissionais' : 'A profissional'}</p>
              <div className="relative md:-mr-[30%]">
                <FitasHorizontais className="pointer-events-none absolute -left-5 top-1/2 -translate-y-1/2 !h-[90px] w-[calc(100%+2.5rem)] md:-left-8 md:!h-[130px] md:w-[calc(100%+2rem)]" voltas={1.3} />
                {nome}
              </div>
              {segunda && (
                <div className="mt-14 hidden w-[58%] max-w-[17rem] md:block">
                  <Foto src={segunda} alt={`${p.nome}`} sizes="17rem" />
                </div>
              )}
              <div className="mt-auto hidden pt-12 md:block">{rodape}</div>
            </div>
            <div className="relative col-span-12 row-start-2 md:col-span-6 md:col-start-7 md:row-start-1 lg:col-span-5 lg:col-start-8">
              <div className="relative">
                <Foto src={principal} alt={`Retrato de ${p.nome}`} sizes="(min-width: 768px) 40vw, 100vw" />
                {/* filetes nos cantos, como no cartão do formulário */}
                <span aria-hidden="true" className="absolute -left-3 -top-3 h-px w-20 bg-agua" />
                <span aria-hidden="true" className="absolute -left-3 -top-3 h-20 w-px bg-agua" />
                <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-px w-20 bg-agua-escura" />
                <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-20 w-px bg-agua-escura" />
              </div>
              {segunda && (
                <div className="relative -mt-24 ml-auto w-[46%] border-[6px] border-perola-2 md:hidden">
                  <Foto src={segunda} alt={`${p.nome}`} sizes="46vw" />
                </div>
              )}
              <div className="mt-10 md:hidden">{rodape}</div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

/* ---------------------------------------------------------------- como funciona */

const ETAPAS = [
  {
    titulo: 'Contato e agendamento',
    texto: 'Você envia uma mensagem pelo WhatsApp ou pelo formulário deste site. A equipe responde com os horários disponíveis.',
  },
  {
    titulo: 'Avaliação individual',
    texto: 'Uma conversa presencial para entender o que você procura, conhecer seu histórico e verificar se há indicação.',
  },
  {
    titulo: 'Plano explicado com clareza',
    texto: 'Se houver indicação, você recebe a explicação do procedimento, dos cuidados e dos possíveis efeitos, e decide com calma.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Orientações para os dias seguintes e contato aberto para tirar dúvidas.',
  },
]

function Etapa({ e, i }: { e: (typeof ETAPAS)[number]; i: number }) {
  const [ref, visto] = useEmVista<HTMLLIElement>('0px 0px -45% 0px')
  return (
    <li ref={ref} className="relative grid grid-cols-[4.5rem_1fr] gap-x-6 pb-14 last:pb-0 md:grid-cols-[9rem_1fr] md:gap-x-12 md:pb-20">
      <span
        aria-hidden="true"
        className={`acende num text-right font-serif text-[clamp(3.5rem,9vw,7rem)] font-light leading-[0.8] tracking-[-0.05em] ${
          visto ? 'text-agua-escura' : 'text-bruma'
        }`}
      >
        {i + 1}
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-[calc(4.5rem+0.75rem)] top-2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border transition-colors duration-700 md:left-[calc(9rem+1.5rem)] ${
          visto ? 'border-agua-escura bg-agua-escura' : 'border-filete bg-perola'
        }`}
      />
      <div className="pl-4 md:pl-8">
        <h3 className="text-[clamp(1.6rem,3.2vw,2.5rem)] text-petroleo">{e.titulo}</h3>
        <p className="mt-3 max-w-[44ch] text-grafite-2">{e.texto}</p>
      </div>
    </li>
  )
}

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const montado = useMontado()
  return (
    <section id="como-funciona" aria-labelledby="t-como" className="border-t border-filete py-24 md:py-36">
      <div className="moldura">
        <div className="mb-16 grid grid-cols-12 gap-y-6 md:mb-24">
          <p className="rotulo col-span-12 text-agua-escura md:col-span-3 md:pt-4">Como funciona</p>
          <h2 id="t-como" className="col-span-12 text-[clamp(2.4rem,5.5vw,4.5rem)] text-petroleo md:col-span-9">
            <Enfase texto="Quatro etapas, nenhuma *pressa*." />
          </h2>
        </div>
        <ol ref={ref} className="relative md:ml-[8.333%]">
          <span aria-hidden="true" className="absolute bottom-0 left-[calc(4.5rem+0.75rem)] top-2 w-px bg-filete md:left-[calc(9rem+1.5rem)]" />
          {montado && (
          <Suspense fallback={null}>
            <ProgressoLinha alvo={ref} className="absolute bottom-0 left-[calc(4.5rem+0.75rem)] top-2 w-px origin-top bg-agua-escura md:left-[calc(9rem+1.5rem)]" />
          </Suspense>
          )}
          {ETAPAS.map((e, i) => (
            <Etapa key={e.titulo} e={e} i={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- dúvidas */

function perguntas() {
  const abertos = CONFIG.horarios.filter((d) => d.abre).sort((a, b) => a.dow - b.dow)
  const fechados = CONFIG.horarios.filter((d) => !d.abre)
  const procs = CONFIG.procedimentos.map((p) => p.nome.toLowerCase())
  const listaProcs = procs.length > 1 ? `${procs.slice(0, -1).join(', ')} e ${procs[procs.length - 1]}` : procs[0]
  const q: { p: string; r: string }[] = []
  if (CONFIG.usarWhatsapp)
    q.push({
      p: 'Como agendar?',
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário desta página, que monta a mensagem para você. A equipe responde com os horários disponíveis e confirma o agendamento.`,
    })
  q.push(
    {
      p: 'Como é a primeira avaliação?',
      r: 'É uma conversa presencial. Você conta o que procura, responde a perguntas sobre sua saúde e seu histórico e ouve se há indicação para algum procedimento. Nada é feito sem que você entenda e concorde.',
    },
    {
      p: 'O que levar?',
      r: 'Um documento com foto. Se você usa medicamentos ou já fez procedimentos estéticos, anote essas informações para contar durante a avaliação.',
    },
  )
  if (procs.length)
    q.push({
      p: 'Quais procedimentos são oferecidos?',
      r: `${listaProcs.charAt(0).toUpperCase()}${listaProcs.slice(1)}. Se quiser saber sobre outro procedimento, pergunte pelo WhatsApp.`,
    })
  q.push({
    p: 'Todo procedimento serve para todas as pessoas?',
    r: 'Não. A indicação depende de avaliação individual por profissional habilitado. Há situações em que um procedimento não é indicado, e isso também é explicado na conversa.',
  })
  if (abertos.length)
    q.push({
      p: 'Quais são os horários?',
      r: `${abertos.map((d) => `${d.nome.split('-')[0]}, das ${hora(d.abre)} às ${hora(d.fecha)}`).join('; ')}. ${CONFIG.avisoHorarios}`,
    })
  if (fechados.some((d) => d.dow === 6) && fechados.some((d) => d.dow === 0))
    q.push({ p: 'Atendem aos sábados e domingos?', r: 'Não. O atendimento é de segunda a sexta-feira.' })
  q.push({
    p: 'Onde fica?',
    r: `${enderecoLinha1()}, ${enderecoLinha2()}, CEP ${CONFIG.endereco.cep}. O botão “Como chegar”, mais abaixo, abre a rota no Google Maps.`,
  })
  if (CONFIG.usarWhatsapp && CONFIG.secoes.agendar)
    q.push({
      p: 'Posso agendar pelo site?',
      r: 'Pelo formulário você escolhe o atendimento, a data e o horário que preferir. Ele abre o WhatsApp com a mensagem pronta; o agendamento só vale depois da confirmação da equipe. Este site não guarda os dados digitados.',
    })
  return q
}

function Pergunta({ p, r, i }: { p: string; r: string; i: number }) {
  const [aberto, setAberto] = useState(false)
  const id = `faq-${i}`
  return (
    <li className="border-t border-filete last:border-b">
      <h3 className="font-sans text-[1.125rem] font-medium leading-snug tracking-normal md:text-[1.25rem]">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-petroleo"
        >
          <span className="flex items-baseline gap-5">
            <span className="num rotulo w-6 shrink-0 text-agua-escura" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            {p}
          </span>
          <span className="cruz" aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="painel" data-aberto={aberto}>
        <div inert={!aberto}>
          <p className="max-w-[60ch] pb-7 pl-11 text-grafite-2">{r}</p>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  const q = perguntas()
  if (!q.length) return null
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="bg-perola-2 py-24 md:py-36">
      <div className="moldura grid grid-cols-12 gap-y-12 lg:gap-x-10">
        <div className="col-span-12 lg:col-span-4">
          <p className="rotulo mb-6 text-agua-escura">Dúvidas</p>
          <h2 id="t-duvidas" className="text-[clamp(2.4rem,5vw,4rem)] text-petroleo">
            <Enfase texto="Perguntas *frequentes*." />
          </h2>
        </div>
        <ul className="col-span-12 lg:col-span-8">
          {q.map((x, i) => (
            <Pergunta key={x.p} p={x.p} r={x.r} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- localização */

function MapaLazy() {
  const ref = useRef<HTMLDivElement>(null)
  const [carregar, setCarregar] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && (setCarregar(true), io.disconnect()), {
      rootMargin: '300px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (!temTexto(CONFIG.mapaEmbedUrl)) return null
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden border border-filete bg-perola-2 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {carregar && (
        <iframe
          title={`Mapa: ${enderecoLinha1()}, ${enderecoLinha2()}`}
          src={CONFIG.mapaEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.75)_contrast(0.95)]"
        />
      )}
    </div>
  )
}

export function Localizacao() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(new Date().getDay()), [])
  const ordem = [...CONFIG.horarios].sort((a, b) => ((a.dow + 6) % 7) - ((b.dow + 6) % 7))
  return (
    <section id="contato" aria-labelledby="t-contato" className="py-24 md:py-36">
      <div className="moldura">
        <div className="mb-14 grid grid-cols-12 gap-y-6 md:mb-20">
          <p className="rotulo col-span-12 text-agua-escura md:col-span-3 md:pt-4">Localização e contato</p>
          <h2 id="t-contato" className="col-span-12 text-[clamp(2.4rem,5.5vw,4.5rem)] text-petroleo md:col-span-9">
            <Enfase texto="Venha nos *visitar*." />
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="rotulo mb-4 font-sans tracking-[0.24em] text-grafite-2">Endereço</h3>
            <address className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light not-italic leading-[1.15] text-petroleo">
              {enderecoLinha1()}
              <br />
              {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
              <span className="num mt-3 block font-sans text-[0.95rem] text-grafite-2">CEP {CONFIG.endereco.cep}</span>
            </address>
            <div className="mt-9 flex flex-col gap-3">
              {temTexto(CONFIG.rotaUrl) && (
                <BotaoLink href={CONFIG.rotaUrl} externo variante="linha">
                  Como chegar
                </BotaoLink>
              )}
              <BotaoWa>Agendar pelo WhatsApp</BotaoWa>
              {insta() && (
                <BotaoLink href={CONFIG.instagram.url} externo variante="linha">
                  Ver no Instagram
                </BotaoLink>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <h3 className="rotulo mb-4 font-sans tracking-[0.24em] text-grafite-2">Horários</h3>
            <table className="num w-full text-[1rem]">
              <caption className="sr-only">Horários de atendimento por dia da semana</caption>
              <tbody>
                {ordem.map((d) => {
                  const eHoje = d.dow === hoje
                  return (
                    <tr key={d.dow} className={`border-b border-filete ${eHoje ? 'text-petroleo' : 'text-grafite'}`}>
                      <th scope="row" className="py-2.5 pr-4 text-left font-normal">
                        {d.nome.split('-')[0]}
                        {eHoje && <span className="rotulo ml-2 text-[0.625rem] text-agua-escura">hoje</span>}
                      </th>
                      <td className={`py-2.5 text-right ${eHoje ? 'font-medium' : ''} ${d.abre ? '' : 'text-grafite-2'}`}>
                        {d.abre ? `${hora(d.abre)} – ${hora(d.fecha)}` : 'Fechado'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {temTexto(CONFIG.avisoHorarios) && <p className="mt-4 text-[0.9rem] text-grafite-2">{CONFIG.avisoHorarios}</p>}
          </div>

          <div className="col-span-12 lg:col-span-5">
            <MapaLazy />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CTA final */

export function CtaFinal() {
  const [ref, visto] = useEmVista<HTMLDivElement>('0px 0px -20% 0px')
  return (
    <section data-tom="escuro" aria-labelledby="t-cta" className="escuro grao relative overflow-hidden bg-petroleo text-perola">
      <div ref={ref} className="pointer-events-none absolute -right-[40%] -top-[10%] h-[120%] w-[26rem] opacity-80 sm:-right-[10%] md:right-[2%] md:w-[32rem]">
        {visto && <HeliceDesenho tom="escuro" voltas={1.5} className="h-full w-full" atraso={0} inclinacao={-12} />}
      </div>
      <div className="moldura relative py-28 md:py-44">
        <p className="rotulo mb-7 text-agua-clara">Agendamento</p>
        <h2 id="t-cta" className="max-w-[12ch] text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.98]">
          <Enfase texto="Sua avaliação é o primeiro *passo*." />
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <BotaoWa>Agendar avaliação</BotaoWa>
          {insta() && (
            <BotaoLink href={CONFIG.instagram.url} externo>
              Ver no Instagram
            </BotaoLink>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- rodapé */

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  const mostraRt = temTexto(rt.nome) && temTexto(rt.registro)
  return (
    <footer className="border-t border-filete pb-28 pt-16 lg:pb-14">
      <div className="moldura grid grid-cols-12 gap-y-10 text-[0.95rem]">
        <div className="col-span-12 md:col-span-4">
          <Logo className="w-[180px]" />
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <h2 className="rotulo mb-3 font-sans tracking-[0.24em] text-grafite-2">Endereço</h2>
          <address className="not-italic">
            {enderecoLinha1()}
            <br />
            {enderecoLinha2()}
            <br />
            <span className="num">CEP {CONFIG.endereco.cep}</span>
          </address>
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <h2 className="rotulo mb-3 font-sans tracking-[0.24em] text-grafite-2">Contato</h2>
          <ul>
            {CONFIG.usarWhatsapp && (
              <li>
                <a className="sublinha num inline-flex min-h-11 items-center" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagens.geral)}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {temTexto(CONFIG.email) && (
              <li>
                <a className="sublinha inline-flex min-h-11 items-center break-all" href={`mailto:${CONFIG.email}`}>
                  {CONFIG.email}
                </a>
              </li>
            )}
            {insta() && (
              <li>
                <a className="sublinha inline-flex min-h-11 items-center" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="col-span-12 border-t border-filete pt-8 text-[0.85rem] text-grafite-2">
          <p className="max-w-[72ch]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitado.
          </p>
          {mostraRt && (
            <p className="mt-2">
              {`Responsável técnico: ${rt.nome} · ${rt.registro}`}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <p>
              {CONFIG.nome} | {CONFIG.descritor} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </p>
            <a href="/privacidade.html" className="sublinha inline-flex min-h-11 items-center self-start">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ---------------------------------------------------------------- barra / flutuante */

export function AgendarFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  if (!CONFIG.usarWhatsapp) return null
  return (
    <>
      {/* celular: barra fixa; o rodapé tem espaço inferior para não ser coberto */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-filete bg-perola/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-[2px] transition-transform duration-500 lg:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!visivel}
        inert={!visivel}
      >
        <BotaoWa className="w-full">Agendar avaliação</BotaoWa>
      </div>
      {/* desktop: aba flutuante discreta na margem esquerda (não cobre o conteúdo) */}
      <a
        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagens.geral)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-10 left-0 z-40 hidden min-w-12 items-center gap-3 bg-petroleo px-3 py-5 text-[0.8rem] font-medium tracking-[0.12em] text-perola uppercase transition-[opacity,transform,background-color] duration-500 [writing-mode:vertical-rl] hover:bg-agua-escura lg:flex ${
          visivel ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ transform: visivel ? 'rotate(180deg)' : 'rotate(180deg) translateX(100%)' }}
        aria-hidden={!visivel}
        tabIndex={visivel ? 0 : -1}
      >
        Agendar avaliação
        <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
      </a>
    </>
  )
}
