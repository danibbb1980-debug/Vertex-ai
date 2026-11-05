import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { CONFIG } from '../config'
import { BotaoLigar, BotaoWhatsApp, IconeInstagram } from './base'

export const LINKS_MENU = [
  { href: '#a-medica', rotulo: 'A médica', secao: 'medica' },
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
] as const

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-marinho px-4 text-center text-[0.75rem] tracking-wide text-marfim"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const links = LINKS_MENU.filter((l) => CONFIG.secoes[l.secao])

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
      if (e.key === 'Tab' && painelRef.current) {
        const focaveis = painelRef.current.querySelectorAll<HTMLElement>('a, button')
        const primeiro = focaveis[0]
        const ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          botaoRef.current?.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          botaoRef.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    painelRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'
  const solido = rolou || aberto

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        solido
          ? 'border-b border-linha/80 bg-marfim/95 shadow-[0_8px_30px_-22px_rgba(37,42,69,0.45)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-marinho focus:px-4 focus:py-2 focus:text-marfim"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="shrink-0 rounded-md" aria-label={`${CONFIG.nome}, ${CONFIG.titulo}. Ir para o início`}>
          <img src="/img/logo.webp" alt="" width={280} height={114} className="h-11 w-auto md:h-12" fetchPriority="high" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative py-2 text-[0.95rem] text-marinho/85 transition-colors hover:text-vinho"
                >
                  {l.rotulo}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-vinho transition-transform duration-500 ease-[var(--ease-flui)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {CONFIG.secoes.agendar ? (
            <a href="#agendar" className="btn btn-primario hidden !min-h-11 !px-5 !text-[0.95rem] sm:inline-flex">
              Agendar avaliação
            </a>
          ) : (
            <BotaoWhatsApp className="hidden !min-h-11 !px-5 sm:inline-flex">Agendar avaliação</BotaoWhatsApp>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-marinho transition-colors hover:bg-pessego/60 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X strokeWidth={1.5} aria-hidden="true" /> : <Menu strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {aberto && (
          <m.div
            ref={painelRef}
            id="menu-celular"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-linha bg-marfim lg:hidden"
          >
            <nav aria-label="Menu do celular" className="container-site flex flex-col pb-10 pt-4">
              <ul className="flex flex-col">
                {[...links, ...(CONFIG.secoes.agendar ? [{ href: '#agendar', rotulo: 'Solicitar agendamento' }] : [])].map(
                  (l, i) => (
                    <li key={l.href} className="border-b border-linha/70">
                      <a
                        href={l.href}
                        onClick={() => setAberto(false)}
                        className="flex min-h-14 items-center justify-between py-3 font-serif text-[1.85rem] text-marinho"
                      >
                        {l.rotulo}
                        <span className="rotulo !text-[0.65rem] !text-tinta">{String(i + 1).padStart(2, '0')}</span>
                      </a>
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <BotaoWhatsApp>Agendar pelo WhatsApp</BotaoWhatsApp>
                <BotaoLigar />
              </div>
              <a
                href={CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 items-center gap-2 text-marinho/85 hover:text-vinho"
              >
                <IconeInstagram /> {CONFIG.instagram.usuario}
              </a>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
