import { useEffect, useState } from 'react'
import { CONFIG, atendimentosAtivos } from '../config'
import {
  DIAS,
  ORDEM_SEMANA,
  agoraNoFuso,
  faixasDoDia,
  hora,
  limitesSemana,
  minutos,
  statusAgora,
  textoDoDia,
} from '../lib/horarios'
import { MSG_GERAL, msgAtendimento, waLink } from '../lib/wa'
import { Foto, LinkExterno, MarcaSecao, Pausa, Titulo } from './ui'

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/* ---------- botões de agendamento ---------- */
export const BotaoAgendar = ({
  texto = 'Agendar horário',
  mensagem = MSG_GERAL,
  className = 'btn',
}: {
  texto?: string
  mensagem?: string
  className?: string
}) =>
  CONFIG.usarWhatsapp ? (
    <LinkExterno href={waLink(mensagem)} className={className}>
      {texto}
    </LinkExterno>
  ) : null

/* ---------- status "aberto agora" ---------- */
export const Status = () => {
  const [s, setS] = useState<{ aberto: boolean; texto: string } | null>(null)
  useEffect(() => {
    const atualizar = () => setS(statusAgora())
    atualizar()
    const id = window.setInterval(atualizar, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div>
      <p className={`status ${s?.aberto ? 'status--aberto' : ''}`} aria-live="polite">
        {s && (
          <>
            {s.aberto ? <span className="ponto" aria-hidden="true" /> : <Pausa />}
            <span>{s.texto}</span>
          </>
        )}
      </p>
      <p className="nota">{CONFIG.avisoFeriados}</p>
    </div>
  )
}

/* ---------- hero ---------- */
export const Hero = () => {
  const { de, ate } = limitesSemana()
  const horas: number[] = []
  for (let m = de; m <= ate; m += 60) horas.push(m)
  const pos = (m: number) => `${((m - de) / (ate - de)) * 100}%`
  const nomes = atendimentosAtivos().map((a) => a.nome.toLowerCase())
  const lista =
    nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0]

  return (
    <section className="hero" id="inicio" aria-labelledby="titulo-hero">
      <div className="wrap hero__grid">
        <p className="rotulo apoio hero__eyebrow">
          {CONFIG.nome} · {CONFIG.descritor}
          <span className="eyebrow__cidade"> · {CONFIG.endereco.cidade}/{CONFIG.endereco.uf}</span>
        </p>
        <h1 className="hero__titulo" id="titulo-hero">
          Uma <em>pausa</em> no seu dia.
        </h1>
        <div className="hero__base">
          {lista && (
            <p className="hero__sub">
              {capital(lista)}, com horário marcado, em {CONFIG.endereco.cidade}.
            </p>
          )}
          <div className="acoes">
            <BotaoAgendar />
            {CONFIG.secoes.horarios && (
              <a className="btn btn--linha" href="#horarios">
                Ver horários
              </a>
            )}
          </div>
          <Status />
        </div>
        <p className="hero__nome">
          <span className="nome-texto">{CONFIG.nomeCurto}</span>
          <span className="rotulo apoio">{CONFIG.descritor}</span>
        </p>
      </div>
      <div className="wrap">
        <div className="tl" aria-hidden="true">
          <div className="tl__regua" />
          {horas.map((m) => (
            <span key={m}>
              <span className="tl__tick" style={{ left: pos(m) }} />
              {m + 30 < ate && <span className="tl__tick tl__tick--meia" style={{ left: pos(m + 30) }} />}
              <span className="tl__hora" style={{ left: pos(m) }}>
                {hora(m)}
              </span>
            </span>
          ))}
          <div className="tl__carro">
            <span className="tl__marca" />
            <span className="pausa tl__pausa">
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- atendimentos ---------- */
export const Atendimentos = ({ n }: { n: number }) => {
  const itens = atendimentosAtivos()
  if (!itens.length) return null
  return (
    <section className="secao sobre-verde abaixo" id="atendimentos" aria-labelledby="titulo-atend">
      <div className="wrap atend__grade">
        <header className="cab atend__lado">
          <MarcaSecao n={n} texto="Atendimentos" />
          <Titulo id="titulo-atend" linhas={['O que você', <>pode <em>agendar</em>.</>]} />
          <p className="apoio">A indicação de cada atendimento depende de avaliação individual.</p>
        </header>
        <div className="indice atend__lista">
          {itens.map((a, i) => {
            const dim = a.foto ? CONFIG.dimensoesFotos[a.foto] : undefined
            return (
              <details className="item" key={a.id} id={a.id}>
                <summary>
                  <span className="item__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="item__nome">{a.nome}</h3>
                  <span className="item__sinal" aria-hidden="true" />
                </summary>
                <div className="item__painel">
                  <div className="item__texto">
                    <p>{a.descricao}</p>
                    <p className="nota">A indicação depende de avaliação individual.</p>
                    <div className="acoes">
                      <BotaoAgendar texto={`Agendar ${a.nome.toLowerCase()}`} mensagem={msgAtendimento(a.nome)} />
                    </div>
                  </div>
                  {a.foto && dim && (
                    <div className="item__foto">
                      <Foto
                        arquivo={a.foto}
                        largura={dim[0]}
                        altura={dim[1]}
                        alt=""
                        sizes="(min-width: 700px) 240px, 90vw"
                      />
                    </div>
                  )}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- o espaço ---------- */
export const Espaco = ({ n }: { n: number }) => {
  if (!CONFIG.fotos.length) return null
  return (
    <section className="secao abaixo" id="espaco" aria-labelledby="titulo-espaco">
      <div className="wrap">
        <header className="cab espaco__cab">
          <MarcaSecao n={n} texto="O espaço" />
          <Titulo id="titulo-espaco" linhas={[<>O <em>espaço</em>, na</>, 'Vila Claudia.']} />
          <p className="apoio">
            Salas reservadas, luz baixa e uma recepção para chegar sem pressa.
          </p>
        </header>
        <div className="galeria">
          {CONFIG.fotos.map((f) => (
            <figure key={f.arquivo} className={f.largura / f.altura > 1.5 ? 'f-larga' : ''}>
              <Foto
                arquivo={f.arquivo}
                alt={f.alt}
                largura={f.largura}
                altura={f.altura}
                sizes={f.largura / f.altura > 1.5 ? '(min-width: 900px) 60vw, 92vw' : '(min-width: 900px) 34vw, 80vw'}
              />
              <figcaption className="rotulo">
                <Pausa />
                {f.legenda}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- horários (seção ousada) ---------- */
export const Horarios = ({ n }: { n: number }) => {
  const { de, ate } = limitesSemana()
  const total = ate - de
  const pct = (m: number) => ((m - de) / total) * 100
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(agoraNoFuso().dia), [])
  const horas: number[] = []
  for (let m = de; m <= ate; m += 60) horas.push(m)

  return (
    <section className="secao horarios abaixo observar" id="horarios" aria-labelledby="titulo-horarios">
      <p className="horarios__gigante" aria-hidden="true">
        {hora(de)}<em>‖</em>{hora(ate)}
      </p>
      <div className="wrap">
        <header className="cab">
          <MarcaSecao n={n} texto="Horários" />
          <Titulo id="titulo-horarios" linhas={['Os horários', <>vêm em <em>faixas</em>.</>]} />
          <p className="apoio" style={{ maxWidth: 'var(--medida)' }}>
            Alguns dias abrem só de manhã, outros só à tarde. A sexta tem duas faixas.
          </p>
        </header>
        <div className="semana" role="list">
          <div className="semana__regua" aria-hidden="true">
            <span />
            <div className="regua">
              {horas.map((m) => (
                <span key={m} style={{ left: `${pct(m)}%` }}>
                  {hora(m)}
                </span>
              ))}
            </div>
            <span />
          </div>
          {ORDEM_SEMANA.map((d) => {
            const faixas = faixasDoDia(d)
            const eHoje = hoje === d
            const fim = faixas.length ? pct(minutos(faixas[faixas.length - 1].fim)) : 0
            const inicio = faixas.length ? pct(minutos(faixas[0].inicio)) : 0
            return (
              <div
                role="listitem"
                key={d}
                className={`dia ${faixas.length ? '' : 'dia--fechado'} ${eHoje ? 'dia--hoje' : ''}`}
              >
                <div className="dia__topo">
                  <span className="dia__nome">
                    {capital(DIAS[d])}
                    {eHoje && <span className="rotulo dia__hoje">hoje</span>}
                  </span>
                  <span className="dia__texto">{capital(textoDoDia(d))}</span>
                </div>
                <div className="trilha" aria-hidden="true">
                  {faixas.map((f) => (
                    <span
                      key={f.inicio}
                      className="trilha__faixa"
                      style={{
                        left: `${pct(minutos(f.inicio))}%`,
                        width: `${pct(minutos(f.fim)) - pct(minutos(f.inicio))}%`,
                      }}
                    />
                  ))}
                  {eHoje && faixas.length > 0 && (
                    <span
                      className="trilha__carro"
                      style={{ left: `${inicio}%`, width: `${fim - inicio}%` }}
                    >
                      <span className="trilha__marca" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="nota horarios__nota">{CONFIG.avisoFeriados}</p>
      </div>
    </section>
  )
}

/* ---------- a casa (silenciosa) ---------- */
export const Casa = ({ n }: { n: number }) => {
  if (!CONFIG.responsavel) return null
  const dim = CONFIG.responsavelFoto ? CONFIG.dimensoesFotos[CONFIG.responsavelFoto] : undefined
  return (
    <section className="casa abaixo" id="a-casa" aria-labelledby="titulo-casa">
      <div className="wrap casa__in">
        <h2 className="rotulo marca-secao observar" id="titulo-casa">
          <Pausa />
          <span>{String(n).padStart(2, '0')} · A casa</span>
        </h2>
        <div className="casa__texto">
          <p>
            {CONFIG.responsavel}, à frente do {CONFIG.nome}.
          </p>
          <p>
            {CONFIG.endereco.rua}, {CONFIG.endereco.numero}, {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}.
          </p>
        </div>
        {CONFIG.responsavelFoto && dim && (
          <figure className="casa__foto">
            <Foto
              arquivo={CONFIG.responsavelFoto}
              alt={CONFIG.responsavelFotoAlt}
              largura={dim[0]}
              altura={dim[1]}
              sizes="(min-width: 900px) 288px, 70vw"
            />
          </figure>
        )}
      </div>
    </section>
  )
}

/* ---------- como funciona ---------- */
const PASSOS = [
  {
    t: 'Contato e agendamento',
    d: 'Você chama pelo WhatsApp ou envia a solicitação pelo site. O dia e o horário são combinados por lá.',
  },
  {
    t: 'Conversa antes de começar',
    d: 'Antes do atendimento, conversamos sobre o que você procura e sobre o que for importante saber.',
  },
  { t: 'Atendimento', d: 'No horário marcado, em sala reservada, no seu tempo.' },
  {
    t: 'Acompanhamento',
    d: 'Depois, se fizer sentido para você, combinamos os próximos horários.',
  },
]
export const ComoFunciona = ({ n }: { n: number }) => (
  <section className="secao abaixo" id="como-funciona" aria-labelledby="titulo-como">
    <div className="wrap">
      <header className="cab">
        <MarcaSecao n={n} texto="Como funciona" />
        <Titulo id="titulo-como" linhas={['Do primeiro contato', <>ao <em>atendimento</em>.</>]} />
      </header>
      <ol className="passos" data-progresso>
        <span className="passos__trilho" aria-hidden="true">
          <span className="passos__progresso" />
        </span>
        {PASSOS.map((p, i) => (
          <li className="passo" key={p.t}>
            <span className="passo__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{p.t}</h3>
            <p className="apoio">{p.d}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

/* ---------- dúvidas ---------- */
export const perguntas = () => {
  const ativos = atendimentosAtivos().map((a) => a.nome.toLowerCase())
  const listaAtend =
    ativos.length > 1 ? `${ativos.slice(0, -1).join(', ')} e ${ativos[ativos.length - 1]}` : ativos[0] ?? ''
  const sab = faixasDoDia(6)
  const dom = faixasDoDia(0)
  const lista: { p: string; r: string }[] = [
    {
      p: 'Como agendar?',
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, ou pelo formulário desta página, que monta a mensagem e abre a conversa. O horário é confirmado pelo ${CONFIG.nome}.`,
    },
    {
      p: 'Como é o primeiro atendimento?',
      r: 'Começa com uma conversa: o que você procura e o que for importante saber antes. A partir daí, o atendimento é ajustado a você.',
    },
    {
      p: 'O que levar?',
      r: 'Nada em especial. Vale chegar com alguns minutos de folga, para começar sem pressa.',
    },
    { p: 'Quais atendimentos são oferecidos no spa?', r: `Hoje: ${listaAtend}.` },
    {
      p: 'Todo atendimento serve para todas as pessoas?',
      r: 'Não necessariamente. A indicação de cada atendimento, inclusive da limpeza de pele, da drenagem linfática e da massagem relaxante, depende de avaliação individual, feita na conversa antes de começar.',
    },
    {
      p: 'Quais são os horários?',
      r:
        ORDEM_SEMANA.map((d) => `${capital(DIAS[d])}: ${textoDoDia(d)}`).join('; ') +
        `. ${CONFIG.avisoFeriados}`,
    },
  ]
  if (sab.length) lista.push({ p: 'Atende aos sábados?', r: `Sim, das ${textoDoDia(6)}.` })
  if (!dom.length) lista.push({ p: 'E aos domingos?', r: 'Não. Aos domingos o espaço fica fechado.' })
  lista.push(
    { p: 'Onde fica?', r: `${CONFIG.enderecoLinha}.` },
    {
      p: 'Posso agendar pelo site?',
      r: `Pelo site você envia uma solicitação: o formulário abre o WhatsApp com a mensagem pronta. O horário só fica marcado depois da confirmação do ${CONFIG.nome}.`,
    },
  )
  return lista.filter((x) => x.r && !x.r.endsWith(': .'))
}

export const Duvidas = ({ n }: { n: number }) => (
  <section className="secao abaixo" id="duvidas" aria-labelledby="titulo-duvidas" style={{ paddingTop: 0 }}>
    <div className="wrap duvidas__grade">
      <header className="cab duvidas__lado">
        <MarcaSecao n={n} texto="Dúvidas" />
        <Titulo id="titulo-duvidas" linhas={['Perguntas', <>de quem vem <em>pela</em></>, 'primeira vez.']} />
      </header>
      <div className="duvidas__lista">
        {perguntas().map((q) => (
          <details className="duvida" key={q.p}>
            <summary>
              <span>{q.p}</span>
              <span className="item__sinal" aria-hidden="true" />
            </summary>
            <p className="duvida__resp">{q.r}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- localização e contato ---------- */
export const Localizacao = ({ n }: { n: number }) => (
  <section className="secao abaixo" id="contato" aria-labelledby="titulo-local" style={{ background: 'var(--papel-2)' }}>
    <div className="wrap">
      <header className="cab">
        <MarcaSecao n={n} texto="Localização e contato" />
        <Titulo id="titulo-local" linhas={[<>Venha nos <em>visitar</em>.</>]} />
      </header>
      <div className="local__grade">
        <div className="local__dados">
          <address className="endereco">
            {CONFIG.endereco.rua}, {CONFIG.endereco.numero}
            <br />
            {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            <br />
            <span className="apoio">CEP {CONFIG.endereco.cep}</span>
          </address>
          <div className="acoes">
            <LinkExterno href={CONFIG.rotaUrl} className="btn">
              Como chegar
            </LinkExterno>
            <LinkExterno href={CONFIG.mapsUrl} className="btn btn--linha">
              Ver no Google Maps
            </LinkExterno>
          </div>
          <div className="contatos">
            {CONFIG.usarWhatsapp && (
              <LinkExterno href={waLink()}>
                <span className="marcador">WhatsApp</span>
                <span className="link">{CONFIG.whatsappExibicao}</span>
              </LinkExterno>
            )}
            {CONFIG.telefoneFixo && (
              <a href={`tel:${CONFIG.telefoneFixo.replace(/\D/g, '')}`}>
                <span className="marcador">Telefone</span>
                <span className="link">{CONFIG.telefoneFixo}</span>
              </a>
            )}
            {CONFIG.email && (
              <a href={`mailto:${CONFIG.email}`}>
                <span className="marcador">E-mail</span>
                <span className="link">{CONFIG.email}</span>
              </a>
            )}
            {CONFIG.instagram.url && (
              <LinkExterno href={CONFIG.instagram.url}>
                <span className="marcador">Instagram</span>
                <span className="link">{CONFIG.instagram.usuario}</span>
              </LinkExterno>
            )}
          </div>
          <div className="acoes">
            <BotaoAgendar />
            <LinkExterno href={CONFIG.instagram.url} className="btn btn--linha">
              Ver no Instagram
            </LinkExterno>
          </div>
        </div>
        <div className="mapa">
          <iframe
            title={`Mapa: ${CONFIG.enderecoLinha}`}
            src={CONFIG.mapaEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  </section>
)

/* ---------- CTA final ---------- */
export const CtaFinal = () => (
  <section className="cta sobre-verde" aria-labelledby="titulo-cta">
    <div className="wrap">
      <h2 className="cta__titulo" id="titulo-cta">
        Reserve a sua <em>pausa</em>.
      </h2>
      <div className="acoes">
        <BotaoAgendar />
        <LinkExterno href={CONFIG.instagram.url} className="btn btn--linha">
          Ver no Instagram
        </LinkExterno>
      </div>
    </div>
  </section>
)

/* ---------- rodapé ---------- */
export const Rodape = () => (
  <footer className="rodape sobre-verde">
    <div className="wrap">
      <div className="rodape__topo">
        <div className="rodape__marca">
          <div className="rodape__logo">
            <img
              src={CONFIG.logo.src400}
              width={200}
              height={113}
              alt={`Logo do ${CONFIG.nome}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="rodape__col">
          <p className="rotulo apoio">Endereço</p>
          <p>
            {CONFIG.endereco.rua}, {CONFIG.endereco.numero}
            <br />
            {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            <br />
            CEP {CONFIG.endereco.cep}
          </p>
        </div>
        <div className="rodape__col">
          <p className="rotulo apoio">Contato</p>
          {CONFIG.usarWhatsapp && (
            <LinkExterno href={waLink()} className="link-rodape">
              <span className="link">WhatsApp {CONFIG.whatsappExibicao}</span>
            </LinkExterno>
          )}
          <LinkExterno href={CONFIG.instagram.url}>
            <span className="link">Instagram {CONFIG.instagram.usuario}</span>
          </LinkExterno>
          <a href="/privacidade.html">
            <span className="link">Privacidade</span>
          </a>
        </div>
      </div>
      <p className="assinatura" aria-hidden="true">
        Refúgio <em>Vita</em>
      </p>
      <p className="rotulo apoio" style={{ marginBottom: 'var(--e4)' }}>
        {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.endereco.cidade}/{CONFIG.endereco.uf}
      </p>
      <div className="rodape__base">
        <p>
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento
          depende de avaliação individual.
        </p>
        <p>© {CONFIG.nome}</p>
      </div>
    </div>
  </footer>
)

export const AgendarLink = () => <a href="#agendar">Solicitar agendamento</a>
