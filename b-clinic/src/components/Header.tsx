import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { agendarUrl } from '../lib/links'
import { Botao } from './Botao'
import { Monograma } from './Monograma'

export const formAtivo = () => CONFIG.secoes.agendar && CONFIG.usarWhatsapp && !!CONFIG.whatsapp

export function navLinks() {
  const s = CONFIG.secoes
  const prof = CONFIG.profissionais.filter((p) => p.nome.trim())
  return [
    s.clinica && { href: '#clinica', rotulo: 'A clínica' },
    s.tratamentos && CONFIG.tratamentos.length > 0 && { href: '#tratamentos', rotulo: 'Tratamentos' },
    s.equipe && prof.length > 0 && { href: '#equipe', rotulo: 'Equipe' },
    s.comoFunciona && { href: '#como-funciona', rotulo: 'Como funciona' },
    s.duvidas && { href: '#duvidas', rotulo: 'Dúvidas' },
    s.contato && { href: '#contato', rotulo: 'Contato' },
    formAtivo() && { href: '#agendar', rotulo: 'Solicitar horário' },
  ].filter(Boolean) as { href: string; rotulo: string }[]
}

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center justify-center bg-preto px-4 text-center text-[0.6875rem] tracking-[0.06em] text-osso/85"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const links = navLinks()
  const topo = CONFIG.rascunho ? 'top-7' : 'top-0'

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const el = painel.current
    const focaveis = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focaveis()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoMenu.current?.focus()
      }
      if (e.key === 'Tab') {
        const f = focaveis()
        if (!f.length) return
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
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-50 transition-[background-color,border-color] duration-300 ${
        solido || aberto ? 'border-b border-filete bg-osso/95 backdrop-blur-[2px]' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-b flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <a href="#topo" className="flex min-h-12 items-center gap-3" aria-label="B Clinic, voltar ao início">
          {CONFIG.logo ? (
            <img src={CONFIG.logo} alt="" className="h-9 w-9" width={36} height={36} />
          ) : (
            <Monograma className="h-9 w-9" cor="var(--color-champanhe-escuro)" anel={10} traco={16} />
          )}
          <span className="whitespace-nowrap text-[0.95rem] font-normal tracking-[0.2em] uppercase">B Clinic</span>
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative py-3 text-[0.8125rem] tracking-[0.04em] text-preto/85 hover:text-preto after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-champanhe-escuro after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden md:block">
            <Botao href={agendarUrl()} externo variante="cheio" className="!px-5">
              Agendar avaliação
            </Botao>
          </span>
          <button
            ref={botaoMenu}
            type="button"
            className="flex h-12 w-12 items-center justify-center xl:hidden cursor-pointer"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-7 bg-preto transition-transform duration-300 ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-px bg-preto transition-all duration-300 ${aberto ? 'top-1.5 w-7 -rotate-45' : 'top-3 w-5'}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={painel}
        hidden={!aberto}
        className="xl:hidden h-[calc(100svh-4rem-1.75rem)] overflow-y-auto border-t border-filete bg-osso"
      >
        <nav aria-label="Menu" className="container-b flex flex-col py-6">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-filete">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-baseline gap-5 py-4 text-[1.75rem] font-light tracking-[-0.02em]"
                >
                  <span className="num w-7 text-xs tracking-[0.1em] text-champanhe-escuro">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <Botao href={agendarUrl()} externo className="mt-8 w-full" onClick={() => setAberto(false)}>
            Agendar avaliação
          </Botao>
        </nav>
      </div>
    </header>
  )
}
