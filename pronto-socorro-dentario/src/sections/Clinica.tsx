import { useId, useState, type ReactNode } from 'react'
import { CONFIG, enderecoLinha, telLink, waLink } from '../config'
import { Access, ArrowUpRight, Car, Card, Child, Clock, Instagram, Phone, Pin, Plus, Users, WhatsApp } from '../components/icons'
import { CallButton, SectionHead, WaButton } from '../components/ui'

export function Clinica() {
  const r = CONFIG.fotos.recepcao
  return (
    <section aria-labelledby="clinica-title" id="clinica" className="border-y border-line bg-paper py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHead
            id="clinica-title"
            eyebrow="A clínica"
            title="Atendimento sério, conversa clara"
            intro={`Somos uma clínica odontológica em ${CONFIG.cidade} com atendimento de urgência e para todas as idades. Cada paciente passa por avaliação individual e recebe explicação clara sobre o que foi encontrado e sobre as opções de tratamento.`}
          />

          <ul className="mt-8 space-y-3">
            {CONFIG.equipe.map((p) => (
              <li key={p.nome} className="reveal flex items-center gap-4 rounded-[1.25rem] border border-line bg-ivory p-4">
                <img
                  src={p.foto}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 flex-none rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold sm:text-xl">{p.nome}</h3>
                  <p className="text-[0.95rem] text-muted">{p.funcao}</p>
                  <p className="mt-0.5 text-sm font-semibold text-forest">
                    CRO-{CONFIG.uf} {p.cro}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <figure className="reveal m-0 overflow-hidden rounded-[1.5rem] border border-line bg-ivory">
            <img src={r.src} srcSet={`/fotos/recepcao-640.webp 640w, ${r.src} 1100w`} sizes="(min-width: 1024px) 55vw, 100vw" alt={r.alt} width={r.w} height={r.h} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
            <figcaption className="flex items-center gap-2 px-5 py-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-muted">
              <span className="h-px w-6 bg-forest/30" aria-hidden="true" />
              Recepção
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

export function Estrutura() {
  const e = CONFIG.estrutura
  const itens = [
    { Icon: Clock, t: 'Atendimento 24 horas', v: 'Conforme a ficha do Google. Confirme a disponibilidade pelo WhatsApp.' },
    { Icon: Pin, t: 'Localização', v: `${CONFIG.endereco.referencia}.` },
    { Icon: Access, t: 'Acessibilidade', v: e.acessibilidade },
    { Icon: Car, t: 'Estacionamento', v: e.estacionamento },
    { Icon: Card, t: 'Formas de pagamento', v: e.pagamento },
    { Icon: Child, t: 'Comodidades', v: e.comodidades },
    { Icon: Users, t: 'Convênios', v: e.convenios },
  ].filter((i) => i.v)
  return (
    <section aria-labelledby="estrutura-title" id="estrutura" className="py-20 lg:py-28">
      <div className="wrap">
        <SectionHead id="estrutura-title" eyebrow="Estrutura e conforto" title="O que você encontra aqui" />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {itens.map(({ Icon, t, v }) => (
            <li key={t} className="reveal flex gap-4 bg-ivory p-6 sm:p-7">
              <Icon size={24} className="mt-0.5 flex-none text-brand" />
              <div>
                <h3 className="font-display text-lg font-semibold text-forest">{t}</h3>
                <p className="mt-1 text-[0.97rem] text-muted">{v}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function AvaliacoesGoogle() {
  const n = CONFIG.notaGoogle
  if (!CONFIG.mostrarNotaGoogle || !n.nota) return null
  return (
    <section aria-labelledby="google-title" className="py-12">
      <div className="wrap flex flex-col items-start gap-4 rounded-[1.5rem] border border-line bg-paper p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="google-title" className="text-2xl">
            Nota {n.nota} no Google
          </h2>
          {n.total && <p className="text-muted">{n.total} avaliações</p>}
        </div>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="link-arrow">
          Ver no Google Maps <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  )
}

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: 'Vocês atendem 24 horas?',
    a: 'A ficha da clínica no Google indica atendimento 24 horas. Como a disponibilidade pode variar, confirme pelo WhatsApp ou por telefone antes de vir.',
  },
  {
    q: 'Preciso agendar para urgência?',
    a: 'A clínica trabalha com agendamento. Em caso de urgência, chame pelo WhatsApp ou ligue antes de vir: assim conversamos sobre o seu caso, vemos a disponibilidade e combinamos o atendimento.',
  },
  {
    q: 'O que fazer se um dente quebrar?',
    a: 'Mantenha a calma, guarde o fragmento em um recipiente limpo, se houver, e fale com a clínica. Evite mastigar do lado afetado e não coloque medicamento no local.',
  },
  {
    q: 'A clínica atende crianças?',
    a: 'Sim. A clínica informa atendimento para todas as idades, incluindo atendimento pediátrico, e tem sala de amamentação. Fale com a gente para saber como funciona para a sua família.',
  },
  {
    q: 'Como funciona a sedação, de forma geral?',
    a: 'A sedação odontológica é um recurso que pode ser indicado para alguns pacientes e procedimentos. A indicação depende de avaliação individual e segue protocolos de segurança. O profissional explica as opções e os cuidados antes de qualquer decisão.',
  },
  {
    q: 'Onde fica a clínica?',
    a: (
      <>
        {enderecoLinha}. {CONFIG.endereco.referencia}. {CONFIG.endereco.fachada}{' '}
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-brand-ink underline underline-offset-4">
          Abrir no Google Maps
        </a>
      </>
    ),
  },
  {
    q: 'A clínica tem acessibilidade e estacionamento?',
    a: `Sim. ${CONFIG.estrutura.acessibilidade} Há ${CONFIG.estrutura.estacionamento.charAt(0).toLowerCase()}${CONFIG.estrutura.estacionamento.slice(1)}`,
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: `${CONFIG.estrutura.pagamento} Para outras dúvidas, pergunte pelo WhatsApp.`,
  },
  {
    q: 'Como agendar uma avaliação estética?',
    a: 'Envie uma mensagem pelo WhatsApp dizendo que quer uma avaliação estética. A equipe informa os horários disponíveis.',
  },
  {
    q: 'O que levar na avaliação?',
    a: 'Se tiver, leve um documento, exames ou receitas recentes e, em caso de fratura, o fragmento do dente ou a peça que soltou.',
  },
]

function FaqItem({ q, a, i }: { q: string; a: ReactNode; i: number }) {
  const [open, setOpen] = useState(i === 0)
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3 className="!font-sans !tracking-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-[1.2rem] font-semibold leading-snug text-forest sm:text-[1.35rem]">{q}</span>
          <span
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ${
              open ? 'rotate-45 border-forest bg-forest text-paper' : 'border-line text-forest group-hover:border-forest'
            }`}
            aria-hidden="true"
          >
            <Plus size={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acc-panel" data-open={open} inert={!open}>
        <div>
          <p className="max-w-2xl pb-7 pr-14 leading-relaxed text-muted">{a}</p>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  return (
    <section aria-labelledby="faq-title" id="duvidas" className="border-t border-line bg-sand/60 py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHead id="faq-title" eyebrow="Dúvidas frequentes" title="Perguntas comuns" intro="Não encontrou a sua? Pergunte pelo WhatsApp." />
            <a href={waLink(CONFIG.mensagens.avaliacao)} target="_blank" rel="noopener" className="link-arrow reveal mt-4">
              <WhatsApp size={18} /> Enviar uma pergunta
              <span className="sr-only"> (abre o WhatsApp)</span>
            </a>
          </div>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} {...f} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Contato() {
  return (
    <section aria-labelledby="contato-title" id="contato" className="py-20 lg:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead id="contato-title" eyebrow="Localização e contato" title="Como chegar" />
          <address className="reveal mt-8 not-italic">
            <p className="flex gap-3 text-lg text-forest">
              <Pin size={22} className="mt-1 flex-none text-brand" />
              <span>
                {CONFIG.endereco.rua}
                <br />
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                <br />
                <span className="text-muted">{CONFIG.endereco.referencia}</span>
              </span>
            </p>
            <p className="mt-6 flex gap-3 rounded-2xl border border-line bg-paper p-5 text-[0.97rem]">
              <Clock size={22} className="mt-0.5 flex-none text-brand" />
              <span>
                <strong className="font-semibold text-forest">Atendimento 24 horas.</strong> {CONFIG.horarioObservacao}
              </span>
            </p>
            <ul className="mt-6 space-y-1">
              <li>
                <a href={waLink()} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-3 font-semibold text-forest hover:text-brand-ink">
                  <WhatsApp size={20} /> WhatsApp {CONFIG.telefoneExibicao}
                  <span className="sr-only"> (abre o WhatsApp)</span>
                </a>
              </li>
              <li>
                <a href={telLink} className="inline-flex min-h-12 items-center gap-3 font-semibold text-forest hover:text-brand-ink">
                  <Phone size={20} /> Telefone {CONFIG.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-3 font-semibold text-forest hover:text-brand-ink">
                  <Instagram size={20} /> Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="lg:col-span-7">
          <Fachada />
        </div>
      </div>
    </section>
  )
}

/** Foto da fachada, para a pessoa reconhecer a entrada ao chegar, e o botão "Como chegar". */
function Fachada() {
  const f = CONFIG.fotos.fachada
  return (
    <figure className="reveal relative m-0 overflow-hidden rounded-[1.75rem] border border-line bg-paper">
      <img src={f.src} srcSet={`/fotos/fachada-640.webp 640w, ${f.src} 1100w`} sizes="(min-width: 1024px) 55vw, 100vw" alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
      <figcaption className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-[0.95rem]">
          <strong className="block font-display text-lg text-forest">
            {CONFIG.nome} <span className="whitespace-nowrap">| {CONFIG.cidade}</span>
          </strong>
          <span className="text-muted">{CONFIG.endereco.fachada}</span>
        </p>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="btn btn-dark !min-h-12 flex-none !text-[0.95rem]">
          <Pin size={18} /> Como chegar
          <span className="sr-only"> (abre o Google Maps)</span>
        </a>
      </figcaption>
    </figure>
  )
}

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-title" className="on-dark grain relative overflow-hidden bg-forest py-20 text-white lg:py-28">
      <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="pointer-events-none absolute -bottom-[40rem] left-1/2 h-[64rem] w-[64rem] -translate-x-1/2 text-white/10">
        <circle cx="50" cy="50" r="49.6" stroke="currentColor" strokeWidth=".12" />
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth=".12" />
        <path d="M50 .4 A 49.6 49.6 0 0 1 99.6 50" stroke="#00a346" strokeOpacity=".5" strokeWidth=".2" />
      </svg>
      <div className="wrap relative text-center">
        <p className="eyebrow reveal justify-center">Fale com a clínica</p>
        <h2 id="cta-title" className="reveal mx-auto mt-5 max-w-4xl text-[2.4rem] !text-paper sm:text-6xl lg:text-7xl">
          Está com dor ou dúvida? Fale com a gente agora.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-lg text-white/75">
          Conte o que está acontecendo. A gente explica os próximos passos e a disponibilidade de atendimento.
        </p>
        <div className="reveal mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <WaButton />
          <CallButton />
        </div>
        <p className="reveal mt-6 text-sm text-white/55">
          {CONFIG.telefoneExibicao} · {CONFIG.horarioObservacao}
        </p>
      </div>
    </section>
  )
}
