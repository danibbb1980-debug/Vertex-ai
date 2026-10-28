import { useEffect, useRef, useState } from 'react'
import { NAV } from '../content'
import { waLink } from '../lib/links'
import { IconClose, IconMenu, IconWhatsApp } from './Icons'
import { Logo } from './Logo'

export function Header() {
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

  // Menu do celular: Esc fecha, foco fica dentro do painel, rolagem travada.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const focaveis = () => Array.from(panel?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focaveis()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const els = focaveis()
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-[var(--banner-h)] z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
        solid || open
          ? 'border-b border-line/70 bg-ivory/92 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a href="#conteudo" className="sr-only-focusable absolute left-4 top-2 z-10 rounded-full bg-ink px-4 py-2 text-sm text-paper">
        Pular para o conteúdo
      </a>
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#topo" className="flex min-h-12 shrink-0 items-center" aria-label="Dr. Gustavo Borges Andrade, início da página">
          <Logo className="w-[6.25rem] md:w-[7.25rem]" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9rem] font-medium text-ink-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="link-line inline-flex min-h-12 items-center hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener" className="btn btn-primary hidden !min-h-11 !px-5 !text-[0.88rem] sm:inline-flex">
            <IconWhatsApp size={18} />
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-celular"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-var(--banner-h)-var(--header-h))] overflow-y-auto border-t border-line/70 bg-ivory lg:hidden"
      >
        <nav aria-label="Menu do celular" className="shell flex h-full flex-col justify-between py-8">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-baseline gap-4 border-b border-line/60 font-display text-[1.75rem] text-ink"
                >
                  <span className="num text-mute">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener" className="btn btn-primary mt-10 w-full" onClick={() => setOpen(false)}>
            <IconWhatsApp size={18} />
            Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
