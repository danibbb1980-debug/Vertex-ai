import { useEffect, useRef, useState } from 'react'
import { CONFIG, linkWhats, secaoAtiva } from '../config'
import { Botao, Marca } from './ui'
import { IconeFechar, IconeMenu, IconeWhats } from './Icones'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center border-b border-gold/25 bg-ink px-3 text-center text-[0.66rem] font-medium leading-tight sm:text-[0.72rem] sm:tracking-[0.04em] text-gold-soft"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

const LINKS = [
  { href: '#dentista', rotulo: 'O dentista', secao: 'dentista' },
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'faq' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
  { href: '#agendar', rotulo: 'Solicitar horário', secao: 'agendar' },
] as const

export function Header() {
  const [rolado, setRolado] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const links = LINKS.filter((l) => secaoAtiva(l.secao))

  useEffect(() => {
    const onScroll = () => setRolado(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!aberto) return
    document.body.style.overflow = 'hidden'
    const primeiro = painelRef.current?.querySelector<HTMLElement>('a,button')
    primeiro?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab' && painelRef.current) {
        const foc = painelRef.current.querySelectorAll<HTMLElement>('a,button')
        const a = foc[0]
        const z = foc[foc.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [aberto])

  const solido = rolado || aberto
  return (
    <header
      className={`on-dark fixed inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${CONFIG.rascunho ? 'top-8' : 'top-0'} ${
        solido ? 'border-b border-gold/15 bg-ink/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="shrink-0 rounded-md">
          <Marca />
          <span className="sr-only"> (voltar ao início)</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center px-3 text-[0.9rem] font-medium text-ivory/80 transition-colors hover:text-ivory after:absolute after:inset-x-3 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Botao href={linkWhats()} externo variante="ouro" className="!px-5">
              <IconeWhats className="size-[1.15rem]" />
              Agendar avaliação
            </Botao>
          </span>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full border border-gold/35 text-ivory lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar className="size-5" /> : <IconeMenu className="size-5" />}
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      {aberto && (
        <div
          id="menu-movel"
          ref={painelRef}
          className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-gold/15 bg-ink lg:hidden"
        >
          <nav aria-label="Menu" className="container-site py-6">
            <ul className="divide-y divide-gold/10">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-14 items-center font-serif text-2xl text-ivory"
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
            <Botao href={linkWhats()} externo variante="ouro" className="mt-8 w-full">
              <IconeWhats className="size-5" />
              Agendar avaliação pelo WhatsApp
            </Botao>
            <p className="mt-6 text-sm text-muted-dark">
              {CONFIG.nome} · {CONFIG.titulo} · {CONFIG.cro}
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}
