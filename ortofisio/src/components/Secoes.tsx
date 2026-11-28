import { useEffect, useId, useRef, useState } from 'react'
import { CONFIG, equipeVisivel, telLink, waLink } from '../config'
import { LinhaMovimento } from './LinhaMovimento'
import { IconeTelefone, IconeWhatsApp, Traco } from './icones'
import { Logo } from './Topo'

const hora = (h: string) => h.replace(':00', 'h').replace(/^0/, '')

/* ───────────────────────── HERO ───────────────────────── */
export function Hero() {
  return (
    <section id="topo" aria-labelledby="titulo-hero" className="relative overflow-hidden pt-36 md:pt-44">
      <LinhaMovimento className="pointer-events-none absolute -right-[2%] top-[52%] w-[104%] max-w-none md:right-0 md:top-[16%] md:w-[78%]" />

      <div className="relative mx-auto max-w-[86rem] px-5 md:px-10">
        <p className="rotulo">
          Fisioterapia e pilates <span aria-hidden="true">·</span>{' '}
          <span className="whitespace-nowrap">
            {CONFIG.cidade} - {CONFIG.uf}
          </span>
        </p>

        <h1 id="titulo-hero" className="titulo-hero mt-6 max-w-[11ch] md:mt-8">
          <span className="linha-mascara">
            <span>Cuidado</span>
          </span>
          <span className="linha-mascara">
            <span className="enfase" style={{ animationDelay: '0.08s' }}>
              individualizado
            </span>
          </span>
          <span className="linha-mascara">
            <span style={{ animationDelay: '0.16s' }}>para o seu movimento.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:items-end">
          <p className="max-w-[34ch] text-lg leading-relaxed text-tinta md:col-span-5 md:text-xl">
            Fisioterapia e pilates em {CONFIG.cidade}, com atendimento pensado para cada pessoa.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-7 md:justify-end">
            {CONFIG.whatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                <IconeWhatsApp />
                Agendar pelo WhatsApp
              </a>
            )}
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="btn btn-secundario bg-linho">
                Conhecer os atendimentos
              </a>
            )}
          </div>
        </div>

        {/* Rodapé do hero com dados reais da clínica */}
        <dl className="mt-16 grid gap-y-5 border-t border-ardosia/15 py-6 text-[0.95rem] sm:grid-cols-3 sm:gap-x-8 md:mt-24">
          <div>
            <dt className="rotulo">Endereço</dt>
            <dd className="mt-1 text-ardosia">
              {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
            </dd>
          </div>
          {CONFIG.horarios.length > 0 && (
            <div>
              <dt className="rotulo">Horários</dt>
              <dd className="tabular mt-1 text-ardosia">
                {CONFIG.horarios.map((h) => `${h.rotulo.replace('Segunda a quinta', 'Seg. a qui.').replace('Sexta', 'Sex.')} ${hora(h.abre)} às ${hora(h.fecha)}`).join('  /  ')}
              </dd>
            </div>
          )}
          {CONFIG.telefoneExibicao && (
            <div>
              <dt className="rotulo">Telefone</dt>
              <dd className="tabular mt-1">
                <a href={telLink()} className="link-fino text-ardosia">
                  {CONFIG.telefoneExibicao}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}

/* ───────────── CUIDADO INDIVIDUALIZADO (editorial) ───────────── */
export function Cuidado() {
  const notas = [
    ['Avaliação individual', 'Antes de qualquer plano, cada pessoa passa por uma avaliação.'],
    ['Indicação profissional', 'O que é indicado para você depende dessa avaliação, e não de um protocolo igual para todos.'],
    ['Explicação clara', 'Você sabe o que está sendo feito, com que objetivo e com que frequência.'],
  ]
  return (
    <section aria-labelledby="titulo-cuidado" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-10 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <h2 id="titulo-cuidado" className="rotulo md:col-span-3 md:pt-3">
          Cuidado individualizado, em poucas palavras
        </h2>
        <div className="md:col-span-9">
          <p className="font-display text-[clamp(1.7rem,3.3vw,3rem)] font-light leading-[1.12] tracking-[-0.022em] text-ardosia">
            Cada pessoa chega com uma história, uma rotina e um jeito de se mover. Por isso, o atendimento na OrtoFisio
            começa <span className="enfase">ouvindo</span>, e só depois decide o próximo passo.
          </p>
          <dl className="mt-14 md:ml-[25%]">
            {notas.map(([t, d]) => (
              <div key={t} className="grid gap-1 border-t border-ardosia/15 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="font-semibold text-ardosia">{t}</dt>
                <dd className="max-w-[48ch] text-tinta">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ───────────── FISIOTERAPIA E PILATES (dois blocos assimétricos) ───────────── */
export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="pb-24 md:pb-36">
      <h2 id="titulo-atendimentos" className="sr-only">
        Atendimentos
      </h2>
      {lista.map((a, i) => {
        const par = i % 2 === 1
        return (
          <article
            key={a.id}
            id={a.id}
            aria-labelledby={`titulo-${a.id}`}
            className={par ? 'relative mt-6 md:mt-0 md:pl-[18%]' : 'relative md:pr-[10%]'}
          >
            <div
              className={
                par
                  ? 'rounded-tl-[3rem] bg-salvia py-16 md:rounded-tl-[6rem] md:py-24'
                  : 'border-t border-ardosia/15 py-16 md:py-24'
              }
            >
              <div className={`mx-auto grid max-w-[86rem] gap-8 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10 ${par ? 'md:pr-10' : ''}`}>
                <h3
                  id={`titulo-${a.id}`}
                  className={`font-display font-light leading-[0.9] tracking-[-0.045em] text-ardosia text-[clamp(3.4rem,11vw,10rem)] md:col-span-12 ${
                    par ? 'md:text-right' : ''
                  }`}
                >
                  {a.nome}
                </h3>
                <div className={`md:col-span-6 ${par ? 'md:col-start-1' : 'md:col-start-7'}`}>
                  {a.descricao.map((p) => (
                    <p key={p} className="mb-4 max-w-[46ch] text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {a.observacao && <p className="max-w-[46ch] text-[0.95rem] text-salvia-escuro">{a.observacao}</p>}
                  {CONFIG.whatsapp && (
                    <a
                      href={waLink(a.mensagemWhatsApp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secundario mt-8"
                    >
                      <IconeWhatsApp />
                      Falar sobre {a.nome.toLowerCase()} pelo WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

/* ───────────── EQUIPE (só com nome + registro, e flag ligada) ───────────── */
export function Equipe() {
  const pessoas = equipeVisivel()
  if (!pessoas || !pessoas.length) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="pb-24 md:pb-36">
      <div className="mx-auto max-w-[86rem] px-5 md:px-10">
        <h2 id="titulo-equipe" className="titulo-secao">
          Quem <span className="enfase">atende</span>
        </h2>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {pessoas.map((p) => (
            <li key={p.registro} className="border-t border-ardosia/15 pt-6">
              {p.foto && (
                <img
                  src={p.foto}
                  alt={`Foto de ${p.nome}`}
                  loading="lazy"
                  className="mb-6 aspect-[4/5] w-full rounded-tl-[2.5rem] object-cover"
                />
              )}
              <p className="font-display text-2xl text-ardosia">{p.nome}</p>
              {p.profissao && <p className="mt-1">{p.profissao}</p>}
              <p className="tabular mt-1 text-[0.95rem] text-salvia-escuro">{p.registro}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── FOTOS (aparecem só quando existirem no config) ───────────── */
export function Fotos() {
  if (!CONFIG.fotos.length) return null
  return (
    <section aria-label="Fotos da clínica" className="pb-24 md:pb-36">
      <div className="mx-auto grid max-w-[86rem] gap-4 px-5 sm:grid-cols-2 md:px-10">
        {CONFIG.fotos.map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className={`w-full object-cover ${i === 0 ? 'aspect-[4/3] rounded-tl-[3rem] sm:row-span-2 sm:aspect-auto sm:h-full' : 'aspect-[4/3]'}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ───────────── COMO FUNCIONA (título fixo + linha do tempo com progresso) ───────────── */
// Adaptado do componente "Scroll animated timeline" (21st.dev): a linha de progresso
// agora usa transform (scaleY) em vez de height, só calcula enquanto a seção está
// visível e não esmaece o conteúdo.
export function ComoFunciona() {
  const listaRef = useRef<HTMLOListElement>(null)
  const barraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lista = listaRef.current
    const barra = barraRef.current
    if (!lista || !barra) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      barra.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    const atualizar = () => {
      raf = 0
      const r = lista.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.6 - r.top) / r.height))
      barra.style.transform = `scaleY(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(atualizar)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true })
        atualizar()
      } else window.removeEventListener('scroll', onScroll)
    })
    io.observe(lista)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!CONFIG.etapas.length) return null
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="bg-papel py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-14 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-40">
            <p className="rotulo">Como funciona</p>
            <h2 id="titulo-como" className="titulo-secao mt-5">
              Do primeiro contato ao <span className="enfase">acompanhamento</span>.
            </h2>
            {CONFIG.avisoEtapas && <p className="mt-6 text-salvia-escuro">{CONFIG.avisoEtapas}</p>}
          </div>
        </div>
        <ol ref={listaRef} className="relative md:col-span-6 md:col-start-7">
          <div aria-hidden="true" className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-ardosia/15 md:left-[1.6rem]" />
          <div
            ref={barraRef}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.1rem] top-6 w-px origin-top bg-teal md:left-[1.6rem]"
            style={{ transform: 'scaleY(0)' }}
          />
          {CONFIG.etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[2.2rem_1fr] gap-6 pb-14 last:pb-0 md:grid-cols-[3.2rem_1fr] md:gap-10 md:pb-20">
              <span
                aria-hidden="true"
                className="tabular relative z-10 bg-papel pb-2 text-center font-display text-[2.6rem] font-light leading-none text-teal md:text-[3.6rem]"
              >
                {i + 1}
              </span>
              <div className="pt-1 md:pt-3">
                <h3 className="font-display text-[1.6rem] font-normal leading-tight tracking-[-0.015em] md:text-[2rem]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.titulo}
                </h3>
                <p className="mt-3 max-w-[42ch]">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ───────────── DÚVIDAS FREQUENTES (acordeão acessível) ───────────── */
function ItemFaq({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-ardosia/15">
      <h3 className="font-sans text-inherit">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.1rem] font-semibold text-ardosia md:text-[1.2rem]"
        >
          {pergunta}
          <svg className="acordeao-marca h-5 w-5 shrink-0 text-teal-forte" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="acordeao-painel" data-aberto={aberto} inert={!aberto}>
        <div>
          <p className="max-w-[62ch] pb-6 pr-10">{resposta}</p>
        </div>
      </div>
    </li>
  )
}

export function Faq() {
  if (!CONFIG.faq.length) return null
  return (
    <section id="duvidas" aria-labelledby="titulo-faq" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-12 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <div className="md:col-span-4">
          <h2 id="titulo-faq" className="titulo-secao">
            Dúvidas <span className="enfase">frequentes</span>
          </h2>
          <p className="mt-6 max-w-[32ch] text-salvia-escuro">
            Respostas gerais. O que vale para o seu caso é conversado na avaliação.
          </p>
        </div>
        <ul className="border-t border-ardosia/15 md:col-span-8">
          {CONFIG.faq.map((f) => (
            <ItemFaq key={f.pergunta} {...f} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── LOCALIZAÇÃO E CONTATO ───────────── */
export function Contato() {
  const e = CONFIG.endereco
  const canais = [
    CONFIG.whatsapp && { rotulo: 'WhatsApp', valor: CONFIG.whatsappExibicao, href: waLink(), externo: true },
    CONFIG.telefone && { rotulo: 'Telefone', valor: CONFIG.telefoneExibicao, href: telLink(), externo: false },
    CONFIG.email && { rotulo: 'E-mail', valor: CONFIG.email, href: `mailto:${CONFIG.email}`, externo: false },
    CONFIG.instagram.url && { rotulo: 'Instagram', valor: CONFIG.instagram.usuario, href: CONFIG.instagram.url, externo: true },
  ].filter(Boolean) as { rotulo: string; valor: string; href: string; externo: boolean }[]

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="border-t border-ardosia/15 py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-14 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <div className="md:col-span-5">
          <p className="rotulo">Localização e contato</p>
          <h2 id="titulo-contato" className="titulo-secao mt-5">
            Venha nos <span className="enfase">visitar</span>.
          </h2>
          <address className="mt-10 font-display text-[1.6rem] font-light not-italic leading-snug tracking-[-0.01em] text-ardosia">
            {e.rua} <br />
            {e.bairro}, {e.cidade} - {e.uf} <br />
            <span className="tabular">CEP {e.cep}</span>
          </address>

          {CONFIG.horarios.length > 0 && (
            <table className="tabular mt-10 w-full max-w-sm text-left">
              <caption className="rotulo mb-3 text-left">Horários</caption>
              <tbody>
                {CONFIG.horarios.map((h) => (
                  <tr key={h.rotulo} className="border-t border-ardosia/15">
                    <th scope="row" className="py-3 font-normal">
                      {h.rotulo}
                    </th>
                    <td className="py-3 text-right font-semibold text-ardosia">
                      {h.abre} às {h.fecha}
                    </td>
                  </tr>
                ))}
                {CONFIG.fechado && (
                  <tr className="border-y border-ardosia/15">
                    <th scope="row" className="py-3 font-normal">
                      {CONFIG.fechado}
                    </th>
                    <td className="py-3 text-right text-salvia-escuro">Fechado</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {CONFIG.avisoHorarios && <p className="mt-3 text-[0.95rem] text-salvia-escuro">{CONFIG.avisoHorarios}</p>}
        </div>

        <div className="md:col-span-7">
          {e.mapaEmbed && (
            <div className="overflow-hidden rounded-tr-[3rem] border border-ardosia/15 bg-salvia md:rounded-tr-[5rem]">
              <iframe
                title={`Mapa: ${e.rua}, ${e.bairro}, ${e.cidade}`}
                src={e.mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[4/3] w-full md:aspect-[16/11]"
              />
            </div>
          )}
          {e.mapsUrl && (
            <a href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secundario mt-6">
              Ver no Google Maps
            </a>
          )}

          <ul className="mt-12 border-t border-ardosia/15">
            {canais.map((c) => (
              <li key={c.rotulo} className="border-b border-ardosia/15">
                <a
                  href={c.href}
                  {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4"
                >
                  <span className="rotulo">{c.rotulo}</span>
                  <span className="tabular break-all text-lg text-ardosia underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-current">
                    {c.valor}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ───────────── CTA FINAL (seção escura com a linha) ───────────── */
export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="bg-escuro relative overflow-hidden bg-ardosia py-28 text-linho md:py-40">
      <LinhaMovimento
        animar={false}
        cor="var(--color-teal-claro)"
        className="pointer-events-none absolute -right-[50%] top-[58%] w-[150%] max-w-none opacity-50 md:-right-[4%] md:top-[6%] md:w-[58%]"
      />
      <div className="relative mx-auto max-w-[86rem] px-5 md:px-10">
        <h2 id="titulo-cta" className="titulo-hero max-w-[12ch] !text-linho">
          O primeiro passo é uma <span className="enfase">conversa</span>.
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {CONFIG.whatsapp && (
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
              <IconeWhatsApp />
              Agendar pelo WhatsApp
              <Traco />
            </a>
          )}
          {CONFIG.instagram.url && (
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
              Ver no Instagram
            </a>
          )}
          {CONFIG.secoes.agendar && CONFIG.whatsapp && (
            <a href="#agendar" className="btn btn-secundario">
              Preencher solicitação
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/* ───────────── RODAPÉ ───────────── */
export function Rodape() {
  const e = CONFIG.endereco
  return (
    <footer className="pb-28 pt-20 md:pb-16">
      <div className="mx-auto grid max-w-[86rem] gap-12 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <div className="md:col-span-4">
          <Logo className="h-28 w-auto" />
        </div>
        <div className="text-[0.95rem] md:col-span-4">
          <p className="rotulo">Endereço</p>
          <p className="mt-2">
            {e.rua} - {e.bairro}
            <br />
            {e.cidade} - {e.uf}, <span className="tabular">CEP {e.cep}</span>
          </p>
        </div>
        <div className="text-[0.95rem] md:col-span-4">
          <p className="rotulo">Contato</p>
          <ul className="tabular mt-2 space-y-1">
            {CONFIG.whatsapp && (
              <li>
                WhatsApp{' '}
                <a className="link-fino" href={waLink()} target="_blank" rel="noopener noreferrer">
                  {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.telefone && (
              <li>
                Telefone{' '}
                <a className="link-fino" href={telLink()}>
                  {CONFIG.telefoneExibicao}
                </a>
              </li>
            )}
            {CONFIG.email && (
              <li className="break-all">
                <a className="link-fino" href={`mailto:${CONFIG.email}`}>
                  {CONFIG.email}
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a className="link-fino" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-4 border-t border-ardosia/15 pt-6 text-[0.875rem] text-salvia-escuro md:col-span-12 md:flex-row md:justify-between">
          <p className="max-w-[70ch]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação
            profissional.
          </p>
          <a href="/privacidade.html" className="link-fino shrink-0">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ───────────── CONVERSÃO FIXA: barra no celular + botão flutuante ───────────── */
export function AcoesFixas() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!CONFIG.whatsapp) return null
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_auto] gap-2 border-t border-ardosia/10 bg-linho/95 px-3 py-2.5 backdrop-blur-sm md:hidden"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario !min-h-12">
          <IconeWhatsApp />
          WhatsApp
        </a>
        {CONFIG.telefone && (
          <a href={telLink()} className="btn btn-secundario !min-h-12 !px-5">
            <IconeTelefone />
            Ligar
          </a>
        )}
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed bottom-6 right-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-teal-forte text-white shadow-[0_6px_20px_-8px_rgba(24,75,74,0.6)] transition-[opacity,transform] duration-300 hover:bg-ardosia md:inline-flex ${
          visivel ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <IconeWhatsApp className="h-6 w-6" />
      </a>
    </>
  )
}
