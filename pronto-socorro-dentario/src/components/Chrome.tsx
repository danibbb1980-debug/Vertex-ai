import { useEffect, useRef, useState } from 'react'
import { CONFIG, enderecoLinha, telLink, waLink } from '../config'
import { Close, Instagram, Menu, Phone, Pin, WhatsApp } from './icons'
import { Logo, Pendente, Val, WaButton } from './ui'

const NAV = [
  { href: '#atendimentos', label: 'Atendimentos', on: CONFIG.secoes.atendimentos },
  { href: '#urgencia', label: 'Urgência', on: CONFIG.secoes.quandoProcurar },
  { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.faq },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
].filter((n) => n.on)

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="bg-[repeating-linear-gradient(135deg,#fff4dc_0_10px,#fdecc8_10px_20px)] border-b border-[#f0d9a6] text-[#5c3b00]">
      <p className="wrap py-1.5 text-center text-[0.7rem] font-semibold leading-tight !px-3 sm:text-[0.78rem]">
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </p>
    </div>
  )
}

function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-[1.06rem] font-bold tracking-[-0.01em] text-forest sm:text-[1.15rem]">
        Pronto Socorro Dentário
      </span>
      <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
        {CONFIG.cidade} · {CONFIG.uf}
      </span>
    </span>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="sticky top-0 z-40">
      <DraftBanner />
      <header
        className={`border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || open ? 'border-line bg-ivory/92 backdrop-blur-md' : 'border-transparent bg-ivory'
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <a href="#inicio" className="flex min-h-12 items-center gap-3">
            <Logo size={40} />
            <Wordmark />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="inline-flex min-h-12 items-center rounded-full px-3.5 text-[0.95rem] font-semibold text-forest/80 transition-colors hover:bg-sand hover:text-forest"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Barra de urgência discreta no desktop */}
            <a
              href={telLink}
              className="hidden min-h-12 items-center gap-2.5 rounded-full px-3 text-[0.95rem] font-semibold text-forest xl:inline-flex hover:bg-sand"
            >
              <span className="pulse-dot" aria-hidden="true" />
              <span>
                <span className="sr-only">Atendimento 24 horas. Ligar para </span>
                {CONFIG.telefoneExibicao}
              </span>
            </a>
            <WaButton small className="hidden sm:inline-flex">
              Falar agora
            </WaButton>
            <button
              ref={btnRef}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-forest hover:bg-sand lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movel"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
              <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            </button>
          </div>
        </div>

        <div id="menu-movel" hidden={!open} className="border-t border-line bg-ivory lg:hidden">
          <nav aria-label="Menu" className="wrap py-3">
            <ul>
              {NAV.map((n) => (
                <li key={n.href} className="border-b border-line/70 last:border-0">
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-13 items-center justify-between py-3 font-display text-xl font-semibold text-forest"
                  >
                    {n.label}
                    <span aria-hidden="true" className="text-brand">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

/** Barra de urgência fixa no celular. */
export function UrgencyBar() {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-forest/97 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="wrap flex items-center gap-2.5 py-2.5">
        <p className="flex w-[3.4rem] flex-none flex-col items-start leading-none text-white">
          <span className="flex items-center gap-1.5 font-display text-lg font-bold">
            <span className="pulse-dot !bg-[#3fd17a]" aria-hidden="true" />
            24h
          </span>
          <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/60">
            <span className="sr-only">Atendimento </span>urgência
          </span>
        </p>
        <a href={waLink()} target="_blank" rel="noopener" className="btn btn-urgent !min-h-12 flex-1 !px-3 !text-[0.95rem]">
          <WhatsApp size={19} />
          WhatsApp
          <span className="sr-only"> (abre o WhatsApp, atendimento de urgência)</span>
        </a>
        <a href={telLink} className="btn btn-line !min-h-12 flex-1 !px-3 !text-[0.95rem]">
          <Phone size={19} />
          Ligar
          <span className="sr-only"> para {CONFIG.telefoneExibicao}</span>
        </a>
      </div>
    </div>
  )
}

/** Botão flutuante discreto: só no desktop (no celular já existe a barra). */
export function FloatingWa() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-forest py-2 pl-2 pr-5 text-paper shadow-[0_18px_40px_-18px_rgba(11,36,24,.6)] transition-[opacity,transform] duration-500 lg:flex ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-on-amber transition-transform duration-300 group-hover:scale-105">
        <WhatsApp size={20} />
      </span>
      <span className="text-[0.95rem] font-bold">
        Falar no WhatsApp<span className="sr-only"> (abre o WhatsApp)</span>
      </span>
    </a>
  )
}

export function Footer() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="on-dark bar-space border-t border-white/10 bg-forest text-white/75">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <span className="font-display text-xl font-bold text-paper">{CONFIG.nome}</span>
          </div>
          <p className="mt-5 max-w-sm text-[0.95rem]">
            Odontologia de urgência em {CONFIG.cidade} - {CONFIG.uf}.
          </p>
          {/* CONFIRMAR COM A CLÍNICA: responsável técnico e CRO (obrigatório na versão final) */}
          <dl className="mt-6 space-y-1.5 text-[0.92rem]">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-white/55">Responsável técnico:</dt>
              <dd className="text-paper">
                <Val v={rt.nome} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-white/55">CRO-{CONFIG.uf}:</dt>
              <dd className="text-paper">
                <Val v={rt.cro} />
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="!font-sans text-xs font-bold uppercase tracking-[0.16em] !text-white/55">Contato</h2>
          <ul className="mt-4 space-y-1 text-[0.95rem]">
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2.5 text-paper hover:text-amber">
                <WhatsApp size={17} /> WhatsApp {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={telLink} className="inline-flex min-h-11 items-center gap-2.5 text-paper hover:text-amber">
                <Phone size={17} /> Ligar {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2.5 text-paper hover:text-amber">
                <Instagram size={17} /> {CONFIG.instagram.usuario}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="!font-sans text-xs font-bold uppercase tracking-[0.16em] !text-white/55">Endereço</h2>
          <p className="mt-4 flex gap-2.5 text-[0.95rem] text-paper">
            <Pin size={17} className="mt-1 flex-none" />
            <span>
              {enderecoLinha}
              {!CONFIG.endereco.confirmado && (
                <>
                  {' '}
                  <Pendente />
                </>
              )}
            </span>
          </p>
          <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-11 items-center text-[0.95rem] font-semibold text-amber underline underline-offset-4">
            Como chegar (Google Maps)
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[0.82rem] text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl">
            Conteúdo informativo; não substitui avaliação profissional. A indicação de cada atendimento depende de avaliação individual.
          </p>
          <p className="flex flex-none items-center gap-4">
            <a href="/privacidade.html" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper">
              Privacidade
            </a>
            <span>© {CONFIG.nome}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
