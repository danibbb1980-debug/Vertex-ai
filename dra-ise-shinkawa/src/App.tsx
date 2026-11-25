import { useEffect, useRef, useState } from 'react';
import { CONFIG, atendimentosAtivos, msgAtendimento } from './config';
import { BtnAgendar, Img, Link, Monograma, Rotulo, Titulo } from './components/Comuns';
import { AntesDepois } from './components/AntesDepois';
import { Agendar } from './components/Agendar';

const S = CONFIG.secoes;
const E = CONFIG.endereco;
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const hora = (h: string) => h.replace(':00', 'h').replace(/^0/, '');

function linhasHorario() {
  const uteis = [1, 2, 3, 4, 5].every((d) => JSON.stringify(CONFIG.horarios[d]) === JSON.stringify(CONFIG.horarios[1]));
  const fimDeSemanaFechado = !CONFIG.horarios[0] && !CONFIG.horarios[6];
  if (uteis && fimDeSemanaFechado && CONFIG.horarios[1]) {
    const h = CONFIG.horarios[1];
    return [
      { dias: [1, 2, 3, 4, 5], rotulo: 'Segunda a sexta', valor: `${hora(h.abre)} às ${hora(h.fecha)}` },
      { dias: [6, 0], rotulo: 'Sábado e domingo', valor: 'Fechado' },
    ];
  }
  return [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = CONFIG.horarios[d];
    return { dias: [d], rotulo: DIAS[d], valor: h ? `${hora(h.abre)} às ${hora(h.fecha)}` : 'Fechado' };
  });
}

const FAQ: { p: string; r: string }[] = [
  { p: 'Como agendar?', r: 'Pelo WhatsApp (19) 99712-8622, pelos botões “Agendar avaliação” ou pelo formulário desta página. O dia e o horário são confirmados pelo WhatsApp.' },
  { p: 'Como é a primeira avaliação?', r: 'É uma conversa com a Dra. Ise sobre o que você procura, seguida de uma avaliação individual no consultório. Ao final, ela explica as opções indicadas para o seu caso.' },
  { p: 'O que levar?', r: 'Um documento com foto e, se tiver, exames ou relatórios recentes relacionados ao que você quer conversar.' },
  { p: 'Quais atendimentos são oferecidos?', r: `Atualmente: ${atendimentosAtivos().map((a) => a.nome).join(', ')}. Todos começam por uma avaliação individual.` },
  { p: 'Todo atendimento serve para todas as pessoas?', r: 'Não. A indicação de cada atendimento depende de avaliação individual com a Dra. Ise.' },
  { p: 'O que é a Cirurgia e Traumatologia Bucomaxilofacial?', r: 'É uma especialidade da odontologia que cuida da face, da boca e dos maxilares. Em Limeira, a Dra. Ise atende essa área com avaliação individual de cada caso.' },
  { p: 'Quais são os horários?', r: 'De segunda a sexta, das 8h às 17h. Os horários podem variar em feriados.' },
  { p: 'Atende aos sábados?', r: 'Não. O atendimento é de segunda a sexta, das 8h às 17h.' },
  { p: 'Onde fica o consultório?', r: `${E.rua}, ${E.bairro}, ${E.cidade} - ${E.uf}, CEP ${E.cep}.` },
  { p: 'Posso agendar pelo site?', r: 'Você pode enviar uma solicitação pelo formulário. Ele abre o WhatsApp com a mensagem pronta; a disponibilidade é confirmada por lá.' },
];

/* ------------------------------------------------------------------ */

function Header() {
  const [aberto, setAberto] = useState(false);
  const links = [
    S.atendimentos && ['#atendimentos', 'Atendimentos'],
    S.comoFunciona && ['#como-funciona', 'Como funciona'],
    S.duvidas && ['#duvidas', 'Dúvidas'],
    S.localizacao && ['#contato', 'Contato'],
  ].filter(Boolean) as [string, string][];
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [aberto]);
  return (
    <header className="header" id="topo-header">
      <div className="wrap">
        <a href="#inicio" className="header-logo" aria-label="Dra. Ise Shinkawa, início">
          <Monograma className="mono" />
          <span className="nome" aria-hidden="true">Ise Shinkawa</span>
        </a>
        <nav className="nav" aria-label="Principal">
          {links.map(([h, t]) => <a key={h} className="lk link" href={h}><span className="t">{t}</span></a>)}
          <BtnAgendar />
        </nav>
        <button className="menu-btn" aria-expanded={aberto} aria-controls="menu-movel" onClick={() => setAberto(!aberto)}>
          <span className="bar" aria-hidden="true" />{aberto ? 'Fechar' : 'Menu'}
        </button>
      </div>
      <div id="menu-movel" className="menu" hidden={!aberto}>
        <nav aria-label="Menu">
          {links.map(([h, t]) => (
            <a key={h} className="item linha-lista" href={h} onClick={() => setAberto(false)}>{t}<span className="ponto-fim" aria-hidden="true" /></a>
          ))}
        </nav>
        <div style={{ marginTop: 'var(--e-5)' }}><BtnAgendar /></div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="h1">
      <div className="wrap">
        <p className="rotulo apoio">{CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}</p>
        <h1 id="h1" aria-label={CONFIG.nome}>
          <span className="l1" aria-hidden="true">Dra. Ise</span>
          <span className="l2" aria-hidden="true">Sh<span className="i-sem-ponto">ı<span className="ponto-i" id="ponto-i" /></span>nkawa</span>
        </h1>
        <div className="grade hero-base">
          <p className="hero-reg rotulo rotulo-c"><span>{CONFIG.registros}</span><span className="traco" aria-hidden="true" /></p>
          <div className="hero-txt">
            <p className="lead">Atendimento a partir de uma avaliação individual, com horário marcado em Limeira.</p>
            <div className="hero-cta">
              <BtnAgendar />
              {S.atendimentos && <a className="btn btn-vazio" href="#atendimentos">Ver atendimentos</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  const f = CONFIG.fotos.retrato;
  if (!S.sobre || !f) return null;
  return (
    <section className="secao revela" aria-labelledby="sobre-t" style={{ paddingTop: 'var(--e-4)' }}>
      <div className="wrap grade">
        <div className="sobre-foto"><Img f={f} sizes="(min-width: 768px) 40vw, 100vw" /></div>
        <div className="sobre-txt">
          <div className="filete" aria-hidden="true" />
          <Rotulo>Quem atende</Rotulo>
          <Titulo id="sobre-t" linhas={['Cada caso começa', 'com a Dra. Ise.']} />
          <p className="lead apoio" style={{ marginTop: 'var(--e-4)' }}>
            Cirurgiã-dentista, {CONFIG.descritor.charAt(0).toLowerCase() + CONFIG.descritor.slice(1)}. Atende em Limeira, na Vila Claudia, de segunda a sexta e com horário marcado.
          </p>
          <dl className="sobre-reg">
            <dt>São Paulo</dt><dd>CROSP 97439</dd>
            <dt>Minas Gerais</dt><dd>CROMG 33342</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Atendimentos() {
  const lista = atendimentosAtivos();
  if (!S.atendimentos || !lista.length) return null;
  return (
    <section id="atendimentos" className="secao escuro revela" aria-labelledby="at-t">
      <div className="wrap">
        <div className="grade">
          <div style={{ gridColumn: '1 / -1' }}>
            <Rotulo>Atendimentos</Rotulo>
            <Titulo id="at-t" linhas={['Tudo parte da mesma', 'porta de entrada.']} />
          </div>
        </div>
        <div className="at-lista">
          {lista.map((a, i) => (
            <details key={a.id} className="at-item linha-lista">
              <summary>
                <span className="at-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="at-nome">{a.nome}</h3>
                <span className="at-mais" aria-hidden="true" />
              </summary>
              <div className="at-corpo">
                <div>
                  <p className="lead">{a.descricao}</p>
                  <p className="apoio" style={{ marginTop: 'var(--e-2)' }}>A indicação depende de avaliação individual.</p>
                  <div style={{ marginTop: 'var(--e-4)' }}>
                    <BtnAgendar texto="Agendar avaliação" msg={msgAtendimento(a.nome)} />
                  </div>
                </div>
              </div>
              <span className="ponto-fim" aria-hidden="true" />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Casos() {
  if (!S.casos || !CONFIG.casos.length) return null;
  return (
    <section id="casos" className="secao escuro abaixo revela" aria-labelledby="casos-t" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="filete" aria-hidden="true" style={{ color: 'var(--papel)' }} />
        <div className="grade casos-cab">
          <div style={{ gridColumn: '1 / -1' }}>
            <Rotulo>Casos</Rotulo>
            <Titulo id="casos-t" linhas={['Antes e depois,', 'lado a lado.']} />
          </div>
          <p className="apoio" style={{ gridColumn: '1 / -1', maxWidth: '30rem' }}>
            Arraste a linha de cada imagem para comparar. No teclado, use as setas.
          </p>
        </div>
        <div className="casos-grade">
          {CONFIG.casos.map((c, i) => (
            <figure className="caso" key={c.antes}>
              <AntesDepois caso={c} indice={i} />
              <figcaption><span>Caso {String(i + 1).padStart(2, '0')}</span><span aria-hidden="true">Perfil</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="nota-casos apoio">
          Imagens publicadas pela Dra. Ise Shinkawa em seu perfil profissional, com fins informativos. Cada caso é único: a indicação depende de avaliação individual, e as imagens não representam promessa para outros casos.
        </p>
      </div>
    </section>
  );
}

function Avaliacao() {
  if (!S.avaliacao) return null;
  const itens = ['Conversa sobre o que você procura', 'Avaliação individual com a Dra. Ise', 'Orientação sobre as opções, para você decidir'];
  return (
    <section className="secao ousada abaixo revela" aria-labelledby="av-t">
      <h2 id="av-t" className="gigante">
        <span className="linha-m"><span>Primeiro,</span></span>
        <span className="linha-m r"><span>a avaliação.</span></span>
      </h2>
      <div className="wrap grade">
        <p className="ousada-txt apoio lead">Antes de qualquer indicação, a Dra. Ise conhece você e o seu caso.</p>
        <div className="passos-av-wrap">
          <ul className="passos-av">
            {itens.map((t) => (
              <li key={t} className="linha-lista"><span className="ponto" aria-hidden="true" /><span>{t}</span><span className="ponto-fim" aria-hidden="true" /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Consultorio() {
  const fs = CONFIG.fotos.consultorio;
  if (!S.consultorio || !fs.length) return null;
  return (
    <section className="secao abaixo revela" aria-labelledby="cons-t" style={{ background: 'var(--papel-2)' }}>
      <div className="wrap">
        <div className="grade">
          <div style={{ gridColumn: '1 / -1' }}>
            <Rotulo>O consultório</Rotulo>
            <Titulo id="cons-t" linhas={['Onde a avaliação', 'acontece.']} />
          </div>
        </div>
        <div className="cons">
          {fs.map((f, i) => (
            <figure key={f.src} className={`f${i + 1}`}>
              <div className="img"><Img f={f} sizes={i === 0 ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 768px) 40vw, 50vw'} /></div>
              {f.legenda && <figcaption><span className="ponto" aria-hidden="true" />{f.legenda}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Horarios() {
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => {
    const d = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.fuso, weekday: 'short' }).format(new Date());
    setHoje(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(d));
  }, []);
  if (!S.horarios) return null;
  return (
    <section id="horarios" className="silenciosa abaixo revela" aria-labelledby="hor-t">
      <div className="wrap">
        <Rotulo>Horários</Rotulo>
        <Titulo id="hor-t" className="h2" linhas={['Com hora marcada.']} />
        <ul className="hor-lista">
          {linhasHorario().map((l) => (
            <li key={l.rotulo} className={`linha-lista${hoje !== null && l.dias.includes(hoje) ? ' hoje' : ''}`}>
              <span className="ponto hoje-p" aria-hidden="true" />
              <span className="hor-dia">{l.rotulo}{hoje !== null && l.dias.includes(hoje) && <span className="sr-only"> (hoje)</span>}</span>
              <span className="hor-h">{l.valor}</span>
              <span className="ponto-fim" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <p className="apoio" style={{ maxWidth: '46rem', marginLeft: 'auto', marginTop: 'var(--e-3)', fontSize: 'var(--t--1)' }}>{CONFIG.avisoHorario}</p>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const alvo = innerHeight * 0.6;
      const v = Math.max(0, Math.min(1, (alvo - r.top) / r.height));
      el.style.setProperty('--prog', v.toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', on, { passive: true });
    tick();
    return () => removeEventListener('scroll', on);
  }, []);
  if (!S.comoFunciona) return null;
  const passos = [
    ['Contato e agendamento', 'Você chama pelo WhatsApp e combina o dia e o horário.'],
    ['Avaliação individual', 'Conversa com a Dra. Ise sobre o que você procura e avaliação no consultório.'],
    ['Orientação', 'Explicação das opções indicadas para o seu caso, para você decidir com calma.'],
    ['Acompanhamento', 'Se houver atendimento, os retornos são combinados com a Dra. Ise.'],
  ];
  return (
    <section id="como-funciona" className="secao abaixo revela" aria-labelledby="cf-t">
      <div className="wrap grade">
        <div className="tempo-tit">
          <Rotulo>Como funciona</Rotulo>
          <Titulo id="cf-t" linhas={['Quatro etapas,', 'sem pressa.']} />
        </div>
        <div className="tempo-wrap">
          <ol className="tempo" ref={ref}>
            <span className="barra" aria-hidden="true" />
            {passos.map(([t, d], i) => (
              <li key={t}>
                <span className="n" aria-hidden="true">{i + 1}</span>
                <div><h3>{t}</h3><p className="apoio">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Duvidas() {
  if (!S.duvidas) return null;
  return (
    <section id="duvidas" className="secao abaixo revela" aria-labelledby="dv-t" style={{ paddingTop: 0 }}>
      <div className="wrap grade">
        <div className="faq-tit">
          <Rotulo>Dúvidas</Rotulo>
          <Titulo id="dv-t" linhas={['Perguntas', 'frequentes.']} />
          <p className="apoio" style={{ marginTop: 'var(--e-3)', maxWidth: '22rem' }}>Sobre a cirurgia bucomaxilofacial em Limeira, a avaliação e o agendamento.</p>
        </div>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.p} className="linha-lista">
              <summary><h3 style={{ fontSize: 'inherit' }}>{f.p}</h3><span className="at-mais" aria-hidden="true" /></summary>
              <div><p className="apoio">{f.r}</p></div>
              <span className="ponto-fim" aria-hidden="true" />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Localizacao() {
  const [mapa, setMapa] = useState(false);
  if (!S.localizacao) return null;
  return (
    <section id="contato" className="secao abaixo revela" aria-labelledby="loc-t" style={{ background: 'var(--papel-2)' }}>
      <div className="wrap grade">
        <div className="loc-a">
          <Rotulo>Localização e contato</Rotulo>
          <Titulo id="loc-t" linhas={['Venha nos visitar.']} />
          <address className="loc-end" style={{ marginTop: 'var(--e-4)' }}>
            {E.rua}<br />{E.bairro}, {E.cidade} - {E.uf}<br /><span className="apoio" style={{ fontFamily: 'var(--f-texto)', fontSize: 'var(--t-0)' }}>CEP {E.cep}</span>
          </address>
          <div className="loc-acoes">
            <Link href={E.rota} externo>Como chegar</Link>
            <Link href={E.maps} externo>Ver no Google Maps</Link>
            {CONFIG.instagram.url && <Link href={CONFIG.instagram.url} externo>Ver no Instagram</Link>}
          </div>
          <div className="hero-cta"><BtnAgendar /></div>
          {CONFIG.whatsappExibicao && <p className="apoio" style={{ marginTop: 'var(--e-3)' }}>WhatsApp {CONFIG.whatsappExibicao}</p>}
        </div>
        <div className="loc-b">
          <div className="mapa">
            {mapa ? (
              <iframe src={E.embed} title={`Mapa: ${E.rua}, ${E.bairro}, ${E.cidade}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="mapa-capa">
                <div className="grade-mapa" aria-hidden="true" /><span className="alvo-p" aria-hidden="true" />
                <p className="rotulo rotulo-c" style={{ position: 'relative' }}>Vila Claudia · Limeira</p>
                <div style={{ position: 'relative' }}>
                  <button type="button" className="btn btn-vazio" style={{ background: 'var(--papel)' }} onClick={() => setMapa(true)}>Mostrar mapa aqui</button>
                  <p className="apoio" style={{ fontSize: 'var(--t--1)', marginTop: '.5rem' }}>O mapa é carregado do Google ao tocar.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Final() {
  if (!S.ctaFinal) return null;
  const f = CONFIG.fotos.retrato2;
  return (
    <section className="secao escuro final abaixo revela" aria-labelledby="fim-t">
      <div className="wrap grade">
        <div className="final-a">
          <Titulo id="fim-t" className="final-tit" linhas={['O primeiro passo', 'é a avaliação.']} />
          <div className="hero-cta">
            <BtnAgendar />
            {CONFIG.instagram.url && <a className="btn btn-vazio" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">Ver no Instagram<span className="sr-only"> (abre em nova aba)</span></a>}
          </div>
        </div>
        {f && <div className="final-b"><Img f={f} sizes="(min-width: 768px) 40vw, 100vw" /></div>}
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="rodape escuro" style={{ borderTop: '1px solid var(--aco)' }}>
      <div className="wrap">
        <div className="grade rodape-cols">
          <div>
            <img src={CONFIG.logo.escuro} alt="Dra. Ise Shinkawa, Especialista em Cirurgia e Traumatologia Bucomaxilofacial, CROSP 97439 | CROMG 33342" width="640" height="204" loading="lazy" style={{ width: 'min(100%, 26rem)', height: 'auto' }} />
            <p className="apoio" style={{ marginTop: 'var(--e-3)', fontSize: 'var(--t--1)' }}>
              {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.registros} · {CONFIG.cidade}/{CONFIG.uf}
            </p>
          </div>
          <div>
            <p className="rotulo rotulo-c" style={{ marginBottom: 'var(--e-2)' }}>Endereço</p>
            <address style={{ fontStyle: 'normal' }}>{E.rua}<br />{E.bairro}, {E.cidade} - {E.uf}<br />CEP {E.cep}</address>
            <Link href={E.rota} externo>Como chegar</Link>
          </div>
          <div>
            <p className="rotulo rotulo-c" style={{ marginBottom: 'var(--e-2)' }}>Contato</p>
            {CONFIG.usarWhatsapp && <div><Link href={`https://wa.me/${CONFIG.whatsapp}`} externo>WhatsApp {CONFIG.whatsappExibicao}</Link></div>}
            {CONFIG.instagram.url && <div><Link href={CONFIG.instagram.url} externo>Instagram {CONFIG.instagram.usuario}</Link></div>}
            <div><Link href="/privacidade.html">Privacidade</Link></div>
          </div>
        </div>
        <p className="assin" aria-hidden="true">Ise Sh<span className="i-sem-ponto">ı<span className="ponto-i" /></span>nkawa</p>
        <div className="rodape-leg apoio">
          <p style={{ maxWidth: '44rem' }}>Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento depende de avaliação individual.</p>
          <p>© {CONFIG.nome}</p>
        </div>
      </div>
    </footer>
  );
}

function Fixo({ visivel }: { visivel: boolean }) {
  if (!CONFIG.usarWhatsapp) return null;
  return <div className={`fixo${visivel ? '' : ' oculto'}`}><BtnAgendar /></div>;
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [fixo, setFixo] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __app: boolean }).__app = true;
    const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // revelações (mecanismos a e b)
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.revela').forEach((el) => io.observe(el));

    // o ponto: pousa no "i" depois que as fontes carregam
    const indice = document.getElementById('indice');
    const pousar = () => {
      root.classList.add('fontes');
      const p = document.getElementById('ponto-i');
      if (!p || reduz || scrollY > 50) { indice?.classList.add('on'); return; }
      const r = p.getBoundingClientRect();
      const d = r.top + r.height + 24;
      const a = p.animate([
        { transform: `translateY(${-d}px)`, easing: 'cubic-bezier(.55,0,.25,1)' },
        { transform: 'translateY(2px)', offset: 0.8, easing: 'cubic-bezier(.16,1,.3,1)' },
        { transform: 'translateY(0)' },
      ], { duration: 1400, fill: 'backwards' });
      a.onfinish = () => indice?.classList.add('on');
    };
    const timeout = new Promise((r) => setTimeout(r, 2500));
    Promise.race([document.fonts?.ready ?? Promise.resolve(), timeout]).then(pousar);

    // header, progresso, índice, botão fixo
    const header = document.getElementById('topo-header');
    const prog = document.getElementById('progresso');
    const ponto = indice?.querySelector<HTMLElement>('.p');
    const hero = document.getElementById('inicio');
    const agendar = document.getElementById('agendar');
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const v = max > 0 ? scrollY / max : 0;
      header?.classList.toggle('solido', scrollY > 8);
      if (prog) prog.style.transform = `scaleX(${v.toFixed(4)})`;
      if (ponto && indice) ponto.style.transform = `translateY(${(v * indice.clientHeight).toFixed(1)}px)`;
      const hb = hero?.getBoundingClientRect().bottom ?? 0;
      const ar = agendar?.getBoundingClientRect();
      const noAgendar = ar ? ar.top < innerHeight && ar.bottom > 0 : false;
      setFixo(hb < 0 && !noAgendar);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    tick();
    return () => { io.disconnect(); removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, []);

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      {CONFIG.rascunho && <div className="rascunho" role="note">Rascunho para avaliação. Informações sujeitas a confirmação.</div>}
      <div className="progresso" id="progresso" aria-hidden="true" />
      <div className="indice" id="indice" aria-hidden="true"><span className="p" /></div>
      <Header />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Atendimentos />
        <Casos />
        <Avaliacao />
        <Consultorio />
        <Horarios />
        <ComoFunciona />
        <Duvidas />
        <Localizacao />
        {S.agendar && CONFIG.usarWhatsapp && <Agendar />}
        <Final />
      </main>
      <Rodape />
      <Fixo visivel={fixo} />
    </>
  );
}
