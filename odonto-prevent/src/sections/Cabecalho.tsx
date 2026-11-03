import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { linkWhatsapp } from '../lib/whatsapp'
import { IconeFechar, IconeMenu, IconeWhatsapp } from '../components/Icones'

const LINKS = [
  { href: '#clinica', rotulo: 'A clínica', secao: CONFIG.secoes.clinica },
  { href: '#prevencao', rotulo: 'Prevenção', secao: CONFIG.secoes.prevencao },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: CONFIG.secoes.duvidas },
  { href: '#contato', rotulo: 'Contato', secao: CONFIG.secoes.localizacao },
  { href: '#agendar', rotulo: 'Agendar', secao: CONFIG.secoes.agendar },
].filter((l) => l.secao)

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-areia px-4 text-center text-[0.72rem] font-medium tracking-[0.01em] text-grafite-950 sm:text-xs">
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

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    painel.current?.querySelector('a')?.focus()
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solido || aberto ? 'border-b border-white/8 bg-grafite-900/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-tinta"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="shrink-0 rounded-md" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <img src="/brand/logo-prevent-192.webp" srcSet="/brand/logo-prevent-192.webp 192w, /brand/logo-prevent.webp 384w" sizes="123px" alt="" width={192} height={75} className="h-11 w-auto sm:h-12" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center px-3 text-[0.95rem] text-grafite-200 transition-colors after:absolute after:inset-x-3 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-menta after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-12 items-center gap-2 rounded-full bg-menta px-5 font-display text-[0.95rem] font-medium text-grafite-950 transition-colors hover:bg-menta-claro sm:inline-flex"
          >
            <IconeWhatsapp tamanho={18} />
            Agendar avaliação
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="grid size-12 place-items-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((a) => !a)}
          >
            {aberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/8 bg-grafite-900 lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site py-6">
          <ul className="divide-y divide-white/8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between font-display text-2xl font-light text-white"
                >
                  {l.rotulo}
                  <span aria-hidden="true" className="text-menta">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-full bg-menta font-display text-lg font-medium text-grafite-950"
          >
            <IconeWhatsapp tamanho={20} />
            Agendar avaliação
          </a>
        </nav>
      </div>
    </header>
  )
}
