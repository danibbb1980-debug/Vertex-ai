import { useRef } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { CONFIG } from './config'
import { FaixaRascunho, Header } from './components/Header'
import { Hero } from './components/Hero'
import { Atendimentos, Marquee, Medica, QuandoProcurar } from './components/Secoes'
import { ComoFunciona, Contato, CtaFinal, Duvidas, Rodape } from './components/Secoes2'
import { Agendar } from './components/Agendar'
import { LinhaFluxo } from './components/LinhaFluxo'
import { Flutuantes } from './components/Flutuantes'

export default function App() {
  const s = CONFIG.secoes
  const fluxo = useRef<HTMLDivElement>(null)
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <FaixaRascunho />
        <Header />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <div ref={fluxo} className="relative overflow-x-clip">
            {s.hero && <Hero />}
            {s.marquee && <Marquee />}
            {s.medica && <Medica />}
            {s.atendimentos && <Atendimentos />}
            {s.quandoProcurar && <QuandoProcurar />}
            {s.comoFunciona && <ComoFunciona />}
            {s.duvidas && <Duvidas />}
            {s.contato && <Contato />}
            {s.agendar && <Agendar />}
            <LinhaFluxo alvo={fluxo} />
          </div>
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <Flutuantes />
      </MotionConfig>
    </LazyMotion>
  )
}
