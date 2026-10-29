import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { cn } from '../lib/cn'
import { IconClose, IconMenu, IconWhatsApp } from './Icons'
import { scrollToHash } from '../lib/scroll'

export const NAV = [
  { href: '#consultorio', label: 'O consultório', on: CONFIG.secoes.consultorio },
  { href: '#atendimentos', label: 'Atendimentos', on: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: '#formacao', label: 'Formação', on: CONFIG.secoes.formacao && CONFIG.formacao.length > 0 },
  { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.faq },
  { href: '#agendar', label: 'Agendar', on: CONFIG.secoes.agendamento },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.localizacao },
].filter((n) => n.on)

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const top = CONFIG.rascunho ? 'top-8' : 'top-0'

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>('a,button')
    first?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a,button')
        const a = f[0]
        const b = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          b.focus()
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', key)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToHash(href)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500',
        top,
        solid || open ? 'border-b border-ink/10 bg-ivory/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" onClick={go('#inicio')} className="-ml-1 shrink-0 p-1" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <img src="/img/logo-dr-vitor.png" alt="" width={203} height={99} className="h-[50px] w-auto" />
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-[0.9rem] font-medium text-ink/85">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={go(n.href)} className="py-2 transition-colors hover:text-teal-deep">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !min-h-11 !px-5 text-[0.88rem] sm:inline-flex"
          >
            <IconWhatsApp className="size-[18px]" />
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex size-12 items-center justify-center text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="size-6" /> : <IconMenu className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="xl:hidden border-t border-ink/10 bg-ivory"
        style={{ height: `calc(100dvh - ${CONFIG.rascunho ? 104 : 72}px)` }}
      >
        <nav aria-label="Menu" className="container-x flex h-full flex-col justify-between overflow-y-auto pb-10 pt-6">
          <ul className="flex flex-col">
            {NAV.map((n, i) => (
              <li key={n.href} className="border-b border-ink/10">
                <a href={n.href} onClick={go(n.href)} className="flex min-h-14 items-baseline gap-4 py-3 font-display text-[1.7rem] text-ink">
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-teal-deep">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 w-full">
            <IconWhatsApp className="size-5" />
            Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
