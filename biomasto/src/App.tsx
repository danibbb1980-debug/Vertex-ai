import { useRef } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { CONFIG } from './config'
import { FaixaRascunho, Header, type LinkNav } from './components/Header'
import { FaixaPalavras, Hero } from './components/Hero'
import { Atendimentos, Clinica, ComoFunciona, Duvidas, QuandoProcurar } from './components/Secoes'
import { Contato, ContatoFixo, CtaFinal, Rodape } from './components/Contato'
import { Agendamento } from './components/Agendamento'
import { FioOnda } from './components/FioOnda'

export default function App() {
  const main = useRef<HTMLElement>(null)
  const s = CONFIG.secoes
  const mostrarAgendar = s.agendar && CONFIG.usarWhatsapp && !!CONFIG.whatsapp

  const links: LinkNav[] = [
    s.clinica && { href: '#clinica', label: 'A clínica' },
    s.atendimentos && CONFIG.atendimentos.length > 0 && { href: '#atendimentos', label: 'Atendimentos' },
    s.comoFunciona && { href: '#como-funciona', label: 'Como funciona' },
    s.duvidas && { href: '#duvidas', label: 'Dúvidas' },
    s.contato && { href: '#contato', label: 'Contato' },
    mostrarAgendar && { href: '#agendar', label: 'Agendar' },
  ].filter(Boolean) as LinkNav[]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#conteudo"
          className="sr-only z-[60] rounded-full bg-ameixa px-5 py-3 font-semibold text-marfim focus:not-sr-only focus:fixed focus:left-4 focus:top-12"
        >
          Pular para o conteúdo
        </a>
        <FaixaRascunho />
        <Header links={links} />
        <main id="conteudo" ref={main} className="relative">
          <FioOnda alvo={main} />
          <Hero />
          <FaixaPalavras />
          {s.clinica && <Clinica />}
          {s.atendimentos && <Atendimentos />}
          {s.quandoProcurar && <QuandoProcurar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {mostrarAgendar && <Agendamento />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <ContatoFixo />
      </MotionConfig>
    </LazyMotion>
  )
}
