import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { Marca } from './ui/Primitivos'
import { IconeFechar, IconeMenu, IconeWhatsApp } from './ui/Icones'

export const LINKS = [
  { href: '#clinica', rotulo: 'A clínica', secao: 'clinica' },
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#equipe', rotulo: 'Equipe', secao: 'equipe' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
] as const

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-tinta px-4 text-center text-[0.72rem] font-medium tracking-[0.02em] text-marfim/90"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao])

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    document.documentElement.style.overflow = 'hidden'
    painelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const teclas = (e: KeyboardEvent) => {
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
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    window.addEventListener('keydown', teclas)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', teclas)
    }
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
        rolou || aberto
          ? 'border-b border-tinta/10 bg-papel/92 shadow-[0_1px_0_rgba(13,31,43,0.02)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-marfim"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="rounded-full">
          <Marca tamanho={42} />
          <span className="sr-only"> (voltar ao início)</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9rem] font-medium text-tinta/80">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative py-2 transition-colors hover:text-tinta after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-verde after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-12 items-center gap-2 rounded-full bg-tinta px-5 text-[0.9rem] font-semibold text-marfim transition-colors hover:bg-azul sm:inline-flex"
          >
            <IconeWhatsApp width={18} height={18} />
            Agendar avaliação
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full text-tinta hover:bg-tinta/5 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar width={24} height={24} /> : <IconeMenu width={24} height={24} />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-tinta/10 bg-papel lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site flex h-full flex-col py-8">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-tinta/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-baseline gap-4 py-4 font-display text-[1.75rem] text-tinta"
                >
                  <span className="font-sans text-xs font-bold tracking-[0.2em] text-areia-escura">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAberto(false)}
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-tinta px-6 py-3.5 font-semibold text-marfim"
          >
            <IconeWhatsApp width={18} height={18} />
            Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular). O <main> reserva espaço para a barra. */
export function WhatsAppFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a CIVAMI pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full border border-tinta/10 bg-papel/95 pl-4 pr-5 text-sm font-semibold text-tinta shadow-[0_10px_30px_-12px_rgba(13,31,43,0.35)] backdrop-blur transition-[opacity,transform] duration-500 hover:bg-white md:inline-flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-verde text-white">
          <IconeWhatsApp width={17} height={17} />
        </span>
        WhatsApp
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-tinta/10 bg-papel/95 px-4 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur md:hidden">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tinta text-[0.95rem] font-semibold text-marfim"
        >
          <IconeWhatsApp width={18} height={18} />
          Agendar pelo WhatsApp
        </a>
      </div>
    </>
  )
}
