import { Abertura, DraftBanner, Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Agendamento } from "./components/Agendamento";
import { BarraAgendar, Faixa, Rodape, Sobre, Tratamentos } from "./components/Blocos";
import { useMotionSystem } from "./motion";

export default function App() {
  useMotionSystem();
  return (
    <>
      <Abertura />
      <DraftBanner />
      <Header />
      <main id="conteudo">
        <Hero />
        <Faixa />
        <Tratamentos />
        <Sobre />
        <Agendamento />
      </main>
      <Rodape />
      <BarraAgendar />
    </>
  );
}
