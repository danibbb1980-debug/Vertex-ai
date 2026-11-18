import { CONFIG } from "./config";
import { Cabecalho } from "./components/Cabecalho";
import { Atendimentos, Hero, Instituto } from "./components/Secoes1";
import { ComoFunciona, Contato, Duvidas } from "./components/Secoes2";
import { Agendar } from "./components/Agendar";
import { AcoesFixas, CtaFinal, Rodape } from "./components/Final";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        {s.instituto && <Instituto />}
        {s.atendimentos && <Atendimentos />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AcoesFixas />
    </>
  );
}
