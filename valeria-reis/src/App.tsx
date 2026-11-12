import { CONFIG } from './config'
import { Agendar } from './components/Agendar'
import { Atendimentos, ComoFunciona, Contato, Duvidas, Medica, ParaQuem } from './components/Conteudo'
import { Trilho } from './components/Fio'
import { AcessoWhatsapp, CtaFinal, Rodape } from './components/Fim'
import { Cabecalho, FaixaRascunho, Hero } from './components/Topo'

export default function App() {
  const s = CONFIG.secoes
  return (
    <>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Trilho>
          {s.medica && <Medica />}
          {s.atendimentos && <Atendimentos />}
          {s.paraQuem && <ParaQuem />}
          {s.comoFunciona && <ComoFunciona />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {s.agendar && <Agendar />}
        </Trilho>
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AcessoWhatsapp />
    </>
  )
}
