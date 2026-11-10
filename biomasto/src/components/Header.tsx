import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { IcFechar, IcMenu, IcTelefone, IcWhatsapp } from './icones'
import { Logo } from './ui'

export type LinkNav = { href: string; label: string }

export function Header({ links }: { links: LinkNav[] }) {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu do celular: Esc fecha, foco vai para o primeiro link e volta ao botão.
  useEffect(() => {
    if (!aberto) return
    const primeiro = painel.current?.querySelector<HTMLElement>('a,button')
    primeiro?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
      if (e.key === 'Tab' && painel.current) {
        const foc = Array.from(painel.current.querySelectorAll<HTMLElement>('a,button'))
        const todos = [botaoMenu.current!, ...foc]
        const i = todos.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          todos[todos.length - 1].focus()
        } else if (!e.shiftKey && i === todos.length - 1) {
          e.preventDefault()
          todos[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const agendar = CONFIG.usarWhatsapp
    ? { href: '#agendar', label: 'Agendar consulta', aria: undefined, Icone: IcWhatsapp }
    : {
        href: CONFIG.telefoneLink,
        label: 'Agendar consulta',
        aria: `Agendar consulta: ligar para ${CONFIG.telefone}`,
        Icone: IcTelefone,
      }

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solido || aberto
          ? 'bg-marfim/92 shadow-[0_1px_0_rgb(75_48_69/0.08),0_8px_24px_-16px_rgb(75_48_69/0.25)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-4">
        <a href="#inicio" className="-ml-1 flex shrink-0 items-center rounded-lg p-1" aria-label="Clínica Biomasto, ir para o início">
          <Logo className="h-[46px] w-auto sm:h-[52px]" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center px-3.5 text-[0.95rem] font-medium text-tinta transition-colors hover:text-ameixa after:absolute after:inset-x-3.5 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-salvia after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={agendar.href}
            aria-label={agendar.aria}
            className="hidden min-h-12 items-center gap-2 rounded-full bg-ameixa px-5 text-[0.95rem] font-semibold text-marfim transition-colors hover:bg-ameixa-2 sm:inline-flex"
          >
            <agendar.Icone size={18} />
            {agendar.label}
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-ameixa ring-1 ring-inset ring-ameixa/20 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IcFechar size={22} /> : <IcMenu size={22} />}
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="border-t border-ameixa/10 bg-marfim lg:hidden"
        style={{ height: 'calc(100dvh - 72px - 2rem)' }}
      >
        <nav aria-label="Menu do celular" className="container-site flex h-full flex-col py-6">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-ameixa/8">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center font-serif text-[1.6rem] text-ameixa"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={agendar.href}
            aria-label={agendar.aria}
            onClick={() => setAberto(false)}
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-ameixa px-6 py-3.5 font-semibold text-marfim"
          >
            <agendar.Icone size={18} />
            {CONFIG.usarWhatsapp ? 'Agendar consulta' : `Ligar ${CONFIG.telefone}`}
          </a>
        </nav>
      </div>
    </header>
  )
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-ameixa-2 px-3 text-center text-[0.75rem] font-medium tracking-[0.02em] text-marfim"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}
