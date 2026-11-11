import { useState } from "react";
import { CONFIG } from "./config";
import { Agendar } from "./components/Agendar";
import { Fio } from "./components/Fio";
import { Flutuante } from "./components/Flutuante";
import { DraftBar, Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Atendimentos, ComoFunciona, Contato, CtaFinal, Duvidas, Medico, ParaQuem, Rodape } from "./components/Sections";

export default function App() {
  const [brainDone, setBrainDone] = useState(false);
  const s = CONFIG.secoes;
  return (
    <>
      <a href="#conteudo" className="skip">
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id="conteudo" className="relative">
        <Fio visible={brainDone} />
        {s.hero && <Hero onBrainDone={() => setBrainDone(true)} />}
        {s.medico && <Medico />}
        {s.atendimentos && <Atendimentos />}
        {s.paraQuem && <ParaQuem />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <Flutuante />
    </>
  );
}
