import { CONFIG, atendimentosAtivos, enderecoLinha } from '../config'
import { hLegivel } from '../lib/horarios'
import { waAtendimento, waUrl } from '../lib/whatsapp'
import { Acordeao } from './Acordeao'
import { Acao, Rotulo, Titulo } from './Base'

/* ---------------------------------------------------------------- Atendimentos */
export function Atendimentos({ n }: { n: number }) {
  const lista = atendimentosAtivos()
  if (!lista.length) return null
  return (
    <section className="secao bloco-ameixa atend" id="atendimentos" aria-labelledby="atend-t">
      <div className="grade">
        <div className="atend-cab">
          <Rotulo n={n} escuro>
            Atendimentos
          </Rotulo>
          <Titulo
            id="atend-t"
            linhas={[
              'Estética facial e corporal,',
              <>
                a partir de uma <em>conversa</em>.
              </>,
            ]}
          />
        </div>
        <Acordeao
          className="atend-lista"
          nivel={3}
          itens={lista.map((a, i) => ({
            id: a.id,
            cabeca: (
              <>
                <span className="atend-num num-viva" data-reveal="" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="atend-nome">{a.nome}</span>
              </>
            ),
            corpo: (
              <div className="atend-corpo">
                <p>{a.descricao}</p>
                <p className="atend-nota">A indicação depende de avaliação individual.</p>
                {CONFIG.usarWhatsapp && (
                  <Acao href={waAtendimento(a.nome)} variante="papel">
                    Agendar avaliação de {a.nome.toLowerCase()}
                  </Acao>
                )}
              </div>
            ),
          }))}
        />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- A avaliação (ousada) */
export function Avaliacao({ n }: { n: number }) {
  return (
    <section className="secao aval" id="avaliacao" aria-labelledby="aval-t">
      <div className="grade aval-grade">
        <Rotulo n={n}>A avaliação</Rotulo>
        <Titulo
          id="aval-t"
          className="aval-titulo"
          linhas={[
            'Primeiro,',
            <>
              a <em>avaliação</em>.
            </>,
          ]}
        />
        <div className="aval-lado">
          <p className="aval-lead">
            Antes de qualquer cuidado, uma conversa. É nela que se define o que faz sentido para você.
          </p>
          <ul className="aval-itens">
            <li className="linha-viva">Conversa sobre o que você procura</li>
            <li className="linha-viva">Orientação do cuidado que faz sentido para você</li>
            <li className="linha-viva">Você decide se quer seguir</li>
          </ul>
        </div>
        {CONFIG.fotos.length > 0 && (
          <div className="fotos">
            {CONFIG.fotos.map((f) => (
              <figure className="foto" key={f.src}>
                <img src={f.src} alt={f.alt} width={f.largura} height={f.altura} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Horários (silenciosa) */
export function Horarios({ n }: { n: number }) {
  if (!CONFIG.horarios.length) return null
  return (
    <section className="secao hor" id="horarios" aria-labelledby="hor-t">
      <div className="grade hor-grade">
        <div className="hor-cab">
          <Rotulo n={n}>Horários</Rotulo>
          <Titulo
            id="hor-t"
            linhas={[
              'Horário marcado,',
              <>
                de segunda a <em>sábado</em>.
              </>,
            ]}
          />
        </div>
        <dl className="hor-lista">
          {CONFIG.horarios.map((h) => (
            <div className="hor-linha linha-viva" key={h.rotulo} data-dias={h.dias.join(',')}>
              <dt>
                {h.rotulo}
                <span className="hor-hoje" hidden>
                  hoje
                </span>
              </dt>
              <dd>
                {h.abre && h.fecha ? (
                  <>
                    <span className="hor-h">{hLegivel(h.abre)}</span>
                    <span className="hor-sep" aria-hidden="true" />
                    <span className="sr-only"> às </span>
                    <span className="hor-h">{hLegivel(h.fecha)}</span>
                  </>
                ) : (
                  <span className="hor-fechado">Fechado</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {CONFIG.avisoHorarios && <p className="hor-aviso">{CONFIG.avisoHorarios}</p>}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Como funciona */
const ETAPAS = [
  {
    t: 'Contato e agendamento',
    d: 'Você chama no WhatsApp ou envia a solicitação pelo site. O dia e o horário são combinados na conversa.',
  },
  {
    t: 'Avaliação personalizada',
    d: 'Na clínica, uma conversa sobre o que você procura e uma observação cuidadosa da sua pele.',
  },
  {
    t: 'Orientação',
    d: 'Você recebe a orientação do cuidado que faz sentido para o seu caso, com tempo para perguntas.',
  },
  {
    t: 'Acompanhamento',
    d: 'Se decidir seguir, os próximos encontros são marcados com você, no seu ritmo.',
  },
]

export function ComoFunciona({ n }: { n: number }) {
  return (
    <section className="secao como" id="como-funciona" aria-labelledby="como-t">
      <div className="grade como-grade">
        <div className="como-cab">
          <Rotulo n={n}>Como funciona</Rotulo>
          <Titulo
            id="como-t"
            linhas={[
              'Do primeiro contato',
              <>
                ao <em>acompanhamento</em>.
              </>,
            ]}
          />
        </div>
        <ol className="como-linha" data-progresso="">
          <span className="como-trilho" aria-hidden="true">
            <span className="como-trilho-cheio" />
          </span>
          {ETAPAS.map((e, i) => (
            <li className="como-etapa" key={e.t}>
              <span className="como-num num-viva" data-reveal="" aria-hidden="true">
                {i + 1}
              </span>
              <div className="como-txt">
                <h3>{e.t}</h3>
                <p>{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Dúvidas */
export function Duvidas({ n }: { n: number }) {
  const ativos = atendimentosAtivos().map((a) => a.nome.toLowerCase())
  const listaAtend =
    ativos.length > 1 ? `${ativos.slice(0, -1).join(', ')} e ${ativos.at(-1)}` : (ativos[0] ?? '')
  const semana = CONFIG.horarios.find((h) => h.dias.includes(1))
  const sab = CONFIG.horarios.find((h) => h.dias.includes(6))
  const dom = CONFIG.horarios.find((h) => h.dias.includes(0))
  const e = CONFIG.endereco
  const faixa = (h?: { abre: string; fecha: string }) =>
    h && h.abre ? `das ${hLegivel(h.abre)} às ${hLegivel(h.fecha)}` : ''

  const perguntas: { q: string; a: string }[] = [
    CONFIG.usarWhatsapp && {
      q: 'Como agendar?',
      a: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões deste site ou pelo formulário de solicitação. O dia e o horário são confirmados pela equipe na conversa.`,
    },
    {
      q: 'Como é a primeira avaliação?',
      a: 'É uma conversa para entender o que você procura e observar a sua pele. A partir dela, você recebe a orientação do cuidado que faz sentido no seu caso e decide se quer seguir.',
    },
    {
      q: 'O que levar?',
      a: 'Não é preciso levar nada específico. Se você usa algum produto na pele ou tem alguma informação de saúde que considere importante, conte durante a avaliação, pessoalmente.',
    },
    listaAtend && {
      q: 'Quais atendimentos são oferecidos?',
      a: `${listaAtend[0].toUpperCase()}${listaAtend.slice(1)}. O que é indicado para você é definido na avaliação.`,
    },
    {
      q: 'Todo atendimento serve para todas as pessoas?',
      a: 'Não. Cada pele pede um cuidado diferente, e a indicação depende de avaliação individual.',
    },
    semana &&
      sab && {
        q: 'Quais são os horários?',
        a: `De segunda a sexta, ${faixa(semana)}; aos sábados, ${faixa(sab)}. ${CONFIG.avisoHorarios}`,
      },
    sab?.abre && { q: 'Atende aos sábados?', a: `Sim, ${faixa(sab)}, com horário marcado.` },
    dom && !dom.abre && { q: 'E aos domingos?', a: 'Não. Aos domingos não há atendimento.' },
    {
      q: 'Onde fica?',
      a: `Na ${e.rua}, ${e.numero}, ${e.bairro}, em ${e.cidade} - ${e.uf}, CEP ${e.cep}. Na seção de contato há links para abrir o endereço no Google Maps e traçar a rota.`,
    },
    CONFIG.usarWhatsapp &&
      CONFIG.secoes.agendar && {
        q: 'Posso agendar pelo site?',
        a: 'Pelo site você envia uma solicitação: escolhe o atendimento, a data e o horário que prefere, e a mensagem abre pronta no WhatsApp. A equipe confirma a disponibilidade pela conversa.',
      },
  ].filter(Boolean) as { q: string; a: string }[]

  return (
    <section className="secao duv" id="duvidas" aria-labelledby="duv-t">
      <div className="grade duv-grade">
        <div className="duv-cab">
          <Rotulo n={n}>Dúvidas frequentes</Rotulo>
          <Titulo
            id="duv-t"
            linhas={[
              'O que perguntam',
              <>
                antes de <em>marcar</em>.
              </>,
            ]}
          />
        </div>
        <Acordeao
          className="duv-lista"
          itens={perguntas.map((p, i) => ({
            id: `q${i}`,
            cabeca: <span className="duv-q">{p.q}</span>,
            corpo: <p className="duv-a">{p.a}</p>,
          }))}
        />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Contato */
export function Contato({ n }: { n: number }) {
  const e = CONFIG.endereco
  return (
    <section className="secao cont" id="contato" aria-labelledby="cont-t">
      <div className="grade cont-grade">
        <div className="cont-cab">
          <Rotulo n={n}>Localização e contato</Rotulo>
          <Titulo
            id="cont-t"
            linhas={[
              <>
                Venha nos <em>visitar</em>.
              </>,
            ]}
          />
          <address className="cont-end">
            <span className="cont-rua">
              {e.rua}, {e.numero}
            </span>
            <span>{e.bairro}</span>
            <span>
              {e.cidade} - {e.uf} · CEP {e.cep}
            </span>
          </address>
          <ul className="cont-links">
            <li>
              <Acao href={e.rotaUrl} variante="texto">
                Como chegar
              </Acao>
            </li>
            <li>
              <Acao href={e.mapsUrl} variante="texto">
                Ver no Google Maps
              </Acao>
            </li>
            {CONFIG.usarWhatsapp && (
              <li>
                <Acao href={waUrl()} variante="texto">
                  WhatsApp {CONFIG.whatsappExibicao}
                </Acao>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <Acao href={CONFIG.instagram.url} variante="texto">
                  Ver no Instagram
                </Acao>
              </li>
            )}
          </ul>
          {CONFIG.usarWhatsapp && (
            <div className="cont-acoes">
              <Acao href={waUrl()}>Agendar avaliação</Acao>
            </div>
          )}
        </div>
        {e.fachada?.src && (
          <figure className="cont-foto">
            <picture>
              <source media="(max-width: 40rem)" srcSet={e.fachada.srcPequena} />
              <img
                src={e.fachada.src}
                width={e.fachada.largura}
                height={e.fachada.altura}
                alt={e.fachada.alt}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption>
              {e.rua}, {e.numero}. A entrada fica sob a placa com o nome da clínica.
            </figcaption>
          </figure>
        )}
        <div className="cont-mapa">
          <iframe
            title={`Mapa: ${enderecoLinha()}`}
            src={e.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            width="800"
            height="600"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CTA final */
export function CtaFinal() {
  return (
    <section className="secao bloco-ameixa cta" aria-labelledby="cta-t">
      <div className="grade cta-grade">
        <Titulo
          id="cta-t"
          className="cta-titulo"
          linhas={[
            'O primeiro passo',
            <>
              é a <em>avaliação</em>.
            </>,
          ]}
        />
        <div className="cta-acoes">
          {CONFIG.usarWhatsapp && (
            <Acao href={waUrl()} variante="papel">
              Agendar avaliação
            </Acao>
          )}
          {CONFIG.instagram.url && (
            <Acao href={CONFIG.instagram.url} variante="contorno-escuro">
              Ver no Instagram
            </Acao>
          )}
        </div>
      </div>
    </section>
  )
}
