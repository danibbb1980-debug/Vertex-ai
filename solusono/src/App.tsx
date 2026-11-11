import { CONFIG } from "./config";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Sono } from "./components/Sono";
import { Servicos } from "./components/Servicos";
import { Modalidades } from "./components/Modalidades";
import { Espaco } from "./components/Espaco";
import { ComoFunciona } from "./components/ComoFunciona";
import { Equipe } from "./components/Equipe";
import { Duvidas } from "./components/Duvidas";
import { Agendar } from "./components/Agendar";
import { Contato, CtaFinal } from "./components/Contato";
import { Rodape, WhatsappFixo } from "./components/Rodape";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="pb-20 md:pb-0">
        <Hero />
        {s.sono && <Sono />}
        {s.servicos && <Servicos />}
        {s.modalidades && <Modalidades />}
        {s.espaco && <Espaco />}
        {s.comoFunciona && <ComoFunciona />}
        {s.equipe && <Equipe />}
        {s.duvidas && <Duvidas />}
        {s.agendar && <Agendar />}
        {s.contato && <Contato />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsappFixo />
    </>
  );
}
