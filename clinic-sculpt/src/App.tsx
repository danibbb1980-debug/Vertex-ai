import { useEffect } from "react";
import { CONFIG } from "./config";
import { iniciarLuz } from "./lib/light";
import Header from "./components/Header";
import Agendar from "./components/Agendar";
import Rodape, { AgendarFixo, FaixaRascunho } from "./components/Rodape";
import { Atendimento, ComoFunciona, Contato, CtaFinal, Duvidas, Espaco, Hero, Profissional, Tratamentos } from "./components/Secoes";

export default function App() {
  useEffect(() => iniciarLuz(), []);
  const s = CONFIG.secoes;
  return (
    <>
      <a href="#conteudo" className="sr-only z-[60] bg-tinta px-4 py-3 text-gesso focus:not-sr-only focus:fixed focus:left-4 focus:top-10">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo">
        <Hero />
        {s.atendimento && <Atendimento />}
        {s.tratamentos && <Tratamentos />}
        {s.espaco && <Espaco />}
        {s.profissional && <Profissional />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  );
}
