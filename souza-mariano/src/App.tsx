import { useRef } from "react";
import { Agendar } from "./components/Agendar";
import { Fios } from "./components/Fios";
import { Hero } from "./components/Hero";
import {
  Advogadas,
  Areas,
  ComoFunciona,
  Contato,
  ContatoFixo,
  CtaFinal,
  Duvidas,
  Escritorio,
  FaixaRascunho,
  Header,
  Rodape,
  Valores,
} from "./components/Secoes";

export default function App() {
  const main = useRef<HTMLElement>(null);
  return (
    <>
      <a href="#conteudo" className="sr-only z-[60] bg-vinho px-4 py-3 text-osso focus:not-sr-only focus:fixed focus:left-4 focus:top-10">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo" ref={main} className="relative overflow-x-clip">
        <Hero />
        <Escritorio />
        <Advogadas />
        <Areas />
        <Valores />
        <ComoFunciona />
        <Duvidas />
        <Contato />
        <Agendar />
        <CtaFinal />
        <Fios alvo={main} />
      </main>
      <Rodape />
      <ContatoFixo />
    </>
  );
}
