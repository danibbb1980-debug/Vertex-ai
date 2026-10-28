import { useEffect } from 'react'
import { CONFIG } from './config'
import { Cabecalho, FaixaRascunho } from './sections/Topo'
import { Hero } from './sections/Hero'
import { Clinica, Marquee } from './sections/Clinica'
import { Atendimentos, ParaQuem } from './sections/Atendimentos'
import { ComoFunciona, Compromissos, Profissionais } from './sections/Equipe'
import { Avaliacoes, CtaFinal, Duvidas, Estrutura, Localizacao, Rodape } from './sections/Contato'
import { WhatsAppFlutuante } from './sections/Flutuante'
import { Agendamento } from './sections/Agendamento'

/** Revela elementos .revela ao entrarem na tela (uma vez só). */
function useRevelar() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.revela, .filete-revela')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visivel'))
      return
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('visivel')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Carrega a lib motion só depois da página pronta e só se houver movimento. */
function useMovimento() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let parar: (() => void) | undefined
    let cancelado = false
    const carregar = () =>
      import('./lib/movimento').then((m) => {
        if (!cancelado) parar = m.iniciar()
      })
    const ocioso = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    const id = ocioso ? ocioso(carregar, { timeout: 1200 }) : window.setTimeout(carregar, 300)
    return () => {
      cancelado = true
      if (ocioso) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      parar?.()
    }
  }, [])
}

export function App() {
  useRevelar()
  useMovimento()
  const s = CONFIG.secoes
  return (
    <>
        <a
          href="#conteudo"
          className="fixed left-4 top-12 z-[70] -translate-y-24 rounded-full bg-champagne px-5 py-3 text-sm font-semibold text-navy-900 focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <FaixaRascunho />
        <Cabecalho />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero />
          {s.clinica && <Clinica />}
          {s.marquee && <Marquee />}
          {s.atendimentos && <Atendimentos />}
          {s.paraQuem && <ParaQuem />}
          {s.comoFunciona && <ComoFunciona />}
          {s.profissionais && <Profissionais />}
          {s.compromissos && <Compromissos />}
          {s.estrutura && <Estrutura />}
          {s.avaliacoes && <Avaliacoes />}
          {s.duvidas && <Duvidas />}
          {s.agendamento && <Agendamento />}
          {s.localizacao && <Localizacao />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <WhatsAppFlutuante />
    </>
  )
}
