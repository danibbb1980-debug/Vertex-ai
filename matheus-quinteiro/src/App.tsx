import { useEffect, useState } from 'react'
import {
  CONFIG,
  MSG_GERAL,
  atendimentosAtivos,
  enderecoLinha,
  hora,
  msgAtendimento,
} from './config'
import { Agendar } from './components/Agendar'
import { Brand, ExtButton, Monogram, Picture, RevealTitle, SectionHead, WaButton } from './components/ui'

const S = CONFIG.secoes

/* Numeração só das seções que aparecem */
function useNumbers() {
  const order: (keyof typeof S)[] = [
    'atendimentos',
    'consulta',
    'formacao',
    'comoFunciona',
    'horarios',
    'duvidas',
    'localizacao',
    'agendar',
  ]
  const visible = order.filter((k) => {
    if (!S[k]) return false
    if (k === 'atendimentos') return atendimentosAtivos().length > 0
    if (k === 'formacao') return CONFIG.formacao.length > 0
    if (k === 'agendar') return CONFIG.usarWhatsapp && !!CONFIG.whatsapp
    return true
  })
  const num = (k: keyof typeof S) => String(visible.indexOf(k) + 1).padStart(2, '0')
  return { show: (k: keyof typeof S) => visible.includes(k), num }
}

/* ---------------- Header ---------------- */
function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])
  const { show } = useNumbers()
  const links = [
    show('atendimentos') && { href: '#atendimentos', label: 'Atendimentos' },
    show('formacao') && { href: '#formacao', label: 'Formação' },
    show('duvidas') && { href: '#duvidas', label: 'Dúvidas' },
    { href: '#contato', label: 'Contato' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <>
    <header className="site-header" data-solid={solid || open} data-open={open}>
      <div className="wrap">
        <Brand />
        <nav className="nav" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} className="link" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
          <WaButton text={MSG_GERAL} small className="header-cta" ariaLabel="Agendar consulta">
            Agendar consulta
          </WaButton>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu-movel"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="bars" aria-hidden="true" />
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
      {open && (
        <nav id="menu-movel" className="mobile-menu on-ink" aria-label="Menu">
          {links.map((l) => (
            <a key={l.href} className="big" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div style={{ marginTop: 'var(--s-4)', position: 'relative', zIndex: 1 }}>
            <WaButton text={MSG_GERAL} ariaLabel="Agendar consulta">
              Agendar consulta
            </WaButton>
          </div>
        </nav>
      )}
    </>
  )
}

/* ---------------- Hero ---------------- */
function Hero() {
  const [l1, l2] = CONFIG.nome.split(' ')
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <p className="label hero-eyebrow">
          <span className="whitespace-nowrap">{CONFIG.descritor} ·</span>{' '}
          <span className="whitespace-nowrap">{`${CONFIG.cidade}/${CONFIG.uf}`} ·</span>{' '}
          <span className="whitespace-nowrap">{CONFIG.registro}</span>
        </p>
        <div className="hero-inner">
          <div className="plate-col">
            <div className="plate">
              <div className="plate-name">
                <span className="plate-ring" aria-hidden="true" />
                <h1 id="hero-title">
                  <span className="plate-line">{l1}</span>{' '}
                  <span className="plate-line">{l2}</span>
                </h1>
                <div className="plate-fill" aria-hidden="true">
                  <span className="plate-line">{l1}</span>
                  <span className="plate-line">{l2}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-aside">
            <p className="hero-sub">
              Nutrição clínica com acompanhamento individual, a partir de uma consulta, em {CONFIG.cidade}.
            </p>
            <div className="btn-row">
              <WaButton text={MSG_GERAL} ariaLabel="Agendar consulta">
                Agendar consulta
              </WaButton>
              <a className="btn btn-ghost" href="#atendimentos">
                Ver atendimentos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Atendimentos (índice editorial) ---------------- */
function Atendimentos({ n }: { n: string }) {
  const lista = atendimentosAtivos()
  const [aberto, setAberto] = useState<string | null>(lista[0]?.id ?? null)
  if (!lista.length) return null
  return (
    <section id="atendimentos" className="section on-ink" aria-labelledby="atend-title">
      <div className="wrap">
        <SectionHead n={n} label="Atendimentos" />
        <div className="grid12" style={{ marginBottom: 'var(--s-6)', rowGap: 'var(--s-3)' }}>
          <RevealTitle
            id="atend-title"
            className="title col-span-4 md:col-span-8"
            lines={['Nutricionista em', `${CONFIG.cidade}, com atendimento`, 'individual.']}
          />
          <p className="muted col-span-4 md:col-start-9 md:col-span-4" style={{ alignSelf: 'end', margin: 0 }}>
            A indicação de cada atendimento depende de avaliação individual.
          </p>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--rule-on-ink)' }}>
          {lista.map((a, i) => {
            const open = aberto === a.id
            const pid = `atend-${a.id}`
            return (
              <li key={a.id} className="row idx-item" data-open={open}>
                <h3 style={{ font: 'inherit', margin: 0 }}>
                  <button
                    className="idx-btn"
                    aria-expanded={open}
                    aria-controls={pid}
                    onClick={() => setAberto(open ? null : a.id)}
                  >
                    <span className="idx-num tnum" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="idx-name">{a.nome}</span>
                    <span className="idx-sign" aria-hidden="true" />
                  </button>
                </h3>
                <div className="idx-panel" id={pid} data-open={open} role="region" aria-label={a.nome}>
                  <div>
                    <div className="idx-panel-inner">
                      <p style={{ margin: 0, fontSize: 'var(--step-1)', lineHeight: 1.45 }}>{a.descricao}</p>
                      <p className="muted" style={{ margin: 0 }}>
                        A indicação depende de avaliação individual.
                      </p>
                      <div>
                        <WaButton text={msgAtendimento(a)} ariaLabel={`Agendar esta consulta: ${a.nome}`}>
                          Agendar esta consulta
                        </WaButton>
                      </div>
                    </div>
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

/* ---------------- A consulta (seção ousada) ---------------- */
function Consulta({ n }: { n: string }) {
  const passos = [
    'Você conta sua rotina e o que procura',
    `Avaliação individual com o ${CONFIG.nome.split(' ')[0]}`,
    'Orientação para você decidir os próximos passos',
  ]
  return (
    <section className="section below" aria-labelledby="consulta-title" style={{ overflow: 'clip' }}>
      <div className="wrap">
        <SectionHead n={n} label="A consulta" />
      </div>
      <h2 id="consulta-title" className="sr-only">
        Primeiro, a conversa.
      </h2>
      <div className="bold-type reveal" data-reveal aria-hidden="true" style={{ paddingInline: 'var(--gutter)' }}>
        <span className="reveal-line">
          <span data-line>Primeiro,</span>
        </span>
        <span className="reveal-line" style={{ paddingLeft: '0.6em' }}>
          <span data-line>
            a <span className="ghost">conversa.</span>
          </span>
        </span>
      </div>
      <div className="wrap grid12" style={{ marginTop: 'var(--s-6)' }}>
        <ol
          className="consult-list col-span-4 md:col-start-6 md:col-span-7"
          style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--rule)' }}
        >
          {passos.map((p, i) => (
            <li key={p} className="row">
              <span className="tnum mark" aria-hidden="true">
                {`${i + 1}.`}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Formação (silenciosa) ---------------- */
function Formacao({ n }: { n: string }) {
  const foto = CONFIG.fotos.retrato
  return (
    <section id="formacao" className="section below" aria-labelledby="formacao-title" style={{ background: 'var(--paper-2)' }}>
      <div className="wrap grid12" style={{ rowGap: 'var(--s-6)' }}>
        {foto && (
          <div className="col-span-3 md:col-span-4">
            <Picture foto={foto} sizes="(min-width: 768px) 30vw, 75vw" />
          </div>
        )}
        <div className={foto ? 'col-span-4 md:col-start-7 md:col-span-6' : 'col-span-4 md:col-start-5 md:col-span-8'}>
          <SectionHead n={n} label="Formação" />
          <h2 id="formacao-title" className="sr-only">
            Formação do nutricionista {CONFIG.nome}
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-6)' }}>
            {CONFIG.formacao.map((f) => (
              <li key={f.titulo}>
                <p className="formacao-item" style={{ margin: 0 }}>
                  {f.titulo}
                </p>
                <p className="muted" style={{ margin: 'var(--s-1) 0 0' }}>
                  {f.instituicao}
                </p>
              </li>
            ))}
          </ul>
          <p className="label" style={{ marginTop: 'var(--s-7)', color: 'var(--accent-ink)' }}>
            {CONFIG.registro}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Como funciona (linha do tempo) ---------------- */
function ComoFunciona({ n }: { n: string }) {
  const etapas = [
    { t: 'Contato e agendamento', d: 'Você chama pelo WhatsApp ou envia a solicitação pelo site. A data e o horário são confirmados na conversa.' },
    { t: 'Consulta e avaliação', d: 'No consultório, você conta sua rotina, sua alimentação e o que procura. A avaliação é individual.' },
    { t: 'Orientação', d: 'Com base na conversa e na avaliação, você recebe a orientação nutricional pensada para o seu dia a dia.' },
    { t: 'Acompanhamento', d: 'Quando faz sentido para você, os retornos servem para ajustar a orientação ao que acontece na prática.' },
  ]
  return (
    <section className="section below" aria-labelledby="como-title">
      <div className="wrap grid12" style={{ rowGap: 'var(--s-6)' }}>
        <div className="col-span-4 md:col-span-5">
          <SectionHead n={n} label="Como funciona" />
          <RevealTitle id="como-title" className="title" lines={['Como a', 'consulta', 'acontece.']} />
        </div>
        <ol className="timeline col-span-4 md:col-start-7 md:col-span-6">
          <span className="timeline-track" aria-hidden="true" />
          {etapas.map((e, i) => (
            <li key={e.t} className="step">
              <span className="step-dot tnum" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{e.t}</h3>
                <p className="muted prose" style={{ margin: 'var(--s-2) 0 0' }}>
                  {e.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Horários ---------------- */
function Horarios({ n }: { n: string }) {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => {
    const d = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.fusoHorario, weekday: 'short' }).format(new Date())
    setHoje(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(d))
  }, [])
  return (
    <section id="horarios" className="section below on-ink" aria-labelledby="horarios-title">
      <div className="wrap grid12" style={{ rowGap: 'var(--s-6)' }}>
        <div className="col-span-4 md:col-span-5">
          <SectionHead n={n} label="Horários" />
          <RevealTitle id="horarios-title" className="title" lines={['Quando o', 'consultório', 'atende.']} />
          <p className="muted" style={{ marginTop: 'var(--s-4)' }}>
            {CONFIG.avisoHorarios}
          </p>
        </div>
        <dl className="col-span-4 md:col-start-7 md:col-span-6" style={{ margin: 0, borderTop: '1px solid var(--rule-on-ink)' }}>
          {CONFIG.horarios.map((h) => (
            <div key={h.dia} className="row hours-row" tabIndex={-1}>
              <dt className="day">
                {h.nome}
                {hoje === h.dia && <span className="today-tag" style={{ color: 'var(--accent-on-ink)', borderColor: 'var(--accent-on-ink)' }}>hoje</span>}
              </dt>
              <dd className="time tnum" style={{ margin: 0 }}>
                {h.abre && h.fecha ? (
                  <>
                    {hora(h.abre)} às {hora(h.fecha)}
                  </>
                ) : (
                  <span className="muted">Fechado</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------------- Dúvidas ---------------- */
function Duvidas({ n }: { n: string }) {
  const sab = CONFIG.horarios.find((h) => h.dia === 6)
  const e = CONFIG.endereco
  const faq = [
    {
      q: 'Como agendar uma consulta com o nutricionista?',
      a: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões "Agendar consulta" ou pelo formulário desta página. A data e o horário são confirmados na conversa.`,
    },
    {
      q: 'Como é a primeira consulta?',
      a: 'É uma conversa sobre sua rotina, sua alimentação e o que você procura, seguida de uma avaliação individual. Com isso, a orientação é pensada para você.',
    },
    {
      q: 'O que levar na consulta?',
      a: 'Se tiver, leve exames recentes e a lista de medicamentos ou suplementos que você usa. Se tiver dúvida sobre algo específico, pergunte no momento do agendamento.',
    },
    {
      q: 'Quais atendimentos são oferecidos?',
      a: `${atendimentosAtivos().map((x) => x.nome).join(' e ')}. A indicação de cada um depende de avaliação individual.`,
    },
    {
      q: 'Todo atendimento serve para todas as pessoas?',
      a: 'Não necessariamente. Cada pessoa tem uma história e uma rotina, e a indicação depende de avaliação individual.',
    },
    {
      q: 'Quais são os horários de atendimento?',
      a: 'Segunda, terça, quarta e sexta, das 8h às 17h; quinta, das 9h às 17h; sábado, das 8h às 12h. Horários podem variar em feriados.',
    },
    sab?.abre && sab.fecha
      ? { q: 'Atende aos sábados?', a: `Sim, das ${hora(sab.abre)} às ${hora(sab.fecha)}.` }
      : null,
    { q: 'E aos domingos?', a: 'Não. O consultório fica fechado aos domingos.' },
    {
      q: `Onde fica o consultório em ${CONFIG.cidade}?`,
      a: `${e.rua}, ${e.complemento.toLowerCase()}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    {
      q: 'Posso agendar pelo site?',
      a: 'Pelo site você envia uma solicitação, que abre uma conversa no WhatsApp. O horário só fica marcado depois da confirmação pelo WhatsApp.',
    },
  ].filter(Boolean) as { q: string; a: string }[]
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="duvidas" className="section below" aria-labelledby="duvidas-title">
      <div className="wrap grid12" style={{ rowGap: 'var(--s-5)' }}>
        <div className="col-span-4 lg:col-span-4 faq-aside">
          <SectionHead n={n} label="Dúvidas" />
          <RevealTitle id="duvidas-title" className="title" lines={['Dúvidas', 'frequentes.']} />
          <p className="muted" style={{ marginTop: 'var(--s-3)', maxWidth: '30ch' }}>
            Sobre a consulta com o nutricionista em {CONFIG.cidade}.
          </p>
        </div>
        <div className="col-span-4 md:col-span-12 lg:col-start-6 lg:col-span-7" style={{ borderTop: '1px solid var(--rule)' }}>
          {faq.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="row" data-open={isOpen}>
                <h3 style={{ margin: 0, font: 'inherit' }}>
                  <button
                    className="faq-btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-b-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-sign" aria-hidden="true" />
                  </button>
                </h3>
                <div className="idx-panel" id={`faq-${i}`} data-open={isOpen} role="region" aria-labelledby={`faq-b-${i}`}>
                  <div>
                    <p className="prose muted" style={{ margin: 0, paddingBottom: 'var(--s-4)', paddingRight: 'var(--s-6)' }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Localização ---------------- */
function Localizacao({ n }: { n: string }) {
  const e = CONFIG.endereco
  const [mapa, setMapa] = useState(false)
  return (
    <section id="contato" className="section below" aria-labelledby="local-title" style={{ background: 'var(--paper-2)' }}>
      <div className="wrap grid12" style={{ rowGap: 'var(--s-5)' }}>
        <div className="col-span-4 md:col-span-6">
          <SectionHead n={n} label="Localização e contato" />
          <RevealTitle id="local-title" className="title" lines={['Venha nos', 'visitar.']} />
          <address className="address" style={{ marginTop: 'var(--s-5)' }}>
            {e.rua}, {e.complemento.toLowerCase()}
            <br />
            {e.bairro}, <span style={{ whiteSpace: 'nowrap' }}>{e.cidade} - {e.uf}</span>
          </address>
          <p className="muted tnum" style={{ margin: 'var(--s-1) 0 0' }}>
            CEP {e.cep}
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--s-5) 0 0', borderTop: '1px solid var(--rule)' }}>
            {CONFIG.whatsapp && (
              <li className="row" style={{ paddingBlock: 'var(--s-2)' }}>
                <span className="mark" aria-hidden="true">
                  ○{' '}
                </span>
                WhatsApp{' '}
                <a className="link tnum" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(MSG_GERAL)}`} target="_blank" rel="noopener noreferrer">
                  {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.telefone && (
              <li className="row" style={{ paddingBlock: 'var(--s-2)' }}>
                Telefone <a className="link" href={`tel:${CONFIG.telefone.replace(/\D/g, '')}`}>{CONFIG.telefone}</a>
              </li>
            )}
            {CONFIG.email && (
              <li className="row" style={{ paddingBlock: 'var(--s-2)' }}>
                E-mail <a className="link" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li className="row" style={{ paddingBlock: 'var(--s-2)' }}>
                <span className="mark" aria-hidden="true">
                  ○{' '}
                </span>
                Instagram{' '}
                <a className="link" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
          </ul>
          <div className="btn-row" style={{ marginTop: 'var(--s-4)' }}>
            <ExtButton href={e.rota} variant="solid">
              Como chegar
            </ExtButton>
            <ExtButton href={e.maps}>Ver no Google Maps</ExtButton>
          </div>
          <div className="btn-row" style={{ marginTop: 'var(--s-2)' }}>
            <WaButton text={MSG_GERAL} variant="ghost" ariaLabel="Agendar consulta">
              Agendar consulta
            </WaButton>
            <ExtButton href={CONFIG.instagram.url}>Ver no Instagram</ExtButton>
          </div>
        </div>

        <div className="col-span-4 md:col-start-8 md:col-span-5" style={{ display: 'grid', gap: 'var(--s-3)', alignContent: 'start' }}>
          <Picture foto={CONFIG.fotos.consultorio} sizes="(min-width: 768px) 40vw, 92vw" />
          <div className="map-box">
            {mapa ? (
              <iframe
                src={e.embed}
                title={`Mapa: ${enderecoLinha()}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-facade">
                <span className="map-pin" aria-hidden="true" />
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  style={{ position: 'absolute', bottom: 'var(--s-2)', left: 'var(--s-2)', background: 'var(--paper)' }}
                  onClick={() => setMapa(true)}
                >
                  Mostrar mapa aqui
                </button>
              </div>
            )}
          </div>
          <p className="muted" style={{ fontSize: '0.8125rem', margin: 0 }}>
            O mapa do Google só carrega quando você pede.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- CTA final ---------------- */
function CtaFinal() {
  const foto = CONFIG.fotos.maca
  return (
    <section className="section below on-ink" aria-labelledby="cta-title" style={{ position: 'relative', overflow: 'clip' }}>
      <div className="wrap grid12" style={{ rowGap: 'var(--s-6)', alignItems: 'center' }}>
        <div className="col-span-4 md:col-span-7" style={{ position: 'relative', zIndex: 1 }}>
          <RevealTitle
            id="cta-title"
            className="title"
            lines={['O primeiro passo', 'é a consulta.']}
          />
          <div className="btn-row" style={{ marginTop: 'var(--s-5)' }}>
            <WaButton text={MSG_GERAL} ariaLabel="Agendar consulta">
              Agendar consulta
            </WaButton>
            <ExtButton href={CONFIG.instagram.url}>Ver no Instagram</ExtButton>
          </div>
        </div>
        <div className="col-span-3 col-start-2 md:col-start-9 md:col-span-4" style={{ position: 'relative' }}>
          <span className="cta-ring" aria-hidden="true" style={{ inset: '-9%' }} />
          {foto && (
            <div className="cta-photo">
              <Picture foto={foto} sizes="(min-width: 768px) 30vw, 70vw" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Rodapé ---------------- */
function Footer() {
  const e = CONFIG.endereco
  return (
    <footer className="on-ink" style={{ borderTop: '1px solid var(--rule-on-ink)', overflow: 'clip' }}>
      <div className="wrap" style={{ paddingTop: 'var(--s-7)' }}>
        <div className="grid12" style={{ rowGap: 'var(--s-4)' }}>
          <div className="col-span-4 md:col-span-5" style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'flex-start' }}>
            <Monogram className="brand-mark" />
            <p style={{ margin: 0 }}>
              <strong>{CONFIG.nome}</strong> · {CONFIG.descritor} · <span style={{ whiteSpace: 'nowrap' }}>{CONFIG.registro}</span> · <span style={{ whiteSpace: 'nowrap' }}>{CONFIG.cidade}/{CONFIG.uf}</span>
            </p>
          </div>
          <div className="col-span-4 md:col-start-7 md:col-span-3">
            <p className="muted" style={{ margin: 0 }}>
              {e.rua}, {e.complemento.toLowerCase()}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
              <br />
              <span className="tnum">CEP {e.cep}</span>
            </p>
          </div>
          <ul className="col-span-4 md:col-span-3" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--s-1)' }}>
            {CONFIG.whatsapp && (
              <li>
                <span className="mark" aria-hidden="true">○ </span>
                <a className="link tnum" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(MSG_GERAL)}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            <li>
              <span className="mark" aria-hidden="true">○ </span>
              <a className="link" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
            <li>
              <span className="mark" aria-hidden="true">○ </span>
              <a className="link" href="/privacidade.html">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
        <p className="muted" style={{ fontSize: '0.8125rem', marginTop: 'var(--s-5)', maxWidth: '70ch' }}>
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento
          depende de avaliação individual.
        </p>
      </div>
      <p className="footer-sign" aria-hidden="true" style={{ margin: 'var(--s-5) 0 0', paddingInline: 'var(--gutter)', transform: 'translateY(0.14em)' }}>
        {CONFIG.nome}
      </p>
    </footer>
  )
}

/* ---------------- Conversão fixa ---------------- */
function StickyCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const nearEnd = h.scrollHeight - (window.scrollY + window.innerHeight) < 900
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null
  return (
    <>
      <div className="mobile-bar on-ink" data-show={show} inert={!show}>
        <span style={{ fontSize: '0.875rem', lineHeight: 1.3 }}>
          {CONFIG.nome}
          <br />
          <span className="muted">{CONFIG.registro}</span>
        </span>
        <WaButton text={MSG_GERAL} small ariaLabel="Agendar consulta">
          Agendar consulta
        </WaButton>
      </div>
      <a
        className="float-btn"
        data-show={show}
        inert={!show}
        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(MSG_GERAL)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar consulta pelo WhatsApp (abre em nova aba)"
      >
        <span aria-hidden="true">Agendar</span>
      </a>
    </>
  )
}

/* ---------------- Efeitos: revelação, Lenis ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            io.unobserve(en.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useSmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return
    let destroy: (() => void) | undefined
    const start = () =>
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({ duration: 1.05, anchors: { offset: -96 } })
        let raf = 0
        const loop = (t: number) => {
          lenis.raf(t)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        destroy = () => {
          cancelAnimationFrame(raf)
          lenis.destroy()
        }
      })
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    const id = ric ? ric(start) : window.setTimeout(start, 1200)
    return () => {
      if (!ric) clearTimeout(id)
      destroy?.()
    }
  }, [])
}

export default function App() {
  useReveal()
  useSmoothScroll()
  const { show, num } = useNumbers()
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      {CONFIG.rascunho && (
        <div className="draft" role="note">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </div>
      )}
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {show('atendimentos') && <Atendimentos n={num('atendimentos')} />}
        {show('consulta') && <Consulta n={num('consulta')} />}
        {show('formacao') && <Formacao n={num('formacao')} />}
        {show('comoFunciona') && <ComoFunciona n={num('comoFunciona')} />}
        {show('horarios') && <Horarios n={num('horarios')} />}
        {show('duvidas') && <Duvidas n={num('duvidas')} />}
        {show('localizacao') && <Localizacao n={num('localizacao')} />}
        {show('agendar') && <Agendar n={num('agendar')} />}
        {S.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
