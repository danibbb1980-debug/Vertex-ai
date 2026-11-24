import { useEffect, useId, useState, type ReactNode } from 'react'
import { CONFIG, atendimentosAtivos, enderecoCompleto, enderecoLinha } from '../config'
import { juntar, linhasHorario, linkArea, linkGeral } from '../lib'
import { Ficha } from './Ficha'
import { Logo, NumSecao } from './Marca'
import { Titulo } from './Reveal'
import { Logo3D } from './Logo3D'
import { Img } from './Galeria'

const novaAba = { target: '_blank', rel: 'noopener noreferrer' } as const

export function SrNovaAba() {
  return <span className="sr-only"> (abre em nova aba)</span>
}

/* ---------- Header ---------- */
export function Header() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => {
    if (!aberto) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [aberto])

  const links = [
    CONFIG.secoes.atendimentos && ['#atendimentos', 'Atendimentos'],
    CONFIG.secoes.espaco && CONFIG.fotos.length > 0 && ['#espaco', 'O espaço'],
    CONFIG.secoes.comoFunciona && ['#como-funciona', 'Como funciona'],
    CONFIG.secoes.duvidas && ['#duvidas', 'Dúvidas'],
    CONFIG.secoes.contato && ['#contato', 'Contato'],
  ].filter(Boolean) as [string, string][]

  return (
    <header className={`topo${solido || aberto ? ' solido' : ''}`}>
      {CONFIG.rascunho && (
        <p className="faixa-rascunho">Rascunho para avaliação. Informações sujeitas a confirmação.</p>
      )}
      <div className="topo-barra">
        <a href="#inicio" className="topo-marca">
          <Logo tamanho={44} />
        </a>
        <nav className="topo-nav" aria-label="Principal">
          <ul>
            {links.map(([h, t]) => (
              <li key={h}>
                <a className="link" href={h}>
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="botao botao-cheio topo-cta" href={linkGeral()} {...novaAba}>
          Agendar avaliação
          <SrNovaAba />
        </a>
        <button
          type="button"
          className="topo-menu"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((v) => !v)}
        >
          <span className="topo-menu-traco" aria-hidden="true" />
          <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          <span aria-hidden="true">{aberto ? 'Fechar' : 'Menu'}</span>
        </button>
      </div>
      <nav id="menu-movel" className="menu-movel" hidden={!aberto} aria-label="Menu">
        <ul>
          {links.map(([h, t], i) => (
            <li key={h}>
              <a href={h} onClick={() => setAberto(false)}>
                <span className="menu-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a className="botao botao-cheio" href={linkGeral()} {...novaAba}>
          Agendar avaliação
          <SrNovaAba />
        </a>
      </nav>
    </header>
  )
}

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-titulo">
      <div className="grade hero-grade">
        <div className="hero-texto">
          <p className="sobrelinha">
            <span className="seg">Homenz Limeira ·</span> <span className="seg">Estética para homens ·</span>{' '}
            <span className="seg">Limeira/SP</span>
          </p>
          <h1 className="hero-titulo" id="hero-titulo">
            <span className="hero-l">Primeiro a avaliação.</span>{' '}
            <span className="hero-l">
              Depois, o cuidado que <em>faz sentido.</em>
            </span>
          </h1>
          <p className="hero-sub">{areasFrase() ? `${areasFrase()}, com` : 'Com'} atendimento individual e horário marcado, em Limeira.</p>
          {CONFIG.secoes.atendimentos && (
            <a className="link link-discreto" href="#atendimentos">
              Ver atendimentos
            </a>
          )}
        </div>
        <div className="hero-ficha">
          <Ficha id="ficha-hero" />
        </div>
      </div>
    </section>
  )
}

/* ---------- Acordeão ---------- */
function ItemAcordeao({
  titulo,
  children,
  prefixo,
  nivel = 3,
  classe = '',
}: {
  titulo: ReactNode
  children: ReactNode
  prefixo?: ReactNode
  nivel?: 3 | 4
  classe?: string
}) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  const H = nivel === 3 ? 'h3' : 'h4'
  return (
    <li className={`acc ${classe}${aberto ? ' aberto' : ''}`}>
      <H className="acc-h">
        <button
          type="button"
          className="acc-botao"
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={() => setAberto((v) => !v)}
        >
          {prefixo}
          <span className="acc-titulo">{titulo}</span>
          <span className="acc-sinal" aria-hidden="true" />
        </button>
      </H>
      <div className="acc-painel" id={`${id}-p`} role="region" aria-labelledby={`${id}-b`}>
        <div className="acc-conteudo">{children}</div>
      </div>
    </li>
  )
}

/* ---------- Atendimentos ---------- */
export function Atendimentos() {
  const itens = atendimentosAtivos()
  if (!itens.length) return null
  return (
    <section className="atend azul" id="atendimentos" aria-labelledby="atend-titulo">
      <div className="grade atend-grade">
        <div className="atend-lateral">
          <NumSecao n="01" rotulo="Atendimentos" claro />
          <Titulo
            id="atend-titulo"
            className="titulo-secao"
            linhas={['Estética masculina,', <>por <em>área</em>.</>]}
          />
          <p className="atend-nota">
            Cada atendimento começa por uma avaliação individual. É ela que diz o que faz sentido para você.
          </p>
        </div>
        <ol className="indice">
          {itens.map((a, i) => (
            <ItemAcordeao
              key={a.id}
              classe="indice-item"
              prefixo={
                <span className="indice-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              }
              titulo={a.nome}
            >
              <p>{a.descricao}</p>
              <p className="indice-aviso">A indicação depende de avaliação individual.</p>
              <a className="botao botao-claro" href={linkArea(a.area)} {...novaAba}>
                Agendar avaliação de {a.naFrase}
                <SrNovaAba />
              </a>
            </ItemAcordeao>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Horários (linhas) ---------- */
export function ListaHorarios({ claro = false }: { claro?: boolean }) {
  return (
    <div className={`horarios${claro ? ' sobre-azul' : ''}`}>
      <dl>
        {linhasHorario().map((l) => (
          <div className={`linha-lista${l.fechado ? ' fechado' : ''}`} key={l.dias} tabIndex={-1}>
            <dt>{l.dias}</dt>
            <dd className="num-tab">{l.horas}</dd>
          </div>
        ))}
      </dl>
      {CONFIG.avisoFeriados && <p className="nota">{CONFIG.avisoFeriados}</p>}
    </div>
  )
}

/* ---------- A clínica (silenciosa) ---------- */
/** "Cabelo, rosto e corpo" a partir dos atendimentos ativos (sem depilação). */
function areasFrase(): string {
  const l = juntar(atendimentosAtivos().filter((a) => a.area !== 'depilacao').map((a) => a.naFrase))
  return l ? l.charAt(0).toUpperCase() + l.slice(1) : ''
}

export function Clinica() {
  const lista = areasFrase()
  return (
    <section className="clinica" id="clinica" aria-labelledby="clinica-titulo">
      <div className="grade clinica-grade">
        <NumSecao n="02" rotulo="A clínica" />
        <div className="clinica-emblema">
          <Logo3D />
        </div>
        <h2 className="clinica-frase" id="clinica-titulo" data-io>
          Estética para homens, em Limeira.{' '}
          {lista && (
            <span className="clinica-frase-2">
              {lista}, com avaliação individual antes de qualquer indicação.
            </span>
          )}
        </h2>
        <div className="clinica-dados">
          <div className="clinica-col">
            <p className="rotulo">Endereço</p>
            <p>
              {enderecoLinha()}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
            </p>
          </div>
          <div className="clinica-col">
            <p className="rotulo">Horários</p>
            <ListaHorarios />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Como funciona (ousada) ---------- */
const PASSOS = [
  {
    t: 'Você diz o que lhe interessa',
    d: 'Marque na ficha o que quer avaliar, ou diga que ainda não sabe. A mensagem segue pronta para o WhatsApp.',
  },
  {
    t: 'Agendamos a avaliação',
    d: 'A equipe da Homenz Limeira responde pela conversa e combina com você o dia e o horário.',
  },
  {
    t: 'A avaliação orienta o que faz sentido',
    d: 'Num atendimento individual, você conta o que procura e recebe a orientação sobre o que é indicado para você.',
  },
  {
    t: 'Acompanhamento',
    d: 'Se fizer sentido seguir, cada etapa é combinada com você, sempre com horário marcado.',
  },
]

export function ComoFunciona() {
  return (
    <section className="como" id="como-funciona" aria-labelledby="como-titulo">
      <div className="grade">
        <div className="como-cabeca">
          <NumSecao n="04" rotulo="Como funciona" />
          <Titulo
            id="como-titulo"
            className="titulo-secao titulo-grande"
            linhas={['Você não precisa', 'saber o que pedir.', <>A avaliação <em>orienta</em>.</>]}
          />
        </div>
        <ol className="linha-tempo" data-progresso>
          <span className="linha-tempo-trilho" aria-hidden="true">
            <span className="linha-tempo-cheio" />
          </span>
          {PASSOS.map((p, i) => (
            <li className="passo" key={p.t} data-io>
              <span className="passo-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="passo-texto">
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Dúvidas ---------- */
export function Duvidas() {
  const nomes = atendimentosAtivos().map((a) => a.nome)
  const h = linhasHorario()
    .map((l) => `${l.dias}: ${l.horas.toLowerCase()}`)
    .join('; ')
  const sab = CONFIG.horarios.find((x) => x.dia === 6)
  const dom = CONFIG.horarios.find((x) => x.dia === 0)

  const itens: [string, ReactNode][] = [
    [
      'Como agendar?',
      <>
        Pelo WhatsApp {CONFIG.whatsappExibicao}. Marque na ficha o que lhe interessa e toque em “Agendar avaliação”: a
        conversa abre com a mensagem pronta. A equipe combina o dia e o horário com você.
      </>,
    ],
    [
      'Posso agendar pelo site?',
      'O site monta a sua mensagem e abre o WhatsApp da clínica. O horário é combinado na conversa com a equipe. Nenhum dado digitado aqui fica guardado.',
    ],
    [
      'Como é a avaliação?',
      'Uma conversa individual sobre o que você observa e o que procura, com a análise da área de interesse. A partir dela, a equipe orienta o que faz sentido para você.',
    ],
    ['O que levar?', 'Nada em especial. Se você já usa algum produto no cabelo ou na pele, vale comentar durante a avaliação.'],
    nomes.length
      ? [
          'Quais atendimentos de estética masculina são oferecidos?',
          `${juntar(nomes)}. Todos começam por uma avaliação individual.`,
        ]
      : null,
    [
      'Todo atendimento serve para todas as pessoas?',
      'Não necessariamente. A indicação de cada atendimento depende de avaliação individual.',
    ],
    ['Quais são os horários?', `${h}. ${CONFIG.avisoFeriados}`],
    sab ? ['Atende aos sábados?', `Sim, das ${horaBR(sab.abre)} às ${horaBR(sab.fecha)}.`] : null,
    !dom ? ['E aos domingos?', 'Não. A clínica fica fechada aos domingos.'] : null,
    ['Onde fica?', `${enderecoCompleto()}. Pelo botão “Como chegar” você abre a rota no Google Maps.`],
  ].filter(Boolean) as [string, ReactNode][]

  return (
    <section className="duvidas" id="duvidas" aria-labelledby="duvidas-titulo">
      <div className="grade duvidas-grade">
        <div className="duvidas-lateral">
          <NumSecao n="06" rotulo="Dúvidas" />
          <Titulo
            id="duvidas-titulo"
            className="titulo-secao"
            linhas={['Antes de marcar,', <>o que costumam <em>perguntar</em>.</>]}
          />
        </div>
        <ul className="faq">
          {itens.map(([q, r]) => (
            <ItemAcordeao key={q} titulo={q} classe="faq-item">
              <p>{r}</p>
            </ItemAcordeao>
          ))}
        </ul>
      </div>
    </section>
  )
}

function horaBR(h: string) {
  const [hh, mm] = h.split(':')
  return mm === '00' ? `${Number(hh)}h` : `${Number(hh)}h${mm}`
}

/* ---------- Contato ---------- */
export function Contato() {
  const [mapa, setMapa] = useState(false)
  useEffect(() => {
    const el = document.getElementById('mapa-lugar')
    if (!el) return
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setMapa(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="contato" id="contato" aria-labelledby="contato-titulo">
      <div className="grade contato-grade">
        <div className="contato-texto">
          <NumSecao n="07" rotulo="Localização e contato" />
          <Titulo id="contato-titulo" className="titulo-secao" linhas={[<>Venha nos <em>visitar</em>.</>]} />
          <address className="contato-end">
            {CONFIG.endereco.rua}, {CONFIG.endereco.numero}
            <br />
            {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            <br />
            CEP {CONFIG.endereco.cep}
          </address>
          <ListaHorarios />
          <ul className="contato-links">
            <li>
              <a className="link link-seta" href={CONFIG.rotaUrl} {...novaAba}>
                Como chegar
                <SrNovaAba />
              </a>
            </li>
            <li>
              <a className="link link-seta" href={CONFIG.mapsUrl} {...novaAba}>
                Ver no Google Maps
                <SrNovaAba />
              </a>
            </li>
            <li>
              <a className="link link-seta" href={CONFIG.instagram.url} {...novaAba}>
                Ver no Instagram
                <SrNovaAba />
              </a>
            </li>
          </ul>
          <a className="botao botao-cheio" href={linkGeral()} {...novaAba}>
            Agendar avaliação
            <SrNovaAba />
          </a>
        </div>
        <div className="contato-visual">
        {CONFIG.fotoFachada && (
          <figure className="contato-fachada">
            <Img f={CONFIG.fotoFachada} sizes="(max-width: 960px) 92vw, 46vw" />
            <figcaption>A fachada azul, na Avenida Antonio Ometto.</figcaption>
          </figure>
        )}
        <div className="contato-mapa" id="mapa-lugar">
          <a className="mapa-fundo" href={CONFIG.mapsUrl} {...novaAba} tabIndex={-1} aria-hidden="true">
            Carregando o mapa…
          </a>
          {mapa ? (
            <iframe
              title={`Mapa: ${enderecoCompleto()}`}
              src={CONFIG.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <a className="mapa-reserva" href={CONFIG.mapsUrl} {...novaAba}>
              <span>Abrir o mapa no Google Maps</span>
              <SrNovaAba />
            </a>
          )}
        </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- CTA final ---------- */
export function CtaFinal() {
  return (
    <section className="cta azul" id="cta" aria-labelledby="cta-titulo">
      <div className="grade cta-grade">
        <div className="cta-texto">
          <Titulo
            id="cta-titulo"
            className="titulo-secao titulo-grande"
            linhas={['Marque o que lhe interessa.', <>A avaliação orienta o <em>resto</em>.</>]}
          />
          <a className="link link-claro link-seta" href={CONFIG.instagram.url} {...novaAba}>
            Ver no Instagram
            <SrNovaAba />
          </a>
        </div>
        <div className="cta-ficha">
          <Ficha id="ficha-cta" compacta />
        </div>
      </div>
    </section>
  )
}

/* ---------- Rodapé ---------- */
export function Rodape() {
  return (
    <footer className="rodape">
      <div className="grade rodape-grade">
        <div className="rodape-marca">
          <Logo tamanho={96} />
          <p className="rodape-desc">Homenz Limeira · Estética para homens · Limeira/SP</p>
        </div>
        <ul className="rodape-links">
          <li>
            <span className="rotulo">Endereço</span>
            <a className="link" href={CONFIG.rotaUrl} {...novaAba}>
              {enderecoCompleto()}
              <SrNovaAba />
            </a>
          </li>
          <li>
            <span className="rotulo">WhatsApp</span>
            <a className="link" href={linkGeral()} {...novaAba}>
              {CONFIG.whatsappExibicao}
              <SrNovaAba />
            </a>
          </li>
          <li>
            <span className="rotulo">Instagram</span>
            <a className="link" href={CONFIG.instagram.url} {...novaAba}>
              {CONFIG.instagram.usuario}
              <SrNovaAba />
            </a>
          </li>
          <li>
            <span className="rotulo">Privacidade</span>
            <a className="link" href="/privacidade.html">
              Como este site trata seus dados
            </a>
          </li>
        </ul>
        <p className="rodape-aviso">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento
          depende de avaliação individual.
        </p>
      </div>
      <p className="assinatura" aria-hidden="true">
        Homenz <em>Limeira</em>
      </p>
    </footer>
  )
}

/* ---------- Barra fixa no celular / botão flutuante ---------- */
export function BarraAgendar() {
  const [ver, setVer] = useState(false)
  useEffect(() => {
    const f = () => setVer(window.scrollY > window.innerHeight * 0.8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <div className={`barra-agendar${ver ? ' visivel' : ''}`}>
      <a className="botao botao-cheio" href={linkGeral()} {...novaAba} tabIndex={ver ? 0 : -1} aria-hidden={!ver}>
        Agendar avaliação
        <SrNovaAba />
      </a>
    </div>
  )
}
