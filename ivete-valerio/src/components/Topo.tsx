import { useEffect, useRef, useState } from 'react'
import { CONFIG, MSG_GERAL, waLink } from '../config'
import { BotaoWhats, Logo, Onda } from './base'

const LINKS = [
  { href: '#servicos', rotulo: 'Serviços', secao: 'servicos' },
  { href: '#sobre', rotulo: 'Sobre', secao: 'sobre' },
  { href: '#como-agendar', rotulo: 'Como agendar', secao: 'comoAgendar' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
] as const

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--faixa)] items-center justify-center bg-cacau px-4 text-center text-[12.5px] leading-tight text-cru"
      role="note"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Topo() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao] && (l.secao !== 'sobre' || !!CONFIG.sobre.nome))

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const primeiro = menuRef.current?.querySelector('a')
    primeiro?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-[var(--faixa)]' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-colors duration-300 ${
        solido || aberto ? 'border-b fio bg-cru/95 backdrop-blur-[2px]' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="absolute left-4 top-2 -translate-y-24 rounded bg-cacau px-4 py-3 text-cru focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[var(--header)] max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <a href="#inicio" className="shrink-0" aria-label={`${CONFIG.nome}, início`}>
          <Logo className="h-[38px] w-auto md:h-[42px]" />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="py-3 hover:text-argila">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:block">
          <BotaoWhats className="min-h-[48px] px-5 text-[15px]" />
        </div>
        <button
          ref={botaoRef}
          type="button"
          className="flex min-h-[48px] min-w-[48px] items-center gap-2 px-2 text-[15px] font-semibold lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? 'Fechar' : 'Menu'}
          <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true" fill="none">
            {aberto ? (
              <path d="M5 1l12 10M17 1L5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <>
                <path d="M1 3c3-2 6-2 10 0s7 2 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M1 10c3-2 6-2 10 0s7 2 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div
        id="menu-movel"
        ref={menuRef}
        hidden={!aberto}
        className="border-t fio bg-cru px-5 pb-8 pt-2 lg:hidden"
      >
        <nav aria-label="Menu">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b fio">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="serif flex min-h-[56px] items-center text-[26px]"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {CONFIG.usarWhatsapp && (
          <a
            href={waLink(MSG_GERAL)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-argila mt-6 w-full"
          >
            Marcar horário pelo WhatsApp
            <Onda />
          </a>
        )}
      </div>
    </header>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular). */
export function AcessoFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const on = () => {
      const fim = document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 260
      setVisivel(window.scrollY > window.innerHeight * 0.7 && !fim)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!CONFIG.usarWhatsapp) return null
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t fio bg-cru/95 px-4 py-3 backdrop-blur-[2px] transition-transform duration-300 md:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!visivel}
      >
        <a
          href={waLink(MSG_GERAL)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visivel ? 0 : -1}
          className="btn btn-argila w-full"
        >
          Marcar horário pelo WhatsApp
          <Onda />
        </a>
      </div>
      <a
        href={waLink(MSG_GERAL)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        aria-label="Marcar horário pelo WhatsApp (abre em nova aba)"
        className={`btn btn-argila fixed bottom-6 right-6 z-30 hidden min-h-[48px] px-5 text-[15px] transition-opacity duration-300 md:inline-flex ${
          visivel ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        Marcar horário
        <Onda />
      </a>
    </>
  )
}
