import { MotionConfig } from 'motion/react'
import { CONFIG } from './config'
import { Abertura } from './components/Abertura'
import { Agendar } from './components/Agendar'
import { BarraAgendar } from './components/BarraAgendar'
import { Clinica } from './components/Clinica'
import { ComoFunciona } from './components/ComoFunciona'
import { Contato } from './components/Contato'
import { Duvidas } from './components/Duvidas'
import { Equipe } from './components/Equipe'
import { CtaFinal, Rodape } from './components/Final'
import { FaixaRascunho, Header } from './components/Header'
import { Tratamentos } from './components/Tratamentos'

export default function App() {
  const s = CONFIG.secoes
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-10 focus:z-[70] focus:bg-preto focus:px-4 focus:py-3 focus:text-osso"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo">
        <Abertura />
        {s.clinica && <Clinica />}
        {s.tratamentos && <Tratamentos />}
        {s.equipe && <Equipe />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <BarraAgendar />
    </MotionConfig>
  )
}
