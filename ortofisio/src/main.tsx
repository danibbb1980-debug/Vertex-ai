import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CONFIG } from './config'
import { Cabecalho, FaixaRascunho } from './components/Topo'
import {
  AcoesFixas,
  Atendimentos,
  ComoFunciona,
  Contato,
  CtaFinal,
  Cuidado,
  Equipe,
  Faq,
  Fotos,
  Hero,
  Rodape,
} from './components/Secoes'
import { Agendar } from './components/Agendar'

function App() {
  const s = CONFIG.secoes
  return (
    <>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {s.hero && <Hero />}
        {s.cuidado && <Cuidado />}
        {s.atendimentos && <Atendimentos />}
        {s.equipe && <Equipe />}
        {s.fotos && <Fotos />}
        {s.comoFunciona && <ComoFunciona />}
        {s.faq && <Faq />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AcoesFixas />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
