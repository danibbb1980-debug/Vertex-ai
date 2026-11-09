import { useEffect, useState } from 'react'
import { linkWhatsApp, temWhatsApp } from '../lib/dados'
import { IconeWhatsApp } from './Icones'

/**
 * Celular: barra fixa no rodapé (o body ganha espaço extra para ela não cobrir conteúdo).
 * Desktop: botão flutuante discreto. Ambos aparecem depois que o hero sai da tela.
 */
export function WhatsAppFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const alvo = document.getElementById('inicio')
    if (!alvo) return
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting), { rootMargin: '-40% 0px 0px 0px' })
    io.observe(alvo)
    return () => io.disconnect()
  }, [])
  if (!temWhatsApp) return null
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-filete bg-pedra/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-suave)] md:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        inert={!visivel}
      >
        <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-primario min-h-12 w-full px-4 py-2 text-[0.95rem]" aria-label="Agendar pelo WhatsApp (abre em nova aba)">
          <IconeWhatsApp />
          Agendar pelo WhatsApp
        </a>
      </div>
      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        inert={!visivel}
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-vinho text-pedra shadow-cartao ring-4 ring-pedra/70 transition-[opacity,transform,background-color] duration-500 ease-[var(--ease-suave)] hover:bg-vinho-600 md:flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconeWhatsApp width={26} height={26} />
      </a>
    </>
  )
}
