import { LazyMotion, MotionConfig } from 'motion/react'

const recursos = () => import('./lib/motion-features').then((r) => r.default)
import { CONFIG } from './config'
import { FOTOS } from './fotos'
import { FaixaRascunho, Header } from './components/Header'
import { Hero } from './components/Hero'
import { Atendimentos, Clinica, ComoFunciona, Equipe, Estrutura, Galeria, Marquee, QuandoProcurar } from './components/Secoes'
import { Faq } from './components/Faq'
import { Contato } from './components/Contato'
import { Agendar } from './components/Agendar'
import { AcoesFixas, CtaFinal, Rodape } from './components/Final'

export default function App() {
  const s = CONFIG.secoes
  const temAtendimentos = s.atendimentos && CONFIG.atendimentos.length > 0
  const links = [
    s.clinica && { href: '#clinica', label: 'A clínica' },
    temAtendimentos && { href: '#atendimentos', label: 'Atendimentos' },
    s.comoFunciona && { href: '#como-funciona', label: 'Como funciona' },
    s.faq && { href: '#duvidas', label: 'Dúvidas' },
    s.contato && { href: '#contato', label: 'Contato' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <LazyMotion features={recursos} strict>
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="fixed left-4 top-10 z-[70] -translate-y-24 rounded-full bg-navy px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header links={links} />
      <main id="conteudo">
        <Hero />
        {s.marquee && temAtendimentos && <Marquee />}
        {s.clinica && <Clinica />}
        {temAtendimentos && <Atendimentos />}
        {s.equipe && CONFIG.dentistas.length > 0 && <Equipe />}
        {s.quandoProcurar && <QuandoProcurar />}
        {s.comoFunciona && <ComoFunciona />}
        {s.estrutura && <Estrutura />}
        {s.galeria && FOTOS.length > 0 && <Galeria />}
        {s.faq && <Faq />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AcoesFixas />
    </MotionConfig>
    </LazyMotion>
  )
}
