import { useEffect, useRef, useState } from 'react'
import { CONFIG, temWhatsapp, waLink } from '../config'
import { Monograma } from './Logo'
import { IconeWhatsapp } from './Icones'

export type LinkNav = { href: string; rotulo: string }

export function Cabecalho({ links }: { links: LinkNav[] }) {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const painel = painelRef.current
    const focaveis = () => Array.from(painel?.querySelectorAll<HTMLElement>('a,button') ?? [])
    focaveis()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const f = [botaoRef.current!, ...focaveis()]
        const i = f.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [aberto])

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {CONFIG.rascunho && (
        <p className="bg-cafe px-4 py-1.5 text-center text-[0.72rem] leading-snug tracking-wide text-creme sm:text-[0.78rem]">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      <header
        className={`transition-colors duration-300 ${
          solido || aberto ? 'border-b border-fio bg-marfim' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-5 sm:px-8 lg:h-[4.5rem]">
          <a href="#inicio" className="flex min-h-12 items-center gap-2.5" aria-label={`${CONFIG.nome}, início`}>
            <Monograma className="h-9 w-auto text-caramelo-queimado" />
            <span className="font-display text-[1.4rem] leading-none tracking-[0.01em]">{CONFIG.nome}</span>
          </a>
          <nav aria-label="Principal" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-7 text-[0.92rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-12 items-center hover:text-caramelo-queimado">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {temWhatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-cheio ml-auto hidden !min-h-11 !px-5 text-[0.9rem] sm:inline-flex xl:ml-0"
            >
              <IconeWhatsapp className="size-[1.1rem]" />
              Agendar avaliação
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="ml-auto inline-flex size-12 items-center justify-center rounded-full sm:ml-0 xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-6 bg-cafe transition-transform duration-300 ${
                  aberto ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-cafe transition-transform duration-300 ${
                  aberto ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
        <div
          id="menu-movel"
          ref={painelRef}
          hidden={!aberto}
          className="h-[calc(100svh-6rem)] overflow-y-auto border-t border-fio bg-marfim px-5 pb-10 pt-6 xl:hidden"
        >
          <nav aria-label="Menu">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-fio">
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-16 items-baseline gap-4 py-3 font-display text-[2rem] leading-none"
                  >
                    <span className="num font-sans text-xs text-cafe-suave">{String(i + 1).padStart(2, '0')}</span>
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {temWhatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAberto(false)}
              className="botao botao-cheio mt-8 w-full"
            >
              <IconeWhatsapp />
              Agendar avaliação
            </a>
          )}
        </div>
      </header>
    </div>
  )
}
