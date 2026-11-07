import { CONFIG } from './config'
import { useRevela } from './lib/useRevela'
import { FaixaRascunho, Topo } from './components/Topo'
import { Hero } from './components/Hero'
import { HorariosDestaque } from './components/Horarios'
import { Sobre } from './components/Sobre'
import { Atendimentos, Faixa } from './components/Atendimentos'
import { AntesDeAgendar, ComoFunciona, Duvidas, Estrutura, Localizacao } from './components/Informativo'
import { Agendamento } from './components/Agendamento'
import { AtalhosWhatsapp, CtaFinal, Rodape } from './components/Final'
import { FioDeMel } from './components/FioDeMel'

export function App() {
  useRevela()
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-10 focus:z-[70] focus:rounded-full focus:bg-oliva focus:px-5 focus:py-3 focus:text-aveia">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Topo />
      <main id="conteudo" className={CONFIG.rascunho ? 'pt-8' : ''}>
        <FioDeMel>
          <Hero />
          <HorariosDestaque />
          <Sobre />
          <Atendimentos />
        </FioDeMel>
        <Faixa />
        <AntesDeAgendar />
        <ComoFunciona />
        <Estrutura />
        <Duvidas />
        <Localizacao />
        <Agendamento />
        <CtaFinal />
      </main>
      <Rodape />
      <AtalhosWhatsapp />
    </>
  )
}
