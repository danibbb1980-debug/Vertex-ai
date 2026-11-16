import { useRef } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { CONFIG } from './config'
import { Topo } from './components/Topo'
import { Hero } from './components/Hero'
import { Espaco } from './components/Espaco'
import { CamadaContorno } from './components/CamadaContorno'
import { Profissional } from './components/Profissional'
import { Atendimentos } from './components/Atendimentos'
import { ComoFunciona } from './components/ComoFunciona'
import { Duvidas } from './components/Duvidas'
import { Contato } from './components/Contato'
import { Agendar } from './components/Agendar'
import { AgendarFixo, CtaFinal, Rodape } from './components/Final'

export default function App() {
  const s = CONFIG.secoes
  const heroRef = useRef<HTMLElement>(null)
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#conteudo" className="sr-only z-[60] bg-grafite px-4 py-3 text-areia focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Pular para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <CamadaContorno corteRef={heroRef}>
          <Hero ref={heroRef} />
          {s.espaco && <Espaco />}
        </CamadaContorno>
        {s.profissional && CONFIG.profissional.nome && <Profissional />}
        {s.atendimentos && <Atendimentos />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.usarWhatsapp && CONFIG.whatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AgendarFixo />
    </LazyMotion>
  )
}
