import { CONFIG } from "./config";
import { Agendar } from "./components/Agendar";
import { Atendimentos, Casos, ComoFunciona, ContatoFixo, CtaFinal, Duvidas, Header, Hero, Local, Profissional, Rodape } from "./components/Secoes";

export function App() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      {CONFIG.rascunho && (
        <div className="faixa-rascunho" role="note">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </div>
      )}
      <Header />
      <main id="conteudo">
        <Hero />
        <Atendimentos />
        <Profissional />
        <Casos />
        <ComoFunciona />
        <Duvidas />
        <Local />
        <Agendar />
        <CtaFinal />
      </main>
      <Rodape />
      <ContatoFixo />
    </>
  );
}
