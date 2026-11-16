import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { BotaoWa, Logo } from './ui'

export const LINKS = [
  { href: '#procedimentos', rotulo: 'Procedimentos', secao: 'procedimentos' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'localizacao' },
] as const

export function Header() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao])

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 12)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    if (!aberto) return
    painelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto])

  const solido = rolou || aberto

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {CONFIG.rascunho && (
        <div className="bg-petroleo text-perola">
          <p className="moldura py-1.5 text-center text-[0.75rem] leading-snug tracking-[0.02em]">
            Rascunho para avaliação. Informações sujeitas a confirmação.
          </p>
        </div>
      )}
      <div
        className={`transition-[background-color,border-color] duration-500 border-b ${
          solido ? 'bg-perola border-filete' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="moldura flex h-[4.5rem] items-center justify-between gap-6 md:h-[5.5rem]">
          <a href="#topo" className="-ml-1 block p-1" aria-label={`${CONFIG.nome} | ${CONFIG.descritor}: início`}>
            <Logo className="w-[150px] md:w-[188px]" />
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.95rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="sublinha py-3">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <BotaoWa className="hidden !min-h-11 !px-5 !py-2.5 sm:inline-flex">Agendar avaliação</BotaoWa>
            <button
              ref={botaoRef}
              type="button"
              className="flex min-h-12 min-w-12 items-center gap-3 px-2 lg:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              onClick={() => setAberto((v) => !v)}
            >
              <span className="rotulo">{aberto ? 'Fechar' : 'Menu'}</span>
              <span className="cruz" aria-hidden="true" style={{ transform: aberto ? 'rotate(45deg)' : 'none', transition: 'transform .4s' }} />
            </button>
          </div>
        </div>
        <div
          id="menu-celular"
          ref={painelRef}
          hidden={!aberto}
          className="border-t border-filete bg-perola lg:hidden"
        >
          <nav aria-label="Menu do celular" className="moldura py-4">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-filete last:border-0">
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-14 items-baseline gap-4 py-3 font-serif text-[1.75rem] font-light"
                  >
                    <span className="num rotulo text-agua-escura">{String(i + 1).padStart(2, '0')}</span>
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
            <BotaoWa className="mt-4 w-full">Agendar avaliação</BotaoWa>
          </nav>
        </div>
      </div>
    </header>
  )
}
