import { CONFIG } from './config'
import { Clinica } from './sections/Clinica'
import { Atendimentos } from './sections/Atendimentos'
import { QuandoProcurar } from './sections/QuandoProcurar'
import { ComoFunciona } from './sections/ComoFunciona'
import { Acessibilidade } from './sections/Acessibilidade'
import { Equipe } from './sections/Equipe'
import { Duvidas } from './sections/Duvidas'
import { Contato } from './sections/Contato'
import { Agendamento } from './sections/Agendamento'
import { CtaFinal, Footer } from './sections/Final'

/** Seções abaixo da dobra: carregadas em um chunk separado, depois da primeira pintura. */
export default function Below({ main }: { main: boolean }) {
  const s = CONFIG.secoes
  if (!main) return <Footer />
  return (
    <>
      {s.clinica && <Clinica />}
      {s.atendimentos && <Atendimentos />}
      {s.quandoProcurar && <QuandoProcurar />}
      {s.comoFunciona && <ComoFunciona />}
      {s.acessibilidade && <Acessibilidade />}
      {s.equipe && <Equipe />}
      {s.duvidas && <Duvidas />}
      {s.contato && <Contato />}
      {s.agendar && <Agendamento />}
      {s.ctaFinal && <CtaFinal />}
    </>
  )
}
