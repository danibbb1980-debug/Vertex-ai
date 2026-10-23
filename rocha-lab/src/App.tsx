import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { ComoEnviar } from './components/ComoEnviar'
import { Avaliacoes, Compromissos } from './components/Compromissos'
import { Confianca, FaixaTrabalhos } from './components/Confianca'
import { CtaFinal, Localizacao, Rodape, WhatsAppFixo } from './components/Contato'
import { Duvidas } from './components/Duvidas'
import { FluxoDigital } from './components/FluxoDigital'
import { FaixaRascunho, Header } from './components/Header'
import { Hero } from './components/Hero'
import { Sobre } from './components/Sobre'
import { Trabalhos } from './components/Trabalhos'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
      <FaixaRascunho />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Confianca />
        <FaixaTrabalhos />
        <Trabalhos />
        <ComoEnviar />
        <FluxoDigital />
        <Sobre />
        <Compromissos />
        <Avaliacoes />
        <Duvidas />
        <Localizacao />
        <CtaFinal />
      </main>
      <Rodape />
      <WhatsAppFixo />
      </MotionConfig>
    </LazyMotion>
    </LazyMotion>
  )
}
