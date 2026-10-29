import { LazyMotion, domAnimation } from 'motion/react'
import { CONFIG } from './config'
import { Agendar } from './components/Agendar'
import { BotoesFixos, Contato, CtaFinal, Faq, Rodape } from './components/Contato'
import { DraftBanner, Header } from './components/Header'
import { Hero } from './components/Hero'
import { Consultorio, Estrutura, Fases, Marquee, Pais, PrimeiraConsulta, Profissional } from './components/Secoes'

export default function App() {
  const s = CONFIG.secoes
  return (
    <LazyMotion features={domAnimation} strict>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-10 focus:z-[70] focus:rounded-full focus:bg-tinta focus:px-5 focus:py-3 focus:font-bold focus:text-creme"
      >
        Pular para o conteúdo
      </a>
      <DraftBanner />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        {s.marquee && <Marquee />}
        {s.consultorio && <Consultorio />}
        {s.atendimento && <Fases />}
        {s.pais && <Pais />}
        {s.primeiraConsulta && <PrimeiraConsulta />}
        {s.profissional && <Profissional />}
        {s.estrutura && <Estrutura />}
        {s.duvidas && <Faq />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <BotoesFixos />
    </LazyMotion>
  )
}
