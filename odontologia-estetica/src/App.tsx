import { CONFIG } from './config'
import { Agendamento } from './components/Agendamento'
import { Cabecalho, ContatoFixo, FaixaRascunho } from './components/Estrutura'
import {
  Atendimentos,
  Clinica,
  ComoFunciona,
  Contato,
  CtaFinal,
  Duvidas,
  EstruturaLocal,
  Faixa,
  Galeria,
  Hero,
  QuandoProcurar,
  Rodape,
} from './components/Secoes'

export default function App() {
  const s = CONFIG.secoes
  return (
    <div className={CONFIG.rascunho ? 'pt-8' : ''}>
      <a
        href="#conteudo"
        className="fixed top-10 left-4 z-[70] -translate-y-40 bg-taupe-950 px-4 py-3 text-gelo focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        {s.atendimentos && <Faixa />}
        {s.clinica && <Clinica />}
        {s.galeria && <Galeria />}
        {s.atendimentos && <Atendimentos />}
        {s.quandoProcurar && <QuandoProcurar />}
        {s.comoFunciona && <ComoFunciona />}
        {s.estrutura && <EstruturaLocal />}
        {s.duvidas && <Duvidas />}
        {s.agendar && <Agendamento />}
        {s.contato && <Contato />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <ContatoFixo />
    </div>
  )
}
