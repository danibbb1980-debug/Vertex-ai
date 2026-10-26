import { DraftBanner, Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Contato, Rodape, Sobre, Tratamentos, WhatsappFixo, useRevealGroups } from "./components/Blocos";

export default function App() {
  useRevealGroups();
  return (
    <>
      <DraftBanner />
      <Header />
      <main id="conteudo">
        <Hero />
        <Tratamentos />
        <Sobre />
        <Contato />
      </main>
      <Rodape />
      <WhatsappFixo />
    </>
  );
}
