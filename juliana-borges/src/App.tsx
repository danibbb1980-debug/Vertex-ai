import { useRef } from 'react'
import { CONFIG } from './config'
import { FaixaRascunho, Header } from './components/Header'
import { Hero } from './components/Hero'
import { HorariosDestaque } from './components/Horarios'
import { Sobre } from './components/Sobre'
import { Atendimentos } from './components/Atendimentos'
import { Marquee } from './components/Marquee'
import { AntesDeAgendar } from './components/AntesDeAgendar'
import { ComoFunciona } from './components/ComoFunciona'
import { Estrutura } from './components/Estrutura'
import { Duvidas } from './components/Duvidas'
import { Localizacao } from './components/Localizacao'
import { Agendar } from './components/Agendar'
import { CtaFinal } from './components/CtaFinal'
import { Rodape } from './components/Rodape'
import { Conversao } from './components/Conversao'
import { LinhaAssinatura } from './components/LinhaAssinatura'

export default function App() {
  const s = CONFIG.secoes
  const wrap = useRef<HTMLDivElement>(null)
  return (
    <>
        <FaixaRascunho />
        <Header />
        <main id="conteudo" ref={wrap} className="relative" tabIndex={-1}>
          <LinhaAssinatura alvo={wrap} />
          {s.hero && <Hero />}
          {s.horariosDestaque && <HorariosDestaque />}
          {s.sobre && <Sobre />}
          {s.atendimentos && <Atendimentos />}
          {s.marquee && <Marquee />}
          {s.antesDeAgendar && <AntesDeAgendar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.duvidas && <Duvidas />}
          {s.localizacao && <Localizacao />}
          {s.agendar && <Agendar />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <Conversao />
    </>
  )
}
