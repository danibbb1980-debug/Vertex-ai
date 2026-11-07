import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { linkWhatsapp, temWhatsapp } from '../lib/dados'
import { Logo } from './Marca'
import { IconeFechar, IconeMenu, IconeWhatsapp } from './Icones'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-oliva-noite px-3 text-center text-[0.69rem] font-medium leading-tight text-sobre-oliva min-[400px]:text-[0.75rem] sm:text-[0.78rem] sm:tracking-[0.02em]"
    >
      <span className="mr-2 hidden h-1.5 w-1.5 shrink-0 rounded-full bg-mel sm:inline-block" aria-hidden="true" />
      <span>Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </div>
  )
}

const LINKS = [
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#horarios', rotulo: 'Horários', secao: 'horariosDestaque' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'localizacao' },
] as const

export function Topo() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao])
  const temForm = CONFIG.secoes.agendamento && temWhatsapp
  const agendarHref = temForm ? '#agendar' : temWhatsapp ? linkWhatsapp() : '#contato'

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
      if (e.key === 'Tab' && painel.current) {
        const foc = painel.current.querySelectorAll<HTMLElement>('a,button')
        const first = botaoMenu.current
        const last = foc[foc.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
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

  const solido = rolou || aberto
  const topo = CONFIG.rascunho ? 'top-8' : 'top-0'

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solido ? 'bg-aveia/92 shadow-[0_1px_0_rgb(52_73_59/0.12)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-6 md:h-20">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center rounded-lg px-1">
          <Logo className="text-[15px] md:text-base" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-12 items-center rounded-full px-3.5 text-[0.95rem] font-medium text-grafite/85 transition-colors hover:text-oliva after:absolute after:inset-x-3.5 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-mel after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={agendarHref}
            {...(!temForm && temWhatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="hidden min-h-12 items-center gap-2 rounded-full bg-oliva px-5 text-[0.95rem] font-semibold text-aveia transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            Agendar
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-oliva transition-colors hover:bg-areia lg:hidden"
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
        className="h-[calc(100dvh-6.25rem)] overflow-y-auto border-t border-oliva/10 bg-aveia lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site flex flex-col gap-1 py-6">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="surge flex min-h-14 items-center justify-between border-b border-oliva/10 font-serif text-[1.65rem] text-grafite"
              style={{ ['--atraso' as string]: `${i * 50}ms` }}
            >
              {l.rotulo}
              <span className="text-base text-mel-texto" aria-hidden="true">0{i + 1}</span>
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            {temForm && (
              <a href="#agendar" onClick={() => setAberto(false)} className="inline-flex min-h-13 items-center justify-center rounded-full bg-oliva px-6 font-semibold text-aveia">
                Solicitar agendamento
              </a>
            )}
            {temWhatsapp && (
              <a
                href={linkWhatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAberto(false)}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-mel px-6 font-semibold text-grafite"
              >
                <IconeWhatsapp /> Agendar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
