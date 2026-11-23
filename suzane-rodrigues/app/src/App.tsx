import { CONFIG } from "./config";
import Agendar from "./components/Agendar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { Atendimentos, ComoFunciona, CtaFinal, DraftBar, Duvidas, FloatingCta, Footer, Local, Profissional } from "./components/Sections";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <a href="#conteudo" className="skip">
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {s.atendimentos && <Atendimentos />}
        {s.profissional && <Profissional />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.local && <Local />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <FloatingCta />
    </>
  );
}
