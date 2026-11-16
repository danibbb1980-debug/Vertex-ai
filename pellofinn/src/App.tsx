import { AgendarFixo, Atendimentos, ComoFunciona, Contato, CtaFinal, Duvidas, Equipe, FaixaRascunho, Header, Hero, OAtendimento, Rodape } from "./components/Sections";
import Agendar from "./components/Agendar";

export default function App() {
  return (
    <>
      <FaixaRascunho />
      <Header />
      <main id="conteudo">
        <Hero />
        <OAtendimento />
        <Atendimentos />
        <Equipe />
        <ComoFunciona />
        <Duvidas />
        <Contato />
        <Agendar />
        <CtaFinal />
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  );
}
