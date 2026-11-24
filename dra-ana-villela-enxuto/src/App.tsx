import { DraftBanner, Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Agendamento } from "./components/Agendamento";
import { BarraAgendar, Rodape, Sobre, Tratamentos, useRevealGroups } from "./components/Blocos";

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
        <Agendamento />
      </main>
      <Rodape />
      <BarraAgendar />
    </>
  );
}
