import { useEffect, useState } from 'react'
import { agendarUrl, agendarCanal } from '../lib/links'

/**
 * Celular: barra fixa inferior (o rodapé reserva espaço para não cobrir conteúdo).
 * Desktop: botão flutuante discreto. Aparece depois do hero.
 */
export function BarraAgendar() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const on = () => setVisivel(window.scrollY > window.innerHeight * 0.9)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-[var(--ease-saida)] md:inset-x-auto md:bottom-6 md:right-6 ${
        visivel ? 'translate-y-0' : 'translate-y-[calc(100%+2rem)]'
      }`}
      aria-hidden={!visivel}
    >
      <a
        href={agendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visivel ? 0 : -1}
        className="flex min-h-14 items-center justify-center gap-3 border-t border-champanhe bg-preto px-6 pb-[env(safe-area-inset-bottom)] text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-osso md:min-h-12 md:rounded-full md:border md:pb-0 md:pl-3 md:pr-5 hover:text-champanhe"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none">
          <circle cx="12" cy="12" r="11" stroke="var(--color-champanhe)" strokeWidth="1" />
          <path d="M8 12h8M13 9l3 3-3 3" stroke="currentColor" strokeWidth="1" />
        </svg>
        Agendar avaliação
        <span className="sr-only"> pelo {agendarCanal()} (abre em nova aba)</span>
      </a>
    </div>
  )
}
