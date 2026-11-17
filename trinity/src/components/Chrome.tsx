import { useEffect, useRef, useState } from 'react'
import { CONFIG, wa } from '../config'
import { useChapter } from '../hooks'
import { Logo } from './Logo'

const links = [
  { href: '#atendimentos', label: 'Atendimentos', on: CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: '#cursos', label: 'Cursos', on: CONFIG.secoes.cursos && CONFIG.cursos.length > 0 },
  { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.local },
].filter((l) => l.on)

export function DraftBar() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-[var(--bar-h)] items-center justify-center bg-ink whitespace-nowrap px-2 text-center text-[clamp(0.62rem,2.9vw,0.78rem)] leading-tight text-paper/85">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const chapter = useChapter()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const top = CONFIG.rascunho ? 'var(--bar-h)' : '0px'

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open])

  return (
    <header
      style={{ top }}
      className={`fixed inset-x-0 z-40 transition-colors duration-300 ${
        solid || open ? 'border-b border-ink/15 bg-paper' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#topo" className="-ml-1 flex min-h-12 items-center p-1" aria-label={`${CONFIG.nome} ${CONFIG.descritor}, voltar ao início`}>
          <Logo tone="light" idPrefix="hdr" active={chapter} />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-12 items-center hover:text-bronze">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={wa(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="btn btn-ink hidden min-h-12 py-2 sm:inline-flex">
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="text-[0.95rem]">{open ? 'Fechar' : 'Menu'}</span>
          </button>
        </div>
      </div>
      <nav id="menu-movel" aria-label="Menu" hidden={!open} className="border-t border-ink/15 bg-paper lg:hidden">
        <ul className="mx-auto max-w-[1360px] px-4 py-3 sm:px-8">
          {links.map((l) => (
            <li key={l.href} className="border-b border-ink/10 last:border-0">
              <a href={l.href} onClick={() => setOpen(false)} className="display flex min-h-14 items-center text-[1.6rem]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/20 bg-paper md:hidden">
      <a href={wa(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center bg-ink px-3 text-center text-[0.95rem] font-medium text-paper">
        Agendar avaliação
      </a>
      {CONFIG.cursos.length > 0 ? (
        <a href={wa(CONFIG.mensagens.cursos)} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center px-3 text-center text-[0.95rem] font-medium">
          Perguntar sobre os cursos
        </a>
      ) : (
        <a href="#contato" className="flex min-h-14 items-center justify-center px-3 text-[0.95rem] font-medium">
          Como chegar
        </a>
      )}
    </div>
  )
}

export function FloatingButton() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <a
      href={wa(CONFIG.mensagens.geral)}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`btn btn-ink fixed bottom-6 right-6 z-40 hidden min-h-12 py-2 text-[0.9rem] transition-opacity duration-300 md:inline-flex ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      WhatsApp
    </a>
  )
}
