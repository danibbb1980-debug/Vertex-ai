import { LazyMotion } from 'motion/react'
import { CONFIG } from './config'
import { Cabecalho, FaixaRascunho } from './sections/Cabecalho'
import { Hero } from './sections/Hero'
import { Marquee } from './components/Marquee'
import { Clinica } from './sections/Clinica'
import { Profissionais } from './sections/Profissionais'
import { Prevencao } from './sections/Prevencao'
import { CalendarioCuidado } from './sections/CalendarioCuidado'
import { ComoFunciona } from './sections/ComoFunciona'
import { Estrutura } from './sections/Estrutura'
import { Fotos } from './sections/Fotos'
import { Duvidas } from './sections/Duvidas'
import { Localizacao } from './sections/Localizacao'
import { Agendar } from './sections/Agendar'
import { CtaFinal } from './sections/CtaFinal'
import { Rodape } from './sections/Rodape'
import { ContatoFixo } from './sections/ContatoFixo'

const recursos = () => import('./lib/recursos-motion').then((r) => r.default)

const PALAVRAS = ['Avaliação individual', 'Informação clara', 'Hora marcada', 'Acompanhamento regular', 'Prevenção como rotina']

export default function App() {
  const s = CONFIG.secoes
  return (
    <LazyMotion features={recursos} strict>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        {s.faixa && <Marquee itens={PALAVRAS} />}
        {s.clinica && <Clinica />}
        {s.profissionais && <Profissionais />}
        {s.prevencao && <Prevencao />}
        {s.calendario && <CalendarioCuidado />}
        {s.comoFunciona && <ComoFunciona />}
        {s.estrutura && <Estrutura />}
        {s.fotos && <Fotos />}
        {s.duvidas && <Duvidas />}
        {s.localizacao && <Localizacao />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <ContatoFixo />
    </LazyMotion>
  )
}
