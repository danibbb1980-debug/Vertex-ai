import { useEffect, useRef } from "react";
import { CONFIG } from "./config";
import { temWhatsapp } from "./lib/whatsapp";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Horarios } from "./components/Horarios";
import { Sobre } from "./components/Sobre";
import { Marquee } from "./components/Marquee";
import { Atendimentos } from "./components/Atendimentos";
import { AntesDeAgendar } from "./components/AntesDeAgendar";
import { ComoFunciona } from "./components/ComoFunciona";
import { Estrutura } from "./components/Estrutura";
import { Faq } from "./components/Faq";
import { Contato } from "./components/Contato";
import { Agendamento } from "./components/Agendamento";
import { CtaFinal } from "./components/CtaFinal";
import { Footer } from "./components/Footer";
import { FaixaRascunho, WhatsappFixo } from "./components/Flutuantes";
import { LinhaAssinatura } from "./components/LinhaAssinatura";

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const s = CONFIG.secoes;

  useEffect(() => {
    document.documentElement.dataset.rascunho = String(CONFIG.rascunho);
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[60] focus:rounded-full focus:bg-ameixa focus:px-5 focus:py-3 focus:text-porcelana"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo" ref={mainRef} className="relative">
        <Hero />
        {s.horarios && CONFIG.horarios.length > 0 ? <Horarios /> : null}
        {s.sobre ? <Sobre /> : null}
        {s.marquee ? <Marquee /> : null}
        {s.atendimentos ? <Atendimentos /> : null}
        {s.antesDeAgendar ? <AntesDeAgendar /> : null}
        {s.comoFunciona ? <ComoFunciona /> : null}
        {s.estrutura ? <Estrutura /> : null}
        {s.faq ? <Faq /> : null}
        {s.contato ? <Contato /> : null}
        {s.agendar && temWhatsapp ? <Agendamento /> : null}
        {s.ctaFinal ? <CtaFinal /> : null}
        <LinhaAssinatura mainRef={mainRef} />
      </main>
      <Footer />
      <WhatsappFixo />
    </>
  );
}
