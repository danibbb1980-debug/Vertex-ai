import { useEffect, useState, type ReactElement } from 'react'
import { CONFIG, temOab, temWhatsapp, waLink } from './config'
import { Header } from './components/Header'
import { Margem, useFolhaAtual } from './components/Margem'
import { Advogado, Atuacao, ComoFunciona, Contato, CtaFinal, Duvidas, Hero, Quando, Rodape } from './components/Secoes'
import { Agendar } from './components/Agendar'
import { Seta } from './components/Icones'

type Def = { chave: string; on: boolean; C: (p: { fls: number }) => ReactElement }

/** Ordem das folhas. Seção desligada ou sem conteúdo não entra (e não recebe número). */
const DEFS: Def[] = [
  { chave: 'hero', on: CONFIG.secoes.hero, C: Hero },
  { chave: 'atuacao', on: CONFIG.secoes.atuacao && CONFIG.areas.length > 0, C: Atuacao },
  { chave: 'advogado', on: CONFIG.secoes.advogado && temOab && !!CONFIG.advogado.nome, C: Advogado },
  { chave: 'quando', on: CONFIG.secoes.quando, C: Quando },
  { chave: 'como', on: CONFIG.secoes.comoFunciona, C: ComoFunciona },
  { chave: 'duvidas', on: CONFIG.secoes.duvidas, C: Duvidas },
  { chave: 'contato', on: CONFIG.secoes.contato, C: Contato },
  { chave: 'agendar', on: CONFIG.secoes.agendar && temWhatsapp, C: Agendar },
]

export default function App() {
  const folhas = DEFS.filter((d) => d.on)
  const total = folhas.length
  const atual = useFolhaAtual()
  const temAgendar = folhas.some((f) => f.chave === 'agendar')
  const [passouHero, setPassouHero] = useState(false)

  useEffect(() => {
    if (!CONFIG.rascunho) document.documentElement.style.setProperty('--topo', '0px')
    const on = () => setPassouHero(window.scrollY > window.innerHeight * 0.8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      {CONFIG.rascunho && (
        <div
          role="note"
          className="fixed inset-x-0 top-0 z-50 flex h-[var(--topo)] items-center justify-center bg-grafite px-3 text-center text-[12px] leading-tight text-papel"
        >
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </div>
      )}
      <Margem atual={atual} total={total} />
      <Header atual={atual} total={total} temAgendar={temAgendar} />

      <main id="conteudo">
        {folhas.map((f, i) => (
          <f.C key={f.chave} fls={i + 1} />
        ))}
        {CONFIG.secoes.ctaFinal && <CtaFinal temAgendar={temAgendar} />}
      </main>
      <Rodape />

      {temWhatsapp && (
        <>
          {/* botão flutuante discreto (desktop) */}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={!passouHero}
            tabIndex={passouHero ? 0 : -1}
            className={`btn btn-tinta fixed right-6 bottom-6 z-30 hidden !min-h-12 !px-5 !text-[14px] transition-[opacity,transform] duration-500 md:inline-flex ${
              passouHero ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            WhatsApp
            <Seta />
          </a>
          {/* barra fixa no celular: o rodapé tem folga inferior para não ser coberto */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grafite bg-papel p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-tinta w-full">
              Agendar pelo WhatsApp
              <Seta />
            </a>
          </div>
        </>
      )}
    </>
  )
}
