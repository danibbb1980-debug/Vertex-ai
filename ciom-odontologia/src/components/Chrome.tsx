import { useEffect, useRef, useState } from 'react'
import {AnimatePresence, m} from 'motion/react'
import { CONFIG } from '../config'
import { waLink } from '../lib/util'
import { IconChat, IconClose, IconMenu, IconCalendar } from './Icons'

export const LINKS = [
  { href: '#clinica', label: 'A clínica', ativo: CONFIG.secoes.clinica },
  { href: '#atendimentos', label: 'Atendimentos', ativo: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: '#como-funciona', label: 'Como funciona', ativo: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', ativo: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', ativo: CONFIG.secoes.localizacao },
  { href: '#agendar', label: 'Solicitar horário', ativo: CONFIG.secoes.agendar },
].filter((l) => l.ativo)

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-ink px-4 text-center text-[10.5px] leading-tight text-ivory/85 min-[400px]:text-[11.5px] sm:text-[12.5px] sm:tracking-wide"
    >
      <span className="mr-2 hidden h-1.5 w-1.5 rounded-full bg-sage sm:inline-block" aria-hidden="true" />
      {CONFIG.textoRascunho}
    </div>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  if (!CONFIG.logo.src) {
    return (
      <span className={`font-serif text-2xl tracking-tight text-ink ${className}`}>
        CIOM <em className="text-sage-deep">Odontologia</em>
      </span>
    )
  }
  return (
    <img
      src={CONFIG.logo.src}
      width={CONFIG.logo.largura}
      height={CONFIG.logo.altura}
      alt="CIOM Odontologia"
      className={`h-11 w-auto rounded-[8px] ${className}`}
      decoding="async"
    />
  )
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>('a')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const top = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${top} z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid || open ? 'bg-ivory/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-md px-1" aria-label="CIOM Odontologia, voltar ao início">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative flex min-h-12 items-center rounded-md px-3 text-[0.95rem] font-medium text-ink/85 transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="absolute inset-x-3 bottom-2.5 h-px origin-left scale-x-0 bg-sage-deep transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !min-h-12 !px-5 !text-[0.95rem] sm:inline-flex">
            <IconChat size={18} />
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-celular"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-celular"
            ref={panelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-line bg-ivory lg:hidden"
          >
            <nav aria-label="Menu" className="wrap py-4">
              <ul className="divide-y divide-line">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center justify-between font-serif text-2xl text-ink"
                    >
                      {l.label}
                      <span aria-hidden="true" className="text-sage-deep">→</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full">
                <IconChat size={18} /> Agendar avaliação pelo WhatsApp
              </a>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/** Barra fixa no celular. Há um espaçador no fim da página para não cobrir conteúdo. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pt-2.5 backdrop-blur-md md:hidden" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
      <div className="flex gap-2">
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-[1.4] !px-3 !text-[0.95rem]">
          <IconChat size={18} /> Agendar avaliação
        </a>
        {CONFIG.secoes.agendar && (
          <a href="#agendar" className="btn btn-ghost flex-1 !px-3 !text-[0.95rem]">
            <IconCalendar size={18} /> Pedir horário
          </a>
        )}
      </div>
    </div>
  )
}

export function FloatingWhats() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a clínica pelo WhatsApp"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-ink hover:bg-ink-3 text-ivory shadow-[0_10px_30px_-10px_rgb(15_45_40/0.6)] transition-[opacity,transform] duration-500 md:flex ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <IconChat size={22} />
    </a>
  )
}
