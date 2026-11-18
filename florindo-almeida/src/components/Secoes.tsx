import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  CONFIG,
  local,
  mapsLink,
  msgArea,
  nomeCompleto,
  oabTexto,
  temEndereco,
  temHorarios,
  temWhatsapp,
  waLink,
} from '../config'
import { useAceso } from '../hooks'
import { Externo, Mais, Seta } from './Icones'
import { Logo } from './Logo'
import { dois } from './Margem'

/* ---------- moldura de cada folha ---------- */
export function Folha({
  id,
  fls,
  children,
  className = '',
  topoFls = 'md:top-32',
}: {
  id: string
  fls?: number
  titulo: string
  topoFls?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} data-fls={fls} aria-labelledby={`${id}-titulo`} className={`folha relative ${className}`}>
      {fls !== undefined && (
        <p className={`rotulo fls fls-margem hidden md:flex ${topoFls}`} aria-hidden="true">
          <span>fls.</span>
          <span className="tabular">{dois(fls)}</span>
        </p>
      )}
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {children}
      </div>
    </section>
  )
}

/** Cabeçalho pequeno de seção: fls + rótulo, alinhado à grade. */
function Rotulo({ fls, children }: { fls?: number; children: ReactNode }) {
  return (
    <p className="rotulo flex items-center gap-3 text-apoio">
      {fls !== undefined && <span className="fls md:hidden">fls. {dois(fls)}</span>}
      {children}
    </p>
  )
}

function BotaoWhats({ msg, children, linha = false }: { msg?: string; children: ReactNode; linha?: boolean }) {
  if (!temWhatsapp) return null
  return (
    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className={`btn ${linha ? 'btn-linha' : 'btn-tinta'}`}>
      {children}
      <Seta />
    </a>
  )
}

function BotaoInstagram() {
  if (!CONFIG.instagram.url) return null
  return (
    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-linha">
      Ver no Instagram
      <Externo />
    </a>
  )
}

/* ---------- 01 · HERO: a capa dos autos ---------- */
export function Hero({ fls }: { fls: number }) {
  const foto = CONFIG.fotos[0]
  const areasCurto = CONFIG.areas.map((a) => a.nome.replace(/^Direito\s+/i, '')).join(' · ')
  return (
    <section
      id="topo"
      data-fls={fls}
      aria-labelledby="topo-titulo"
      className="folha relative pt-[calc(var(--topo)+96px)] pb-16 md:pt-[calc(var(--topo)+132px)] md:pb-28"
    >
      <p className="rotulo fls fls-margem hidden md:flex md:top-[calc(var(--topo)+138px)]" aria-hidden="true">
        <span>fls.</span>
        <span className="tabular">{dois(fls)}</span>
      </p>
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pt-6">
          <p className="rotulo surge flex items-center gap-3 text-apoio" style={{ animationDelay: '0.1s' }}>
            <span className="fls md:hidden">fls. {dois(fls)}</span>
            Advocacia · {local}
          </p>

          <h1 id="topo-titulo" className="titulo mt-6 text-[clamp(3rem,8.6vw,7rem)]">
            <span className="revela">
              <span>Seu caso,</span>
            </span>
            <span className="revela">
              <span style={{ animationDelay: '0.12s' }}>explicado com</span>
            </span>
            <span className="revela">
              <span style={{ animationDelay: '0.24s' }}>
                <em className="relative inline-block">
                  clareza
                  <svg
                    className="sublinhado absolute -bottom-[0.1em] left-[-2%] h-[0.22em] w-[104%] overflow-visible"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9.5c22-3.6 47-5.4 74-5.6 33-.3 62 1.2 90 3.3 10 .8 20 1.9 31 .6"
                      fill="none"
                      stroke="#2A3FA6"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      pathLength={1}
                    />
                  </svg>
                </em>
                .
              </span>
            </span>
          </h1>

          <p className="surge mt-8 max-w-[34rem] text-[18px] leading-[1.6] text-apoio md:text-[19px]" style={{ animationDelay: '0.5s' }}>
            Atendimento direto pelo advogado {nomeCompleto}, com explicação clara sobre as possibilidades de cada
            situação.
          </p>

          <div className="surge mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: '0.65s' }}>
            <BotaoWhats>Agendar atendimento</BotaoWhats>
            {CONFIG.secoes.atuacao && CONFIG.areas.length > 0 && (
              <a href="#atuacao" className="btn btn-linha">
                Conhecer a atuação
              </a>
            )}
          </div>
        </div>

        {/* a capa: foto presa à pasta + etiqueta */}
        <div className="surge relative lg:col-span-5" style={{ animationDelay: '0.3s' }}>
          <div className={`relative ${foto ? 'mx-auto max-w-[440px] lg:ml-auto lg:mr-0' : ''}`}>
            {foto && (
              <figure className="relative ml-auto w-[78%] max-w-[340px]">
                <div className="foto-orelha relative border border-grafite bg-papel-2">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${foto.srcSmall ?? foto.src} 280w, ${foto.src} ${foto.largura}w`}
                      sizes="(min-width: 1024px) 340px, 72vw"
                    />
                    <img
                      src={foto.fallback ?? foto.src}
                      alt={foto.alt}
                      width={foto.largura}
                      height={foto.altura}
                      fetchPriority="high"
                      decoding="async"
                      className="block aspect-[4/5] h-auto w-full object-cover"
                    />
                  </picture>
                  <span className="orelha" aria-hidden="true" />
                </div>
              </figure>
            )}

            <div
              className={`relative z-10 border border-grafite bg-papel ${
                foto ? '-mt-20 w-[88%] md:-mt-24' : 'w-full lg:mt-10'
              }`}
            >
              <div className="flex items-center justify-between border-b border-grafite px-4 py-2.5">
                <span className="rotulo">Autos</span>
                <span className="rotulo fls">fls. {dois(fls)}</span>
              </div>
              <dl>
                <CampoCapa rotulo="Advogado" valor={nomeCompleto} />
                {oabTexto && <CampoCapa rotulo="Inscrição" valor={oabTexto} />}
                <CampoCapa rotulo="Local" valor={local} />
                <CampoCapa rotulo="Atuação" valor={areasCurto} ultimo />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CampoCapa({ rotulo, valor, ultimo = false }: { rotulo: string; valor: string; ultimo?: boolean }) {
  return (
    <div className={`grid grid-cols-[88px_1fr] items-baseline gap-3 px-4 py-3 ${ultimo ? '' : 'border-b border-fio'}`}>
      <dt className="rotulo text-[11px] text-apoio">{rotulo}</dt>
      <dd className="serif text-[18px] leading-snug md:text-[20px]">{valor}</dd>
    </div>
  )
}

/* ---------- ATUAÇÃO: título fixo + lista editorial numerada ---------- */
export function Atuacao({ fls }: { fls: number }) {
  const [aberta, setAberta] = useState<number | null>(0)
  return (
    <Folha id="atuacao" fls={fls} titulo="Atuação" className="border-t border-fio py-20 md:py-32">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[140px]">
            <Rotulo fls={fls}>Atuação</Rotulo>
            <h2 id="atuacao-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,3.75rem)]">
              Áreas de <em>atuação</em>.
            </h2>
            <p className="mt-6 max-w-[22rem] text-apoio">
              Orientação e acompanhamento jurídico em {local}. Cada caso depende de análise individual.
            </p>
          </div>
        </div>
        <ol className="border-b border-grafite lg:col-span-8">
          {CONFIG.areas.map((a, i) => (
            <ItemArea
              key={a.nome}
              i={i}
              nome={a.nome}
              descricao={a.descricao}
              aberta={aberta === i}
              alternar={() => setAberta((v) => (v === i ? null : i))}
            />
          ))}
        </ol>
      </div>
    </Folha>
  )
}

function ItemArea({
  i,
  nome,
  descricao,
  aberta,
  alternar,
}: {
  i: number
  nome: string
  descricao: string
  aberta: boolean
  alternar: () => void
}) {
  const [ref, aceso] = useAceso<HTMLLIElement>('0px 0px -25% 0px')
  const id = `area-${i}`
  return (
    <li ref={ref} className="area-item border-t border-grafite" data-aceso={aceso}>
      <h3>
        <button
          type="button"
          id={`${id}-botao`}
          aria-expanded={aberta}
          aria-controls={`${id}-painel`}
          onClick={alternar}
          className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 py-7 text-left md:gap-8 md:py-10"
        >
          <span className="area-num rotulo tabular text-caneta md:text-[13px]">{dois(i + 1)}</span>
          <span className="area-nome titulo text-[clamp(2rem,5.4vw,4.25rem)] transition-transform duration-500 group-hover:translate-x-1">
            {nome}
          </span>
          <span className="self-center text-grafite">
            <Mais />
          </span>
        </button>
      </h3>
      <div id={`${id}-painel`} role="region" aria-labelledby={`${id}-botao`} className="painel" data-aberto={aberta}>
        <div>
          <div className="grid gap-6 pb-10 md:grid-cols-[auto_1fr] md:gap-8 md:pl-0">
            <span className="hidden w-[2.4rem] md:block" aria-hidden="true" />
            <div className="max-w-[36rem]" inert={!aberta}>
              <p className="serif text-[21px] leading-[1.45] md:text-[24px]">{descricao}</p>
              <p className="mt-4 text-[15px] text-apoio">Cada caso depende de análise individual.</p>
              {temWhatsapp && (
                <a
                  href={waLink(msgArea(nome))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link mt-6 inline-flex min-h-12 items-center gap-3 text-[16px] font-semibold"
                >
                  Agendar atendimento sobre {nome}
                  <Seta />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

/* ---------- O ADVOGADO (só com nome + OAB) ---------- */
export function Advogado({ fls }: { fls: number }) {
  return (
    <Folha id="advogado" fls={fls} titulo="O advogado" topoFls="md:top-28" className="border-t border-fio py-20 md:py-28">
      <Rotulo fls={fls}>O advogado</Rotulo>
      <h2 id="advogado-titulo" className="titulo mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
        {nomeCompleto}
      </h2>
      <dl className="mt-10 grid max-w-[720px] border-t border-grafite sm:grid-cols-2">
        <div className="border-b border-fio py-4 sm:pr-6">
          <dt className="rotulo text-apoio">Profissão</dt>
          <dd className="serif mt-1 text-[22px]">{CONFIG.advogado.profissao}</dd>
        </div>
        <div className="border-b border-fio py-4 sm:pl-6">
          <dt className="rotulo text-apoio">Inscrição</dt>
          <dd className="serif tabular mt-1 text-[22px]">{oabTexto}</dd>
        </div>
      </dl>
    </Folha>
  )
}

/* ---------- QUANDO PROCURAR: texto grande intercalado com fios e legendas ---------- */
const situacoes = [
  { legenda: 'Ao receber um documento', texto: 'Ao receber uma notificação, citação ou intimação.' },
  { legenda: 'Antes de assinar', texto: 'Antes de assinar um contrato, um acordo ou uma rescisão.' },
  { legenda: 'Diante de uma dúvida', texto: 'Quando houver dúvida sobre direitos e deveres em uma situação do dia a dia.' },
  {
    legenda: 'Na esfera penal',
    texto: 'Quando for preciso entender os próximos passos em uma questão penal.',
  },
]

export function Quando({ fls }: { fls: number }) {
  return (
    <Folha id="quando" fls={fls} titulo="Quando procurar um advogado" className="bg-papel-2 py-20 md:py-32">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Rotulo fls={fls}>Orientação</Rotulo>
          <h2 id="quando-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,3.75rem)]">
            Quando <em>procurar</em> um advogado.
          </h2>
        </div>
        <p className="max-w-[26rem] self-end text-apoio lg:col-span-4 lg:col-start-9">
          Algumas situações costumam pedir uma orientação jurídica antes de qualquer decisão. Em termos gerais:
        </p>
      </div>

      <ol className="mt-14 border-t border-grafite md:mt-20">
        {situacoes.map((s, i) => (
          <li key={s.legenda} className="grid gap-3 border-b border-fio py-8 md:grid-cols-12 md:gap-8 md:py-10">
            <p className="rotulo flex gap-3 text-caneta md:col-span-3 md:pt-3">
              <span className="tabular">{String.fromCharCode(97 + i)})</span>
              <span className="text-apoio">{s.legenda}</span>
            </p>
            <p className="titulo text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15] md:col-span-9">{s.texto}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[40rem] text-[15px] text-apoio">
        Este site é informativo e não substitui a orientação jurídica individual.
      </p>
    </Folha>
  )
}

/* ---------- COMO FUNCIONA: linha do tempo com progresso ---------- */
const etapas = [
  {
    t: 'Contato e agendamento',
    d: 'Você envia uma mensagem pelo WhatsApp e combina um horário para o atendimento.',
  },
  {
    t: 'Análise do caso',
    d: 'O advogado ouve a situação, examina os documentos disponíveis e identifica as questões jurídicas envolvidas.',
  },
  {
    t: 'Orientação sobre as possibilidades',
    d: 'Você recebe uma explicação clara sobre os caminhos possíveis e suas implicações, para decidir com informação.',
  },
  {
    t: 'Acompanhamento',
    d: 'Se você decidir seguir, o caso é acompanhado e você recebe informações sobre o andamento de cada etapa.',
  },
]

export function ComoFunciona({ fls }: { fls: number }) {
  const trilho = useRef<HTMLOListElement>(null)
  const [ativas, setAtivas] = useState(0)

  useEffect(() => {
    const el = trilho.current
    if (!el) return
    let raf = 0
    let visivel = false
    const calc = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const meio = window.innerHeight * 0.55
      const p = Math.min(1, Math.max(0, (meio - r.top) / r.height))
      el.style.setProperty('--p', p.toFixed(4))
      const itens = Array.from(el.children) as HTMLElement[]
      setAtivas(itens.filter((li) => li.getBoundingClientRect().top < meio).length)
    }
    const on = () => {
      if (visivel && !raf) raf = requestAnimationFrame(calc)
    }
    // pausa fora da viewport
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) on()
    })
    io.observe(el)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Folha id="como-funciona" fls={fls} titulo="Como funciona" className="py-20 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[140px]">
            <Rotulo fls={fls}>Etapas</Rotulo>
            <h2 id="como-funciona-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,3.75rem)]">
              Como <em>funciona</em>.
            </h2>
            <p className="mt-6 max-w-[24rem] text-apoio">
              Do primeiro contato ao acompanhamento, cada etapa é explicada antes de acontecer.
            </p>
          </div>
        </div>
        <ol ref={trilho} className="trilho relative lg:col-span-7">
          <span className="trilho-fio absolute top-2 bottom-2 left-[11px] w-px bg-fio md:left-[15px]" aria-hidden="true" />
          {etapas.map((e, i) => (
            <li
              key={e.t}
              className="etapa relative grid grid-cols-[24px_1fr] gap-5 pb-14 last:pb-0 md:grid-cols-[32px_1fr] md:gap-8 md:pb-20"
              data-ativa={i < ativas}
            >
              <span
                className={`relative z-10 mt-[0.9rem] block h-[9px] w-[9px] justify-self-center border transition-colors duration-500 ${
                  i < ativas ? 'border-caneta bg-caneta' : 'border-grafite bg-papel'
                }`}
                aria-hidden="true"
              />
              <div>
                <p className="etapa-num titulo tabular text-[clamp(3.5rem,8vw,6rem)] leading-[0.9]" aria-hidden="true">
                  {dois(i + 1)}
                </p>
                <h3 className="serif mt-3 text-[26px] leading-tight md:text-[30px]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.t}
                </h3>
                <p className="mt-3 max-w-[30rem] text-apoio">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Folha>
  )
}

/* ---------- DÚVIDAS FREQUENTES ---------- */
function perguntas() {
  const areas = CONFIG.areas.map((a) => a.nome)
  const listaAreas =
    areas.length > 1 ? `${areas.slice(0, -1).join(', ')} e ${areas[areas.length - 1]}` : areas.join('')
  const lista: { p: string; r: ReactNode }[] = [
    {
      p: 'Como agendar um atendimento?',
      r: temWhatsapp ? (
        <>
          Pelo WhatsApp {CONFIG.whatsappExibicao}, pelos botões “Agendar” deste site ou pelo formulário de solicitação. O
          dia e o horário são combinados diretamente com o advogado.
        </>
      ) : (
        'Pelo Instagram do advogado. O dia e o horário são combinados diretamente com ele.'
      ),
    },
    {
      p: 'Posso agendar pelo site?',
      r: 'O formulário desta página monta uma mensagem com seu nome, a área e sua preferência de dia e horário, e abre o WhatsApp. O atendimento só fica marcado depois que o advogado confirma a disponibilidade.',
    },
    { p: 'Onde é o atendimento?', r: `Em ${local}, mediante agendamento.` },
    {
      p: 'Quais áreas o advogado atende?',
      r: `${listaAreas}. Se você não souber em qual área sua situação se encaixa, basta explicar o assunto de forma resumida no contato.`,
    },
    {
      p: 'Como é o primeiro atendimento?',
      r: 'É uma conversa para entender a situação, ouvir suas dúvidas e explicar as possibilidades em termos claros. Cada caso depende de análise individual.',
    },
    {
      p: 'Que documentos costumam ser úteis?',
      r: 'De forma geral, documentos pessoais e os papéis ligados à situação, como contratos, notificações, comunicações recebidas ou comprovantes. Se tiver dúvida sobre o que levar, pergunte no momento do agendamento.',
    },
    {
      p: 'Preciso contar todo o caso na primeira mensagem?',
      r: 'Não. Basta dizer o assunto de forma geral. Os detalhes são tratados com calma no atendimento. Não envie documentos ou informações sigilosas pelo formulário.',
    },
    {
      p: 'É possível saber de antemão como o caso vai terminar?',
      r: 'Não. Nenhum advogado pode assegurar o resultado de um caso. O que se oferece é uma análise atenta e uma explicação honesta sobre as possibilidades.',
    },
    {
      p: 'Como são tratados os honorários?',
      r: 'Esse assunto é conversado diretamente com o advogado, no atendimento, conforme a situação de cada pessoa.',
    },
  ]
  return lista
}

export function Duvidas({ fls }: { fls: number }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const lista = perguntas()
  return (
    <Folha id="duvidas" fls={fls} titulo="Dúvidas frequentes" className="border-t border-fio py-20 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[140px]">
            <Rotulo fls={fls}>Dúvidas</Rotulo>
            <h2 id="duvidas-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,3.75rem)]">
              Dúvidas <em>frequentes</em>.
            </h2>
            <p className="mt-6 max-w-[20rem] text-apoio">Respostas gerais. Para a sua situação, o caminho é a conversa.</p>
          </div>
        </div>
        <div className="border-b border-grafite lg:col-span-8">
          {lista.map((q, i) => {
            const id = `faq-${i}`
            const ab = aberta === i
            return (
              <div key={q.p} className="border-t border-grafite">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b`}
                    aria-expanded={ab}
                    aria-controls={`${id}-p`}
                    onClick={() => setAberta(ab ? null : i)}
                    className="grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-3 py-6 text-left hover:text-caneta"
                  >
                    <span className="rotulo tabular text-caneta">{dois(i + 1)}</span>
                    <span className="serif text-[21px] leading-snug md:text-[24px]">{q.p}</span>
                    <span className="self-center">
                      <Mais />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="painel" data-aberto={ab}>
                  <div>
                    <p className="max-w-[38rem] pb-7 pl-[calc(2.25rem+0.75rem)] text-apoio" inert={!ab}>
                      {q.r}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Folha>
  )
}

/* ---------- CONTATO (+ Localização quando houver endereço) ---------- */
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function Contato({ fls }: { fls: number }) {
  return (
    <Folha id="contato" fls={fls} titulo="Contato" className="border-t border-fio py-20 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Rotulo fls={fls}>Contato</Rotulo>
          <h2 id="contato-titulo" className="titulo mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
            Fale com o <em>advogado</em>.
          </h2>
          <p className="mt-6 max-w-[26rem] text-[18px] text-apoio">
            {temEndereco ? `Atendimento em ${local}.` : `Atendimento em ${local}, mediante agendamento.`}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWhats>Agendar pelo WhatsApp</BotaoWhats>
            <BotaoInstagram />
          </div>
        </div>

        <dl className="self-end border-t border-grafite lg:col-span-5 lg:col-start-8">
          {temWhatsapp && (
            <Linha rotulo="WhatsApp">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link tabular">
                {CONFIG.whatsappExibicao}
              </a>
            </Linha>
          )}
          {CONFIG.instagram.url && (
            <Linha rotulo="Instagram">
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link">
                {CONFIG.instagram.usuario}
              </a>
            </Linha>
          )}
          <Linha rotulo="Cidade">{local}</Linha>
          {CONFIG.email && (
            <Linha rotulo="E-mail">
              <a href={`mailto:${CONFIG.email}`} className="link">
                {CONFIG.email}
              </a>
            </Linha>
          )}
        </dl>
      </div>

      {temEndereco && (
        <div id="localizacao" className="mt-20 grid gap-10 border-t border-grafite pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h3 className="titulo text-[clamp(2rem,4vw,3rem)]">
              <em>Localização</em>
            </h3>
            <p className="serif mt-5 text-[22px] leading-snug">{CONFIG.endereco}</p>
            {temHorarios && (
              <dl className="mt-6 border-t border-fio">
                {CONFIG.horarios.map((h) => (
                  <div key={h.dia} className="flex justify-between border-b border-fio py-2 text-[15px]">
                    <dt>{DIAS[h.dia]}</dt>
                    <dd className="tabular text-apoio">
                      {h.abre}–{h.pausa ? `${h.pausa.inicio}, ${h.pausa.fim}–` : ''}
                      {h.fecha}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="link mt-6 inline-flex min-h-12 items-center gap-2">
              Ver no Google Maps <Externo />
            </a>
          </div>
          <div className="lg:col-span-7">
            <iframe
              title={`Mapa: ${CONFIG.endereco}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(CONFIG.endereco)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border border-grafite grayscale-[0.4]"
            />
          </div>
        </div>
      )}
    </Folha>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-fio py-4">
      <dt className="rotulo text-[11px] text-apoio">{rotulo}</dt>
      <dd className="serif text-[20px]">{children}</dd>
    </div>
  )
}

/* ---------- CTA FINAL ---------- */
export function CtaFinal({ temAgendar }: { temAgendar: boolean }) {
  return (
    <section aria-labelledby="cta-titulo" className="escuro folha bg-grafite text-papel">
      <div className="relative mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
        <span className="absolute top-0 bottom-0 left-5 w-px bg-papel/70 md:left-8" aria-hidden="true" />
        <div className="pl-6 md:pl-14">
          <p className="rotulo text-papel/75">Atendimento mediante agendamento · {local}</p>
          <h2 id="cta-titulo" className="titulo mt-6 max-w-[14ch] text-[clamp(2.8rem,7.4vw,6.25rem)]">
            O primeiro passo é uma <em>conversa</em>.
          </h2>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWhats>Agendar pelo WhatsApp</BotaoWhats>
            <BotaoInstagram />
            {temAgendar && (
              <a href="#agendar" className="inline-flex min-h-[52px] items-center px-2 text-[15px] underline underline-offset-4">
                Solicitar agendamento pelo formulário
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- RODAPÉ ---------- */
export function Rodape() {
  return (
    <footer className="folha border-t border-grafite pb-28 md:pb-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <a href="#topo" aria-label="Voltar ao início" className="inline-block">
            <Logo className="h-[46px] w-auto" />
          </a>
          <p className="mt-6 text-[15px]">
            {nomeCompleto} · {CONFIG.advogado.profissao}
            {oabTexto && <> · {oabTexto}</>}
          </p>
          <p className="text-[15px] text-apoio">{local}</p>
        </div>
        <ul className="space-y-1 text-[15px] md:col-span-3">
          {temWhatsapp && (
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-caneta">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
          )}
          {CONFIG.instagram.url && (
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-caneta">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
          )}
          <li>
            <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-caneta">
              Privacidade
            </a>
          </li>
        </ul>
        <p className="text-[13px] leading-relaxed text-apoio md:col-span-4">
          Conteúdo meramente informativo, sem finalidade de captação de clientela, em conformidade com o Provimento
          205/2021 do Conselho Federal da OAB.
        </p>
      </div>
    </footer>
  )
}

