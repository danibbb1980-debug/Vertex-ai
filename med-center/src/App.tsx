import { CONFIG } from "./config";
import { Agendar } from "./components/Agendar";
import { Areas } from "./components/Areas";
import { AreasMarquee, Centro } from "./components/Centro";
import { ComoFunciona } from "./components/ComoFunciona";
import { Contato } from "./components/Contato";
import { Duvidas } from "./components/Duvidas";
import { Estrutura } from "./components/Estrutura";
import { CtaFinal, Footer, WhatsFlutuante } from "./components/Final";
import { DraftBanner, Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Profissionais } from "./components/Profissionais";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <DraftBanner />
      <Header />
      <main id="conteudo">
        <Hero />
        <AreasMarquee />
        {s.centro && <Centro />}
        {s.areas && <Areas />}
        {s.profissionais && <Profissionais />}
        {s.comoFunciona && <ComoFunciona />}
        {s.estrutura && <Estrutura />}
        {s.agendar && <Agendar />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <WhatsFlutuante />
    </>
  );
}
