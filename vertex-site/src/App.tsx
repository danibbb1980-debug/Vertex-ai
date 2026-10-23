import { useEffect } from "react";
import { inView } from "motion";
import { CONFIG } from "./config";
import { Header } from "./components/Header";
import { Stage3D } from "./components/Stage3D";
import { FloatingWa } from "./components/FloatingWa";
import { Hero } from "./sections/Hero";
import { Proposta } from "./sections/Proposta";
import { ComoFunciona } from "./sections/ComoFunciona";
import { Faixa, Segmentos } from "./sections/Segmentos";
import { Exemplos } from "./sections/Exemplos";
import { Padrao } from "./sections/Padrao";
import { Planos } from "./sections/Planos";
import { Faq } from "./sections/Faq";
import { Sobre } from "./sections/Sobre";
import { CtaFinal } from "./sections/CtaFinal";
import { Footer } from "./sections/Footer";

export default function App() {
  useEffect(() => {
    return inView(
      "[data-reveal]",
      (entry) => {
        entry.target.classList.add("is-in");
      },
      { margin: "0px 0px -8% 0px" },
    );
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-gold px-5 py-3 font-display text-ink-0 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <Stage3D />
      <Header />
      <main id="conteudo" className="relative z-10">
        <Hero />
        <Faixa />
        <Proposta />
        <ComoFunciona />
        <Segmentos />
        {CONFIG.mostrarExemplos && <Exemplos />}
        <Padrao />
        {CONFIG.mostrarPrecos && <Planos />}
        <Faq />
        <Sobre />
        <CtaFinal />
      </main>
      <Footer />
      <FloatingWa />
    </>
  );
}
