import { useEffect, useRef, useState } from 'react'
import { CONFIG, linkWhatsApp } from '../config'
import { IconeFechar, IconeInstagram, IconeMenu, IconeSeta, IconeWhatsApp, Logo } from '../components/base'

export const LINKS = [
  { href: '#clinica', rotulo: 'A clínica' },
  { href: '#atendimentos', rotulo: 'Atendimentos' },
  { href: '#profissionais', rotulo: 'Profissionais' },
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: '#duvidas', rotulo: 'Dúvidas' },
  { href: '#agendar', rotulo: 'Agendar' },
  { href: '#contato', rotulo: 'Contato' },
]

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center border-b border-champagne/20 bg-navy-950 px-3 text-center text-[0.65rem] font-medium tracking-normal text-champagne sm:text-xs sm:tracking-[0.08em]"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Cabecalho() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Menu do celular: trava a rolagem, fecha com Esc e mantém o foco dentro
  useEffect(() => {
    if (!aberto) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focaveis = () => Array.from(painel.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focaveis()[0]?.focus()
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
      if (e.key === 'Tab') {
        const f = focaveis()
        if (!f.length) return
        const primeiro = f[0]
        const ultimo = f[f.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = anterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`escuro fixed inset-x-0 ${topo} z-50 transition-[background-color,border-color] duration-500 ${
        solido || aberto ? 'border-b border-champagne/15 bg-navy-900/95 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-vc flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="flex items-center gap-3 text-ivory" aria-label={`Vilhena Carvalho Odontologia, ${CONFIG.nome}: voltar ao início`}>
          <Logo tamanho={44} />
          <span className="flex flex-col leading-none">
            <span className="whitespace-nowrap font-display text-[0.95rem] font-semibold tracking-[0.14em] sm:text-[1.05rem] sm:tracking-[0.2em]">VILHENA CARVALHO</span>
            <span className="mt-1 text-[0.625rem] font-medium tracking-[0.36em] text-champagne sm:tracking-[0.42em]">ODONTOLOGIA</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-5 text-sm text-ivory/85">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative whitespace-nowrap py-3 transition-colors hover:text-champagne">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-ouro hidden !min-h-11 whitespace-nowrap !px-5 !py-2.5 text-sm sm:inline-flex"
          >
            Agendar avaliação
            <IconeSeta tamanho={16} className="seta" />
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full text-ivory xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar tamanho={24} /> : <IconeMenu tamanho={24} />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100svh-4.5rem-2rem)] overflow-y-auto border-t border-champagne/15 bg-navy-900 xl:hidden"
      >
        <nav aria-label="Menu do celular" className="container-vc flex min-h-full flex-col py-8">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-champagne/10">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between py-3 font-display text-3xl text-ivory"
                >
                  {l.rotulo}
                  <IconeSeta tamanho={18} className="text-champagne" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="botao botao-ouro w-full">
              <IconeWhatsApp tamanho={19} />
              Agendar avaliação pelo WhatsApp
            </a>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno-claro w-full">
              <IconeInstagram tamanho={19} />
              {CONFIG.instagram.usuario}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
