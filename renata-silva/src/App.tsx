import { CONFIG, atendimentosMarquee } from "./config";
import { DraftBanner } from "./sections/DraftBanner";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Clinica } from "./sections/Clinica";
import { Atendimentos } from "./sections/Atendimentos";
import { ComoFunciona } from "./sections/ComoFunciona";
import { AntesDeAgendar } from "./sections/AntesDeAgendar";
import { Duvidas } from "./sections/Duvidas";
import { Contato } from "./sections/Contato";
import { Agendamento } from "./sections/Agendamento";
import { CtaFinal } from "./sections/CtaFinal";
import { Footer } from "./sections/Footer";
import { WhatsAppFixos } from "./sections/WhatsAppFixos";
import { Marquee } from "./components/Marquee";
import { SpiralLine } from "./components/SpiralLine";

export default function App() {
  return (
    <>
      <DraftBanner />
      <Header />
      <main id="conteudo" className="relative" tabIndex={-1}>
        <SpiralLine />
        <Hero />
        {CONFIG.secoes.marquee && <Marquee items={atendimentosMarquee} />}
        <Clinica />
        <Atendimentos />
        <ComoFunciona />
        <AntesDeAgendar />
        <Duvidas />
        <Contato />
        <Agendamento />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsAppFixos />
    </>
  );
}
