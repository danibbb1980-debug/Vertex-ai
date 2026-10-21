import { MotionConfig } from "motion/react";
import { FaixaRascunho, Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import {
  Atendimento,
  CtaFinal,
  Faixa,
  OndeAtendo,
  ParaOsPais,
  PrimeiraConsulta,
  Rodape,
  Sobre,
  WhatsappFixo,
} from "./sections/Conteudo";
import { Duvidas } from "./sections/Duvidas";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FaixaRascunho />
      <Header />
      <main id="conteudo">
        <Hero />
        <Faixa />
        <Sobre />
        <Atendimento />
        <PrimeiraConsulta />
        <ParaOsPais />
        <OndeAtendo />
        <Duvidas />
        <CtaFinal />
      </main>
      <Rodape />
      <WhatsappFixo />
    </MotionConfig>
  );
}
