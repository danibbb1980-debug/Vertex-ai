import { CONFIG } from './config'
import { FloatingWa, Footer, Header, UrgencyBar } from './components/Chrome'
import { useRevealAll } from './lib/hooks'
import { Hero, Marquee } from './sections/Hero'
import { PrimeirosCuidados, QuandoProcurar } from './sections/Urgencia'
import { Atendimentos, ComoFunciona } from './sections/Servicos'
import { AvaliacoesGoogle, Clinica, Contato, CtaFinal, Duvidas, Estrutura } from './sections/Clinica'

export default function App() {
  useRevealAll()
  const s = CONFIG.secoes
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-paper">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        {s.marquee && <Marquee />}
        {s.quandoProcurar && <QuandoProcurar />}
        {s.primeirosCuidados && <PrimeirosCuidados />}
        {s.atendimentos && <Atendimentos />}
        {s.comoFunciona && <ComoFunciona />}
        {s.clinica && <Clinica />}
        {s.estrutura && <Estrutura />}
        {s.avaliacoesGoogle && <AvaliacoesGoogle />}
        {s.faq && <Duvidas />}
        {s.contato && <Contato />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <UrgencyBar />
      <FloatingWa />
    </>
  )
}
