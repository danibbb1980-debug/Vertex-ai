import { useEffect, useState } from 'react'
import { linkTelefone, linkWhatsapp } from '../lib/whatsapp'
import { IconeTelefone, IconeWhatsapp } from '../components/Icones'

/** Barra fixa no celular + botão flutuante discreto no desktop (aparecem depois do hero). */
export function ContatoFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const transicao = `transition-[transform,opacity] duration-500 ease-suave ${visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-grafite-900/95 px-3 pt-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden ${transicao}`}
        aria-hidden={!visivel}
      >
        <div className="mx-auto flex max-w-md gap-2">
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visivel ? 0 : -1}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-menta font-display font-medium text-grafite-950"
          >
            <IconeWhatsapp tamanho={19} /> Agendar pelo WhatsApp
          </a>
          <a
            href={linkTelefone()}
            tabIndex={visivel ? 0 : -1}
            aria-label="Ligar para a clínica"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 text-white"
          >
            <IconeTelefone tamanho={20} />
          </a>
        </div>
      </div>
      <a
        href={linkWhatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        aria-hidden={!visivel}
        tabIndex={visivel ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 place-items-center rounded-full bg-menta text-grafite-950 shadow-[0_18px_40px_-14px_rgba(23,24,26,0.55)] ring-4 ring-grafite-900/10 hover:bg-menta-claro lg:grid ${transicao}`}
      >
        <IconeWhatsapp tamanho={26} />
      </a>
    </>
  )
}
