import { CONFIG, atendimentosAtivos } from "./config";
import { Cabecalho, FaixaRascunho, Hero } from "./components/Topo";
import { Atendimentos, AtalhoAgendar, ComoFunciona, CtaFinal, Duvidas, Espaco, Local, Rodape } from "./components/Secoes";
import { Agendar } from "./components/Agendar";

export default function App() {
  const s = CONFIG.secoes;
  // numeração contínua só entre as seções que de fato aparecem
  let n = 0;
  const prox = () => ++n;
  const mostraAtend = s.atendimentos && atendimentosAtivos().length > 0;
  const mostraAgendar = s.agendar && CONFIG.usarWhatsapp && Boolean(CONFIG.whatsapp);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-10 focus:z-[70] focus:bg-tinta focus:px-4 focus:py-3 focus:text-areia"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        {mostraAtend && <Atendimentos n={prox()} />}
        {s.espaco && <Espaco n={prox()} />}
        {s.comoFunciona && <ComoFunciona n={prox()} />}
        {s.duvidas && <Duvidas n={prox()} />}
        {s.local && <Local n={prox()} />}
        {mostraAgendar && <Agendar n={prox()} />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AtalhoAgendar />
    </>
  );
}
