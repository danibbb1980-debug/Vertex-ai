import { useId, useState, type ReactNode } from 'react'
import { CONFIG, enderecoLinha, pendente, telLink, waLink } from '../config'
import { Access, ArrowUpRight, Car, Card, Clock, Instagram, Phone, Pin, Plus, Users, WhatsApp } from '../components/icons'
import { CallButton, Pendente, PhotoSlot, SectionHead, Val, WaButton } from '../components/ui'

export function Clinica() {
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
          {/* CONFIRMAR COM A CLÍNICA: texto institucional */}
          <p className="reveal mt-6 text-[0.9rem] text-muted">
            Texto institucional <Pendente />
          </p>
        </div>

        <div className="lg:col-span-7">
          {/* CONFIRMAR COM A CLÍNICA: equipe (nome, função e CRO) */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {CONFIG.equipe.map((p, i) => (
              <li key={i} className="reveal overflow-hidden rounded-[1.5rem] border border-line bg-ivory" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <PhotoSlot label="Foto do profissional (substituir)" className="aspect-[4/3]" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">
                    <Val v={p.nome} />
                    {pendente(p.nome) && <span className="sr-only">Nome do profissional a confirmar</span>}
                  </h3>
                  <p className="mt-1 text-muted">{p.funcao}</p>
                  <p className="mt-3 text-sm font-semibold text-forest">
                    CRO-{CONFIG.uf}: <Val v={p.cro} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Estrutura() {
  const e = CONFIG.estrutura
  const itens = [
    { Icon: Clock, t: 'Atendimento 24 horas', v: 'Conforme a ficha do Google. Confirme a disponibilidade pelo WhatsApp.' },
    { Icon: Pin, t: 'Localização', v: CONFIG.endereco.referencia },
    { Icon: Car, t: 'Estacionamento', v: e.estacionamento },
    { Icon: Access, t: 'Acessibilidade', v: e.acessibilidade },
    { Icon: Card, t: 'Formas de pagamento', v: e.pagamento },
    { Icon: Users, t: 'Convênios', v: e.convenios },
  ]
  const fotos = CONFIG.fotos.galeria
  return (
    <section aria-labelledby="estrutura-title" id="estrutura" className="py-20 lg:py-28">
      <div className="wrap">
        <SectionHead id="estrutura-title" eyebrow="Estrutura e conforto" title="O que você encontra aqui" />

        {/* CONFIRMAR COM A CLÍNICA: estacionamento, acessibilidade, pagamento e convênios */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {itens.map(({ Icon, t, v }) => (
            <li key={t} className="reveal flex gap-4 bg-ivory p-6 sm:p-7">
              <Icon size={24} className="mt-0.5 flex-none text-brand" />
              <div>
                <h3 className="font-display text-lg font-semibold text-forest">{t}</h3>
                <p className="mt-1 text-[0.97rem] text-muted">
                  <Val v={v} />
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {fotos.length > 0
            ? fotos.map((f) => <img key={f.src} src={f.src} alt={f.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[1.25rem] object-cover" />)
            : ['Fachada', 'Recepção', 'Consultório'].map((l, i) => (
                <PhotoSlot key={l} label={`${l} (substituir)`} className={`reveal aspect-[4/3] rounded-[1.25rem] border border-line lg:aspect-[16/10] ${i === 2 ? 'col-span-2 !aspect-[8/3] lg:col-span-1 lg:!aspect-[16/10]' : ''}`} />
              ))}
        </div>
      </div>
    </section>
  )
}

export function AvaliacoesGoogle() {
  const n = CONFIG.notaGoogle
  if (!CONFIG.mostrarNotaGoogle || pendente(n.nota)) return null
  return (
    <section aria-labelledby="google-title" className="py-12">
      <div className="wrap flex flex-col items-start gap-4 rounded-[1.5rem] border border-line bg-paper p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="google-title" className="text-2xl">
            Nota {n.nota} no Google
          </h2>
          {!pendente(n.total) && <p className="text-muted">{n.total} avaliações</p>}
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
    a: (
      <>
        A ficha da clínica no Google indica atendimento 24 horas. Como a disponibilidade pode variar, confirme pelo WhatsApp ou por telefone antes de vir.
        Atendimento em feriados: <Val v={CONFIG.feriados} />
      </>
    ),
  },
  {
    q: 'Preciso agendar para urgência?',
    a: 'O ideal é chamar antes pelo WhatsApp ou ligar. Assim conversamos sobre o seu caso e a disponibilidade, e você já chega sabendo o que fazer.',
  },
  {
    q: 'O que fazer se um dente quebrar?',
    a: 'Mantenha a calma, guarde o fragmento em um recipiente limpo, se houver, e fale com a clínica. Evite mastigar do lado afetado e não coloque medicamento no local.',
  },
  {
    q: 'A clínica atende crianças?',
    a: 'Sim. A clínica informa atendimento para todas as idades, incluindo atendimento pediátrico. Fale com a gente para saber como funciona para a sua família.',
  },
  {
    q: 'Como funciona a sedação, de forma geral?',
    a: 'A sedação odontológica é um recurso que pode ser indicado para alguns pacientes e procedimentos. A indicação depende de avaliação individual e segue protocolos de segurança. O profissional explica as opções e os cuidados antes de qualquer decisão.',
  },
  {
    q: 'Onde fica a clínica?',
    a: (
      <>
        {enderecoLinha}. {CONFIG.endereco.referencia}.{' '}
        {!CONFIG.endereco.confirmado && <Pendente />}{' '}
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-brand-ink underline underline-offset-4">
          Abrir no Google Maps
        </a>
      </>
    ),
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: (
      <>
        <Val v={CONFIG.estrutura.pagamento} /> Enquanto isso, pergunte pelo WhatsApp.
      </>
    ),
  },
  {
    q: 'A clínica aceita convênios?',
    a: (
      <>
        <Val v={CONFIG.estrutura.convenios} /> Pergunte pelo WhatsApp sobre o seu plano.
      </>
    ),
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
                {!CONFIG.endereco.confirmado && (
                  <>
                    <br />
                    <Pendente label="Endereço [A CONFIRMAR]" />
                  </>
                )}
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
          <MapaOuArte />
        </div>
      </div>
    </section>
  )
}

/** Mapa do Google só quando o endereço estiver confirmado (CONFIG.mostrarMapa). Carrega sob demanda. */
function MapaOuArte() {
  const [load, setLoad] = useState(false)
  const q = encodeURIComponent(`${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`)
  return (
    <div className="reveal relative overflow-hidden rounded-[1.75rem] border border-line bg-paper">
      {CONFIG.mostrarMapa && load ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="aspect-[4/3] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="relative w-full sm:aspect-[16/11]">
          <div className="relative aspect-[16/10] sm:absolute sm:inset-0 sm:aspect-auto">
          {/* composição gráfica abstrata, não é um mapa real */}
          <svg aria-hidden="true" viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="280" fill="#f3efe5" />
            <g stroke="#e2dccd" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-20 70 C 90 60, 160 110, 420 90" />
              <path d="M60 -20 C 80 90, 120 180, 100 300" />
              <path d="M-20 210 C 120 200, 250 230, 420 190" />
              <path d="M290 -20 C 270 80, 300 170, 330 300" />
            </g>
            <g stroke="#ece7db" strokeWidth="6" fill="none">
              <path d="M180 -10 L 200 300" />
              <path d="M-10 140 L 410 150" />
            </g>
            <circle cx="210" cy="140" r="58" fill="#00a346" opacity=".08" />
            <circle cx="210" cy="140" r="30" fill="#00a346" opacity=".12" />
          </svg>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[85%] flex-col items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-paper shadow-[0_16px_30px_-14px_rgba(11,36,24,.7)]">
              <Pin size={26} />
            </span>
            <span className="h-3 w-px bg-forest" />
          </div>
          </div>
          <div className="relative m-3 sm:absolute sm:inset-x-6 sm:bottom-6 sm:m-0 flex flex-col gap-3 rounded-2xl border border-line bg-paper/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.95rem]">
              <strong className="block font-display text-lg text-forest">
                {CONFIG.nome} <span className="whitespace-nowrap">| {CONFIG.cidade}</span>
              </strong>
              <span className="text-muted">{CONFIG.endereco.referencia}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="btn btn-dark !min-h-12 !text-[0.95rem]">
                <Pin size={18} /> Como chegar
                <span className="sr-only"> (abre o Google Maps)</span>
              </a>
              {CONFIG.mostrarMapa && (
                <button type="button" onClick={() => setLoad(true)} className="btn btn-line !min-h-12 !text-[0.95rem]">
                  Carregar mapa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
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
