import { useId, useRef, useState } from 'react'
import {
  CONFIG,
  atendimentosVisiveis,
  crmTexto,
  enderecoLinha,
  especialidadeTexto,
  temWhatsapp,
  waAtendimento,
  waLink,
} from '../config'
import { Monograma } from './Monograma'
import { IconeInstagram, IconeMapa, IconeWhatsapp, LinkExterno, Marca, Titulo, useEmFoco } from './ui'

/* ============ A médica ============ */
export function Medica() {
  const temFoto = !!CONFIG.foto
  const nome = CONFIG.nomeCompleto.trim() || CONFIG.nome
  return (
    <section id="medica" aria-labelledby="titulo-medica" className="pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="wrap">
        <div className="no-trilho">
          <Marca>A médica</Marca>
          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2 id="titulo-medica" className="display text-[clamp(2.8rem,8vw,6rem)] text-bronze">
                {nome}
              </h2>
              <p className="mt-4 text-[0.95rem] font-medium tracking-[0.01em] text-taupe">
                {[crmTexto(), especialidadeTexto()].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-10 max-w-[34rem] text-[1.125rem] leading-[1.75]">
                Ginecologista e obstetra em {CONFIG.endereco.cidade}. No consultório, a consulta começa pela
                conversa: sua história, suas perguntas e o momento de vida em que você está. Exames e condutas são
                explicados antes de qualquer decisão.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pt-4">
              {temFoto && (
                <img
                  src={CONFIG.foto}
                  alt={CONFIG.fotoAlt || `Retrato de ${nome}`}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="mb-10 aspect-[4/5] w-full rounded-[2px] object-cover"
                />
              )}
              {CONFIG.formacao.length > 0 && (
                <>
                  <h3 className="rotulo text-taupe">Formação</h3>
                  <ul className="mt-4 border-t border-linha">
                    {CONFIG.formacao.map((f) => (
                      <li key={f} className="display border-b border-linha py-5 text-[1.35rem] leading-snug md:text-[1.5rem]">
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {CONFIG.mostrarSantaCasa && CONFIG.santaCasa.length > 0 && (
                <>
                  <h3 className="rotulo mt-10 text-taupe">Atuação hospitalar</h3>
                  <ul className="mt-4 border-t border-linha">
                    {CONFIG.santaCasa.map((f) => (
                      <li key={f} className="border-b border-linha py-4 text-[1.02rem]">
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {CONFIG.frase && (
            <figure className="mt-20 grid items-end gap-6 md:mt-28 md:grid-cols-12">
              <Monograma className="hidden h-auto w-24 md:col-span-2 md:block" peso={1.4} />
              <blockquote className="md:col-span-10">
                <p className="display text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[1.12] text-bronze">{CONFIG.frase}</p>
              </blockquote>
              <figcaption className="rotulo text-taupe md:col-span-10 md:col-start-3">{CONFIG.nome}</figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============ Atendimentos: lista editorial numerada, título fixo à esquerda ============ */
export function Atendimentos() {
  const lista = atendimentosVisiveis()
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="fundo-2 bg-creme-2 py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--faixa)+8rem)]">
              <Marca>Atendimentos</Marca>
              <h2 id="titulo-atendimentos" className="display mt-6 text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
                <Titulo texto="O que é atendido no *consultório*" />
              </h2>
              <p className="mt-6 max-w-[24rem] text-taupe">
                Cada atendimento começa por uma consulta. A conduta é definida depois da avaliação médica individual.
              </p>
            </div>
          </div>

          <ol className="border-t border-linha lg:col-span-8">
            {lista.map((a, i) => (
              <li key={a.id} className="group grid grid-cols-[3.25rem_1fr] gap-x-4 border-b border-linha py-9 md:grid-cols-[6rem_1fr] md:gap-x-8 md:py-11">
                <span aria-hidden="true" className="display num pt-1 text-[1.9rem] text-ouro-texto transition-colors duration-500 group-hover:text-bronze md:text-[3rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="display text-[1.65rem] leading-tight text-tinta md:text-[2.15rem]">{a.titulo}</h3>
                  <p className="mt-3 max-w-[36rem] text-[1.03rem] leading-relaxed">{a.descricao}</p>
                  <p className="mt-3 text-[0.9rem] text-taupe">A indicação depende de avaliação médica individual.</p>
                  {temWhatsapp() && (
                    <a
                      href={waAtendimento(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-12 items-center gap-2 text-[0.98rem] font-medium text-bronze"
                    >
                      <IconeWhatsapp className="size-[1.15rem]" />
                      <span className="link-sutil">
                        {a.mensagemDiscreta ? 'Agendar uma consulta' : `Agendar consulta de ${a.nomeCurto.toLowerCase()}`}
                      </span>
                      <span className="sr-only"> (abre o WhatsApp)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ============ Para quem é: texto grande intercalado com fios e legendas ============ */
export function ParaQuem() {
  if (!CONFIG.paraQuem.length) return null
  return (
    <section id="para-quem" aria-labelledby="titulo-para-quem" className="py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho">
          <Marca>Para quem é</Marca>
          <h2 id="titulo-para-quem" className="display mt-6 max-w-[48rem] text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
            <Titulo texto="Um consultório para diferentes *momentos* da vida." />
          </h2>

          <ul className="mt-14 border-t border-linha">
            {CONFIG.paraQuem.map((p) => (
              <li key={p.legenda} className="grid gap-2 border-b border-linha py-6 md:grid-cols-12 md:items-baseline md:gap-10 md:py-8">
                <span className="rotulo text-taupe md:col-span-3">{p.legenda}</span>
                <span className="display text-[clamp(1.45rem,3.2vw,2.35rem)] leading-[1.18] md:col-span-9">{p.texto}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 text-[0.98rem] md:grid-cols-2 md:gap-10">
            <p className="border-l border-ouro pl-5 text-taupe">
              Este site é informativo e não substitui a consulta. Não inicie nem suspenda medicamentos por conta própria.
            </p>
            <p className="border-l border-ouro pl-5 text-taupe">
              Em caso de urgência ou sinais de alerta, procure um pronto atendimento ou ligue{' '}
              <a href="tel:192" className="link-sutil font-medium text-tinta">
                192 (SAMU)
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============ Como funciona: linha do tempo sobre o próprio fio ============ */
function Passo({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const ativo = useEmFoco(ref, '0px 0px -35% 0px')
  return (
    <li ref={ref} className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 py-10 md:grid-cols-[8rem_1fr] md:gap-x-10 md:py-14">
      <span className="no top-[3.35rem] md:top-[4.4rem]" data-ativo={ativo} aria-hidden="true" />
      <span
        aria-hidden="true"
        className={`display num text-[2.6rem] leading-none transition-colors duration-700 md:text-[5rem] ${ativo ? 'text-ouro-texto' : 'text-linha'}`}
      >
        {n}
      </span>
      <div className="max-w-[34rem] pt-1 md:pt-3">
        <h3 className="display text-[1.6rem] leading-tight md:text-[2rem]">
          <span className="sr-only">Etapa {n}: </span>
          {titulo}
        </h3>
        <p className="mt-3 text-[1.03rem] leading-relaxed text-taupe">{texto}</p>
      </div>
    </li>
  )
}

export function ComoFunciona() {
  if (!CONFIG.passos.length) return null
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="fundo-2 bg-creme-2 py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Marca>Como funciona</Marca>
              <h2 id="titulo-como" className="display mt-6 text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
                <Titulo texto="Do primeiro contato ao *acompanhamento*." />
              </h2>
            </div>
            <p className="max-w-[22rem] self-end text-taupe lg:col-span-4 lg:col-start-9">
              Quatro etapas, sempre com hora marcada e com tempo para perguntas.
            </p>
          </div>
          <ol className="mt-8">
            {CONFIG.passos.map((p, i) => (
              <Passo key={p.titulo} n={i + 1} titulo={p.titulo} texto={p.texto} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ============ Dúvidas frequentes ============ */
type Pergunta = { p: string; r: string }

function perguntas(): Pergunta[] {
  const e = CONFIG.endereco
  const h = CONFIG.horarios
  const lista: Pergunta[] = []
  if (temWhatsapp())
    lista.push({
      p: 'Como agendo uma consulta?',
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário de solicitação nesta página. A equipe responde confirmando o dia e o horário disponíveis.`,
    })
  if (temWhatsapp())
    lista.push({
      p: 'O WhatsApp responde dúvidas clínicas?',
      r: 'Não. O número é usado somente para agendamento. Dúvidas clínicas, pedidos de exames, atestados e receitas são tratados na consulta.',
    })
  lista.push(
    {
      p: 'Como é a primeira consulta?',
      r: 'Começa por uma conversa sobre sua história de saúde, o motivo da consulta e suas perguntas. Em seguida vem a avaliação indicada para o seu caso e a explicação dos próximos passos.',
    },
    {
      p: 'O que devo levar?',
      r: 'De forma geral, um documento com foto e os exames anteriores que você tiver. Se usar algum medicamento, leve o nome anotado. Em caso de dúvida, pergunte no momento do agendamento.',
    },
    {
      p: 'Quais atendimentos são realizados?',
      r: `${atendimentosVisiveis()
        .map((a) => a.titulo)
        .join('; ')}. A indicação de cada conduta depende de avaliação médica individual.`,
    },
    {
      p: 'Adolescentes podem ser atendidas?',
      r: 'Sim. A primeira consulta ginecológica pode acontecer na adolescência e é um momento para conversar e tirar dúvidas. Para menores de idade, combine no agendamento como será a presença de um responsável.',
    },
  )
  if (h.length)
    lista.push({
      p: 'Quais são os horários?',
      r: `${h.map((x) => `${x.rotulo}, das ${x.abre.replace(':', 'h')} às ${x.fecha.replace(':', 'h')}`).join('; ')}, com hora marcada. ${CONFIG.avisoFeriados}`,
    })
  lista.push(
    {
      p: 'Onde fica o consultório?',
      r: `${e.logradouro}, ${e.complemento}, ${e.bairro}, ${e.cidade} - ${e.uf}.`,
    },
    {
      p: 'O consultório atende urgências?',
      r: 'Não. Em caso de urgência ou sinais de alerta, procure um pronto atendimento ou ligue 192 (SAMU).',
    },
    {
      p: 'O site guarda os dados que eu digito?',
      r: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp. Nada é armazenado neste site.',
    },
  )
  return lista
}

export function Duvidas() {
  const lista = perguntas()
  const [aberta, setAberta] = useState<number | null>(0)
  const base = useId()
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Marca>Dúvidas</Marca>
            <h2 id="titulo-duvidas" className="display mt-6 text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
              <Titulo texto="Perguntas *frequentes*" />
            </h2>
            <p className="mt-6 max-w-[22rem] text-taupe">
              Respostas gerais. O que diz respeito ao seu caso é conversado na consulta.
            </p>
          </div>

          <div className="border-t border-linha lg:col-span-8">
            {lista.map((q, i) => {
              const id = `${base}-${i}`
              const aberto = aberta === i
              return (
                <div key={q.p} className="border-b border-linha">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-b`}
                      aria-expanded={aberto}
                      aria-controls={`${id}-p`}
                      onClick={() => setAberta(aberto ? null : i)}
                      className="flex min-h-16 w-full items-baseline gap-4 py-5 text-left md:gap-6"
                    >
                      <span aria-hidden="true" className="num w-7 shrink-0 text-[0.9rem] text-ouro-texto">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="display flex-1 text-[1.3rem] leading-snug md:text-[1.55rem]">{q.p}</span>
                      <span aria-hidden="true" className="relative ml-2 size-4 shrink-0 self-center">
                        <span className="absolute left-0 top-1/2 h-px w-4 bg-bronze" />
                        <span
                          className={`absolute left-0 top-1/2 h-px w-4 bg-bronze transition-transform duration-500 ${aberto ? 'rotate-0' : 'rotate-90'}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acordeao-painel" data-aberto={aberto}>
                    <div>
                      <p className="max-w-[38rem] pb-7 pl-11 text-[1.03rem] leading-relaxed text-taupe md:pl-[3.25rem]">
                        {q.r}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============ Localização e contato ============ */
export function Contato() {
  const e = CONFIG.endereco
  const [mapa, setMapa] = useState(false)
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const abertos = new Set(CONFIG.horarios.flatMap((h) => h.dias))
  const fechados = [6, 0].filter((d) => !abertos.has(d as 0 | 6))
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="fundo-2 bg-creme-2 py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho">
          <Marca>Localização e contato</Marca>
          <h2 id="titulo-contato" className="display mt-6 text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
            <Titulo texto="Venha nos *visitar*." />
          </h2>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <address className="not-italic">
                <p className="display text-[1.55rem] leading-snug md:text-[1.8rem]">
                  {e.complemento}
                  <br />
                  {e.logradouro}
                </p>
                <p className="mt-3 text-taupe">
                  {e.bairro}, {e.cidade} - {e.uf}
                  <br />
                  <span className="num">CEP {e.cep}</span>
                </p>
              </address>

              {CONFIG.horarios.length > 0 && (
                <div className="mt-10">
                  <h3 className="rotulo text-taupe">Horários</h3>
                  <dl className="num mt-3 border-t border-linha">
                    {CONFIG.horarios.map((h) => (
                      <div key={h.rotulo} className="flex justify-between gap-4 border-b border-linha py-3">
                        <dt>{h.rotulo}</dt>
                        <dd>
                          {h.abre.replace(':', 'h')} às {h.fecha.replace(':', 'h')}
                        </dd>
                      </div>
                    ))}
                    {fechados.length > 0 && (
                      <div className="flex justify-between gap-4 border-b border-linha py-3 text-taupe">
                        <dt>{fechados.map((d, i) => (i ? dias[d].toLowerCase() : dias[d])).join(' e ')}</dt>
                        <dd>Fechado</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-3 text-[0.92rem] text-taupe">{CONFIG.avisoFeriados}</p>
                </div>
              )}

              <ul className="mt-10 flex flex-col gap-3">
                {CONFIG.mapsUrl && (
                  <li>
                    <LinkExterno href={CONFIG.mapsUrl} className="botao botao-linha w-full sm:w-auto">
                      <IconeMapa /> Ver no Google Maps
                    </LinkExterno>
                  </li>
                )}
                {temWhatsapp() && (
                  <li>
                    <LinkExterno href={waLink()} className="botao botao-cheio w-full sm:w-auto">
                      <IconeWhatsapp /> WhatsApp {CONFIG.whatsappExibicao}
                    </LinkExterno>
                    <p className="mt-2 text-[0.85rem] leading-snug text-taupe">
                      Somente para agendamento. {CONFIG.mensagens.avisoWhatsapp}
                    </p>
                  </li>
                )}
                {CONFIG.telefone && (
                  <li>
                    <a href={`tel:${CONFIG.telefone.replace(/\D/g, '')}`} className="botao botao-linha w-full sm:w-auto">
                      Ligar {CONFIG.telefone}
                    </a>
                  </li>
                )}
                {CONFIG.email && (
                  <li>
                    <a href={`mailto:${CONFIG.email}`} className="link-sutil inline-flex min-h-12 items-center">
                      {CONFIG.email}
                    </a>
                  </li>
                )}
                {CONFIG.instagram && (
                  <li>
                    <LinkExterno href={CONFIG.instagram} className="inline-flex min-h-12 items-center gap-2 font-medium text-bronze">
                      <IconeInstagram /> <span className="link-sutil">{CONFIG.instagramUsuario}</span>
                    </LinkExterno>
                  </li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] border border-linha bg-creme sm:aspect-[4/3]">
                {mapa ? (
                  <iframe
                    title={`Mapa: ${enderecoLinha()}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(enderecoLinha())}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 size-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-10">
                    <Monograma className="h-auto w-28 self-end opacity-70 md:w-36" peso={1.3} />
                    <div>
                      <p className="rotulo text-ouro-texto">Mapa</p>
                      <p className="display mt-3 max-w-[22rem] text-[1.6rem] leading-snug">
                        {e.complemento.split(',')[1]?.trim() || e.complemento}, {e.bairro}
                      </p>
                      <button type="button" onClick={() => setMapa(true)} className="botao botao-linha mt-6">
                        <IconeMapa /> Mostrar o mapa aqui
                      </button>
                      <p className="mt-3 max-w-[24rem] text-[0.85rem] leading-snug text-taupe">
                        O mapa é carregado do Google Maps somente se você pedir.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
