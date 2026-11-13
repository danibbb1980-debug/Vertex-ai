import { useEffect, useState } from 'react'
import { CONFIG, temWhatsapp, waLink } from '../config'
import { IconeWhatsapp } from './Icones'

/** Celular: barra fixa inferior. Desktop: botão flutuante discreto após o hero. */
export function BarraContato() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const on = () => setVisivel(window.scrollY > window.innerHeight * 0.9)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!temWhatsapp) return null
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-fio bg-marfim/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <div className="grid grid-cols-[1.3fr_1fr] gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio !px-3 text-[0.95rem]">
            <IconeWhatsapp />
            WhatsApp
          </a>
          {CONFIG.secoes.agendar ? (
            <a href="#agendar" className="botao botao-linha !px-3 text-[0.95rem]">
              Pedir horário
            </a>
          ) : (
            <a href={`tel:${CONFIG.telefone.tel}`} className="botao botao-linha !px-3 text-[0.95rem]">
              Ligar
            </a>
          )}
        </div>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-cafe text-creme ring-1 ring-caramelo/40 transition-[opacity,transform] duration-500 hover:bg-caramelo-queimado sm:inline-flex ${
          visivel ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <IconeWhatsapp className="size-6" />
      </a>
    </>
  )
}
