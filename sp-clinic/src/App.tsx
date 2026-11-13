import { CONFIG, temWhatsapp } from './config'
import { Cabecalho, type LinkNav } from './components/Cabecalho'
import { Hero } from './components/Hero'
import { Clinica } from './components/Clinica'
import { Espaco } from './components/Espaco'
import { Tratamentos } from './components/Tratamentos'
import { ComoFunciona } from './components/ComoFunciona'
import { Equipe } from './components/Equipe'
import { Duvidas } from './components/Duvidas'
import { Contato } from './components/Contato'
import { Agendar } from './components/Agendar'
import { CtaFinal } from './components/CtaFinal'
import { Rodape } from './components/Rodape'
import { BarraContato } from './components/BarraContato'

const s = CONFIG.secoes
const mostra = {
  clinica: s.clinica && (!!CONFIG.frase || CONFIG.pilares.length > 0),
  espaco: s.espaco && CONFIG.fotos.some((f) => f.src),
  tratamentos: s.tratamentos && CONFIG.tratamentos.length > 0,
  comoFunciona: s.comoFunciona && CONFIG.etapas.length > 0,
  equipe: s.equipe && CONFIG.profissionais.some((p) => p.nome && p.profissao && p.registro),
  duvidas: s.duvidas && CONFIG.faq.length > 0,
  contato: s.contato,
  agendar: s.agendar && temWhatsapp,
  ctaFinal: s.ctaFinal,
}

const links: LinkNav[] = [
  mostra.clinica && { href: '#clinica', rotulo: 'A clínica' },
  mostra.tratamentos && { href: '#tratamentos', rotulo: 'Tratamentos' },
  mostra.comoFunciona && { href: '#como-funciona', rotulo: 'Como funciona' },
  mostra.duvidas && { href: '#duvidas', rotulo: 'Dúvidas' },
  mostra.contato && { href: '#contato', rotulo: 'Contato' },
  mostra.agendar && { href: '#agendar', rotulo: 'Solicitar horário' },
].filter(Boolean) as LinkNav[]

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-cafe focus:px-5 focus:py-3 focus:text-creme"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho links={links} />
      <main id="conteudo">
        <Hero />
        {mostra.clinica && <Clinica />}
        {mostra.espaco && <Espaco />}
        {mostra.tratamentos && <Tratamentos />}
        {mostra.comoFunciona && <ComoFunciona />}
        {mostra.equipe && <Equipe />}
        {mostra.duvidas && <Duvidas />}
        {mostra.contato && <Contato />}
        {mostra.agendar && <Agendar />}
        {mostra.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <BarraContato />
    </>
  )
}
