import { useEffect, useState } from 'react'
import { CONFIG, linkWhatsApp } from '../config'
import { IconeWhatsApp } from '../components/base'

/**
 * Celular: barra fixa no rodapé (o <body> ganha espaço extra para ela não cobrir
 * conteúdo). Desktop: botão redondo discreto. Ambos aparecem depois do hero.
 */
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  const estado = visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
  return (
    <>
      <div
        className={`escuro fixed inset-x-0 bottom-0 z-40 border-t border-champagne/20 bg-navy-900/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,opacity] duration-500 md:hidden ${estado}`}
        aria-hidden={!visivel}
      >
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visivel ? 0 : -1}
          className="botao botao-ouro w-full"
        >
          <IconeWhatsApp tamanho={19} />
          Agendar avaliação pelo WhatsApp
        </a>
      </div>
      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        aria-label={`WhatsApp da ${CONFIG.nome}: agendar avaliação`}
        title="Agendar avaliação pelo WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-champagne/50 bg-navy-900 text-champagne shadow-[0_10px_30px_-10px_rgb(14_23_40/0.6)] transition-[transform,opacity] duration-500 hover:scale-105 md:flex ${estado}`}
      >
        <IconeWhatsApp tamanho={24} />
      </a>
    </>
  )
}
