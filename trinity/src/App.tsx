import { CONFIG } from './config'
import { ChapterContext, useActiveChapter } from './hooks'
import { DraftBar, FloatingButton, Header, MobileBar } from './components/Chrome'
import { Atendimentos, Caminhos, ComoFunciona, CtaFinal, Cursos, Duvidas, Espaco, Footer, Hero, Local, Profissionais, Registros } from './components/Sections'
import { Agendar } from './components/Agendar'

export default function App() {
  const chapter = useActiveChapter()
  const s = CONFIG.secoes
  return (
    <ChapterContext.Provider value={chapter}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[60] focus:bg-ink focus:p-3 focus:text-paper">
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id="conteudo" className="pb-14 md:pb-0">
        <Hero />
        {s.caminhos && <Caminhos />}
        {s.atendimentos && CONFIG.atendimentos.length > 0 && <Atendimentos />}
        {s.registros && <Registros />}
        {s.cursos && <Cursos />}
        {s.espaco && <Espaco />}
        {s.profissionais && <Profissionais />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.local && <Local />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <MobileBar />
      <FloatingButton />
    </ChapterContext.Provider>
  )
}
