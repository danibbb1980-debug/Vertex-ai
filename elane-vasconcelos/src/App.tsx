import { LazyMotion, domAnimation } from "motion/react";
import { useRef } from "react";
import { FioDourado } from "./components/FioDourado";
import { MarqueeRolagem } from "./components/MarqueeRolagem";
import { Agendamento } from "./sections/Agendamento";
import { Atendimentos } from "./sections/Atendimentos";
import { ComoFunciona } from "./sections/ComoFunciona";
import { Contato } from "./sections/Contato";
import { Duvidas } from "./sections/Duvidas";
import { Estrutura } from "./sections/Estrutura";
import { ParaQuemAcompanha } from "./sections/Familias";
import { BarraWhatsApp, CtaFinal, Rodape } from "./sections/Fim";
import { Hero } from "./sections/Hero";
import { Sobre } from "./sections/Sobre";
import { Cabecalho, FaixaRascunho } from "./sections/Topo";

export default function App() {
  const principal = useRef<HTMLElement>(null);
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[60] focus:rounded-full focus:bg-mauve focus:px-5 focus:py-3 focus:text-marfim">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo" ref={principal} className="relative">
        <Hero />
        <MarqueeRolagem />
        <Sobre />
        <Atendimentos />
        <ParaQuemAcompanha />
        <ComoFunciona />
        <Estrutura />
        <Duvidas />
        <Contato />
        <Agendamento />
        <CtaFinal />
        <FioDourado alvo={principal} />
      </main>
      <Rodape />
      <BarraWhatsApp />
    </LazyMotion>
  );
}
