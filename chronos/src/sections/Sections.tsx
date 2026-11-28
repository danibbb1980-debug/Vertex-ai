import { useEffect, useId, useState } from 'react'
import { CONFIG, MSG_GERAL, NOMES_DIA, hh, msgServico, servicosAtivos, waLink, type Dia, type Foto } from '../config'
import { Arrow, Dial, ExtLink, Lines, SectionNum, Wordmark } from '../ui'

const WaButton = ({ msg, label = 'Pedir horário', variant = 'primary' }: { msg: string; label?: string; variant?: 'primary' | 'ghost' | 'paper' }) => (
  <a className={`btn btn--${variant}`} href={waLink(msg)} target='_blank' rel='noopener noreferrer'>
    <span>{label}</span>
    <Arrow />
    <span className='sr-only'> pelo WhatsApp (abre em nova aba)</span>
  </a>
)

/* ------------------------------ 01 Estética ------------------------------ */

export const Estetica = () => {
  const itens = servicosAtivos()
  if (!itens.length) return null
  return (
    <section className='sec sec--block' id='estetica' aria-labelledby='estetica-t' data-reveal>
      <div className='wrap grid12'>
        <div className='est-side'>
          <SectionNum n='01' label='Atendimento' />
        </div>
        <div className='est-main'>
          <Lines id='estetica-t' className='t-2xl' lines={['O que a Chronos', 'faz por aqui.']} />
          <ol className='est-list'>
            {itens.map((s, i) => (
              <li key={s.id} className='est-item'>
                <span className='est-n' aria-hidden='true'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className='est-body'>
                  <h3 className='est-name'>{s.nome}</h3>
                  {s.descricao && <p className='est-desc'>{s.descricao}</p>}
                  <WaButton msg={msgServico(s.nome)} label={`Pedir horário para ${s.nome.toLowerCase()}`} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ 02 O traço (ousada) ------------------------------ */

export const OTraco = () => (
  <section className='sec sec--page traco' aria-labelledby='traco-t' data-reveal>
    <div className='traco-scrub' data-scrub>
      <svg className='traco-line' viewBox='0 0 1440 520' preserveAspectRatio='none' aria-hidden='true' focusable='false'>
        <path pathLength={1} d='M-10 430 H420 L500 350 H880 L960 270 H1250 L1330 190 H1460' />
      </svg>
    </div>
    <div className='traco-mega' aria-hidden='true'>
      <span>Cada veículo,</span>
      <span>com atenção.</span>
    </div>
    <div className='wrap grid12 traco-foot'>
      <div className='traco-head'>
        <SectionNum n='02' label='Como pensamos' />
        <h2 id='traco-t' className='sr-only'>
          Cada veículo, com atenção.
        </h2>
      </div>
      <ul className='traco-notes'>
        <li className='row'>
          <span className='row-k'>a</span>Você conta como é o seu veículo e o que precisa.
        </li>
        <li className='row'>
          <span className='row-k'>b</span>Combinamos o atendimento e o horário pelo WhatsApp.
        </li>
      </ul>
    </div>
  </section>
)

/* ------------------------------ 03 Trabalhos ------------------------------ */

const Img = ({ f, sizes, eager = false }: { f: Foto; sizes: string; eager?: boolean }) => {
  const src = `/fotos/${f.arquivo}-480.webp`
  const srcSet = f.tem960 ? `/fotos/${f.arquivo}-480.webp 480w, /fotos/${f.arquivo}-960.webp 960w` : undefined
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={f.largura}
      height={f.altura}
      alt={f.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding='async'
      style={{ aspectRatio: `${f.largura} / ${f.altura}` }}
    />
  )
}

export const Trabalhos = () => {
  const fotos = CONFIG.fotos
  if (!fotos.length) return null
  return (
    <section className='sec sec--page trab' id='trabalhos' aria-labelledby='trab-t' data-reveal>
      <div className='wrap grid12 trab-head'>
        <div className='trab-num'>
          <SectionNum n='03' label='Trabalhos' />
        </div>
        <Lines id='trab-t' className='t-2xl trab-title' lines={['Do espaço', 'da Chronos.']} />
        <p className='trab-intro'>Registros do dia a dia em Poços de Caldas, enviados pela própria Chronos.</p>
      </div>
      <div className='wrap trab-grid'>
        {fotos.map((f, i) => (
          <figure key={f.arquivo} className={`ph ph--${i + 1}${f.largura < 300 ? ' ph--small' : ''}`}>
            <div className='ph-frame'>
              <Img f={f} sizes='(min-width: 1024px) 40vw, 92vw' />
            </div>
            {f.legenda && (
              <figcaption>
                <span className='ph-n'>{String(i + 1).padStart(2, '0')}</span>
                {f.legenda}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------ Silêncio ------------------------------ */

export const Silencio = () => (
  <section className='sec sec--paper silencio' aria-labelledby='sil-t' data-reveal>
    <div className='wrap grid12'>
      <Lines id='sil-t' className='t-3xl silencio-t' lines={['Estética automotiva', 'em Poços de Caldas.']} />
      <div className='silencio-foot'>
        <img src='/logo-chronos-tinta.svg' alt='Chronos Estética Automotiva' width='120' height='34' loading='lazy' decoding='async' />
        <p>{CONFIG.endereco.completo}</p>
      </div>
    </div>
  </section>
)

/* ------------------------------ 04 Como funciona ------------------------------ */

const ETAPAS = [
  ['Você chama no WhatsApp', 'Conte qual é o veículo e o que você procura.'],
  ['Combinamos o atendimento e o horário', 'A disponibilidade é confirmada pela própria conversa.'],
  ['Atendimento no endereço da Chronos', `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}.`],
  ['Retirada do veículo', 'Combinada com você, no mesmo endereço.']
]

export const ComoFunciona = () => (
  <section className='sec sec--page como' id='como-funciona' aria-labelledby='como-t' data-reveal>
    <div className='wrap grid12'>
      <div className='como-side'>
        <SectionNum n='04' label='Como funciona' />
        <Lines id='como-t' className='t-xl' lines={['Do primeiro', 'contato à', 'retirada.']} />
      </div>
      <ol className='timeline' data-scrub>
        <span className='timeline-track' aria-hidden='true'>
          <span className='timeline-fill' />
        </span>
        {ETAPAS.map(([t, d], i) => (
          <li key={i} className='tl-item'>
            <span className='tl-n' aria-hidden='true'>
              {i + 1}
            </span>
            <div>
              <h3 className='tl-t'>{t}</h3>
              <p className='tl-d'>{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

/* ------------------------------ 05 Horários ------------------------------ */

const ORDEM: Dia[] = [1, 2, 3, 4, 5, 6, 0]

export const diaHoje = (): Dia => {
  const nome = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.fusoHorario, weekday: 'short' }).format(new Date())
  return (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nome) as Dia) ?? 1
}

export const Horarios = () => {
  const [hoje, setHoje] = useState<Dia | null>(null)
  useEffect(() => setHoje(diaHoje()), [])
  return (
    <section className='sec sec--block horarios' id='horarios' aria-labelledby='hor-t' data-reveal>
      <div className='wrap grid12'>
        <div className='hor-side'>
          <SectionNum n='05' label='Horários' />
          <Lines id='hor-t' className='t-xl' lines={['Quando a Chronos', 'atende.']} />
          <p className='hor-note'>{CONFIG.avisoFeriados}</p>
        </div>
        <dl className='hor-list'>
          {ORDEM.map(d => {
            const h = CONFIG.horarios[d]
            return (
              <div key={d} className={`row hor-row${hoje === d ? ' is-today' : ''}${h ? '' : ' is-closed'}`}>
                <dt>
                  {NOMES_DIA[d]}
                  {hoje === d && <span className='hor-today'>hoje</span>}
                </dt>
                <dd className='tnum'>{h ? `${hh(h.abre)} às ${hh(h.fecha)}` : 'Fechado'}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

/* ------------------------------ 06 Dúvidas ------------------------------ */

const FAQ: [string, string][] = [
  ['Como pedir um horário?', 'Pelo WhatsApp (35) 9126-7375, pelo botão “Pedir horário” ou pelo formulário desta página, que monta a mensagem para você.'],
  ['Que atendimento a Chronos oferece?', 'Estética automotiva. Para saber o que cabe no seu veículo, converse com a Chronos pelo WhatsApp.'],
  ['Preciso agendar?', 'Você pode solicitar o seu horário pelo WhatsApp. A confirmação da disponibilidade é feita por lá.'],
  ['Quais são os horários?', 'Segunda a quinta, das 8h às 17h. Sexta e sábado, das 8h às 16h. Horários podem variar em feriados.'],
  ['Atende aos sábados?', 'Sim, das 8h às 16h.'],
  ['E aos domingos?', 'Não. Aos domingos a Chronos está fechada.'],
  ['Onde fica a Chronos?', 'Na R. Acácia, nº 518, bairro São João, em Poços de Caldas - MG, CEP 37701-125.'],
  ['Como falo sobre valores?', 'Chame no WhatsApp para conversar sobre o seu veículo.'],
  ['Posso pedir o horário pelo site?', 'Pode. O formulário “Pedir horário” monta a mensagem e abre o WhatsApp; a Chronos confirma a disponibilidade pela conversa. O site não guarda os dados digitados.']
]

const FaqItem = ({ q, a, i }: { q: string; a: string; i: number }) => {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className={`faq-item row${open ? ' is-open' : ''}`}>
      <h3>
        <button type='button' className='faq-q' aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={() => setOpen(o => !o)}>
          <span className='faq-n tnum' aria-hidden='true'>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className='faq-qt'>{q}</span>
          <span className='faq-sign' aria-hidden='true' />
        </button>
      </h3>
      <div className='faq-a' id={`${id}-a`} role='region' aria-labelledby={`${id}-q`} hidden={!open}>
        <p>{a}</p>
      </div>
    </div>
  )
}

export const Duvidas = () => (
  <section className='sec sec--page duvidas' id='duvidas' aria-labelledby='duv-t' data-reveal>
    <div className='wrap grid12'>
      <div className='duv-side'>
        <SectionNum n='06' label='Dúvidas' />
        <Lines id='duv-t' className='t-xl' lines={['Perguntas sobre', 'a estética automotiva', 'em Poços de Caldas.']} />
      </div>
      <div className='duv-list'>
        {FAQ.map(([q, a], i) => (
          <FaqItem key={i} q={q} a={a} i={i} />
        ))}
      </div>
    </div>
  </section>
)

/* ------------------------------ 07 Contato ------------------------------ */

export const Contato = () => {
  const [mapa, setMapa] = useState(false)
  return (
    <section className='sec sec--block contato' id='contato' aria-labelledby='cont-t' data-reveal>
      <div className='wrap grid12'>
        <div className='cont-text'>
          <SectionNum n='07' label='Localização' />
          <Lines id='cont-t' className='t-2xl' lines={['Venha nos', 'visitar.']} />
          <address className='cont-addr'>
            {CONFIG.endereco.ruaCompleta}
            <br />
            {CONFIG.endereco.bairro}, {CONFIG.cidade} - {CONFIG.uf}
            <br />
            CEP {CONFIG.endereco.cep}
          </address>
          <ul className='cont-links'>
            <li className='row'>
              <span className='row-k'>Rota</span>
              <ExtLink href={CONFIG.rotaUrl} className='ulink'>
                Como chegar
              </ExtLink>
            </li>
            <li className='row'>
              <span className='row-k'>Mapa</span>
              <ExtLink href={CONFIG.mapsUrl} className='ulink'>
                Ver no Google Maps
              </ExtLink>
            </li>
            <li className='row'>
              <span className='row-k'>WhatsApp</span>
              <ExtLink href={waLink(MSG_GERAL)} className='ulink tnum'>
                {CONFIG.whatsappExibicao}
              </ExtLink>
            </li>
            <li className='row'>
              <span className='row-k'>Instagram</span>
              <ExtLink href={CONFIG.instagram.url} className='ulink'>
                Ver no Instagram
              </ExtLink>
            </li>
          </ul>
          <div className='cont-ctas'>
            <WaButton msg={MSG_GERAL} />
            <ExtLink href={CONFIG.instagram.url} className='btn btn--ghost'>
              Ver no Instagram
            </ExtLink>
          </div>
        </div>
        <div className='cont-map'>
          {mapa ? (
            <iframe
              title={`Mapa: ${CONFIG.endereco.completo}`}
              src={CONFIG.mapaEmbed}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          ) : (
            <div className='map-facade'>
              <Dial className='map-dial' ticks={60} />
              <p className='map-label'>
                <span className='label'>R. Acácia, 518</span>
                São João · Poços de Caldas
              </p>
              <button type='button' className='btn btn--ghost' onClick={() => setMapa(true)}>
                Carregar o mapa aqui
              </button>
              <p className='map-hint'>O mapa vem do Google e só carrega se você pedir.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ CTA final e rodapé ------------------------------ */

export const CtaFinal = () => (
  <section className='sec sec--page cta' aria-labelledby='cta-t' data-reveal>
    <div className='cta-mega' aria-hidden='true'>
      CHRONOS
    </div>
    <div className='wrap grid12 cta-body'>
      <Dial className='cta-dial' ticks={60} />
      <div className='cta-copy'>
        <Lines id='cta-t' className='t-2xl' lines={['Chame no WhatsApp e', 'combine o seu horário.']} />
        <div className='cta-ctas'>
          <WaButton msg={MSG_GERAL} />
          <ExtLink href={CONFIG.instagram.url} className='btn btn--ghost'>
            Ver no Instagram
          </ExtLink>
        </div>
      </div>
    </div>
  </section>
)

export const Footer = () => (
  <footer className='footer'>
    <div className='wrap'>
      <div className='foot-sign' aria-hidden='true'>
        <Wordmark />
      </div>
      <div className='grid12 foot-grid'>
        <div className='foot-brand'>
          <img src='/logo-chronos.svg' alt='Chronos Estética Automotiva' width='120' height='34' loading='lazy' decoding='async' />
          <p>Chronos | Estética Automotiva · Poços de Caldas/MG</p>
        </div>
        <address className='foot-addr'>
          {CONFIG.endereco.completo}
        </address>
        <ul className='foot-links'>
          <li>
            <span className='foot-k' aria-hidden='true'>W</span>
            <ExtLink href={waLink(MSG_GERAL)} className='ulink tnum'>
              WhatsApp {CONFIG.whatsappExibicao}
            </ExtLink>
          </li>
          <li>
            <span className='foot-k' aria-hidden='true'>I</span>
            <ExtLink href={CONFIG.instagram.url} className='ulink'>
              {CONFIG.instagram.usuario}
            </ExtLink>
          </li>
          <li>
            <span className='foot-k' aria-hidden='true'>P</span>
            <a href='/privacidade.html' className='ulink'>
              Privacidade
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
)
