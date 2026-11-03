import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { CONFIG } from './config'
import { Topo } from './components/Topo'
import { EixoDourado } from './components/EixoDourado'
import { Hero } from './components/Hero'
import { Atendimentos, Clinica, ComoFunciona, Equipe, Estrutura, QuandoProcurar } from './components/Secoes'
import { Agendar } from './components/Agendar'
import { Contato, CtaFinal, Duvidas, Rodape, WhatsAppFixo } from './components/Final'

export default function App() {
  const s = CONFIG.secoes
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Topo />
        <EixoDourado />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero />
          {s.clinica && <Clinica />}
          {s.atendimentos && <Atendimentos />}
          {s.quandoProcurar && <QuandoProcurar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.equipe && <Equipe />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {s.agendar && <Agendar />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <WhatsAppFixo />
      </MotionConfig>
    </LazyMotion>
  )
}
