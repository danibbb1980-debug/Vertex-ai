import { CONFIG, atendimentosAtivos } from "./config";
import Agendar from "./components/Agendar";
import Atendimentos from "./components/Atendimentos";
import ComoFunciona from "./components/ComoFunciona";
import Contato from "./components/Contato";
import Duvidas from "./components/Duvidas";
import { AtalhoAgendar, CtaFinal, Rodape } from "./components/Fim";
import Hero from "./components/Hero";
import Horarios from "./components/Horarios";
import Fotos from "./components/Fotos";
import { Cabecalho, FaixaRascunho } from "./components/Topo";

export default function App() {
  const s = CONFIG.secoes;
  const temWhats = CONFIG.usarWhatsapp && !!CONFIG.whatsapp;

  // Seções ativas, na ordem; cada uma recebe um "horário" (08, 10, 12...) como numeração.
  const ordem = [
    s.atendimentos && atendimentosAtivos().length > 0 && "atendimentos",
    s.horarios && "horarios",
    s.comoFunciona && "comoFunciona",
    s.duvidas && "duvidas",
    s.contato && "contato",
    s.agendar && temWhats && "agendar",
  ].filter(Boolean) as string[];
  const h = (k: string) => String(8 + ordem.indexOf(k) * 2).padStart(2, "0");

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-4 focus:top-10 focus:bg-grafite focus:px-4 focus:py-3 focus:text-linho"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        {ordem.includes("atendimentos") && <Atendimentos hora={h("atendimentos")} />}
        {ordem.includes("horarios") && <Horarios hora={h("horarios")} />}
        <Fotos />
        {ordem.includes("comoFunciona") && <ComoFunciona hora={h("comoFunciona")} />}
        {ordem.includes("duvidas") && <Duvidas hora={h("duvidas")} />}
        {ordem.includes("contato") && <Contato hora={h("contato")} />}
        {ordem.includes("agendar") && <Agendar hora={h("agendar")} />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AtalhoAgendar />
    </>
  );
}
