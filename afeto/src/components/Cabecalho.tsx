import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/dados'
import { LogoCompacto } from '../brand/Marca'
import { IconeWhatsApp } from './Icones'

export interface ItemMenu { href: string; rotulo: string }

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-tinta px-4 text-center text-[0.75rem] leading-tight tracking-wide text-papel">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Cabecalho({ itens }: { itens: ItemMenu[] }) {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const zap = linkWhatsApp()
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const primeiro = painelRef.current?.querySelector<HTMLElement>('a,button')
    primeiro?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
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
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-[background-color,box-shadow] duration-300 ${
        solido || aberto ? 'bg-creme/95 shadow-[0_1px_0_var(--color-fio)] backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[84rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded p-1" aria-label={`${CONFIG.nome}, início`}>
          <LogoCompacto className="h-10 w-auto sm:h-11" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {itens.map((i) => (
              <li key={i.href}>
                <a
                  href={i.href}
                  className="flex min-h-12 items-center rounded px-3 text-[0.95rem] font-medium text-tinta transition-colors hover:text-terracota-texto"
                >
                  {i.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {zap && (
            <a
              href={zap}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-12 items-center justify-center rounded-full text-tinta transition-colors hover:bg-salvia sm:flex"
              aria-label="Conversar pelo WhatsApp (abre em nova aba)"
            >
              <IconeWhatsApp className="size-6" />
            </a>
          )}
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="botao botao-primario !min-h-12 !px-5 !text-[0.95rem]">
              Agendar
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="flex size-12 items-center justify-center rounded-full text-tinta lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              {aberto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h11" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-fio bg-creme px-6 pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Menu do celular">
          <ul>
            {itens.map((i, n) => (
              <li key={i.href} className="border-b border-fio">
                <a
                  href={i.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-16 items-baseline gap-4 py-3 font-display text-[2rem] leading-none text-tinta"
                >
                  <span className="num text-base text-terracota-texto">{String(n + 1).padStart(2, '0')}</span>
                  {i.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {zap && (
          <a href={zap} target="_blank" rel="noopener noreferrer" className="botao botao-primario mt-8 w-full">
            <IconeWhatsApp /> Agendar pelo WhatsApp
          </a>
        )}
      </div>
    </header>
  )
}
