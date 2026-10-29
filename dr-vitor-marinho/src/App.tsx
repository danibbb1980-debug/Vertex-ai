import { useEffect } from 'react'
import { CONFIG } from './config'
import { DraftBanner } from './components/DraftBanner'
import { Header } from './components/Header'
import { WhatsAppDock } from './components/WhatsAppDock'
import { Marquee } from './components/Marquee'
import { SquaresDivider } from './components/SquaresDivider'
import { Hero } from './sections/Hero'
import { Consultorio } from './sections/Consultorio'
import { Atendimentos } from './sections/Atendimentos'
import { Formacao } from './sections/Formacao'
import { ParaQuem } from './sections/ParaQuem'
import { ComoFunciona } from './sections/ComoFunciona'
import { Estrutura } from './sections/Estrutura'
import { Faq } from './sections/Faq'
import { Localizacao } from './sections/Localizacao'
import { Agendamento } from './sections/Agendamento'
import { CtaFinal } from './sections/CtaFinal'
import { Footer } from './sections/Footer'
import { setLenis } from './lib/scroll'

export default function App() {
  const s = CONFIG.secoes

  // Rolagem suave só com mouse/trackpad e sem preferência por movimento reduzido.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let destroy = () => {}
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
      setLenis(lenis)
      const loop = (t: number) => {
        lenis.raf(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      destroy = () => {
        cancelAnimationFrame(raf)
        lenis.destroy()
        setLenis(null)
      }
    })
    return () => destroy()
  }, [])

  return (
    <>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[70] focus:bg-paper focus:px-4 focus:py-3 focus:text-ink">
          Pular para o conteúdo
        </a>
        <DraftBanner />
        <Header />
        <main id="conteudo">
          <Hero />
          {s.marquee && CONFIG.atendimentos.length > 0 && (
            <Marquee items={[...CONFIG.atendimentos.map((a) => a.titulo), 'Dentística', 'Atendimento com hora marcada']} />
          )}
          {s.consultorio && <Consultorio />}
          {s.atendimentos && <Atendimentos />}
          {s.formacao && <Formacao />}
          {s.paraQuem && (
            <>
              <div className="container-x">
                <SquaresDivider />
              </div>
              <ParaQuem />
            </>
          )}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.faq && <Faq />}
          {s.localizacao && <Localizacao />}
          {s.agendamento && <Agendamento />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Footer />
        <WhatsAppDock />
    </>
  )
}
