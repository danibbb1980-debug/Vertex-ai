import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { Assinatura, BotaoWhats } from './ui'

export function linksNav() {
  const s = CONFIG.secoes
  return [
    s.atendimentos && CONFIG.atendimentos.length > 0 && { href: '#atendimentos', rotulo: 'Atendimentos' },
    s.comoFunciona && { href: '#como-funciona', rotulo: 'Como funciona' },
    s.duvidas && { href: '#duvidas', rotulo: 'Dúvidas' },
    s.contato && { href: '#contato', rotulo: 'Contato' },
  ].filter(Boolean) as { href: string; rotulo: string }[]
}

export function Topo() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const links = linksNav()

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!aberto) return
    painel.current?.querySelector<HTMLElement>('a')?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
    }
    document.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [aberto])

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {CONFIG.rascunho && (
        <p className="rotulo bg-grafite px-4 py-1.5 text-center !text-[0.6rem] !tracking-[0.04em] text-areia xs:!tracking-[0.1em] sm:!text-[0.625rem] sm:!tracking-[0.16em]">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      <header
        className={`transition-[background-color,border-color] duration-300 ${
          solido || aberto ? 'border-b border-fio bg-areia' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#inicio" className="-ml-1 flex min-h-12 items-center p-1">
            <Assinatura compacta />
            <span className="sr-only"> (início)</span>
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-12 items-center text-[0.95rem] hover:text-terracota-escuro">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <BotaoWhats className="hidden !min-h-11 !px-5 sm:inline-flex" rotuloAcessivel="Agendar horário">
              Agendar horário
            </BotaoWhats>
            <button
              ref={botaoMenu}
              type="button"
              className="flex h-12 w-12 items-center justify-center lg:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              onClick={() => setAberto((v) => !v)}
            >
              <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
              <span aria-hidden="true" className="relative block h-3 w-7">
                <span className={`absolute left-0 h-px w-7 bg-grafite transition-transform duration-300 ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-7 bg-grafite transition-transform duration-300 ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>
        <div
          id="menu-celular"
          ref={painel}
          hidden={!aberto}
          className="h-[calc(100svh-6.5rem)] overflow-y-auto border-t border-fio bg-areia px-5 pb-10 pt-6 lg:hidden"
        >
          <nav aria-label="Menu do celular">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-fio">
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-16 items-baseline gap-5 py-3 font-display text-[2rem] tracking-[-0.02em]"
                  >
                    <span className="num rotulo text-terracota-escuro">{String(i + 1).padStart(2, '0')}</span>
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <BotaoWhats className="mt-8 w-full" rotuloAcessivel="Agendar horário" />
        </div>
      </header>
    </div>
  )
}
