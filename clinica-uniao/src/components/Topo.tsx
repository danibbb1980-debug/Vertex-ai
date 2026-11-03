import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CONFIG } from '../config'
import { waLink } from '../lib/links'
import { IconeWhats } from './Icones'

export const NAV = [
  { href: '#clinica', label: 'A clínica', secao: 'clinica' },
  { href: '#atendimentos', label: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', label: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', label: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', label: 'Contato', secao: 'localizacao' },
  { href: '#agendar', label: 'Agendar', secao: 'agendar' },
] as const

const navAtiva = NAV.filter((n) => CONFIG.secoes[n.secao as keyof typeof CONFIG.secoes])

export function Logo({ className = '', sizes = '140px' }: { className?: string; sizes?: string }) {
  return (
    <img
      src="/img/logo-uniao-400.webp"
      srcSet="/img/logo-uniao-400.webp 400w, /img/logo-uniao-800.webp 800w"
      sizes={sizes}
      width={400}
      height={145}
      alt="Clínica União, Pouso Alegre"
      className={className}
      decoding="async"
    />
  )
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center whitespace-nowrap bg-choco-950 px-3 text-center text-[0.69rem] font-medium leading-none text-camel-300 min-[400px]:text-[0.75rem] sm:text-[0.78rem] sm:tracking-wide"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Cabecalho() {
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab' && painelRef.current) {
        const foco = painelRef.current.querySelectorAll<HTMLElement>('a,button')
        const lista = [botaoRef.current!, ...Array.from(foco)]
        const i = lista.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          lista[lista.length - 1].focus()
        } else if (!e.shiftKey && i === lista.length - 1) {
          e.preventDefault()
          lista[0].focus()
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

  const fundo = solido || aberto

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        CONFIG.rascunho ? 'top-8' : 'top-0'
      } ${fundo ? 'bg-ivory/95 shadow-[0_1px_0_rgba(98,75,54,.12)] backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" className="shrink-0 rounded-md" aria-label="Clínica União, voltar ao início">
          <Logo className="h-11 w-auto sm:h-12" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navAtiva.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium text-choco-800 transition-colors hover:bg-choco-900/[0.05] hover:text-choco-950"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {CONFIG.whatsapp && (
            <a
              href={CONFIG.secoes.agendar ? '#agendar' : waLink()}
              {...(CONFIG.secoes.agendar ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="btn btn-primario btn-brilho hidden !px-5 sm:inline-flex"
            >
              <IconeWhats className="h-[18px] w-[18px]" />
              Agendar avaliação
            </a>
          )}
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-choco-900 hover:bg-choco-900/[0.06] lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-72px-var(--banner-h))] overflow-y-auto border-t border-choco-700/10 bg-ivory lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul className="divide-y divide-choco-700/10">
            {navAtiva.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between py-3 font-serif text-2xl text-choco-900"
                >
                  {n.label}
                  <span aria-hidden className="text-camel-600">→</span>
                </a>
              </li>
            ))}
          </ul>
          {CONFIG.whatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primario mt-8 w-full"
              onClick={() => setAberto(false)}
            >
              <IconeWhats /> Agendar pelo WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
