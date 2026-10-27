import { CONFIG } from './config'
import { Cabecalho, FaixaRascunho, WhatsAppFixo } from './components/Topo'
import { Abertura, Faixa } from './components/Abertura'
import { Integrada } from './components/Integrada'
import { Atendimentos, ComoFunciona, ParaQuem } from './components/Atendimentos'
import {
  AvaliacoesGoogle,
  ChamadaFinal,
  Compromissos,
  Contato,
  Duvidas,
  Equipe,
  Estrutura,
  Rodape,
} from './components/Secoes'

export default function App() {
  const s = CONFIG.secoes
  return (
    <>
        <FaixaRascunho />
        <Cabecalho />
        <main id="conteudo">
          <Abertura />
          {s.faixa && <Faixa />}
          {s.clinica && <Integrada />}
          {s.atendimentos && <Atendimentos />}
          {s.paraQuem && <ParaQuem />}
          {s.comoFunciona && <ComoFunciona />}
          {s.equipe && <Equipe />}
          {s.compromissos && <Compromissos />}
          {s.estrutura && <Estrutura />}
          {s.avaliacoes && <AvaliacoesGoogle />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {s.ctaFinal && <ChamadaFinal />}
        </main>
        <Rodape />
        <WhatsAppFixo />
    </>
  )
}
