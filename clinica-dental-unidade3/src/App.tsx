import { useRef } from "react";
import { CONFIG } from "./config";
import { useUnidade } from "./lib/unidade";
import { resumoHorarios } from "./lib/horarios";
import { FaixaRascunho } from "./components/sections/FaixaRascunho";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { Clinica } from "./components/sections/Clinica";
import { Atendimentos } from "./components/sections/Atendimentos";
import { QuandoProcurar } from "./components/sections/QuandoProcurar";
import { ComoFunciona } from "./components/sections/ComoFunciona";
import { Equipe } from "./components/sections/Equipe";
import { Galeria } from "./components/sections/Galeria";
import { Estrutura } from "./components/sections/Estrutura";
import { Faq } from "./components/sections/Faq";
import { Contato } from "./components/sections/Contato";
import { Agendamento } from "./components/sections/Agendamento";
import { CtaFinal } from "./components/sections/CtaFinal";
import { Rodape } from "./components/sections/Rodape";
import { Flutuantes } from "./components/sections/Flutuantes";
import { Marquee } from "./components/ui/Marquee";
import { FioDourado } from "./components/ui/FioDourado";

export default function App() {
  const { unidade } = useUnidade();
  const percurso = useRef<HTMLDivElement>(null);
  const s = CONFIG.secoes;
  const horarios = resumoHorarios(unidade.horarios).filter((h) => !h.fechado);
  const itensMarquee = [
    ...CONFIG.atendimentos.map((a) => a.nome),
    "Hora marcada",
    ...horarios.map((h) => `${h.rotulo}, ${h.texto}`),
    `${unidade.endereco.cidade} - ${unidade.endereco.uf}`,
  ];

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-10 z-[70] -translate-y-24 rounded-full bg-navy-900 px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        {/* O fio dourado percorre da primeira seção até o contato */}
        <div ref={percurso} className="relative">
          <FioDourado alvo={percurso} />
          {s.clinica && <Clinica />}
          {s.marquee && <Marquee itens={itensMarquee} />}
          {s.atendimentos && <Atendimentos />}
          {s.quandoProcurar && <QuandoProcurar />}
          {s.comoFunciona && <ComoFunciona />}
          {s.equipe && <Equipe />}
          {s.galeria && <Galeria />}
          {s.estrutura && <Estrutura />}
          {s.faq && <Faq />}
          {s.contato && <Contato />}
        </div>
        {s.agendamento && <Agendamento />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <Flutuantes />
    </>
  );
}
