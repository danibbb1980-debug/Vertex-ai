import { useId, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { CONFIG, MSG_GERAL, enderecoLinha, msgArea, oabTexto, temWhats, waLink } from '../config'
import { ArrowIcon, SectionHead, WhatsIcon } from './ui'

/* ---------------------------------------------------------------- O advogado */
export function Advogado() {
  const linhas: { k: string; v: string }[] = []
  if (CONFIG.nomeCompleto || oabTexto)
    linhas.push({ k: 'Identificação', v: [CONFIG.nomeCompleto, oabTexto].filter(Boolean).join(' · ') })
  if (CONFIG.mostrarTrajetoria)
    CONFIG.trajetoria.forEach((t, i) => linhas.push({ k: i === 0 ? 'Formação' : 'Trajetória', v: t }))
  if (CONFIG.mostrarCargosOAB) CONFIG.cargosOAB.forEach((c) => linhas.push({ k: 'OAB', v: c }))

  return (
    <section id="advogado" aria-labelledby="t-advogado" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHead n="§ 01" label="O advogado" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 id="t-advogado" className="max-w-[16ch] text-[clamp(2rem,5vw,3.6rem)]">
              Quem atende é quem <em>explica</em>.
            </h2>
            <div className="mt-8 max-w-[38rem] space-y-5 text-ink-2">
              <p>
                {CONFIG.nomeExibicao} atende pessoalmente, do primeiro contato ao acompanhamento. Cada conversa começa
                pelo que você precisa entender: qual é a situação, o que a lei diz sobre ela e quais caminhos existem.
              </p>
              <p>
                A atuação reúne Direito Tributário, Direito Empresarial e Direito do Trabalho, com atendimento a empresas,
                empresários, profissionais liberais e trabalhadores de {CONFIG.endereco.cidade} e região.
              </p>
            </div>

            {linhas.length > 0 && (
              <dl className="mt-12 max-w-[40rem] border-t border-ink">
                {linhas.map((l, i) => (
                  <div
                    key={l.v}
                    className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-rule py-4 sm:grid-cols-[2.5rem_9rem_1fr]"
                  >
                    <span className="num text-sm text-brick" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <dt className="label self-center text-slate">{l.k}</dt>
                    <dd className="col-start-2 text-ink sm:col-start-3">{l.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {CONFIG.fotos.advogado && (
            <figure className="lg:col-span-5 lg:pt-4">
              <div className="relative">
                <span className="absolute -left-3 -top-3 h-full w-full border border-brick/40" aria-hidden="true" />
                <img
                  src={CONFIG.fotos.advogado}
                  alt={CONFIG.fotos.advogadoAlt}
                  width={739}
                  height={930}
                  loading="lazy"
                  decoding="async"
                  className="relative block aspect-[739/930] w-full object-cover [filter:saturate(.82)_contrast(1.03)]"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-b border-rule pb-3 text-sm text-slate">
                <span>
                  {CONFIG.nomeExibicao}, {CONFIG.titulo.toLowerCase()}
                </span>
                <span className="num label">{CONFIG.endereco.cidade}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Áreas */
export function Areas() {
  return (
    <section id="areas" aria-labelledby="t-areas" className="border-t border-rule bg-card py-20 sm:py-28">
      <div className="wrap">
        <SectionHead n="§ 02" label="Áreas de atuação" />
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="t-areas" className="text-[clamp(2rem,5vw,3.6rem)] lg:col-span-7">
            Três áreas, um mesmo <em>método</em>.
          </h2>
          <p className="max-w-[30rem] self-end text-slate lg:col-span-5">
            Cada área abaixo descreve, em termos gerais, as situações em que o advogado costuma atuar. Cada caso depende
            de análise individual.
          </p>
        </div>

        <ol className="mt-14 border-t-2 border-ink">
          {CONFIG.areas.map((a, i) => (
            <li key={a.id} id={`area-${a.id}`} className="grid gap-x-8 gap-y-5 border-b border-rule py-10 lg:grid-cols-12">
              <div className="flex items-baseline gap-5 lg:col-span-4 lg:block">
                <span className="num block font-serif text-[clamp(2.6rem,6vw,4.5rem)] leading-none text-brick" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] lg:mt-5">{a.titulo}</h3>
              </div>
              <div className="lg:col-span-5">
                <p className="text-ink-2">{a.resumo}</p>
                <ul className="mt-5 space-y-2">
                  {a.situacoes.map((s) => (
                    <li key={s} className="grid grid-cols-[1.25rem_1fr] text-[0.98rem] text-ink-2">
                      <span className="text-brick" aria-hidden="true">
                        –
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-between gap-4 border-rule lg:col-span-3 lg:border-l lg:pl-8">
                <p className="text-sm text-slate">Cada caso depende de análise individual.</p>
                {temWhats && (
                  <a
                    href={waLink(msgArea(a.titulo))}
                    target="_blank"
                    rel="noopener"
                    className="link inline-flex min-h-12 items-center gap-2 !no-underline hover:!underline"
                  >
                    <WhatsIcon className="h-[1.1rem] w-[1.1rem]" />
                    Conversar sobre {a.titulo}
                    <span className="sr-only"> pelo WhatsApp (nova aba)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Quando procurar */
const quando = [
  { t: 'Antes de assinar um contrato.', c: 'Ler com calma o que se está assumindo costuma ser mais simples do que discutir depois.' },
  { t: 'Ao abrir ou reorganizar uma empresa.', c: 'Tipo societário, contrato social, entrada ou saída de sócios.' },
  { t: 'Ao receber uma notificação ou autuação.', c: 'Entender o que está sendo cobrado e quais são os caminhos possíveis.' },
  { t: 'Em dúvidas sobre as obrigações da empresa.', c: 'Fiscais, societárias ou trabalhistas, no dia a dia do negócio.' },
  { t: 'Quando a relação de trabalho muda.', c: 'Contratação, mudança de função, desligamento: para empregador e empregado.' },
]

export function Quando() {
  return (
    <section id="quando" aria-labelledby="t-quando" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHead n="§ 03" label="Quando procurar um advogado" />
        <h2 id="t-quando" className="sr-only">
          Quando procurar um advogado
        </h2>
        <ul>
          {quando.map((q, i) => (
            <li
              key={q.t}
              className="grid gap-x-10 gap-y-2 border-b border-rule py-7 first:pt-0 md:grid-cols-[3rem_1fr_18rem] md:items-baseline"
            >
              <span className="num hidden text-sm text-brick md:block" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className={`font-serif text-[clamp(1.6rem,4.2vw,3.1rem)] leading-[1.1] tracking-[-0.025em] text-ink ${i % 2 ? 'md:pl-[8%]' : ''}`}>
                {q.t}
              </p>
              <p className="text-[0.95rem] text-slate">{q.c}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[40rem] border-l-2 border-brick pl-4 text-[0.95rem] text-slate">
          Este site é informativo e não substitui a orientação jurídica individual.
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Como funciona */
const etapas = [
  {
    t: 'Contato e agendamento',
    d: 'Você manda uma mensagem pelo WhatsApp ou pelo formulário deste site, e o escritório combina com você o dia e o horário.',
  },
  {
    t: 'Análise do caso',
    d: 'Na conversa, o advogado ouve a situação e verifica os documentos que você já tiver. Nada é decidido sem entender o contexto.',
  },
  {
    t: 'Orientação sobre as possibilidades',
    d: 'Você recebe uma explicação clara dos caminhos possíveis, com os prós, os contras e o que cada um exige.',
  },
  {
    t: 'Acompanhamento',
    d: 'Se decidir seguir, o advogado acompanha cada etapa e mantém você informado sobre o andamento.',
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="como-funciona" aria-labelledby="t-como" className="border-t border-rule bg-paper-2/60 py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <SectionHead n="§ 04" label="Como funciona" />
            <h2 id="t-como" className="text-[clamp(2rem,5vw,3.6rem)]">
              Quatro lançamentos, em <em>ordem</em>.
            </h2>
            <p className="mt-6 max-w-[26rem] text-slate">
              O tempo de cada etapa depende do caso. O que não muda é a ordem: primeiro entender, depois orientar.
            </p>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          <span className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-rule sm:left-[2.4rem]" aria-hidden="true" />
          <motion.span
            className="absolute bottom-6 left-[1.6rem] top-6 w-px origin-top bg-brick sm:left-[2.4rem]"
            style={{ scaleY: reduce ? 1 : scaleY }}
            aria-hidden="true"
          />
          {etapas.map((e, i) => (
            <li key={e.t} className="relative grid grid-cols-[3.2rem_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[4.8rem_1fr]">
              <span
                className="num relative z-10 flex h-[3.2rem] w-[3.2rem] items-center justify-center border border-ink bg-paper font-serif text-xl text-ink sm:h-[4.8rem] sm:w-[4.8rem] sm:text-3xl"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="border-b border-rule pb-8 pt-2 sm:pt-4">
                <h3 className="text-[1.5rem] sm:text-[1.85rem]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.t}
                </h3>
                <p className="mt-3 max-w-[34rem] text-ink-2">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Dúvidas */
const faq: { q: string; a: string }[] = [
  {
    q: 'Como agendar um atendimento?',
    a: 'Pelo WhatsApp, com os botões deste site, ou pelo formulário "Solicitar agendamento". A mensagem chega ao escritório, que confirma a disponibilidade de dia e horário.',
  },
  {
    q: 'O escritório atende empresas e pessoas físicas?',
    a: 'Sim. O atendimento é voltado a empresas, empresários e profissionais liberais, e também a pessoas físicas, inclusive trabalhadores, nas áreas de atuação descritas neste site.',
  },
  {
    q: 'Quais áreas o escritório atende?',
    a: 'Direito Tributário, Direito Empresarial e Direito do Trabalho. Se a sua dúvida for de outra área, vale perguntar no primeiro contato.',
  },
  {
    q: 'Como é o primeiro atendimento?',
    a: 'É uma conversa para entender a situação, ouvir suas dúvidas e explicar, em termos claros, como o assunto costuma ser tratado. A partir dela se define se e como seguir.',
  },
  {
    q: 'Que documentos costumam ser úteis?',
    a: 'De forma geral, os documentos ligados ao assunto: um contrato, uma notificação recebida, o contrato social da empresa ou documentos da relação de trabalho. Se não tiver tudo, não tem problema: no contato o escritório orienta o que separar.',
  },
  {
    q: 'Preciso explicar o caso por mensagem?',
    a: 'Não. Para agendar, basta o seu nome e a área do assunto. Os detalhes são tratados com calma no atendimento.',
  },
  {
    q: 'O atendimento é feito pelo próprio advogado?',
    a: 'Sim. O atendimento é feito diretamente por Vicente Loredo.',
  },
  {
    q: 'Quais são os horários?',
    a: 'De segunda a sexta-feira, das 9h às 18h. Sábado e domingo o escritório fica fechado. Os horários podem variar em feriados.',
  },
  {
    q: 'Onde fica o escritório?',
    a: `${enderecoLinha}.`,
  },
]

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-rule">
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={() => setOpen((v) => !v)}
          className="grid min-h-16 w-full cursor-pointer grid-cols-[2.5rem_1fr_1.5rem] items-center gap-x-3 py-4 text-left"
        >
          <span className="num text-sm text-brick" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-serif text-[1.2rem] leading-snug text-ink sm:text-[1.35rem]">{q}</span>
          <span className="relative h-4 w-4 justify-self-end" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
            <span
              className={`absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform duration-300 ${open ? 'scale-y-0' : ''}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <p className="max-w-[40rem] pb-6 pl-[3.25rem] pr-6 text-ink-2">{a}</p>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="py-20 sm:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <SectionHead n="§ 05" label="Dúvidas frequentes" />
            <h2 id="t-duvidas" className="text-[clamp(2rem,5vw,3.2rem)]">
              Perguntas <em>comuns</em>, respostas diretas.
            </h2>
            <p className="mt-6 text-slate">
              Respostas gerais. Para a sua situação, o caminho é a conversa.
            </p>
          </div>
        </div>
        <ul className="border-t-2 border-ink lg:col-span-8">
          {faq.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Contato */
function MapaLazy() {
  const [on, setOn] = useState(false)
  if (!CONFIG.mapsEmbed) return null
  return (
    <div className="relative aspect-[4/3] w-full border border-rule-strong bg-paper-2">
      {on ? (
        <iframe
          title={`Mapa: ${enderecoLinha}`}
          src={CONFIG.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
          {/* grade de régua, como papel milimetrado do livro-razão */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-rule) 1px, transparent 1px), linear-gradient(90deg, var(--color-rule) 1px, transparent 1px)',
              backgroundSize: '100% 2.5rem, 2.5rem 100%',
            }}
            aria-hidden="true"
          />
          <p className="label relative text-slate">Localização</p>
          <div className="relative">
            <p className="font-serif text-2xl text-ink sm:text-3xl">
              {CONFIG.endereco.logradouro}
              <br />
              <span className="text-slate">{CONFIG.endereco.complemento} · {CONFIG.endereco.bairro}</span>
            </p>
            <button type="button" onClick={() => setOn(true)} className="btn btn-line mt-5 bg-paper">
              Mostrar o mapa aqui
            </button>
            <p className="mt-2 text-xs text-slate">O mapa é carregado do Google somente após o clique.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function Contato() {
  const hoje = new Date().getDay()
  return (
    <section id="contato" aria-labelledby="t-contato" className="border-t border-rule bg-card py-20 sm:py-28">
      <div className="wrap">
        <SectionHead n="§ 06" label="Localização e contato" />
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="t-contato" className="text-[clamp(2rem,5vw,3.6rem)]">
              Venha nos <em>visitar</em>.
            </h2>
            <address className="mt-8 not-italic">
              <p className="font-serif text-[1.5rem] leading-snug text-ink">
                {CONFIG.endereco.logradouro}, {CONFIG.endereco.complemento}
              </p>
              <p className="mt-1 text-ink-2">
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                {CONFIG.endereco.cep && <span className="num"> · CEP {CONFIG.endereco.cep}</span>}
              </p>
            </address>

            <table className="mt-10 w-full max-w-[30rem] border-t-2 border-ink text-left">
              <caption className="label pb-3 text-left text-slate">Horário de atendimento</caption>
              <tbody>
                {CONFIG.horarios.map((h) => (
                  <tr key={h.dia} className={`border-b border-rule ${h.dia === hoje ? 'bg-paper-2/80' : ''}`}>
                    <th scope="row" className="py-2.5 pl-2 font-normal text-ink-2">
                      {h.nome}
                      {h.dia === hoje && <span className="label ml-2 !text-[0.62rem] text-brick">hoje</span>}
                    </th>
                    <td className="num py-2.5 pr-2 text-right text-ink">
                      {h.abre ? (
                        <>
                          {h.abre} – {h.pausa ? `${h.pausa.inicio} · ${h.pausa.fim} – ` : ''}
                          {h.fecha}
                        </>
                      ) : (
                        <span className="text-slate">Fechado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {CONFIG.avisoHorarios && <p className="mt-3 text-sm text-slate">{CONFIG.avisoHorarios}</p>}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {temWhats && (
                <a href={waLink(MSG_GERAL)} target="_blank" rel="noopener" className="btn btn-ink">
                  <WhatsIcon />
                  WhatsApp <span className="num font-normal">{CONFIG.whatsappExibicao}</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
              {CONFIG.maps && (
                <a href={CONFIG.maps} target="_blank" rel="noopener" className="btn btn-line">
                  Ver no Google Maps <ArrowIcon />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
              {CONFIG.telefone && (
                <a href={`tel:${CONFIG.telefone.replace(/\D/g, '')}`} className="btn btn-line">
                  Ligar
                </a>
              )}
            </div>
            <ul className="mt-6 space-y-2 text-[0.98rem]">
              {CONFIG.instagram && (
                <li>
                  <span className="label mr-3 text-slate">Instagram</span>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener" className="link">
                    {CONFIG.instagramUsuario}
                  </a>
                </li>
              )}
              {CONFIG.email && (
                <li>
                  <span className="label mr-3 text-slate">E-mail</span>
                  <a href={`mailto:${CONFIG.email}`} className="link">
                    {CONFIG.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-8 lg:col-span-6">
            {CONFIG.fotos.escritorio && (
              <figure>
                <img
                  src={CONFIG.fotos.escritorio}
                  alt={CONFIG.fotos.escritorioAlt}
                  width={739}
                  height={978}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[16/11] w-full object-cover object-[50%_40%] [filter:saturate(.8)]"
                />
                <figcaption className="mt-3 flex justify-between border-b border-rule pb-3 text-sm text-slate">
                  <span>Recepção do escritório</span>
                  <span className="num label">{CONFIG.endereco.complemento}</span>
                </figcaption>
              </figure>
            )}
            <MapaLazy />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CTA final */
export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="dark-zone relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="wrap relative">
        <SectionHead n="§ 08" label="Próximo passo" dark />
        <span className="mb-10 block h-[3px] w-24 bg-brick-soft" aria-hidden="true" />
        <h2 id="t-cta" className="max-w-[14ch] text-[clamp(2.4rem,7vw,5.4rem)] !text-paper">
          O primeiro passo é uma <em className="!text-brick-soft">conversa</em>.
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {temWhats && (
            <a href={waLink(MSG_GERAL)} target="_blank" rel="noopener" className="btn btn-paper">
              <WhatsIcon />
              Agendar pelo WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-line-light">
              Solicitar agendamento
            </a>
          )}
          {CONFIG.instagram && (
            <a href={CONFIG.instagram} target="_blank" rel="noopener" className="btn btn-line-light">
              Ver no Instagram <ArrowIcon />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </div>
        {/* linhas de régua em tijolo ao fundo */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-24 hidden space-y-6 sm:block" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-px bg-brick-soft/25" />
          ))}
        </div>
      </div>
    </section>
  )
}
