import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { IconFechar, IconMenu, IconWhats } from './Icons'

const LINKS = [
  { href: '#consultorio', label: 'O consultório', on: CONFIG.secoes.consultorio },
  { href: '#atendimento', label: 'Atendimento', on: CONFIG.secoes.atendimento },
  { href: '#pais', label: 'Para os pais', on: CONFIG.secoes.pais },
  { href: '#primeira-consulta', label: 'Primeira consulta', on: CONFIG.secoes.primeiraConsulta },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
  { href: '#agendar', label: 'Agendar', on: CONFIG.secoes.agendar },
].filter((l) => l.on)

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center whitespace-nowrap bg-tinta px-2 text-center text-[0.66rem] font-semibold text-creme min-[400px]:text-[0.72rem] sm:text-[0.8rem] sm:tracking-wide"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    painelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab' && painelRef.current) {
        const f = painelRef.current.querySelectorAll<HTMLElement>('a,button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [aberto])

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow] duration-300 ${
        solido || aberto ? 'bg-creme/92 shadow-[0_1px_0_rgb(28_41_67/0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#inicio" className="flex shrink-0 items-center rounded-xl" aria-label={`${CONFIG.marca}, ${CONFIG.descritor}. Ir para o início`}>
          <img
            src={CONFIG.logo.marca}
            srcSet={CONFIG.logo.marcaSrcSet}
            width={CONFIG.logo.marcaW}
            height={CONFIG.logo.marcaH}
            alt=""
            className="h-11 w-auto"
            decoding="async"
          />
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-flex min-h-12 items-center px-3 text-[0.95rem] font-bold text-tinta-2 transition-colors hover:text-tinta"
                >
                  {l.label}
                  <span className="absolute inset-x-3 bottom-2.5 h-[2px] origin-left scale-x-0 rounded-full bg-framboesa transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario hidden !min-h-12 !px-5 sm:inline-flex">
            <IconWhats size={20} />
            Agendar avaliação
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full text-tinta transition-colors hover:bg-white/70 xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconFechar size={26} /> : <IconMenu size={26} />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="xl:hidden border-t border-tinta/10 bg-creme"
        style={{ height: `calc(100dvh - 4.5rem - ${CONFIG.rascunho ? '2rem' : '0px'})` }}
      >
        <nav aria-label="Menu do celular" className="container-site flex h-full flex-col overflow-y-auto py-6">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-tinta/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center font-display text-2xl text-tinta"
                  style={{ fontVariationSettings: "'SOFT' 100" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-8 w-full">
            <IconWhats size={20} />
            Agendar pelo WhatsApp
          </a>
          <p className="mt-auto pt-8 text-sm text-tinta-3">
            {CONFIG.nome} · {CONFIG.cro}
          </p>
        </nav>
      </div>
    </header>
  )
}
