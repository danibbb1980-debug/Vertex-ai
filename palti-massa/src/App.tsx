import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useRef } from "react";
import { CONFIG } from "./config";
import { DraftBanner } from "./components/DraftBanner";
import { LogoSprite } from "./components/Logo";
import { Header } from "./components/Header";
import { SignatureArc } from "./components/SignatureArc";
import { WhatsFloat } from "./components/WhatsFloat";
import { Agendar } from "./sections/Agendar";
import { Atendimentos } from "./sections/Atendimentos";
import { ComoFunciona } from "./sections/ComoFunciona";
import { Contato } from "./sections/Contato";
import { CtaFinal } from "./sections/CtaFinal";
import { Duvidas } from "./sections/Duvidas";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Marquee } from "./sections/Marquee";
import { Medico } from "./sections/Medico";
import { ParaQuem } from "./sections/ParaQuem";

export default function App() {
  const main = useRef<HTMLElement>(null);
  const s = CONFIG.secoes;
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="sr-only z-[60] rounded-full bg-white px-5 py-3 font-semibold text-petroleo-900 shadow-alta focus:not-sr-only focus:fixed focus:left-4 focus:top-10">
        Pular para o conteúdo
      </a>
      <LogoSprite />
      <DraftBanner />
      <Header />
      <main id="conteudo" ref={main} className="relative">
        <SignatureArc containerRef={main} />
        <Hero />
        {s.medico && <Medico />}
        {s.marquee && <Marquee />}
        {s.atendimentos && <Atendimentos />}
        {s.paraQuem && <ParaQuem />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.whatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <WhatsFloat />
      </MotionConfig>
    </LazyMotion>
  );
}
