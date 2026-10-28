import { CONFIG, modoAtual } from "./config";
import { useRevela } from "./lib/useRevela";
import { FaixaRascunho } from "./components/Rascunho";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { SecaoAline } from "./components/SecaoAline";
import { ParaOsPais } from "./components/ParaOsPais";
import { SecaoJosiane } from "./components/SecaoJosiane";
import { ComoFunciona } from "./components/ComoFunciona";
import { Estrutura } from "./components/Estrutura";
import { Avaliacoes } from "./components/Avaliacoes";
import { Duvidas } from "./components/Duvidas";
import { Agendar } from "./components/Agendar";
import { Contato } from "./components/Contato";
import { CtaFinal } from "./components/CtaFinal";
import { Rodape } from "./components/Rodape";
import { WhatsFlutuante } from "./components/WhatsFlutuante";

export default function App() {
  useRevela();
  const s = CONFIG.secoes;
  const ambas = modoAtual() === "ambas";
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[70] focus:rounded-full focus:bg-tinta focus:px-5 focus:py-3 focus:text-marfim"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo">
        <Hero />
        {s.marquee ? <Marquee /> : null}
        {CONFIG.mostrarAline && s.aline ? <SecaoAline /> : null}
        {CONFIG.mostrarAline && s.paraOsPais && !ambas ? <ParaOsPais /> : null}
        {CONFIG.mostrarJosiane && s.josiane ? <SecaoJosiane /> : null}
        {CONFIG.mostrarAline && s.paraOsPais && ambas ? <ParaOsPais /> : null}
        {s.comoFunciona ? <ComoFunciona /> : null}
        {s.estrutura ? <Estrutura /> : null}
        {s.avaliacoes ? <Avaliacoes /> : null}
        {s.duvidas ? <Duvidas /> : null}
        {s.agendar ? <Agendar /> : null}
        {s.contato ? <Contato /> : null}
        {s.ctaFinal ? <CtaFinal /> : null}
      </main>
      <Rodape />
      <WhatsFlutuante />
    </>
  );
}
