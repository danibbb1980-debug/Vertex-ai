import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { Logo, IconeWhatsApp } from './ui'
import { linkWhatsApp } from '../lib/utils'

const links = [
  { href: '#atendimentos', label: 'Atendimentos', secao: 'atendimentos' },
  { href: '#horarios', label: 'Horários', secao: 'horariosDestaque' },
  { href: '#como-funciona', label: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', label: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', label: 'Contato', secao: 'localizacao' },
] as const

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-cacau px-4 text-center text-[0.72rem] tracking-[0.06em] text-nude-claro sm:text-[0.78rem]">
      <p>Rascunho para avaliação. Informações sujeitas a confirmação.</p>
    </div>
  )
}

export function Header() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'
  const visiveis = links.filter((l) => CONFIG.secoes[l.secao])
  const temAgendar = CONFIG.secoes.agendar && !!CONFIG.whatsapp

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24)
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

  const fundo = solido || aberto ? 'bg-creme/95 shadow-[0_1px_0_rgb(78_50_38/0.08),0_10px_30px_-18px_rgb(78_50_38/0.35)] backdrop-blur-md' : 'bg-transparent'

  return (
    <header className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow] duration-500 ${fundo}`}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-choco focus:px-4 focus:py-2 focus:text-creme"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-4 md:h-20">
        <a href="#inicio" className="flex h-full items-center gap-3 py-3 text-ouro">
          <Logo variante="monograma" className="h-full" decorativo />
          <span className="flex flex-col leading-none">
            <span className="text-[0.82rem] font-medium uppercase tracking-[0.3em] text-ouro-esc">Juliana Borges</span>
            <span className="mt-1.5 hidden text-[0.6rem] uppercase tracking-[0.28em] text-choco/80 sm:block">Beleza e Estética</span>
            <span className="sr-only">, voltar ao início</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {visiveis.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-sublinhado py-3 text-[0.95rem] text-choco">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {CONFIG.whatsapp && (
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-12 items-center justify-center rounded-full text-choco transition-colors hover:bg-nude/40 md:inline-flex"
              aria-label="Conversar pelo WhatsApp (abre em nova aba)"
            >
              <IconeWhatsApp className="size-5" />
            </a>
          )}
          {temAgendar ? (
            <a href="#agendar" className="btn btn-primario !min-h-12 !px-5 text-[0.92rem]">
              Agendar
            </a>
          ) : (
            CONFIG.whatsapp && (
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-primario !min-h-12 !px-5">
                Agendar
              </a>
            )
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-choco lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={menuRef}
        hidden={!aberto}
        className="h-[calc(100dvh-6.25rem)] overflow-y-auto border-t border-choco/10 bg-creme lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site flex h-full flex-col pb-10 pt-6">
          <ul className="flex flex-col">
            {[...visiveis, ...(temAgendar ? [{ href: '#agendar', label: 'Solicitar agendamento', secao: 'agendar' }] : [])].map((l) => (
              <li key={l.href} className="border-b border-choco/10">
                <a href={l.href} onClick={() => setAberto(false)} className="flex min-h-14 items-center font-serif text-[1.6rem] text-choco">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            {CONFIG.whatsapp && (
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full" onClick={() => setAberto(false)}>
                <IconeWhatsApp className="size-5" /> Agendar pelo WhatsApp
              </a>
            )}
            <p className="text-center text-sm text-choco/80">{CONFIG.whatsappExibicao}</p>
          </div>
        </nav>
      </div>
    </header>
  )
}
