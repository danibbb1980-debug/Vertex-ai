import { useEffect } from 'react'
import { iniciarEfeitos } from './efeitos'
import { secaoAtiva } from './config'
import { FaixaRascunho, Header } from './components/Topo'
import { Faixa, Hero } from './components/Hero'
import { Atendimentos, ComoFunciona, Dentista, Estrutura, QuandoProcurar } from './components/Secoes'
import { Contato, CtaFinal, Faq, Rodape, WhatsFixo } from './components/Contato'
import { Agendar } from './components/Agendar'

export default function App() {
  useEffect(() => iniciarEfeitos(), [])
  return (
    <>
        <a
          href="#conteudo"
          className="sr-only z-[70] rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-12"
        >
          Pular para o conteúdo
        </a>
        <FaixaRascunho />
        <Header />
        <main id="conteudo" tabIndex={-1} className="focus:outline-none">
          {secaoAtiva('hero') && <Hero />}
          {secaoAtiva('marquee') && <Faixa />}
          {secaoAtiva('dentista') && <Dentista />}
          {secaoAtiva('atendimentos') && <Atendimentos />}
          {secaoAtiva('quandoProcurar') && <QuandoProcurar />}
          {secaoAtiva('comoFunciona') && <ComoFunciona />}
          {secaoAtiva('estrutura') && <Estrutura />}
          {secaoAtiva('faq') && <Faq />}
          {secaoAtiva('contato') && <Contato />}
          {secaoAtiva('agendar') && <Agendar />}
          {secaoAtiva('ctaFinal') && <CtaFinal />}
        </main>
        <Rodape />
        <WhatsFixo />
    </>
  )
}
