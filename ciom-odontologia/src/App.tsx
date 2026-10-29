import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { Agendar } from './components/Agendar'
import { Atendimentos, QuandoProcurar } from './components/Atendimentos'
import { PlanLine } from './components/Base'
import { DraftBanner, FloatingWhats, Header, MobileBar } from './components/Chrome'
import { Clinica, Marquee } from './components/Clinica'
import { CtaFinal, Footer, Localizacao } from './components/Final'
import { Hero } from './components/Hero'
import { Profissionais } from './components/Profissionais'
import { Acolhimento, ComoFunciona, Duvidas } from './components/Secoes'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <DraftBanner />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee />
        <PlanLine>
          <Clinica />
          <Profissionais />
          <Atendimentos />
          <QuandoProcurar />
          <ComoFunciona />
          <Acolhimento />
          <Duvidas />
          <Localizacao />
          <Agendar />
        </PlanLine>
        <CtaFinal />
      </main>
      <Footer />
      <FloatingWhats />
      <MobileBar />
    </MotionConfig>
    </LazyMotion>
  )
}
