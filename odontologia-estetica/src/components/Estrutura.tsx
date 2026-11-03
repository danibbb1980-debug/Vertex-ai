import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { MSG_GERAL, formatarFone, telLink, waLink } from '../lib/contato'
import { IconeTelefone, IconeWhatsApp } from './Icones'

export const LINKS = [
  { href: '#clinica', rotulo: 'A clínica', ativo: CONFIG.secoes.clinica },
  { href: '#atendimentos', rotulo: 'Atendimentos', ativo: CONFIG.secoes.atendimentos },
  { href: '#como-funciona', rotulo: 'Como funciona', ativo: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', rotulo: 'Dúvidas', ativo: CONFIG.secoes.duvidas },
  { href: '#contato', rotulo: 'Contato', ativo: CONFIG.secoes.contato },
  { href: '#agendar', rotulo: 'Agendamento', ativo: CONFIG.secoes.agendar, soXl: true },
].filter((l) => l.ativo)

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-taupe-950 px-3 text-center text-[0.68rem] leading-tight text-pedra-100 sm:text-[0.75rem] sm:tracking-wide"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function BotaoWhats({
  texto = 'Agendar avaliação',
  mensagem = MSG_GERAL,
  variante = 'cheio',
  className = '',
}: {
  texto?: string
  mensagem?: string
  variante?: 'cheio' | 'contorno' | 'claro'
  className?: string
}) {
  const estilos = {
    cheio: 'bg-taupe-800 text-gelo hover:bg-taupe-950',
    contorno: 'border border-taupe-700/40 text-taupe-900 hover:border-taupe-900 hover:bg-pedra-50',
    claro: 'bg-gelo text-taupe-950 hover:bg-pedra-100',
  }[variante]
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden px-6 whitespace-nowrap text-[0.95rem] font-medium transition-colors duration-300 ${estilos} ${className}`}
    >
      {/* efeito sutil: um arco que cresce do canto */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 size-12 origin-bottom-right scale-0 rounded-tl-full bg-terracota/25 transition-transform duration-500 ease-(--ease-encaixe) group-hover:scale-[2.2]"
      />
      <IconeWhatsApp size={18} />
      <span className="relative">{texto}</span>
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  )
}

export function Cabecalho() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', tecla)
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => document.removeEventListener('keydown', tecla)
  }, [aberto])

  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow] duration-300 ${
        solido || aberto ? 'bg-gelo/95 shadow-[0_1px_0_rgb(87_81_75/0.12)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="flex shrink-0 items-center gap-3">
          <img src="/img/logo.webp" alt="" width={48} height={48} className="size-12 rounded-full mix-blend-multiply" />
          <span className="block leading-tight">
            <span className="block font-display text-[1.05rem] text-taupe-900">Odontologia Estética</span>
            <span className="rotulo block text-[0.56rem] tracking-[0.14em] text-taupe-700 sm:text-[0.62rem] sm:tracking-[0.22em]">Dr. André Totti &amp; Dr. Douglas Barbosa</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[0.92rem] whitespace-nowrap">
            {LINKS.map((l) => (
              <li key={l.href} className={'soXl' in l ? 'hidden xl:block' : undefined}>
                <a
                  href={l.href}
                  className="relative py-2 text-taupe-800 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-terracota after:transition-transform after:duration-300 hover:text-taupe-950 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <BotaoWhats />
          </span>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-12 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-taupe-900 transition-transform duration-300 ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-taupe-900 transition-transform duration-300 ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={menuRef}
        hidden={!aberto}
        className="border-t border-pedra-200 bg-gelo lg:hidden"
      >
        <nav aria-label="Menu" className="container-site py-4">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-12 items-center border-b border-pedra-100 font-display text-xl text-taupe-900"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <BotaoWhats className="mt-5 w-full" />
        </nav>
      </div>
    </header>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular). */
export function ContatoFixo() {
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-musgo text-gelo shadow-[0_8px_24px_rgb(47_43_39/0.18)] transition-transform duration-300 hover:-translate-y-0.5 md:flex"
      >
        <IconeWhatsApp size={24} />
        <span className="sr-only">Agendar avaliação pelo WhatsApp (abre em nova aba)</span>
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-px border-t border-pedra-200 bg-pedra-200 pb-[env(safe-area-inset-bottom)] md:hidden">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 items-center justify-center gap-2 bg-taupe-800 text-[0.95rem] font-medium text-gelo"
        >
          <IconeWhatsApp size={18} />
          Agendar avaliação
          <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
        </a>
        <a
          href={telLink(CONFIG.telefone)}
          className="flex min-h-14 items-center justify-center gap-2 bg-gelo px-5 text-[0.95rem] text-taupe-900"
        >
          <IconeTelefone size={18} />
          Ligar
          <span className="sr-only"> para {formatarFone(CONFIG.telefone)}</span>
        </a>
      </div>
    </>
  )
}
