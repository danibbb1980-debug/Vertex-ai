import { useEffect } from 'react'
import { CONFIG } from './config'
import { ArchLine } from './components/ArchLine'
import { AreasMarquee } from './components/AreasMarquee'
import { Atendimentos } from './components/Atendimentos'
import { Avaliacoes } from './components/Avaliacoes'
import { ComoFunciona } from './components/ComoFunciona'
import { Consultorio } from './components/Consultorio'
import { Contato } from './components/Contato'
import { CtaFinal } from './components/CtaFinal'
import { DraftBanner } from './components/DraftBanner'
import { Estrutura } from './components/Estrutura'
import { Faq } from './components/Faq'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ParaQuem } from './components/ParaQuem'
import { Profissional } from './components/Profissional'

/** Revela elementos [data-reveal] ao entrar na tela (só transform/opacity). */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Rolagem suave (Lenis), carregada depois da primeira pintura e só sem reduced-motion. */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let stop = false
    let raf = 0
    const id = window.setTimeout(async () => {
      const { default: Lenis } = await import('lenis')
      if (stop) return
      // âncoras: o deslocamento do header vem do scroll-padding-top do CSS
      const lenis = new Lenis({ duration: 1.1, anchors: true, autoRaf: false })
      window.__lenis = lenis
      const loop = (t: number) => {
        lenis.raf(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }, 400)
    return () => {
      stop = true
      clearTimeout(id)
      cancelAnimationFrame(raf)
      window.__lenis?.destroy()
      window.__lenis = undefined
    }
  }, [])
}

export default function App() {
  useReveal()
  useSmoothScroll()
  const s = CONFIG.secoes
  return (
    <>
        <DraftBanner />
        <Header />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero />
          {s.areas && <AreasMarquee />}
          <ArchLine>
            {s.consultorio && <Consultorio />}
            {s.atendimentos && <Atendimentos />}
            {s.paraQuem && <ParaQuem />}
            {s.comoFunciona && <ComoFunciona />}
            {s.profissional && <Profissional />}
            {s.estrutura && <Estrutura />}
            {s.avaliacoes && <Avaliacoes />}
            {s.faq && <Faq />}
            {s.contato && <Contato />}
          </ArchLine>
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Footer />
        <FloatingWhatsApp />
    </>
  )
}
