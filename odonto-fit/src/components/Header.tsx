import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CONFIG } from '../config'
import { BotaoWhatsApp } from './ui'

/** Logo original com o fundo branco removido e as margens recortadas (sem redesenho). */
export function Logo({ className = '', altura = 40 }: { className?: string; altura?: number }) {
  return (
    <img
      src="/logo-odonto-fit.png"
      alt="Odonto Fit"
      width={145}
      height={42}
      className={className}
      style={{ height: altura, width: 'auto' }}
      decoding="async"
    />
  )
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-sand px-3 text-center text-[0.68rem] font-medium text-navy sm:text-[0.8rem]"
    >
      <span>Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </div>
  )
}

export function Header({ links }: { links: { href: string; label: string }[] }) {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botao = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!aberto) return
    painel.current?.querySelector<HTMLElement>('a')?.focus()
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow] duration-300 ${
        solido || aberto ? 'bg-ice/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-xl px-1" aria-label="Odonto Fit, voltar ao início">
          <Logo altura={42} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-12 items-center rounded-full px-4 text-[0.95rem] font-medium text-navy/80 transition-colors hover:bg-navy/5 hover:text-navy"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {CONFIG.secoes.agendar ? (
            <a href="#agendar" className="btn btn-primary hidden sm:inline-flex">
              Agendar avaliação
            </a>
          ) : (
            <span className="hidden sm:inline-flex">
              <BotaoWhatsApp className="btn-primary">Agendar avaliação</BotaoWhatsApp>
            </span>
          )}
          <button
            ref={botao}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-navy ring-1 ring-line ring-inset lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="border-t border-line bg-ice lg:hidden"
      >
        <nav aria-label="Menu do celular" className="wrap py-4">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-12 items-center border-b border-line/70 py-2 font-display text-2xl text-navy"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-3 pb-2">
            {CONFIG.secoes.agendar && (
              <a href="#agendar" onClick={() => setAberto(false)} className="btn btn-primary">
                Solicitar agendamento
              </a>
            )}
            <BotaoWhatsApp className="btn-ghost">Falar pelo WhatsApp</BotaoWhatsApp>
          </div>
        </nav>
      </div>
    </header>
  )
}
