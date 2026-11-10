import { useRef } from "react";
import { secaoAtiva } from "./lib/secoes";
import { Cabecalho, FaixaRascunho } from "./sections/Cabecalho";
import { Hero } from "./sections/Hero";
import { HorariosDestaque } from "./sections/HorariosDestaque";
import { Sobre } from "./sections/Sobre";
import { Areas } from "./sections/Areas";
import { CorpoClinico } from "./sections/CorpoClinico";
import { AntesConsulta } from "./sections/AntesConsulta";
import { ComoFunciona } from "./sections/ComoFunciona";
import { Estrutura } from "./sections/Estrutura";
import { Duvidas } from "./sections/Duvidas";
import { Localizacao } from "./sections/Localizacao";
import { Agendar } from "./sections/Agendar";
import { CtaFinal } from "./sections/CtaFinal";
import { Rodape } from "./sections/Rodape";
import { Flutuantes } from "./components/Flutuantes";
import { LinhasAssinatura } from "./components/LinhasAssinatura";

export function App() {
  const principal = useRef<HTMLElement>(null);
  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-10 z-[70] -translate-y-24 bg-grafite px-5 py-3 font-semibold text-creme transition-transform focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" ref={principal} className="relative" tabIndex={-1}>
        {secaoAtiva("hero") && <Hero />}
        {secaoAtiva("horariosDestaque") && <HorariosDestaque />}
        {secaoAtiva("sobre") && <Sobre />}
        {secaoAtiva("areas") && <Areas />}
        {secaoAtiva("corpoClinico") && <CorpoClinico />}
        {secaoAtiva("antesDaConsulta") && <AntesConsulta />}
        {secaoAtiva("comoFunciona") && <ComoFunciona />}
        {secaoAtiva("estrutura") && <Estrutura />}
        {secaoAtiva("faq") && <Duvidas />}
        {secaoAtiva("localizacao") && <Localizacao />}
        {secaoAtiva("agendar") && <Agendar />}
        {secaoAtiva("ctaFinal") && <CtaFinal />}
        <LinhasAssinatura alvo={principal} />
      </main>
      <Rodape />
      <Flutuantes />
    </>
  );
}
