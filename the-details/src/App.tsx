import { Hero } from './Hero';
import { Trabalhos } from './Trabalhos';
import { Agendar } from './Agendar';
import {
  DraftBar,
  Header,
  Atendimentos,
  DePerto,
  Silencio,
  ComoFunciona,
  Horarios,
  Duvidas,
  Contato,
  CtaFinal,
  Rodape,
  MobileBar,
} from './sections';
import { WaButton } from './ui';

export function App() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <span id="topo" />
        <Hero />
        <Atendimentos />
        <Trabalhos />
        <DePerto />
        <Silencio />
        <ComoFunciona />
        <Horarios />
        <Duvidas />
        <Contato />
        <Agendar />
        <CtaFinal />
      </main>
      <Rodape />
      <div className="float-wa">
        <WaButton />
      </div>
      <MobileBar />
    </>
  );
}
