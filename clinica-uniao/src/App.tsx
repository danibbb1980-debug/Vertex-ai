import { CONFIG } from './config'
import { Agendar } from './components/Agendar'
import { BotoesFixos, CtaFinal, Duvidas, Localizacao, Rodape } from './components/Contato'
import { FaixaAtendimentos } from './components/Faixa'
import { Hero } from './components/Hero'
import { Atendimentos, Clinica, ComoFunciona, Equipe, Estrutura, Galeria, QuandoProcurar } from './components/Secoes'
import { Cabecalho, FaixaRascunho } from './components/Topo'

export default function App() {
  const s = CONFIG.secoes
  return (
    <>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[70] focus:rounded-full focus:bg-choco-900 focus:px-5 focus:py-3 focus:text-ivory"
        >
          Pular para o conteúdo
        </a>
        <FaixaRascunho />
        <Cabecalho />
        <main id="conteudo">
          <Hero />
          {s.atendimentos && <FaixaAtendimentos />}
          {s.clinica && <Clinica />}
          {s.atendimentos && <Atendimentos />}
          {s.equipe && <Equipe />}
          {s.galeria && <Galeria />}
          {s.quandoProcurar && <QuandoProcurar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.duvidas && <Duvidas />}
          {s.localizacao && <Localizacao />}
          {s.agendar && <Agendar />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <BotoesFixos />
    </>
  )
}
