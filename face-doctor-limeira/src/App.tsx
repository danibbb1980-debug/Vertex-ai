import { useEffect } from 'react'
import { CONFIG } from './config'
import { Agendar } from './components/Agendar'
import { Cabecalho } from './components/Cabecalho'
import { AgendarFixo, FaixaRascunho } from './components/Fixos'
import { Hero } from './components/Hero'
import { Rodape } from './components/Rodape'
import { Atendimentos, Avaliacao, ComoFunciona, Contato, CtaFinal, Duvidas, Horarios } from './components/Secoes'

export function App() {
  useEffect(() => {
    import('./enhance').then((m) => m.iniciar())
  }, [])

  const s = CONFIG.secoes
  let n = 0
  const prox = () => ++n

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {s.atendimentos && <Atendimentos n={prox()} />}
        {s.avaliacao && <Avaliacao n={prox()} />}
        {s.horarios && <Horarios n={prox()} />}
        {s.comoFunciona && <ComoFunciona n={prox()} />}
        {s.duvidas && <Duvidas n={prox()} />}
        {s.contato && <Contato n={prox()} />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar n={prox()} />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  )
}
