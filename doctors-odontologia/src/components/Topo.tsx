import { useEffect, useRef, useState } from 'react'
import { CONFIG, waLink } from '../config'
import { IconeFechar, IconeMenu, IconeWhatsApp } from './Icones'

export const LINKS = [
  { href: '#clinica', rotulo: 'A clínica', secao: 'clinica' },
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
  { href: '#agendar', rotulo: 'Agendar', secao: 'agendar' },
] as const

const linksAtivos = LINKS.filter((l) => CONFIG.secoes[l.secao])

export function Logo({ className = '' }: { className?: string }) {
  return (
    <picture>
      <source srcSet="/logo-doctors.webp" type="image/webp" />
      <img
        src="/logo-doctors.png"
        alt="Doctors Odontologia e Saúde"
        width={192}
        height={154}
        className={className}
      />
    </picture>
  )
}

export function Topo() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const primeiro = painelRef.current?.querySelector<HTMLElement>('a')
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

  const solido = rolou || aberto

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {CONFIG.rascunho && (
        <div className="bg-vinho-950 px-4 py-1.5 text-center text-[0.72rem] leading-tight tracking-wide text-ouro-claro" role="note">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </div>
      )}
      <header
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solido ? 'bg-creme/92 shadow-[0_1px_0_var(--color-linha)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-10 focus:rounded focus:bg-vinho focus:px-4 focus:py-2 focus:text-creme"
        >
          Pular para o conteúdo
        </a>
        <div className="container-site flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <a href="#inicio" className="-ml-2 flex shrink-0 items-center rounded" aria-label="Doctors Odontologia e Saúde, voltar ao início">
            <Logo className="h-[54px] w-auto md:h-[62px]" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {linksAtivos.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative inline-flex min-h-12 items-center px-3 text-[0.92rem] text-grafite/85 transition-colors hover:text-vinho after:absolute after:inset-x-3 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-ouro after:transition-transform after:duration-300 hover:after:scale-x-100"
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
              className="hidden min-h-12 items-center gap-2 rounded-full bg-vinho px-5 text-[0.9rem] font-medium text-creme transition-colors hover:bg-vinho-900 sm:inline-flex"
            >
              <IconeWhatsApp tamanho={17} />
              Agendar avaliação
            </a>
            <button
              ref={botaoRef}
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full text-vinho-900 lg:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <IconeFechar /> : <IconeMenu />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-100px)] overflow-y-auto border-t border-linha bg-creme lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-6">
          <ul className="flex flex-col">
            {linksAtivos.map((l, i) => (
              <li key={l.href} className="border-b border-linha">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-baseline gap-4 py-3 font-serif text-[1.6rem] text-vinho-900"
                >
                  <span className="rotulo text-ouro-escuro">{String(i + 1).padStart(2, '0')}</span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex min-h-12 items-center justify-center gap-2 rounded-full bg-vinho px-6 text-creme"
          >
            <IconeWhatsApp tamanho={18} /> Agendar avaliação pelo WhatsApp
          </a>
        </nav>
      </div>
    </div>
  )
}
