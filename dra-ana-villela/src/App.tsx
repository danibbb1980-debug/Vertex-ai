import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import { DraftBanner, Header } from "./components/Header";
import { Hero, Marquee } from "./components/Hero";
import { ComoFunciona, Compromissos, Filosofia, Sobre, Tratamentos } from "./components/Sections";
import { CtaFinal, Duvidas, Localizacao, Rodape, WhatsappFixo } from "./components/Contato";

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <DraftBanner />
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Filosofia />
        <Tratamentos />
        <ComoFunciona />
        <Sobre />
        <Compromissos />
        {/* Avaliações do Google: omitidas até haver avaliações reais autorizadas. */}
        <Duvidas />
        <Localizacao />
        <CtaFinal />
      </main>
      <Rodape />
      <WhatsappFixo />
    </MotionConfig>
    </LazyMotion>
  );
}
