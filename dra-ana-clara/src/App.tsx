import { useEffect, useRef, useState } from 'react'
import { CONFIG, MSG_GERAL, atendimentosAtivos, casosAtivos, msgAtendimento, wa, type Foto } from './config'
import mono from './logoMono.json'
import { Compara } from './components/Compara'
import { Agendar } from './components/Agendar'

const S = CONFIG.secoes
const ext = { target: '_blank', rel: 'noopener' } as const

function Mono({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={mono.viewBox} aria-hidden="true" focusable="false">
      <path d={mono.d} fill="currentColor" />
    </svg>
  )
}

function Titulo({ id, children, rotulo }: { id: string; children: React.ReactNode; rotulo?: string }) {
  const linhas = Array.isArray(children) ? children : [children]
  return (
    <div className="titulo-secao revela">
      <span className="fulcro" aria-hidden="true"><i /></span>
      {rotulo && <p className="rotulo apoio">{rotulo}</p>}
      <h2 id={id} className="h2">
        {linhas.map((l, i) => <span className="mascara" key={i}><span>{l}</span></span>)}
      </h2>
    </div>
  )
}

function Img({ f, sizes, eager, className }: { f: Foto; sizes: string; eager?: boolean; className?: string }) {
  return (
    <img
      className={className}
      src={f.src}
      srcSet={f.srcSm ? (f.srcMd ? `${f.srcSm} 480w, ${f.srcMd} 780w, ${f.src} ${f.w}w` : `${f.srcSm} 600w, ${f.src} ${f.w}w`) : undefined}
      sizes={f.srcSm ? sizes : undefined}
      width={f.w}
      height={f.h}
      alt={f.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      {...(eager ? { fetchpriority: 'high' } : {})}
    />
  )
}

function Acordeao({ id, titulo, children, variante }: { id: string; titulo: React.ReactNode; children: React.ReactNode; variante: 'indice' | 'faq' }) {
  const [aberto, setAberto] = useState(false)
  const btnId = `${id}-btn`, painelId = `${id}-painel`
  return (
    <li className={variante === 'faq' ? 'faq-item linha-ativa' : 'linha-ativa'}>
      <h3 style={{ margin: 0, font: 'inherit' }}>
        <button id={btnId} className={variante === 'faq' ? 'faq-btn' : 'indice-btn'} aria-expanded={aberto} aria-controls={painelId} onClick={() => setAberto((a) => !a)}>
          {titulo}
          <span className="sinal" aria-hidden="true" />
        </button>
      </h3>
      <div id={painelId} role="region" aria-labelledby={btnId} className={`painel${aberto ? ' aberto' : ''}`} {...(!aberto ? { inert: '' } : {})}>
        <div><div className="painel-conteudo">{children}</div></div>
      </div>
    </li>
  )
}

const DUVIDAS: [string, string][] = [
  ['Como agendar a avaliação?', `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelo formulário desta página (ele abre o WhatsApp com a sua solicitação pronta) ou pelo Instagram ${CONFIG.instagram.usuario}. Dia e horário são confirmados pelo WhatsApp.`],
  ['Como é a primeira avaliação?', 'Uma conversa individual com a Dra. Ana Clara sobre o que você procura, seguida da avaliação da face. Ao final, ela explica as opções para o seu caso, e a decisão é sua.'],
  ['O que levar no dia?', 'Um documento com foto. Se você usa algum medicamento ou já passou por atendimento na face, leve essas informações para conversar na avaliação.'],
  ['Quais atendimentos são oferecidos?', 'Avaliação e harmonização facial. O que faz sentido para cada pessoa é definido na avaliação individual.'],
  ['Todo atendimento serve para todas as pessoas?', 'Não. Cada face é diferente, e a indicação depende de avaliação individual com a Dra. Ana Clara.'],
  ['Quais são os horários?', 'Segunda a sexta, das 7h às 17h. Sábado, das 8h às 11h. Os horários podem variar em feriados.'],
  ['Atende aos sábados?', 'Sim, das 8h às 11h, com horário marcado.'],
  ['E aos domingos?', 'Não. Aos domingos o consultório fica fechado.'],
  ['Onde fica o consultório?', `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}.`],
  ['Posso agendar pelo site?', 'Pelo site você envia uma solicitação: o formulário monta a mensagem e abre o WhatsApp. O horário só fica marcado depois da confirmação pelo WhatsApp.'],
]

const PASSOS: [string, string][] = [
  ['Contato e agendamento', 'Você chama pelo WhatsApp ou envia a solicitação pelo site. A data é confirmada por mensagem.'],
  ['Avaliação individual', 'Conversa com a Dra. Ana Clara sobre o que você procura e avaliação da face.'],
  ['Orientação', 'Ela explica as opções que fazem sentido para o seu caso. Você decide com calma.'],
  ['Acompanhamento', 'Se houver atendimento, os retornos são combinados com a Dra. Ana Clara.'],
]

export default function App() {
  const [solido, setSolido] = useState(false)
  const [menu, setMenu] = useState(false)
  const [barra, setBarra] = useState(false)
  const [casoAtivo, setCasoAtivo] = useState(0)
  const [rodar, setRodar] = useState(0)
  const casosRef = useRef<HTMLDivElement>(null)
  const tempoRef = useRef<HTMLOListElement>(null)
  const atend = atendimentosAtivos()
  const casos = casosAtivos()

  // header sólido, barra móvel, progresso da linha do tempo
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      setSolido(y > 8)
      setBarra(y > window.innerHeight * 0.7)
      const t = tempoRef.current
      if (t) {
        const r = t.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height))
        t.style.setProperty('--p', p.toFixed(3))
        t.querySelectorAll('li').forEach((li) => {
          li.classList.toggle('feito', li.getBoundingClientRect().top < window.innerHeight * 0.6)
        })
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  // títulos: revelação por linha + fulcro que se nivela (uma vez)
  useEffect(() => {
    const els = document.querySelectorAll('.revela, .titulo-secao')
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -12% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // casos: varredura ao entrar na tela pela primeira vez
  useEffect(() => {
    const el = casosRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRodar((r) => r + 1); io.disconnect() }
    }, { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menu) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [menu])

  const trocarCaso = (i: number) => { setCasoAtivo(i); setRodar((r) => r + 1) }
  const onAbasKey = (e: React.KeyboardEvent) => {
    const n = casos.length
    let i = casoAtivo
    if (e.key === 'ArrowRight') i = (i + 1) % n
    else if (e.key === 'ArrowLeft') i = (i - 1 + n) % n
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = n - 1
    else return
    e.preventDefault()
    trocarCaso(i)
    document.getElementById(`aba-${casos[i].id}`)?.focus()
  }

  const links: [string, string][] = [
    ['#atendimentos', 'Atendimentos'],
    ...(S.casos && casos.length ? [['#casos', 'Casos'] as [string, string]] : []),
    ['#como-funciona', 'Como funciona'],
    ['#duvidas', 'Dúvidas'],
    ['#contato', 'Contato'],
  ]
  const fotos = CONFIG.fotos

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      {CONFIG.rascunho && <div className="faixa" role="note">Rascunho para avaliação. Informações sujeitas a confirmação.</div>}

      <header className={`header${solido || menu ? ' solido' : ''}`}>
        <div className="wrap">
          <a className="marca" href="#topo" aria-label={`${CONFIG.nome}, início`}>
            <Mono className="mono" />
            <img className="lockup" src={CONFIG.logo.horizontal} width={505} height={66} alt="" />
          </a>
          <nav className="nav" aria-label="Principal">
            {links.map(([h, t]) => <a key={h} className="link" href={h}>{t}</a>)}
            <a className="btn btn-cheio" href={wa()} {...ext}>Agendar avaliação</a>
          </nav>
          <button className="menu-btn" aria-expanded={menu} aria-controls="gaveta" onClick={() => setMenu((m) => !m)}>
            {menu ? 'Fechar' : 'Menu'} <span className="barras" aria-hidden="true" />
          </button>
        </div>
      </header>
      <nav id="gaveta" className="gaveta" hidden={!menu} aria-label="Menu">
        {links.map(([h, t]) => <a key={h} href={h} onClick={() => setMenu(false)}>{t}</a>)}
        <a className="btn btn-cheio" href={wa()} {...ext}>Agendar avaliação pelo WhatsApp</a>
      </nav>

      <main id="conteudo">
        {/* HERO */}
        <section className="hero" id="topo" aria-labelledby="h1">
          <div className="wrap grade">
            <div className="hero-texto">
              <p className="rotulo apoio">Harmonização facial · {CONFIG.cidade}/{CONFIG.uf}</p>
              <h1 id="h1" className="display" style={{ marginTop: 'var(--s4)' }}>
                <span className="dra">Dra.</span>
                <span className="linha">Ana Clara</span>
                <span className="linha recuo">Grimberg</span>
              </h1>
              <div className="eixo">
                <div className="eixo-conjunto">
                  <span className="fulcro" aria-hidden="true"><i /></span>
                  <div className="eixo-rotulos rotulo">
                    <span>{CONFIG.registro}</span>
                    <span>{CONFIG.descritor}</span>
                  </div>
                </div>
              </div>
              <p className="hero-sub">Atendimento a partir de uma avaliação individual, com horário marcado em {CONFIG.cidade}.</p>
              <div className="btns">
                <a className="btn btn-cheio" href={wa()} {...ext}>Agendar avaliação</a>
                <a className="btn btn-linha" href="#atendimentos">Ver atendimentos</a>
              </div>
            </div>
            {fotos.retrato && (
              <div className="hero-foto">
                <figure>
                  <Img f={fotos.retrato} eager sizes="(min-width: 1024px) 30vw, calc(100vw - 2rem)" />
                </figure>
              </div>
            )}
          </div>
        </section>

        {/* ATENDIMENTOS */}
        {S.atendimentos && atend.length > 0 && (
          <section className="secao escuro" id="atendimentos" aria-labelledby="t-atend">
            <div className="wrap">
              <Titulo id="t-atend">{['Atendimentos de harmonização', 'facial em Limeira']}</Titulo>
              <ol className="indice">
                {atend.map((a, i) => (
                  <Acordeao key={a.nome} id={`at-${i}`} variante="indice" titulo={<><span className="n num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span className="nome">{a.nome}</span></>}>
                    <p className="leitura">{a.descricao}</p>
                    <p className="apoio">A indicação depende de avaliação individual.</p>
                    <div><a className="btn btn-linha" href={wa(msgAtendimento(a.nome))} {...ext}>Agendar {a.nome === 'Avaliação' ? 'avaliação' : `avaliação de ${a.nome.toLowerCase()}`}</a></div>
                  </Acordeao>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* A AVALIAÇÃO — seção ousada */}
        {S.avaliacao && (
          <section className="secao ousada" id="avaliacao" aria-labelledby="t-aval">
            <div className="wrap grade">
              <div className="col-a revela">
                <h2 id="t-aval" className="gigante">
                  <span className="mascara"><span>Primeiro,</span></span>
                  <span className="mascara"><span>a <em>avaliação.</em></span></span>
                </h2>
              </div>
              <div className="col-b">
                <ol className="passos-curtos">
                  <li><span className="num">i.</span>Conversa sobre o que você procura</li>
                  <li><span className="num">ii.</span>Avaliação individual com a Dra. Ana Clara</li>
                  <li><span className="num">iii.</span>Orientação sobre as opções, para você decidir</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* CASOS — antes e depois animado */}
        {S.casos && casos.length > 0 && (
          <section className="secao casos" id="casos" aria-labelledby="t-casos" style={{ background: 'var(--marfim)' }}>
            <div className="wrap grade">
              <div className="casos-intro">
                <Titulo id="t-casos">{['Casos atendidos', 'no consultório']}</Titulo>
                <p className="leitura">Imagens publicadas pela Dra. Ana Clara em seu perfil profissional. Arraste a linha, toque na imagem ou use as setas do teclado para comparar.</p>
                <div className="abas" role="tablist" aria-label="Casos" onKeyDown={onAbasKey}>
                  {casos.map((c, i) => (
                    <button key={c.id} id={`aba-${c.id}`} role="tab" className="aba linha-ativa" aria-selected={i === casoAtivo} aria-controls="painel-caso" tabIndex={i === casoAtivo ? 0 : -1} onClick={() => trocarCaso(i)}>
                      <span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className="t">{c.rotulo}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="casos-palco" ref={casosRef}>
                <div id="painel-caso" role="tabpanel" aria-labelledby={`aba-${casos[casoAtivo].id}`}>
                  <Compara caso={casos[casoAtivo]} rodar={rodar} />
                </div>
                <div className="casos-controles">
                  <p className="rotulo apoio num">{String(casoAtivo + 1).padStart(2, '0')} / {String(casos.length).padStart(2, '0')}</p>
                  <button type="button" className="btn-texto link" onClick={() => setRodar((r) => r + 1)}>Rever a comparação</button>
                </div>
                <p className="casos-nota">Cada pessoa é única, e o que se vê em um caso não se repete igual em outra face. A indicação de cada atendimento depende de avaliação individual.</p>
              </div>
            </div>
          </section>
        )}

        {/* QUEM ATENDE */}
        {S.profissional && fotos.retratoSecundario && (
          <section className="secao escuro prof" id="profissional" aria-labelledby="t-prof">
            <div className="wrap grade">
              <div className="foto"><Img f={fotos.retratoSecundario} sizes="(min-width: 1024px) 40vw, 100vw" /></div>
              <div className="texto">
                <Titulo id="t-prof">Quem atende</Titulo>
                <p className="frase">A avaliação é feita pela própria Dra. Ana Clara, com horário marcado.</p>
                <dl className="dados">
                  <dt className="rotulo apoio">Registro</dt><dd>{CONFIG.registro}</dd>
                  <dt className="rotulo apoio">Atuação</dt><dd>{CONFIG.descritor}</dd>
                  <dt className="rotulo apoio">Consultório</dt><dd>{CONFIG.endereco.bairro}, {CONFIG.cidade}/{CONFIG.uf}</dd>
                  <dt className="rotulo apoio">Instagram</dt><dd><a className="link" style={{ minHeight: 0 }} href={CONFIG.instagram.url} {...ext}>{CONFIG.instagram.usuario}</a></dd>
                </dl>
              </div>
            </div>
          </section>
        )}

        {/* CONSULTÓRIO */}
        {S.consultorio && fotos.consultorio.length > 0 && (
          <section className="secao consult" id="consultorio" aria-labelledby="t-cons">
            <div className="wrap grade">
              <div className="consult-titulo">
                <Titulo id="t-cons">{['O consultório', 'na Vila Claudia']}</Titulo>
                <p className="apoio">Entrada pela {CONFIG.endereco.rua.replace('R.', 'Rua')}, em {CONFIG.cidade}.</p>
              </div>
              <div className="mosaico">
                {fotos.consultorio.map((f, i) => (
                  <figure key={f.src} className={f.w / f.h > 1.4 ? 'larga' : undefined}>
                    <Img f={f} sizes={i === 0 ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 30vw, 50vw'} />
                    {f.legenda && <figcaption className="legenda">{f.legenda}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COMO FUNCIONA */}
        {S.comoFunciona && (
          <section className="secao" id="como-funciona" aria-labelledby="t-como" style={{ borderTop: 'var(--filete) solid var(--linha)' }}>
            <div className="wrap">
              <Titulo id="t-como">Como funciona</Titulo>
              <ol className="tempo" ref={tempoRef}>
                {PASSOS.map(([t, d], i) => (
                  <li key={t}>
                    <span className="n num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{t}</h3>
                    <p className="apoio leitura">{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* HORÁRIOS — seção silenciosa */}
        {S.horarios && (
          <section className="secao silenciosa escuro" id="horarios" aria-labelledby="t-hor">
            <div className="wrap">
              <Titulo id="t-hor">Horários</Titulo>
              <ul className="horarios">
                <li><span>Segunda a sexta</span><span className="h">7h às 17h</span></li>
                <li><span>Sábado</span><span className="h">8h às 11h</span></li>
                <li className="fechado"><span>Domingo</span><span className="h">Fechado</span></li>
              </ul>
              <p className="horarios-nota apoio">Os horários podem variar em feriados.</p>
            </div>
          </section>
        )}

        {/* DÚVIDAS */}
        {S.duvidas && (
          <section className="secao duvidas" id="duvidas" aria-labelledby="t-duv">
            <div className="wrap grade">
              <div className="esq"><Titulo id="t-duv">{['Dúvidas sobre', 'harmonização facial', 'em Limeira']}</Titulo></div>
              <div className="dir">
                <ul className="faq" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {DUVIDAS.map(([q, a], i) => (
                    <Acordeao key={q} id={`faq-${i}`} variante="faq" titulo={<span>{q}</span>}>
                      <p>{a}</p>
                    </Acordeao>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* LOCALIZAÇÃO */}
        {S.localizacao && (
          <section className="secao local" id="contato" aria-labelledby="t-loc" style={{ background: 'var(--marfim)' }}>
            <div className="wrap grade">
              <div className="info">
                <Titulo id="t-loc">Venha nos visitar</Titulo>
                <address className="endereco">
                  {CONFIG.endereco.rua}<br />
                  {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}<br />
                  <span className="num">CEP {CONFIG.endereco.cep}</span>
                </address>
                <div className="btns">
                  <a className="btn btn-cheio" href={CONFIG.endereco.rota} {...ext}>Como chegar</a>
                  <a className="btn btn-linha" href={CONFIG.endereco.maps} {...ext}>Ver no Google Maps</a>
                </div>
                <div style={{ display: 'grid' }}>
                  <a className="link marcador" href={wa()} {...ext}>Agendar avaliação · WhatsApp {CONFIG.whatsappExibicao}</a>
                  <a className="link marcador" href={CONFIG.instagram.url} {...ext}>Ver no Instagram · {CONFIG.instagram.usuario}</a>
                </div>
              </div>
              <div className="mapa">
                <iframe title={`Mapa: ${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade}`} src={CONFIG.endereco.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </section>
        )}

        {/* SOLICITAR AGENDAMENTO */}
        {S.agendar && CONFIG.usarWhatsapp && (
          <section className="secao agendar" id="agendar" aria-labelledby="t-ag">
            <div className="wrap grade">
              <div className="esq">
                <span className="fulcro" aria-hidden="true" style={{ width: '7.5rem' }}><i /></span>
                <p className="rotulo apoio">Praticidade</p>
                <h2 id="t-ag" className="h2">Peça sua avaliação em poucos <span className="it">cliques.</span></h2>
                <p className="leitura apoio">Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp, e a confirmação da disponibilidade é feita pelo WhatsApp.</p>
              </div>
              <div className="dir"><Agendar /></div>
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        {S.ctaFinal && (
          <section className="cta vinho-bloco" aria-labelledby="t-cta">
            <div className="wrap">
              <h2 id="t-cta">O primeiro passo é a avaliação.</h2>
              <div className="btns">
                <a className="btn btn-marfim" href={wa()} {...ext}>Agendar avaliação</a>
                <a className="btn btn-linha" href={CONFIG.instagram.url} {...ext}>Ver no Instagram</a>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="rodape escuro">
        <div className="wrap grade">
          <p className="assinatura" aria-hidden="true">Ana Clara Grimberg</p>
          <div className="col">
            <img className="lockup" src={CONFIG.logo.horizontalMarfim} width={505} height={66} alt={CONFIG.nome} loading="lazy" />
            <p className="apoio" style={{ marginTop: 'var(--s2)' }}>{CONFIG.nome} · {CONFIG.descritor} · {CONFIG.registro} · {CONFIG.cidade}/{CONFIG.uf}</p>
          </div>
          <div className="col">
            <p className="rotulo apoio">Endereço</p>
            <p>{CONFIG.endereco.rua}<br />{CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}<br />CEP {CONFIG.endereco.cep}</p>
          </div>
          <div className="col">
            <p className="rotulo apoio">Contato</p>
            <a className="link marcador" href={wa()} {...ext}>WhatsApp {CONFIG.whatsappExibicao}</a>
            <a className="link marcador" href={CONFIG.instagram.url} {...ext}>Instagram {CONFIG.instagram.usuario}</a>
            <a className="link marcador" href="/privacidade.html">Privacidade</a>
          </div>
          <p className="aviso apoio">Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento depende de avaliação individual.</p>
        </div>
      </footer>

      <a className={`flutuante btn btn-cheio${barra ? ' visivel' : ''}`} href={wa(MSG_GERAL)} {...ext} tabIndex={barra ? 0 : -1} aria-hidden={!barra}>Agendar avaliação</a>
      <div className={`barra-movel${barra ? ' visivel' : ''}`} aria-hidden={!barra}>
        <a className="principal" href={wa()} {...ext} tabIndex={barra ? 0 : -1}>Agendar avaliação</a>
        <a href={CONFIG.endereco.rota} {...ext} tabIndex={barra ? 0 : -1}>Como chegar</a>
      </div>
    </>
  )
}
