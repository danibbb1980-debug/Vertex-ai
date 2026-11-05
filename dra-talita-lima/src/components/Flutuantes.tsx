import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/util'
import { IconeWhatsApp } from './base'

/** Botão flutuante discreto (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function Flutuantes() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-vinho text-white shadow-[0_18px_40px_-16px_rgba(142,38,64,.8)] transition-[opacity,transform] duration-500 ease-[var(--ease-flui)] hover:bg-vinho-2 md:flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconeWhatsApp className="size-6" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-marfim/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-flui)] md:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!visivel}
      >
        <div className="flex gap-2">
          <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" tabIndex={visivel ? 0 : -1} className="btn btn-primario !min-h-12 flex-1 !px-4 !text-[0.95rem]">
            <IconeWhatsApp />
            <span>Agendar pelo WhatsApp</span>
          </a>
          <a href={CONFIG.telefoneLink} tabIndex={visivel ? 0 : -1} aria-label={`Ligar para ${CONFIG.telefone}`} className="btn btn-secundario !min-h-12 !px-4 !text-[0.95rem]">
            <Phone className="size-[1.1rem]" strokeWidth={1.6} aria-hidden="true" />
            <span>Ligar</span>
          </a>
        </div>
      </div>
    </>
  )
}
