import { CONFIG } from './config'
import { useMontado } from './components/ui'
import { Header } from './components/header'
import { Suspense, lazy } from 'react'
import { Agendar } from './components/agendar'
import {
  AgendarFixo,
  Atendimento,
  ComoFunciona,
  CtaFinal,
  Duvidas,
  Hero,
  Localizacao,
  Procedimentos,
  Profissional,
  Rodape,
} from './components/secoes'

const HeliceRolagem = lazy(() => import('./components/movimento').then((m) => ({ default: m.HeliceRolagem })))

export default function App() {
  const s = CONFIG.secoes
  const montado = useMontado()
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-petroleo focus:px-4 focus:py-3 focus:text-perola"
      >
        Pular para o conteúdo
      </a>
      <Header />
      {montado && (
        <Suspense fallback={null}>
          <HeliceRolagem />
        </Suspense>
      )}
      <main id="conteudo">
        <Hero />
        {s.atendimento && <Atendimento />}
        {s.procedimentos && <Procedimentos />}
        {s.profissional && <Profissional />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.localizacao && <Localizacao />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  )
}
