import { useEffect, useState } from 'react'
import { CONFIG, temEndereco, temWhatsapp, waLink } from '../config'
import { useScrolled } from '../hooks'
import { Logo } from './Logo'
import { Contador } from './Margem'

type Props = { atual: number; total: number; temAgendar: boolean }

export function Header({ atual, total, temAgendar }: Props) {
  const scrolled = useScrolled()
  const [aberto, setAberto] = useState(false)

  const links = [
    { href: '#atuacao', label: 'Atuação', on: CONFIG.secoes.atuacao && CONFIG.areas.length > 0 },
    { href: '#como-funciona', label: 'Como funciona', on: CONFIG.secoes.comoFunciona },
    { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
    { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
    { href: '#localizacao', label: 'Localização', on: CONFIG.secoes.contato && temEndereco },
    { href: '#agendar', label: 'Solicitar agendamento', on: temAgendar, soMobile: true },
  ].filter((l) => l.on)

  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aberto])

  const solido = scrolled || aberto

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-colors duration-300 ${
        solido ? 'border-b border-fio bg-papel/95 backdrop-blur-[2px]' : 'border-b border-transparent bg-transparent'
      }`}
      style={{ top: 'var(--topo)' }}
    >
      <div className="folha">
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-4 px-4 md:h-[76px] md:px-8">
          <a href="#topo" className="-my-2 flex min-h-12 items-center py-2" aria-label="Início">
            <Logo className="hidden h-[42px] w-auto sm:block" />
            <Logo compacto className="h-[34px] w-auto sm:hidden" />
          </a>

          <nav aria-label="Principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {links
                .filter((l) => !l.soMobile)
                .map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="inline-flex min-h-12 items-center px-3 text-[15px] underline-offset-[6px] hover:text-caneta hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          {temWhatsapp && (
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-tinta ml-2 hidden !min-h-12 !px-5 !text-[14px] md:inline-flex"
            >
              Agendar atendimento
            </a>
          )}

          <Contador atual={atual} total={total} className="ml-auto md:hidden" />

          <button
            type="button"
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
              {aberto ? (
                <path d="M4 0l14 14M18 0L4 14" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M0 1h22M0 7h22M8 13h14" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        </div>

        <nav
          id="menu-movel"
          aria-label="Menu"
          hidden={!aberto}
          className="border-t border-fio px-4 pb-6 lg:hidden"
        >
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-fio">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-baseline gap-4 py-3 font-serif text-[26px] leading-tight"
                >
                  <span className="rotulo text-caneta">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
