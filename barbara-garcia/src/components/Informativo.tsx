import { useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { CONFIG } from '../config'
import { aberto, enderecoLinha, faixaDia, horaCurta, linkWhatsapp, temWhatsapp } from '../lib/dados'
import { IconeCalendario, IconeConversa, IconeInfo, IconeInstagram, IconeMais, IconePino, IconeRelogio, IconeWhatsapp } from './Icones'
import { TabelaHorarios } from './Horarios'
import { Favo } from './Marca'

/* ---------------- Antes de agendar ---------------- */

const ORIENTACOES = [
  {
    t: 'Como funciona o agendamento',
    d: 'O pedido de horário é feito pelo WhatsApp: você pode mandar mensagem direto ou usar o formulário deste site. A equipe responde com a disponibilidade.',
  },
  {
    t: 'Conte antes sobre a sua saúde',
    d: 'Se você tem alergia, alguma condição de pele, está gestante ou usa medicação, avise antes do atendimento para que isso seja considerado na avaliação.',
  },
  { t: 'Chegue com calma', d: 'Procure chegar com alguns minutos de antecedência do horário combinado.' },
  { t: 'Dúvidas antes de marcar', d: 'Se tiver qualquer dúvida sobre os atendimentos ou os horários, converse pelo WhatsApp antes de agendar.' },
]

export function AntesDeAgendar() {
  if (!CONFIG.secoes.antesDeAgendar) return null
  return (
    <section id="antes" aria-labelledby="titulo-antes" className="py-20 md:py-28">
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="rotulo revela">Antes de agendar</p>
          <h2 id="titulo-antes" className="revela mt-4 text-[clamp(2rem,4.6vw,3rem)]" style={{ ['--atraso' as string]: '80ms' }}>
            Algumas orientações <em>gerais</em>.
          </h2>
          <p className="revela mt-5 max-w-[28rem] text-suave" style={{ ['--atraso' as string]: '160ms' }}>
            Informações práticas para o primeiro contato. Elas não substituem a avaliação individual.
          </p>
        </div>
        <div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {ORIENTACOES.map((o, i) => (
              <li
                key={o.t}
                className="revela rounded-[1.5rem] border border-oliva/12 bg-aveia-2 p-6"
                style={{ ['--atraso' as string]: `${i * 80}ms` }}
              >
                <span className="font-serif text-[1.6rem] italic leading-none text-mel-texto" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-sans text-[1.08rem] font-semibold tracking-normal text-grafite">{o.t}</h3>
                <p className="mt-2 text-[0.98rem] text-suave">{o.d}</p>
              </li>
            ))}
          </ol>
          <p className="revela mt-6 flex items-center gap-2 font-medium text-oliva">
            <IconeInfo tamanho={18} /> As orientações são dadas no atendimento.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Como funciona ---------------- */

const ETAPAS = [
  { t: 'Contato e agendamento', d: 'Você chama no WhatsApp ou envia a solicitação pelo formulário. A equipe responde com os horários disponíveis.', I: IconeConversa },
  { t: 'Conversa e avaliação', d: 'Antes de qualquer procedimento, uma conversa para entender o que você procura, avaliar e explicar como será o atendimento.', I: IconeInfo },
  { t: 'Atendimento', d: 'No horário combinado, o atendimento acontece de forma individual, com hora marcada.', I: IconeCalendario },
  { t: 'Orientações', d: 'Ao final, você recebe as orientações sobre os cuidados depois do atendimento e os próximos passos, se houver.', I: IconeCheckSuave },
]

function IconeCheckSuave(p: { tamanho?: number }) {
  return (
    <svg width={p.tamanho ?? 20} height={p.tamanho ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9" />
      <path d="m8 12 3 3 6-6" />
    </svg>
  )
}

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduz = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 55%'] })
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const linha = useRef<HTMLSpanElement>(null)
  useMotionValueEvent(suave, 'change', (v) => {
    if (linha.current && !reduz) linha.current.style.scale = `1 ${Math.min(Math.max(v, 0), 1).toFixed(4)}`
  })
  if (!CONFIG.secoes.comoFunciona) return null
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="no-escuro relative overflow-hidden bg-oliva py-20 text-aveia md:py-28">
      <Favo className="pointer-events-none absolute -right-24 -top-24 w-[26rem] text-aveia/[0.06]" />
      <Favo className="pointer-events-none absolute -bottom-32 -left-20 w-[20rem] text-mel/10" />
      <div className="container-site relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="rotulo revela">Como funciona</p>
          <h2 id="titulo-como" className="revela mt-4 text-[clamp(2rem,4.6vw,3.2rem)] text-aveia" style={{ ['--atraso' as string]: '80ms' }}>
            Do primeiro contato às <em>orientações</em>.
          </h2>
          <p className="revela mt-5 max-w-[26rem] text-sobre-oliva" style={{ ['--atraso' as string]: '160ms' }}>
            Quatro etapas simples, sempre com conversa antes de qualquer procedimento.
          </p>
        </div>

        <ol ref={ref} className="relative grid gap-10 pl-16 md:gap-14 md:pl-20">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.45rem] top-6 w-px bg-aveia/20 md:left-[1.7rem]" />
          <span
            ref={linha}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.45rem] top-6 w-[2px] origin-top bg-mel md:left-[1.7rem] [.js_&]:scale-y-0 motion-reduce:!scale-y-100"
          />
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="revela relative" style={{ ['--atraso' as string]: `${i * 90}ms` }}>
              <span className="absolute -left-16 top-0 inline-flex h-12 w-12 items-center justify-center rounded-full border border-mel/60 bg-oliva-escuro text-mel-claro md:-left-20 md:h-14 md:w-14">
                <e.I tamanho={22} />
              </span>
              <p className="rotulo">Etapa {i + 1}</p>
              <h3 className="mt-2 text-[clamp(1.5rem,3vw,1.9rem)] text-aveia">{e.t}</h3>
              <p className="mt-3 max-w-[32rem] text-sobre-oliva">{e.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Estrutura (resumo prático) ---------------- */

export function Estrutura() {
  if (!CONFIG.secoes.estrutura) return null
  const { endereco, instagram } = CONFIG
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="py-20 md:py-28">
      <div className="container-site">
        <p className="rotulo revela">Estrutura</p>
        <h2 id="titulo-estrutura" className="revela mt-4 max-w-[36rem] text-[clamp(2rem,4.6vw,3rem)]" style={{ ['--atraso' as string]: '80ms' }}>
          O essencial, num só <em>lugar</em>.
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="revela rounded-[var(--radius-card)] bg-areia-2 p-6 md:p-8">
            <h3 className="flex items-center gap-2 font-sans text-[1.05rem] font-semibold tracking-normal text-oliva">
              <IconeRelogio tamanho={18} /> Horário por dia
            </h3>
            <div className="mt-4">
              <TabelaHorarios compacta />
            </div>
            {CONFIG.avisoHorarios && <p className="mt-3 text-[0.9rem] text-suave">{CONFIG.avisoHorarios}</p>}
          </div>
          <div className="grid gap-5">
            <div className="revela rounded-[var(--radius-card)] bg-areia-2 p-6 md:p-8" style={{ ['--atraso' as string]: '90ms' }}>
              <h3 className="flex items-center gap-2 font-sans text-[1.05rem] font-semibold tracking-normal text-oliva">
                <IconePino tamanho={18} /> Endereço
              </h3>
              <address className="mt-3 not-italic leading-relaxed text-grafite">
                {endereco.rua}
                <br />
                {endereco.bairro}, {endereco.cidade} - {endereco.uf}
                <br />
                CEP {endereco.cep}
              </address>
            </div>
            <div className="revela rounded-[var(--radius-card)] bg-areia-2 p-6 md:p-8" style={{ ['--atraso' as string]: '180ms' }}>
              <h3 className="flex items-center gap-2 font-sans text-[1.05rem] font-semibold tracking-normal text-oliva">
                <IconeConversa tamanho={18} /> Formas de contato
              </h3>
              <ul className="mt-3 space-y-1">
                {temWhatsapp && (
                  <li>
                    <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 font-medium text-grafite hover:text-oliva">
                      <IconeWhatsapp tamanho={18} className="text-oliva" /> WhatsApp {CONFIG.whatsappExibicao}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </li>
                )}
                {instagram.url && (
                  <li>
                    <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 font-medium text-grafite hover:text-oliva">
                      <IconeInstagram tamanho={18} className="text-oliva" /> Instagram {instagram.usuario}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Dúvidas frequentes ---------------- */

function horariosEmFrase() {
  return CONFIG.horarios
    .filter(aberto)
    .map((d) => `${d.nome.replace('-feira', '').toLowerCase()}, ${faixaDia(d)}`)
    .join('; ')
}

export function perguntas(): { p: string; r: string }[] {
  const sab = CONFIG.horarios.find((d) => d.dow === 6)
  const nomes = CONFIG.atendimentos.map((a) => a.nome.toLowerCase())
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0]
  const out = [
    {
      p: 'Preciso agendar antes de ir?',
      r: 'Sim. O atendimento é individual e com hora marcada. Peça um horário pelo WhatsApp ou pelo formulário deste site; a equipe responde com a disponibilidade.',
    },
    lista && {
      p: 'Quais atendimentos são oferecidos?',
      r: `${lista.charAt(0).toUpperCase()}${lista.slice(1)}. A indicação de cada atendimento depende de avaliação individual.`,
    },
    {
      p: 'Quais são os horários?',
      r: `Por dia: ${horariosEmFrase()}. Domingo sem atendimento. ${CONFIG.avisoHorarios}`,
    },
    sab && aberto(sab) && {
      p: 'Atende aos sábados?',
      r: `Sim, das ${horaCurta(sab.abre!)} às ${horaCurta(sab.fecha!)}. Aos domingos não há atendimento.`,
    },
    {
      p: 'Há horários cedo ou no começo da noite?',
      r: 'Sim, em alguns dias. Na quarta, o atendimento começa às 6h, e na terça, às 7h. Na quinta, vai até as 21h; na segunda e na sexta, até as 20h.',
    },
    {
      p: 'Onde fica?',
      r: `Na ${enderecoLinha}, CEP ${CONFIG.endereco.cep}. O link "Como chegar" abre a rota no Google Maps.`,
    },
    temWhatsapp && {
      p: 'Como solicitar um horário?',
      r: 'Pelo formulário "Solicitar agendamento": escolha o atendimento, o dia e o horário de preferência, e o site abre o WhatsApp com a mensagem pronta para você enviar. Também é possível chamar direto no WhatsApp. O horário é uma preferência; a equipe responde com a disponibilidade.',
    },
    temWhatsapp && {
      p: 'Posso tirar dúvidas antes pelo WhatsApp?',
      r: `Sim. Você pode conversar pelo WhatsApp ${CONFIG.whatsappExibicao} antes de decidir qualquer coisa.`,
    },
    {
      p: 'Como saber qual atendimento é indicado para mim?',
      r: 'A indicação depende de avaliação individual. Se ainda não sabe, escolha "Ainda não sei, quero conversar" no formulário ou conte pelo WhatsApp o que você procura.',
    },
    {
      p: 'Preciso informar algo antes do atendimento?',
      r: 'Se você tem alergia, alguma condição de pele, está gestante ou usa medicação, avise antes, para que isso seja considerado na avaliação. Não é preciso enviar esses dados pelo formulário do site.',
    },
  ]
  return out.filter(Boolean) as { p: string; r: string }[]
}

function ItemFaq({ p, r, i }: { p: string; r: string; i: number }) {
  const [aberto, setAberto] = useState(false)
  const id = `faq-${i}`
  return (
    <li className="border-b border-oliva/15">
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          id={`${id}-botao`}
          aria-expanded={aberto}
          aria-controls={`${id}-resposta`}
          onClick={() => setAberto((v) => !v)}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.1rem] font-semibold text-grafite transition-colors hover:text-oliva md:text-[1.18rem]"
        >
          <span>{p}</span>
          <span
            aria-hidden="true"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-oliva/25 text-oliva transition-[transform,background-color] duration-500 ease-[var(--ease-mel)] group-hover:bg-areia ${
              aberto ? 'rotate-45 bg-areia' : ''
            }`}
          >
            <IconeMais tamanho={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-resposta`} role="region" aria-labelledby={`${id}-botao`} hidden={!aberto}>
        <p className="surge max-w-[44rem] pb-6 pr-14 text-[1.02rem] text-suave">{r}</p>
      </div>
    </li>
  )
}

export function Duvidas() {
  if (!CONFIG.secoes.duvidas) return null
  const lista = perguntas()
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-areia-2 py-20 md:py-28">
      <div className="container-site grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="rotulo revela">Dúvidas frequentes</p>
          <h2 id="titulo-duvidas" className="revela mt-4 text-[clamp(2rem,4.6vw,3rem)]" style={{ ['--atraso' as string]: '80ms' }}>
            Perguntas antes do primeiro <em>horário</em>.
          </h2>
          {temWhatsapp && (
            <p className="revela mt-5 text-suave" style={{ ['--atraso' as string]: '160ms' }}>
              Não encontrou o que procurava?{' '}
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="font-semibold text-oliva underline decoration-mel decoration-2 underline-offset-4">
                Pergunte pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
              .
            </p>
          )}
        </div>
        <ul className="revela border-t border-oliva/15">
          {lista.map((q, i) => (
            <ItemFaq key={q.p} p={q.p} r={q.r} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Localização e contato ---------------- */

export function Localizacao() {
  const [mapa, setMapa] = useState(false)
  if (!CONFIG.secoes.localizacao) return null
  const { endereco, maps, instagram } = CONFIG
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="py-20 md:py-28">
      <div className="container-site">
        <p className="rotulo revela">Localização e contato</p>
        <h2 id="titulo-contato" className="revela mt-4 text-[clamp(2.1rem,5vw,3.4rem)]" style={{ ['--atraso' as string]: '80ms' }}>
          Venha nos <em>visitar</em>.
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="revela flex flex-col rounded-[var(--radius-card)] bg-oliva p-7 text-aveia no-escuro md:p-9">
            <p className="rotulo">Endereço</p>
            <address className="mt-3 font-serif text-[1.45rem] not-italic leading-snug text-aveia md:text-[1.6rem]">
              {endereco.rua}
              <br />
              {endereco.bairro}
              <br />
              {endereco.cidade} - {endereco.uf}
              <br />
              <span className="whitespace-nowrap font-sans text-[1rem] text-sobre-oliva">CEP {endereco.cep}</span>
            </address>
            <p className="rotulo mt-8">Horários</p>
            <div className="mt-2">
              <TabelaHorarios compacta tom="escuro" />
            </div>
            {CONFIG.avisoHorarios && <p className="mt-2 text-[0.92rem] text-sobre-oliva">{CONFIG.avisoHorarios}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {maps.url && (
                <a href={maps.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-mel px-6 font-semibold text-grafite transition-transform hover:-translate-y-0.5">
                  <IconePino tamanho={18} /> Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
                </a>
              )}
              {temWhatsapp && (
                <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-aveia/60 px-6 font-semibold text-aveia transition-colors hover:border-aveia">
                  <IconeWhatsapp tamanho={18} /> {CONFIG.whatsappExibicao}
                  <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                </a>
              )}
              {instagram.url && (
                <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-aveia/60 px-6 font-semibold text-aveia transition-colors hover:border-aveia">
                  <IconeInstagram tamanho={18} /> Instagram<span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
            </div>
          </div>

          {maps.embed && (
            <div className="revela relative min-h-[22rem] overflow-hidden rounded-[var(--radius-card)] bg-areia md:min-h-[28rem]" style={{ ['--atraso' as string]: '120ms' }}>
              {mapa ? (
                <iframe
                  src={maps.embed}
                  title={`Mapa: ${enderecoLinha}`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                  {/* "mapa" ilustrado: ruas abstratas e favos */}
                  <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-oliva/15" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
                    <path d="M-10 90 C80 70 150 120 230 100 S350 60 420 80" stroke="currentColor" strokeWidth="10" fill="none" />
                    <path d="M-10 210 C90 230 170 180 260 200 S360 240 420 220" stroke="currentColor" strokeWidth="6" fill="none" />
                    <path d="M140 -10 C150 80 120 180 150 310" stroke="currentColor" strokeWidth="7" fill="none" />
                    <path d="M300 -10 C280 90 320 200 290 310" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-oliva text-mel-claro shadow-[var(--shadow-macia)]">
                    <IconePino tamanho={28} />
                  </span>
                  <p className="relative max-w-[22rem] font-medium text-grafite">
                    {endereco.bairro}, {endereco.cidade}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMapa(true)}
                    className="relative inline-flex min-h-12 items-center gap-2 rounded-full bg-aveia px-6 font-semibold text-oliva shadow-[var(--shadow-macia)] transition-transform hover:-translate-y-0.5"
                  >
                    Mostrar mapa
                  </button>
                  <p className="relative max-w-[22rem] text-[0.85rem] text-suave">O mapa é carregado do Google só quando você pede.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
