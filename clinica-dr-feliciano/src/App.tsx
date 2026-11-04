import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { CONFIG } from "./config";
import { AtalhosWhatsApp, FaixaRascunho, Header } from "./components/Header";
import { FaixaAtendimentos, Hero } from "./components/Hero";
import { Agendamento } from "./components/Agendamento";
import { Atendimentos, Clinica, ComoFunciona, Contato, CtaFinal, Duvidas, Estrutura, QuandoProcurar, Rodape } from "./components/Secoes";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#conteudo"
          className="sr-only z-[60] rounded-full bg-petroleo-900 px-5 py-3 text-linho focus:not-sr-only focus:fixed focus:top-10 focus:left-4"
        >
          Pular para o conteúdo
        </a>
        <FaixaRascunho />
        <Header />
        <main id="conteudo">
          <Hero />
          {s.atendimentos && <FaixaAtendimentos />}
          {s.clinica && <Clinica />}
          {s.atendimentos && <Atendimentos />}
          {s.quandoProcurar && <QuandoProcurar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.estrutura && <Estrutura />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
          {s.agendar && <Agendamento />}
          {s.ctaFinal && <CtaFinal />}
        </main>
        <Rodape />
        <AtalhosWhatsApp />
      </MotionConfig>
    </LazyMotion>
  );
}
