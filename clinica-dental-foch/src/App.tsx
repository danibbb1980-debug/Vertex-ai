import { CONFIG } from './config'
import { UnidadeProvider, useUnidade } from './context/unidade'
import { useReveal } from './lib/hooks'
import { Topo, WhatsappFixo, type LinkNav } from './components/Topo'
import { Divisor } from './components/Ondas'
import { Hero } from './sections/Hero'
import { Atendimento, Clinica, Equipe, Faixa, Galeria, ParaQuem, Unidades } from './sections/Institucional'
import { ComoFunciona, Estrutura, Faq } from './sections/Jornada'
import { Contato, CtaFinal, Rodape } from './sections/Contato'
import { Agendar } from './sections/Agendar'

const COR = {
  branco: '#ffffff',
  areia: '#f4efe7',
  gelo: '#f5f9f8',
}

function Pagina() {
  const { unidade } = useUnidade()
  useReveal([unidade.id])
  const s = CONFIG.secoes
  const temEquipe = s.equipe && CONFIG.profissionais.length > 0
  const temGaleria = s.galeria && CONFIG.fotos.length > 0
  const temUnidades = s.unidades && CONFIG.unidades.length > 1

  const links: LinkNav[] = [
    s.clinica && { href: '#clinica', rotulo: 'A clínica' },
    s.atendimento && { href: '#atendimento', rotulo: 'Atendimento' },
    s.comoFunciona && { href: '#como-funciona', rotulo: 'Como funciona' },
    s.faq && { href: '#duvidas', rotulo: 'Dúvidas' },
    s.contato && { href: '#contato', rotulo: 'Contato' },
    s.agendar && { href: '#agendar', rotulo: 'Agendar' },
  ].filter(Boolean) as LinkNav[]

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-teal-800 focus:px-5 focus:py-3 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Topo links={links} />
      <main id="conteudo">
        <Hero />
        {s.clinica && <Clinica />}
        {s.atendimento && (
          <>
            <Divisor de={COR.branco} para={COR.areia} variante={0} />
            <Atendimento />
            <Divisor de={COR.areia} para={COR.branco} variante={1} />
          </>
        )}
        {s.paraQuem && <ParaQuem />}
        {temEquipe && <Equipe />}
        <Faixa />
        {s.comoFunciona && <ComoFunciona />}
        {temGaleria && <Galeria />}
        {s.estrutura && (
          <>
            <Divisor de={COR.gelo} para={COR.areia} variante={2} />
            <Estrutura />
            <Divisor de={COR.areia} para={COR.branco} variante={0} />
          </>
        )}
        {temUnidades && <Unidades />}
        {s.faq && <Faq />}
        {s.contato && (
          <>
            <Divisor de={COR.branco} para={COR.gelo} variante={1} />
            <Contato />
          </>
        )}
        {s.agendar && (
          <>
            <Divisor de={COR.gelo} para={COR.areia} variante={2} />
            <Agendar />
          </>
        )}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsappFixo />
    </>
  )
}

export function App() {
  return (
    <UnidadeProvider>
      <Pagina />
    </UnidadeProvider>
  )
}
