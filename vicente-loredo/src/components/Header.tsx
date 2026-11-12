import { useEffect, useRef, useState } from 'react'
import { CONFIG, MSG_GERAL, temWhats, waLink } from '../config'
import { WhatsIcon } from './ui'

const links = [
  { href: '#advogado', label: 'O advogado', on: CONFIG.secoes.advogado },
  { href: '#areas', label: 'Áreas de atuação', on: CONFIG.secoes.areas },
  { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
  { href: '#agendar', label: 'Agendar', on: CONFIG.secoes.agendar },
].filter((l) => l.on)

export function Wordmark({ light = false }: { light?: boolean }) {
  if (CONFIG.logo) return <img src={CONFIG.logo} alt={CONFIG.nomeExibicao} className="h-9 w-auto" />
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-serif text-[1.35rem] tracking-[-0.01em] ${light ? 'text-paper' : 'text-ink'}`}>
        {CONFIG.nomeExibicao}
      </span>
      <span className={`label mt-1 !text-[0.62rem] !tracking-[0.42em] ${light ? 'text-paper/75' : 'text-slate'}`}>
        Advocacia
      </span>
    </span>
  )
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

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
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const top = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${top} z-40 transition-[background-color,border-color] duration-300 ${
        solid || open ? 'border-b border-rule bg-paper/95 backdrop-blur-[2px]' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Ir para o conteúdo
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#topo" className="flex min-h-12 items-center no-underline">
          <Wordmark />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="py-3 text-ink-2 no-underline hover:text-brick">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {temWhats && (
            <a
              href={waLink(MSG_GERAL)}
              target="_blank"
              rel="noopener"
              className="btn btn-ink hidden !min-h-11 !px-4 !text-[0.95rem] sm:inline-flex"
            >
              <WhatsIcon className="h-[1.1rem] w-[1.1rem]" />
              Agendar atendimento
              <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
            </a>
          )}
          <button
            ref={btnRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="menu-movel"
        aria-label="Menu"
        hidden={!open}
        className="border-t border-rule bg-paper lg:hidden"
      >
        <ul className="wrap py-2">
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-rule last:border-0">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center gap-4 font-serif text-xl text-ink no-underline"
              >
                <span className="num label text-brick">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
