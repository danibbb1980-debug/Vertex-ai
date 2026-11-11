import { CONFIG } from './config'
import { profissionaisPublicaveis } from './lib/dados'
import { Cabecalho, FaixaRascunho, type ItemMenu } from './components/Cabecalho'
import { Hero } from './components/Hero'
import { FaixaAreas } from './components/FaixaAreas'
import { Espaco } from './components/Espaco'
import { Fotos } from './components/Fotos'
import { Atendimentos } from './components/Atendimentos'
import { Equipe } from './components/Equipe'
import { ComoFunciona } from './components/ComoFunciona'
import { Duvidas } from './components/Duvidas'
import { Contato } from './components/Contato'
import { Agendar } from './components/Agendar'
import { CtaFinal } from './components/CtaFinal'
import { Rodape } from './components/Rodape'
import { WhatsAppFixo } from './components/WhatsAppFixo'

export function App() {
  const s = CONFIG.secoes
  const menu: ItemMenu[] = [
    s.espaco && { href: '#espaco', rotulo: 'O espaço' },
    s.atendimentos && CONFIG.especialidades.length > 0 && { href: '#atendimentos', rotulo: 'Atendimentos' },
    s.equipe && profissionaisPublicaveis().length > 0 && { href: '#equipe', rotulo: 'Equipe' },
    s.comoFunciona && CONFIG.comoFunciona.length > 0 && { href: '#como-funciona', rotulo: 'Como funciona' },
    s.duvidas && { href: '#duvidas', rotulo: 'Dúvidas' },
    s.contato && { href: '#contato', rotulo: 'Contato' },
  ].filter(Boolean) as ItemMenu[]

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-10 z-[60] -translate-y-24 rounded-full bg-tinta px-5 py-3 text-papel focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho itens={menu} />
      <main id="conteudo">
        {s.hero && <Hero />}
        {s.faixaAreas && <FaixaAreas />}
        {s.espaco && <Espaco />}
        {s.fotos && <Fotos />}
        {s.atendimentos && <Atendimentos />}
        {s.equipe && <Equipe />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsAppFixo />
    </>
  )
}
