import { useEffect, useState } from 'react';
import { CONFIG, servicosAtivos, enderecoLinha } from './config';
import { WaButton, LinkButton, SectionHead, LensName } from './ui';
import { msgServico, horaCurta, hojeNoFuso } from './lib';
import logo from './assets/logo.svg';
import logoClaro from './assets/logo-claro.svg';

export function DraftBar() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="draft" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

const NAV = [
  { href: '#atendimentos', label: 'Atendimentos', on: CONFIG.secoes.atendimentos },
  { href: '#trabalhos', label: 'Trabalhos', on: CONFIG.secoes.trabalhos && CONFIG.trabalhos.length > 0 },
  { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
].filter((n) => n.on);

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`} data-header>
      <div className="wrap site-header__in">
        <a className="brand" href="#topo" aria-label="The Details Estética Automotiva, início">
          <img src={logo} alt="" width="854" height="271" className="brand__logo" />
        </a>
        <nav className="nav" id="menu" aria-label="Principal">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="nav__link" onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <WaButton className="nav__cta" />
        </nav>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-btn__ring" aria-hidden="true" />
          <span>{open ? 'Fechar' : 'Menu'}</span>
        </button>
      </div>
    </header>
  );
}

export function Atendimentos() {
  const lista = servicosAtivos();
  if (!CONFIG.secoes.atendimentos || lista.length === 0) return null;
  return (
    <section className="sec sec--ink1" id="atendimentos" aria-labelledby="atendimentos-t">
      <div className="wrap">
        <SectionHead num="01" label="Atendimentos" title="Detalhamento automotivo para carros e motos." id="atendimentos-t">
          <p>Toque em cada atendimento para ver como ele funciona e pedir um horário.</p>
        </SectionHead>
        <ol className="index">
          {lista.map((s, i) => (
            <li key={s.id} className="index__item">
              <details className="index__det">
                <summary className="index__sum line-hover">
                  <span className="index__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="index__name">{s.nome}</span>
                  <span className="index__toggle" aria-hidden="true" />
                </summary>
                <div className="index__body">
                  {s.descricao ? <p>{s.descricao}</p> : null}
                  <WaButton texto={msgServico(s.nome)}>Pedir horário para {s.id === 'motos' ? 'a moto' : 'o carro'}</WaButton>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DePerto() {
  if (!CONFIG.secoes.dePerto) return null;
  return (
    <section className="sec deperto" aria-labelledby="deperto-t">
      <div className="deperto__circle" data-drift aria-hidden="true" />
      <div className="wrap deperto__wrap">
        <p className="shead__num" data-ring>
          <span className="ring" aria-hidden="true" />
          <span className="shead__n">03</span>
          <span className="shead__label">De perto</span>
        </p>
        <h2 className="deperto__title" id="deperto-t">
          <span className="mask" data-reveal>
            <span>
              Cada detalhe,
              <br />
              de perto.
            </span>
          </span>
        </h2>
        <ul className="deperto__list">
          <li className="line-hover">Você conta como é o seu veículo e o que ele precisa.</li>
          <li className="line-hover">Combinamos o atendimento e o horário pelo WhatsApp.</li>
          <li className="line-hover">No box, atenção aos detalhes do seu veículo, um a um.</li>
        </ul>
      </div>
    </section>
  );
}

export function Silencio() {
  if (!CONFIG.secoes.silencio) return null;
  return (
    <section className="sec silencio" aria-labelledby="silencio-t">
      <div className="wrap silencio__wrap">
        <h2 className="silencio__t" id="silencio-t">
          Detalhamento automotivo em {CONFIG.cidade}.
        </h2>
        <div className="silencio__foot">
          <img src={logoClaro} alt="The Details Estética Automotiva" width="854" height="271" loading="lazy" decoding="async" className="silencio__logo" />
          <p className="silencio__addr">{enderecoLinha()}</p>
        </div>
      </div>
    </section>
  );
}

const ETAPAS = [
  { t: 'Você chama no WhatsApp', d: 'Pelo botão do site ou pelo formulário de pedido de horário.' },
  { t: 'Combinamos o atendimento e o horário', d: 'Você conta sobre o veículo e a disponibilidade é confirmada na conversa.' },
  { t: 'Atendimento no endereço da The Details', d: `Você leva o veículo até a ${CONFIG.endereco.rua}, no bairro ${CONFIG.endereco.bairro}.` },
  { t: 'Retirada do veículo', d: 'Combinada pelo WhatsApp, dentro do horário de funcionamento.' },
];

export function ComoFunciona() {
  if (!CONFIG.secoes.comoFunciona) return null;
  return (
    <section className="sec sec--ink1" id="como-funciona" aria-labelledby="como-t">
      <div className="wrap como">
        <div className="como__head">
          <SectionHead num="04" label="Como funciona" title="Do primeiro contato à retirada." id="como-t" />
        </div>
        <ol className="timeline" data-timeline>
          <span className="timeline__track" aria-hidden="true">
            <span className="timeline__bar" data-timeline-bar />
          </span>
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="timeline__step">
              <span className="timeline__n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="timeline__t">{e.t}</h3>
                <p className="timeline__d">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Horarios() {
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => setHoje(hojeNoFuso()), []);
  if (!CONFIG.secoes.horarios) return null;
  return (
    <section className="sec" id="horarios" aria-labelledby="horarios-t">
      <div className="wrap horarios">
        <SectionHead num="05" label="Horários" title="Quando a The Details atende." id="horarios-t">
          <p>{CONFIG.avisoHorarios}</p>
        </SectionHead>
        <dl className="hours">
          {CONFIG.horarios.map((d) => (
            <div key={d.dia} className={`hours__row line-hover ${hoje === d.idx ? 'is-today' : ''}`}>
              <dt>
                {d.dia}
                {hoje === d.idx ? <span className="hours__today">hoje</span> : null}
              </dt>
              <dd>
                {d.abre && d.fecha ? (
                  <>
                    {horaCurta(d.abre)} às {horaCurta(d.fecha)}
                  </>
                ) : (
                  'Fechado'
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Como pedir um horário na The Details?',
    a: 'Pelo WhatsApp (35) 98422-0508, pelo botão "Pedir horário" ou pelo formulário desta página, que monta a mensagem para você.',
  },
  {
    q: 'Quais atendimentos de estética automotiva a The Details oferece?',
    a: 'Detalhamento automotivo de carros e de motos. Os detalhes de cada atendimento são combinados pelo WhatsApp, conforme o veículo.',
  },
  {
    q: 'Preciso agendar?',
    a: 'Você pode solicitar o horário pelo WhatsApp. A confirmação da disponibilidade é feita por lá.',
  },
  {
    q: 'Quais são os horários de atendimento?',
    a: 'De segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h. Os horários podem variar em feriados.',
  },
  { q: 'Atende aos sábados?', a: 'Sim, das 8h às 12h.' },
  { q: 'E aos domingos?', a: 'Não. Aos domingos a The Details fica fechada.' },
  {
    q: 'Onde fica a The Details em Poços de Caldas?',
    a: `Na ${enderecoLinha()}.`,
  },
  {
    q: 'Como falo sobre valores?',
    a: 'Chame no WhatsApp para conversar sobre o seu veículo e sobre o atendimento que ele precisa.',
  },
  {
    q: 'Posso pedir o horário pelo site?',
    a: 'Sim. O formulário desta página monta a mensagem e abre o WhatsApp. É só enviar. O site não guarda os dados digitados.',
  },
];

export function Duvidas() {
  if (!CONFIG.secoes.duvidas) return null;
  return (
    <section className="sec sec--ink1" id="duvidas" aria-labelledby="duvidas-t">
      <div className="wrap duvidas">
        <div className="duvidas__head">
          <SectionHead num="06" label="Dúvidas" title="Perguntas sobre o detalhamento automotivo." id="duvidas-t" />
        </div>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q} className="faq__item">
              <summary className="faq__q line-hover">
                <span>{f.q}</span>
                <span className="index__toggle" aria-hidden="true" />
              </summary>
              <p className="faq__a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contato() {
  const [mapa, setMapa] = useState(false);
  useEffect(() => {
    const el = document.getElementById('mapa-slot');
    if (!el || !('IntersectionObserver' in window)) return setMapa(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setMapa(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  return (
    <section className="sec" id="contato" aria-labelledby="contato-t">
      <div className="wrap contato">
        <div className="contato__info">
          <SectionHead num="07" label="Localização e contato" title="Venha nos visitar." id="contato-t" />
          <address className="contato__addr">
            {e.rua}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            CEP {e.cep}
          </address>
          <ul className="contato__links">
            <li>
              <a className="tlink" href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
                <span className="tlink__mark" aria-hidden="true">○</span>Como chegar
              </a>
            </li>
            {CONFIG.mapsUrl ? (
              <li>
                <a className="tlink" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <span className="tlink__mark" aria-hidden="true">○</span>Ver no Google Maps
                </a>
              </li>
            ) : null}
            {CONFIG.usarWhatsapp ? (
              <li>
                <a className="tlink" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <span className="tlink__mark" aria-hidden="true">○</span>WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            ) : null}
            <li>
              <a className="tlink" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                <span className="tlink__mark" aria-hidden="true">○</span>Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
          </ul>
          <div className="btn-row">
            <WaButton />
            <LinkButton href={CONFIG.instagram.url} external>
              Ver no Instagram
            </LinkButton>
          </div>
        </div>
        <div className="contato__map" id="mapa-slot">
          {mapa ? (
            <iframe
              title={`Mapa: ${enderecoLinha()}`}
              src={CONFIG.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <a className="contato__mapfallback" href={CONFIG.mapsUrl || CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
              Abrir o mapa no Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section className="sec cta" aria-labelledby="cta-t">
      <div className="wrap">
        <LensName className="cta__name" />
        <div className="cta__row">
          <h2 className="cta__t" id="cta-t">
            Chame no WhatsApp e combine o seu horário.
          </h2>
          <div className="btn-row">
            <WaButton />
            <LinkButton href={CONFIG.instagram.url} external>
              Ver no Instagram
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <img src={logo} alt="The Details Estética Automotiva" width="854" height="271" loading="lazy" decoding="async" className="footer__logo" />
          <div>
            <p className="footer__k">Endereço</p>
            <p>
              {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, CEP {CONFIG.endereco.cep}
            </p>
          </div>
          <div>
            <p className="footer__k">Contato</p>
            <ul className="footer__links">
              {CONFIG.usarWhatsapp ? (
                <li>
                  <a className="ulink" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp {CONFIG.whatsappExibicao}
                  </a>
                </li>
              ) : null}
              <li>
                <a className="ulink" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
              <li>
                <a className="ulink" href="/privacidade.html">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer__sig" aria-hidden="true" data-text={CONFIG.marca} />
        <p className="footer__legal">
          {CONFIG.nome} · {CONFIG.cidade}/{CONFIG.uf}
        </p>
      </div>
    </footer>
  );
}

export function MobileBar() {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <div className="mbar" data-mbar>
      <WaButton className="mbar__wa" />
      <a className="btn btn--line mbar__route" href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
        <span>Como chegar</span>
      </a>
    </div>
  );
}
