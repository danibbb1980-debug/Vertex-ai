import { CONFIG } from "./config";
import { AgendarFixo, Cortina, Divisor, FaixaRascunho, Header } from "./components/Estrutura";
import {
  Atendimento,
  ComoFunciona,
  Contato,
  CtaFinal,
  Cursos,
  Duvidas,
  EsteticaCorporal,
  Formacao,
  Fotos,
  Hero,
  Rodape,
} from "./components/Secoes";
import { Agendar } from "./components/Agendar";

export default function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <a
        href="#conteudo"
        className="btn btn-cheio fixed left-4 top-10 z-[80] -translate-y-[200%] focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cortina />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        {s.atendimento && <Atendimento />}
        {s.esteticaCorporal && <EsteticaCorporal />}
        <Fotos />
        {s.formacao && <Formacao />}
        {s.cursos && <Cursos />}
        {s.comoFunciona && (
          <>
            <Divisor fase={1.7} />
            <ComoFunciona />
          </>
        )}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  );
}
