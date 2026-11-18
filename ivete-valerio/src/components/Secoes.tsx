import { useEffect, useId, useRef, useState } from 'react'
import { CONFIG, diasAbertos, enderecoLinha, faixaHoras, msgServico } from '../config'
import { Acende, BotaoInstagram, BotaoWhats, Revela } from './base'

const larg = 'mx-auto w-full max-w-[1200px] px-5 md:px-8'

/* ---------------------------------------------------------------- HERO */
export function Hero() {
  const f = CONFIG.fotos.retrato
  return (
    <section id="inicio" className="relative pt-[calc(var(--faixa)+var(--header)+28px)] md:pt-[calc(var(--faixa)+var(--header)+56px)]">
      <div className={`${larg} conteudo grid gap-12 pb-20 md:grid-cols-12 md:gap-8 md:pb-28`}>
        <div className={f ? 'md:col-span-7 md:pt-16' : 'md:col-span-10 md:pt-16'}>
          <p className="rotulo aparece text-argila" style={{ animationDelay: '100ms' }}>
            Estética · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          </p>
          <h1 className="display mt-6 text-[46px] sm:text-[64px] lg:text-[88px]">
            <Revela texto="Um horário só *seu*, no Centro de Varginha." atraso={200} />
          </h1>
          <p className="aparece mt-8 max-w-[34ch] text-[19px] leading-relaxed md:text-[21px]" style={{ animationDelay: '900ms' }}>
            Massagens, depilação, design de sobrancelha e estética facial, com hora marcada.
          </p>
          <div className="aparece mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '1100ms' }}>
            <BotaoWhats />
            {CONFIG.secoes.servicos && (
              <a href="#servicos" className="btn btn-linha">
                Ver os serviços
              </a>
            )}
          </div>
        </div>
        {f && (
          <figure className="relative md:col-span-5 md:mt-24 md:pl-6">
            <div data-linha="sobrancelha" className="relative mx-auto w-[86%] max-w-[440px] md:mr-0 md:w-full">
              <picture>
                {f.webpPequena && <source media="(max-width: 767px)" srcSet={f.webpPequena} type="image/webp" />}
                {f.webp && <source srcSet={f.webp} type="image/webp" />}
                <img
                  src={f.src}
                  alt={f.alt}
                  width={f.largura}
                  height={f.altura}
                  {...{ fetchpriority: 'high' }}
                  className="block aspect-[4/5] w-full rounded-[var(--radius-suave)] object-cover"
                />
              </picture>
            </div>
            <figcaption className="mx-auto mt-4 flex w-[86%] max-w-[440px] items-baseline justify-between gap-4 border-t fio pt-3 text-[14px] md:mr-0 md:w-full">
              <span className="serif text-[19px]">{CONFIG.nomePessoa}</span>
              <span>{CONFIG.titulo}</span>
            </figcaption>
          </figure>
        )}
      </div>
      {!f && <div data-linha="sobrancelha" className="absolute right-[12%] top-[40%] h-40 w-56" aria-hidden="true" />}
    </section>
  )
}

/* ---------------------------------------------------------------- SERVIÇOS */
const fundos = [
  { bg: 'bg-cru', txt: '', escuro: false, desloc: '' },
  { bg: 'bg-areia', txt: '', escuro: false, desloc: 'md:ml-16 lg:ml-24' },
  { bg: 'bg-argila', txt: 'text-cru', escuro: true, desloc: 'md:-mr-8 lg:-mr-16' },
  { bg: 'bg-cru-2', txt: '', escuro: false, desloc: 'md:mr-20' },
]

export function Servicos() {
  const [aberto, setAberto] = useState(0)
  const id = useId()
  const lista = CONFIG.servicos.filter((s) => s.nome && s.itens.length)
  if (!lista.length) return null
  return (
    <section id="servicos" data-linha-borda className="relative pb-24 pt-16 md:pb-32 md:pt-20" aria-labelledby="t-servicos">
      <div className={`${larg} conteudo grid gap-10 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-4">
          <div className="md:sticky md:top-[calc(var(--faixa)+var(--header)+40px)]">
            <p className="rotulo text-argila">Serviços</p>
            <h2 id="t-servicos" className="display mt-5 text-[40px] md:text-[54px]">
              Quatro frentes, uma <em>mão</em>.
            </h2>
            <p className="mt-6 max-w-[30ch] text-[17px]">
              Toque em cada uma para ver a lista. Tudo com hora marcada.
            </p>
          </div>
        </div>
        <ol className="md:col-span-8">
          {lista.map((s, i) => {
            const estilo = fundos[i % fundos.length]
            const open = aberto === i
            const direita = i % 2 === 1
            return (
              <li
                key={s.id}
                className={`${estilo.bg} ${estilo.txt} ${estilo.desloc} ${estilo.escuro ? 'sobre-escuro' : ''} rounded-[var(--radius-suave)] ${
                  i > 0 ? 'mt-3' : ''
                } ${estilo.bg === 'bg-cru' ? 'border fio' : ''}`}
                {...(estilo.escuro ? { 'data-linha-escuro': '' } : {})}
              >
                <h3>
                  <button
                    type="button"
                    id={`${id}-b${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-p${i}`}
                    onClick={() => setAberto(open ? -1 : i)}
                    className={`group flex w-full items-baseline gap-5 px-5 py-7 text-left md:px-9 md:py-9 ${
                      direita ? 'md:flex-row-reverse md:text-right' : ''
                    }`}
                  >
                    <Acende className="serif text-[22px] md:text-[28px]">{String(i + 1).padStart(2, '0')}</Acende>
                    <span className="display flex-1 text-[34px] transition-transform duration-300 sm:text-[44px] md:text-[56px]">
                      {s.nome}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`self-center text-[28px] leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} className="painel" data-aberto={open}>
                  <div>
                    <div className={`grid gap-8 px-5 pb-9 md:grid-cols-[1fr_1.2fr] md:px-9 md:pb-11 ${direita ? 'md:text-right' : ''}`}>
                      <div className={direita ? 'md:order-2' : ''}>
                        <p className="max-w-[34ch] text-[18px] leading-relaxed md:ml-0">{s.frase}</p>
                        <BotaoWhats
                          className="mt-6"
                          mensagem={msgServico(s.nome)}
                          rotuloAcessivel={`Marcar horário para ${s.nome}`}
                        />
                      </div>
                      <ul className={`border-t ${estilo.escuro ? 'border-cru/30' : 'fio'} ${direita ? 'md:order-1' : ''}`}>
                        {s.itens.map((it) => (
                          <li
                            key={it}
                            className={`serif border-b py-3 text-[20px] md:text-[22px] ${estilo.escuro ? 'border-cru/30' : 'fio'}`}
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- HORA MARCADA */
export function HoraMarcada() {
  const e = CONFIG.endereco
  const linhas = [
    CONFIG.horarios.somenteHoraMarcada && {
      t: 'Somente com hora marcada.',
      d: 'Você chega no horário combinado pelo WhatsApp.',
    },
    diasAbertos().length > 0 && {
      t: 'De quarta a sábado.',
      d: `Domingo, segunda e terça não há atendimento. ${CONFIG.horarios.observacao}`,
    },
    { t: `No ${e.bairro} de ${e.cidade}.`, d: `${e.logradouro}.` },
  ].filter(Boolean) as { t: string; d: string }[]
  return (
    <section
      data-linha-borda
      data-linha-escuro
      className="sobre-escuro relative bg-cacau py-24 text-cru md:py-32"
      aria-labelledby="t-hora"
    >
      <div className={`${larg} conteudo`}>
        <h2 id="t-hora" className="rotulo text-argila-clara">
          Como funciona o atendimento
        </h2>
        <ul className="mt-10 border-t border-cru/25">
          {linhas.map((l, i) => (
            <li
              key={l.t}
              className={`grid gap-3 border-b border-cru/25 py-9 md:grid-cols-12 md:items-end md:gap-8 md:py-12 ${
                i === 1 ? 'md:pl-[8%]' : i === 2 ? 'md:pl-[16%]' : ''
              }`}
            >
              <p className="display text-[38px] sm:text-[52px] md:col-span-8 lg:text-[72px]">{l.t}</p>
              <p className="max-w-[36ch] text-[17px] text-cru/85 md:col-span-4 md:pb-2">{l.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- SOBRE */
export function Sobre() {
  const s = CONFIG.sobre
  if (!s.nome) return null
  return (
    <section id="sobre" data-linha-borda className="relative py-24 md:py-36" aria-labelledby="t-sobre">
      <div className={`${larg} conteudo`}>
        <p className="rotulo text-argila">Sobre</p>
        <h2 id="t-sobre" className="display mt-6 text-[64px] leading-[0.9] sm:text-[96px] lg:text-[148px]">
          {s.nome.split(' ')[0]}
          <br />
          <span className="md:pl-[18%]">
            <em>{s.nome.split(' ').slice(1).join(' ')}</em>
          </span>
        </h2>
        <div className="mt-12 grid gap-4 border-t fio pt-6 md:ml-[36%] md:grid-cols-2 md:gap-8">
          {s.titulo && <p className="serif text-[26px]">{s.titulo}</p>}
          {s.frase && <p className="text-[18px]">{s.frase}</p>}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- COMO AGENDAR */
const ETAPAS = [
  { t: 'Você envia uma mensagem pelo WhatsApp.', d: 'Direto, ou pelo formulário desta página, que monta a mensagem.' },
  { t: 'Vocês combinam o dia e o período.', d: 'O atendimento é de quarta a sábado.' },
  { t: 'Você é atendida com hora marcada.', d: `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.bairro}.` },
]

export function ComoAgendar() {
  const ref = useRef<HTMLOListElement>(null)
  const barra = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ol = ref.current
    const b = barra.current
    if (!ol || !b) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      b.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    let ativo = false
    const upd = () => {
      const r = ol.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height))
      b.style.transform = `scaleY(${p})`
    }
    const on = () => {
      if (!ativo) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(upd)
    }
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (ativo) upd()
    })
    io.observe(ol)
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <section id="como-agendar" data-linha-borda className="relative bg-areia py-24 md:py-32" aria-labelledby="t-agendar">
      <div className={`${larg} conteudo grid gap-12 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-5">
          <p className="rotulo text-cacau">Como agendar</p>
          <h2 id="t-agendar" className="display mt-5 text-[40px] md:text-[54px]">
            Três passos, <em>uma</em> conversa.
          </h2>
        </div>
        <ol ref={ref} className="relative md:col-span-7">
          <div className="absolute bottom-2 left-[27px] top-2 w-px bg-cacau/20 md:left-[39px]" aria-hidden="true" />
          <div
            ref={barra}
            className="absolute bottom-2 left-[27px] top-2 w-px origin-top bg-argila md:left-[39px]"
            style={{ transform: 'scaleY(0)' }}
            aria-hidden="true"
          />
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="relative grid grid-cols-[56px_1fr] gap-5 pb-14 last:pb-0 md:grid-cols-[80px_1fr] md:gap-8">
              <span className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-full bg-areia md:h-20 md:w-20">
                <Acende className="display text-[44px] md:text-[64px]">{i + 1}</Acende>
              </span>
              <div className="pt-2 md:pt-4">
                <h3 className="serif text-[26px] leading-tight md:text-[32px]">{e.t}</h3>
                <p className="mt-3 max-w-[40ch] text-[17px]">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- DÚVIDAS */
export function Duvidas() {
  if (!CONFIG.faq.length) return null
  return (
    <section id="duvidas" data-linha-borda className="relative py-24 md:py-32" aria-labelledby="t-duvidas">
      <div className={`${larg} conteudo grid gap-10 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-4">
          <p className="rotulo text-argila">Dúvidas frequentes</p>
          <h2 id="t-duvidas" className="display mt-5 text-[40px] md:text-[54px]">
            Antes de <em>marcar</em>.
          </h2>
        </div>
        <div className="border-t fio md:col-span-8">
          {CONFIG.faq.map((q) => (
            <details key={q.p} className="duvida border-b fio">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-5">
                <h3 className="serif text-[21px] leading-snug md:text-[25px]">{q.p}</h3>
                <span className="sinal shrink-0 text-[26px] leading-none text-argila" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-[58ch] pb-6 pr-10 text-[17px]">{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CONTATO */
export function Contato() {
  const e = CONFIG.endereco
  return (
    <section id="contato" data-linha-borda className="relative bg-cru-2 py-24 md:py-32" aria-labelledby="t-contato">
      <div className={`${larg} conteudo grid gap-12 md:grid-cols-12 md:gap-10`}>
        <div className="md:col-span-6">
          <p className="rotulo text-argila">Localização e contato</p>
          <h2 id="t-contato" className="display mt-5 text-[40px] md:text-[54px]">
            Venha nos <em>visitar</em>.
          </h2>
          <address className="serif mt-8 text-[24px] not-italic leading-snug md:text-[28px]">
            {e.logradouro}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            <span className="num">CEP {e.cep}</span>
          </address>
          <h3 className="rotulo mt-10 text-cacau">Dias de atendimento</h3>
          <dl className="mt-4 border-t fio text-[16px]">
            {CONFIG.horarios.dias.map((d) => (
              <div key={d.nome} className="flex justify-between gap-4 border-b fio py-2.5">
                <dt className={d.aberto ? '' : 'text-cacau/70'}>{d.nome}</dt>
                <dd className={d.aberto ? 'font-semibold' : 'text-cacau/70'}>
                  {d.aberto ? faixaHoras(d) || 'Com hora marcada' : 'Fechado'}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[15px]">
            Atendimento somente com hora marcada. {CONFIG.horarios.observacao}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWhats texto="Marcar pelo WhatsApp" />
            <a href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-linha" aria-label="Como chegar (abre o Google Maps em nova aba)">
              Como chegar
            </a>
            <BotaoInstagram />
          </div>
        </div>
        <div className="md:col-span-6 md:pt-24">
          <iframe
            title={`Mapa: ${enderecoLinha()}`}
            src={CONFIG.mapaEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/5] w-full rounded-[var(--radius-suave)] border fio bg-areia md:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CTA FINAL */
export function CtaFinal() {
  return (
    <section
      data-linha-borda
      data-linha-escuro
      className="sobre-escuro relative overflow-hidden bg-cacau pb-44 pt-24 text-cru md:py-36"
      aria-labelledby="t-cta"
    >
      <div className={`${larg} conteudo grid gap-10 md:grid-cols-12`}>
        <h2 id="t-cta" className="display text-[44px] sm:text-[60px] md:col-span-9 lg:text-[84px]">
          Seu horário está a uma mensagem de <em>distância</em>.
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row md:col-span-12">
          <BotaoWhats />
          <BotaoInstagram />
        </div>
      </div>
      <div
        data-linha="laco"
        className="absolute bottom-[72px] right-[42%] h-2 w-2 md:bottom-[30%] md:right-[16%]"
        aria-hidden="true"
      />
    </section>
  )
}
