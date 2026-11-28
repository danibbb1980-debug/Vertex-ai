import { useEffect, useRef, useState } from 'react'
import { CONFIG, waLink } from '../config'
import { IconeWhatsApp } from './icones'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center overflow-hidden whitespace-nowrap bg-ardosia px-2 text-center text-[0.6875rem] leading-tight text-linho sm:text-[0.8125rem]"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src={CONFIG.logo.src}
      width={CONFIG.logo.largura}
      height={CONFIG.logo.altura}
      alt={CONFIG.logo.alt}
      className={className}
      decoding="async"
    />
  )
}

export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const links = [
    CONFIG.secoes.atendimentos && CONFIG.atendimentos.some((a) => a.id === 'fisioterapia') && { href: '#fisioterapia', rotulo: 'Fisioterapia' },
    CONFIG.secoes.atendimentos && CONFIG.atendimentos.some((a) => a.id === 'pilates') && { href: '#pilates', rotulo: 'Pilates' },
    CONFIG.secoes.comoFunciona && { href: '#como-funciona', rotulo: 'Como funciona' },
    CONFIG.secoes.faq && CONFIG.faq.length > 0 && { href: '#duvidas', rotulo: 'Dúvidas' },
    CONFIG.secoes.contato && { href: '#contato', rotulo: 'Contato' },
    CONFIG.secoes.agendar && CONFIG.whatsapp && { href: '#agendar', rotulo: 'Solicitar agendamento' },
  ].filter(Boolean) as { href: string; rotulo: string }[]

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const solido = rolou || aberto
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-[background-color,border-color] duration-300 ${
        solido ? 'border-b border-ardosia/10 bg-linho/95 backdrop-blur-sm' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[86rem] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
        <a href="#topo" className="shrink-0 rounded-md" aria-label="OrtoFisio, voltar ao início">
          <Logo className="h-14 w-auto md:h-[4.25rem]" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem] font-medium text-ardosia">
            {links
              .filter((l) => l.href !== '#agendar')
              .map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-fino !decoration-transparent hover:!decoration-current">
                    {l.rotulo}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {CONFIG.whatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primario hidden !min-h-12 !px-5 md:inline-flex"
            >
              <IconeWhatsApp />
              Agendar pelo WhatsApp
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ardosia/25 text-ardosia lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {aberto ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={menuRef}
        hidden={!aberto}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-ardosia/10 bg-linho px-5 pb-28 pt-6 lg:hidden"
      >
        <nav aria-label="Menu">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-ardosia/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center font-display text-[1.65rem] font-light tracking-tight text-ardosia"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {CONFIG.whatsapp && (
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-8 w-full">
            <IconeWhatsApp />
            Agendar pelo WhatsApp
          </a>
        )}
      </div>
    </header>
  )
}
