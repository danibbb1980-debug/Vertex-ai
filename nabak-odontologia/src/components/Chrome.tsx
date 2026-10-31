import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { IconClose, IconMenu, IconWhatsApp } from './Icons'
import { Magnetic } from './motion'

export function Logo({ className = '', width = 64 }: { className?: string; width?: number }) {
  return (
    <img
      src="/img/logo-nabak@3x.webp"
      alt={CONFIG.nome}
      width={width}
      height={Math.round((width * 93) / 103)}
      className={`block ${className}`}
      decoding="async"
    />
  )
}

export function DraftBar() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-espresso whitespace-nowrap px-3 text-center text-[0.6875rem] tracking-[0.01em] text-cream sm:text-[0.8125rem] sm:tracking-[0.04em]"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const s = CONFIG.secoes
  const links = [
    s.clinica && { href: '#clinica', label: 'A clínica' },
    s.atendimentos && CONFIG.atendimentos.length > 0 && { href: '#atendimentos', label: 'Atendimentos' },
    s.comoFunciona && { href: '#como-funciona', label: 'Como funciona' },
    s.duvidas && { href: '#duvidas', label: 'Dúvidas' },
    s.contato && { href: '#contato', label: 'Contato' },
    s.agendar && CONFIG.whatsapp && { href: '#agendar', label: 'Agendar' },
  ].filter(Boolean) as { href: string; label: string }[]

  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
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
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const wa = waLink()

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        solid || open ? 'border-b border-line/80 bg-paper/92 shadow-[0_10px_30px_-24px_rgba(43,33,28,0.5)] backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
      style={{ top: 'var(--draft-h)' }}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-3 focus:text-paper"
      >
        Pular para o conteúdo
      </a>
      <div className="container-n flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <a href="#topo" className="shrink-0 overflow-hidden rounded-[1.1rem]" aria-label={`${CONFIG.nome}, início`}>
          <Logo width={64} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-flex min-h-12 items-center px-3.5 text-[0.9375rem] font-medium text-espresso/85 transition-colors hover:text-espresso"
                >
                  {l.label}
                  <span className="absolute inset-x-3.5 bottom-3 h-px origin-left scale-x-0 bg-copper transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {wa && (
            <Magnetic>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden min-h-12 px-5 text-[0.875rem] sm:inline-flex">
                <IconWhatsApp size={17} />
                Agendar avaliação
              </a>
            </Magnetic>
          )}
          <button
            ref={btnRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-espresso hover:bg-sand/60 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-paper lg:hidden"
        style={{ height: 'calc(100dvh - var(--draft-h) - 4.5rem)' }}
      >
        <nav aria-label="Menu" className="container-n flex h-full flex-col justify-between overflow-y-auto pb-8 pt-4">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line/70">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between font-serif text-[1.875rem] text-espresso"
                >
                  {l.label}
                  <span aria-hidden className="font-sans text-xs tracking-[0.2em] text-copper-ink">{String(i + 1).padStart(2, '0')}</span>
                </a>
              </li>
            ))}
          </ul>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 w-full">
              <IconWhatsApp size={18} /> Agendar pelo WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function WhatsAppFixed() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const wa = waLink()
  if (!wa) return null
  return (
    <>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={show ? 0 : -1}
        className={`fixed bottom-7 right-7 z-40 hidden h-14 items-center gap-2.5 rounded-full border border-copper/40 bg-espresso pl-4 pr-5 text-[0.875rem] font-semibold text-paper shadow-[0_18px_40px_-18px_rgba(43,33,28,0.7)] transition-[opacity,transform] duration-500 hover:bg-espresso-soft md:inline-flex ${
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconWhatsApp size={20} className="text-copper-light" />
        WhatsApp
      </a>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
      >
        <div className="flex gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-12 flex-1 whitespace-nowrap px-4 text-[0.875rem]">
            <IconWhatsApp size={18} /> Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-ghost min-h-12 whitespace-nowrap px-4 text-[0.875rem]" aria-label="Solicitar horário pelo formulário">
              Formulário
            </a>
          )}
        </div>
      </div>
    </>
  )
}
