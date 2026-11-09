import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { Logo } from '../brand/Logo'
import { IconeFechar, IconeMenu } from '../components/Icones'
import { linkWhatsApp, temWhatsApp } from '../lib/dados'

const s = CONFIG.secoes
const LINKS = [
  { href: '#atendimentos', texto: 'Atendimentos', ativo: s.atendimentos && CONFIG.atendimentos.length > 0 },
  { href: '#horarios', texto: 'Horários', ativo: s.estrutura && CONFIG.horarios.length > 0 },
  { href: '#como-funciona', texto: 'Como funciona', ativo: s.comoFunciona },
  { href: '#duvidas', texto: 'Dúvidas', ativo: s.duvidas },
  { href: '#contato', texto: 'Contato', ativo: s.localizacao },
].filter((l) => l.ativo)

export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'
  const agendarHref = s.agendar && temWhatsApp ? '#agendar' : linkWhatsApp()

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab' && painelRef.current) {
        const foc = painelRef.current.querySelectorAll<HTMLElement>('a, button')
        const lista = [botaoRef.current!, ...Array.from(foc)]
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
    document.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const solido = rolou || aberto

  return (
    <header className={`fixed inset-x-0 ${topo} z-50`}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-vinho focus:px-5 focus:py-3 focus:text-pedra">
        Pular para o conteúdo
      </a>
      <div
        className={`border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          solido ? 'border-filete/80 bg-pedra/95 shadow-[0_8px_30px_-22px_rgb(90_30_51/0.5)] backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          <a href="#inicio" className="flex min-h-12 items-center text-vinho" title="Voltar ao início">
            <Logo className="h-9 w-auto sm:h-10 lg:h-11" carregamento="eager" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="relative inline-flex min-h-12 items-center px-3.5 text-[0.95rem] font-medium text-tinta-suave transition-colors hover:text-vinho after:absolute after:inset-x-3.5 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-vinho after:transition-transform after:duration-300 hover:after:scale-x-100">
                    {l.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {agendarHref && (
              <a href={agendarHref} className="btn btn-primario hidden min-h-12 px-6 py-2.5 text-[0.95rem] sm:inline-flex">
                Agendar
              </a>
            )}
            <button
              ref={botaoRef}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-vinho transition-colors hover:bg-rose/60 lg:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <IconeFechar width={24} height={24} /> : <IconeMenu width={24} height={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-4.5rem-2rem)] overflow-y-auto border-b border-filete bg-pedra lg:hidden"
      >
        <nav aria-label="Menu" className="container-site flex flex-col gap-1 py-6">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)} className="flex min-h-14 items-center border-b border-filete/70 font-serif text-[1.65rem] text-vinho">
              {l.texto}
            </a>
          ))}
          {agendarHref && (
            <a href={agendarHref} onClick={() => setAberto(false)} className="btn btn-primario mt-8 w-full">
              Agendar
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
