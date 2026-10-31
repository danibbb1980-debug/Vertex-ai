import { useEffect, useId, useState } from 'react'
import { CONFIG, enderecoLinha, horariosResumo, linkWhats, secaoAtiva } from '../config'
import { AnelDourado, Botao, Marca, Reveal, Titulo } from './ui'
import { IconeInstagram, IconeMais, IconePin, IconeRelogio, IconeSeta, IconeWhats } from './Icones'

/* ============================== FAQ ============================== */

/** Acordeão acessível: botão com aria-expanded + região. Só opacity/transform na animação. */
function ItemFaq({ pergunta, resposta, i }: { pergunta: string; resposta: string; i: number }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          id={`${id}-b`}
          onClick={() => setAberto((v) => !v)}
          className="group flex min-h-16 w-full items-center gap-5 py-5 text-left"
        >
          <span aria-hidden className="w-7 shrink-0 font-serif text-sm italic text-gold-deep">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex-1 font-serif text-[1.25rem] font-[400] leading-snug text-text transition-colors group-hover:text-gold-deep sm:text-[1.4rem]">
            {pergunta}
          </span>
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,border-color,background-color] duration-500 ease-out-soft ${
              aberto ? 'rotate-45 border-gold bg-gold/15' : 'border-line group-hover:border-gold'
            }`}
          >
            <IconeMais className="size-4 text-text" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-b`}
        hidden={!aberto}
        className="pb-7 pl-12 pr-2 sm:pr-16"
      >
        <p className="animate-[faq-in_.5s_cubic-bezier(.22,1,.36,1)] text-[1.02rem] leading-relaxed text-muted motion-reduce:animate-none">
          {resposta}
        </p>
      </div>
    </li>
  )
}

export function Faq() {
  if (!CONFIG.faq.length) return null
  return (
    <section id="duvidas" aria-labelledby="t-faq" className="bg-ivory py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <Titulo id="t-faq" rotulo="Dúvidas frequentes" texto="Perguntas que costumam *chegar* antes da consulta." />
          <p className="mt-6 max-w-sm text-[1.05rem] text-muted">Não encontrou a sua? Pergunte pelo WhatsApp.</p>
          <Botao href={linkWhats()} externo variante="contorno-escuro" className="mt-6">
            <IconeWhats className="size-5" />
            Enviar uma pergunta
          </Botao>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="border-t border-line">
            {CONFIG.faq.map((f, i) => (
              <ItemFaq key={f.pergunta} {...f} i={i} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================== LOCALIZAÇÃO E CONTATO ============================== */

function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(enderecoLinha())}&output=embed`
  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-line bg-ink lg:min-h-full">
      {carregar ? (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="on-dark absolute inset-0 grid place-items-center p-8 text-center">
          <div className="grid-fina absolute inset-0 opacity-70" aria-hidden />
          <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 size-full text-gold/30" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
            <path d="M-20 210C70 190 120 120 210 130s160 60 230 20" strokeWidth="10" opacity=".35" />
            <path d="M120 -10 160 320M300 -10 260 320" strokeWidth="5" opacity=".3" />
            <path d="M-20 80h440" strokeWidth="3" opacity=".25" />
          </svg>
          <div className="relative">
            <span className="relative mx-auto grid size-20 place-items-center">
              <AnelDourado className="absolute inset-0 size-full" aneisInternos={false} />
              <IconePin className="size-8 text-gold-soft" />
            </span>
            <p className="mt-5 font-serif text-2xl text-ivory">{CONFIG.endereco.bairro}</p>
            <p className="text-ivory/70">
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setCarregar(true)}
                className="inline-flex min-h-12 items-center rounded-full border border-gold/55 px-6 text-[0.95rem] font-semibold text-ivory transition-colors hover:border-gold-soft hover:bg-ivory/5"
              >
                Mostrar mapa aqui
              </button>
            </div>
            <p className="mt-3 text-xs text-ivory/65">O mapa do Google é carregado apenas se você pedir.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function Contato() {
  const horarios = horariosResumo()
  return (
    <section id="contato" aria-labelledby="t-contato" className="bg-sand py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <Titulo id="t-contato" rotulo="Localização e contato" texto="Venha nos *visitar*." />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="rounded-[1.5rem] border border-line bg-ivory p-7 sm:p-9">
            <div className="flex gap-4">
              <IconePin className="mt-1 size-6 shrink-0 text-gold-deep" />
              <div>
                <h3 className="eyebrow text-gold-deep">Endereço</h3>
                <address className="mt-2 not-italic text-[1.05rem] leading-relaxed text-text">
                  {CONFIG.endereco.rua}
                  <br />
                  {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                  <br />
                  CEP {CONFIG.endereco.cep}
                </address>
                <a
                  href={CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-12 items-center gap-2 font-semibold text-gold-deep underline decoration-gold/50 underline-offset-[6px] hover:text-ink"
                >
                  Como chegar
                  <IconeSeta className="size-4" />
                  <span className="sr-only"> (abre o Google Maps em nova aba)</span>
                </a>
              </div>
            </div>

            {horarios.length > 0 && (
              <div className="mt-8 flex gap-4 border-t border-line pt-8">
                <IconeRelogio className="mt-1 size-6 shrink-0 text-gold-deep" />
                <div className="flex-1">
                  <h3 className="eyebrow text-gold-deep">Horários</h3>
                  <dl className="mt-3 divide-y divide-line/70">
                    {horarios.map((h) => (
                      <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 py-2.5">
                        <dt className="text-text">{h.dias}</dt>
                        <dd className={h.horas === 'Fechado' ? 'text-muted' : 'font-semibold text-text'}>{h.horas}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-muted">
                    Atendimento com hora marcada. {CONFIG.avisoHorarios}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row lg:flex-col xl:flex-row">
              <Botao href={linkWhats()} externo variante="escuro">
                <IconeWhats className="size-5 text-gold-soft" />
                WhatsApp {CONFIG.telefoneExibicao}
              </Botao>
              <Botao href={CONFIG.instagram} externo variante="contorno-escuro">
                <IconeInstagram className="size-5" />
                {CONFIG.instagramUsuario}
              </Botao>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="min-h-[22rem]">
            <Mapa />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================== CTA FINAL ============================== */

export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="on-dark relative overflow-hidden bg-ink py-24 text-ivory sm:py-32">
      <div className="filete absolute inset-x-0 top-0" />
      <div className="container-site flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow text-gold-soft">Avaliação com hora marcada</p>
          <h2 id="t-cta" className="mt-5 text-[2.4rem] text-ivory sm:text-6xl">
            Sua avaliação é o primeiro <em className="font-[330] text-gold-soft">passo</em>.
          </h2>
        </Reveal>

        {/* O anel do medalhão volta como moldura do botão de agendar */}
        <div className="relative mt-12 grid aspect-square w-[17.5rem] place-items-center sm:w-[21rem]">
          <AnelDourado className="absolute inset-0 size-full" duracao={2} />
          <div className="relative flex flex-col items-center gap-3">
            <Botao href={linkWhats()} externo variante="ouro" className="whitespace-nowrap !px-5 shadow-[0_0_0_6px_rgb(195_164_107/0.12)] sm:!px-7">
              <IconeWhats className="size-5" />
              Agendar pelo WhatsApp
            </Botao>
            <span className="text-sm text-ivory/65">{CONFIG.telefoneExibicao}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Botao href={CONFIG.instagram} externo variante="contorno-claro">
            <IconeInstagram className="size-5" />
            Ver no Instagram
          </Botao>
          {secaoAtiva('agendar') && (
            <a href="#agendar" className="inline-flex min-h-12 items-center px-3 text-[0.95rem] font-semibold text-gold-soft underline decoration-gold/40 underline-offset-[6px] hover:text-ivory">
              Ou solicite um horário pelo formulário
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================== RODAPÉ ============================== */

export function Rodape() {
  const horarios = horariosResumo()
  return (
    <footer className="on-dark bg-[#0a0908] pb-28 pt-16 text-ivory/75 md:pb-12">
      <div className="container-site">
        <div className="grid gap-12 border-b border-gold/15 pb-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Marca />
            <p className="mt-5 text-sm">
              {CONFIG.nome} · {CONFIG.titulo} · {CONFIG.cro}
            </p>
            <address className="mt-3 text-sm not-italic leading-relaxed">{enderecoLinha()}</address>
          </div>
          <div>
            <h2 className="eyebrow font-sans text-gold-soft">Contato</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <a href={linkWhats()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-ivory">
                  <IconeWhats className="size-4" /> WhatsApp {CONFIG.telefoneExibicao}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-ivory">
                  <IconeInstagram className="size-4" /> {CONFIG.instagramUsuario}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>
          {horarios.length > 0 && (
            <div>
              <h2 className="eyebrow font-sans text-gold-soft">Horários</h2>
              <ul className="mt-4 space-y-1.5 text-sm">
                {horarios.map((h) => (
                  <li key={h.dias}>
                    {h.dias}: {h.horas}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ivory/60">{CONFIG.avisoHorarios}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-8 text-xs leading-relaxed text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl">
            Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.
          </p>
          <a href="/privacidade.html" className="inline-flex min-h-12 items-center text-ivory/80 underline underline-offset-4 hover:text-ivory">
            Política de privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ============================== WHATSAPP FIXO ============================== */

export function WhatsFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      {/* Desktop: botão flutuante discreto, com o anel dourado como moldura */}
      <a
        href={linkWhats()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp (abre em nova aba)"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 place-items-center rounded-full bg-ink text-gold-soft shadow-[0_12px_30px_-10px_rgb(15_14_12/0.6)] transition-[opacity,transform] duration-500 ease-out-soft hover:scale-105 md:grid ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <span aria-hidden className="absolute -inset-1.5 rounded-full border border-gold/45" />
        <IconeWhats className="size-6" />
      </a>
      {/* Celular: barra fixa; o rodapé tem espaço extra para ela não cobrir conteúdo */}
      <div className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex gap-2">
          <a
            href={linkWhats()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 text-[0.95rem] font-semibold text-ink"
          >
            <IconeWhats className="size-5" />
            WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          {secaoAtiva('agendar') && (
            <a
              href="#agendar"
              className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-gold/50 px-4 text-[0.95rem] font-semibold text-ivory"
            >
              Solicitar horário
            </a>
          )}
        </div>
      </div>
    </>
  )
}
