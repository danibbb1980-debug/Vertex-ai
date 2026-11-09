import { useEffect, useRef } from 'react'
import { CONFIG } from './config'
import { FaixaRascunho } from './sections/FaixaRascunho'
import { Cabecalho } from './sections/Cabecalho'
import { Hero } from './sections/Hero'
import { HorariosDestaque } from './sections/HorariosDestaque'
import { Sobre } from './sections/Sobre'
import { Atendimentos } from './sections/Atendimentos'
import { AntesDaConsulta } from './sections/AntesDaConsulta'
import { ComoFunciona } from './sections/ComoFunciona'
import { Estrutura } from './sections/Estrutura'
import { Duvidas } from './sections/Duvidas'
import { Localizacao } from './sections/Localizacao'
import { Agendamento } from './sections/Agendamento'
import { CtaFinal } from './sections/CtaFinal'
import { Rodape } from './sections/Rodape'
import { FaixaRolante } from './components/FaixaRolante'
import { WhatsAppFixo } from './components/WhatsAppFixo'
import { Haste } from './components/Haste'

function useRevelar() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-revelar]')
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('visivel')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  const s = CONFIG.secoes
  const trilha = useRef<HTMLDivElement>(null)
  useRevelar()
  const faixa = CONFIG.atendimentos.map((a) => a.titulo).concat(['Com hora marcada', `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`])
  return (
    <>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" className={CONFIG.rascunho ? 'pt-8' : ''}>
        <Hero />
        {s.horariosDestaque && <HorariosDestaque />}
        <div ref={trilha} className="relative">
          <Haste alvo={trilha} />
          {s.sobre && <Sobre />}
          {s.faixaRolante && <FaixaRolante itens={faixa} />}
          {s.atendimentos && <Atendimentos />}
          {s.antesDaConsulta && <AntesDaConsulta />}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.duvidas && <Duvidas />}
          {s.localizacao && <Localizacao />}
          {s.agendar && <Agendamento />}
        </div>
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsAppFixo />
    </>
  )
}
