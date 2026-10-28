import { useEffect, useRef } from "react";
import { secaoAtiva } from "./config";
import { Cabecalho } from "./components/Cabecalho";
import { LinhaCuidado } from "./components/LinhaCuidado";
import { Rodape } from "./components/Rodape";
import { WhatsAppFixo } from "./components/WhatsAppFixo";
import { Hero } from "./sections/Hero";
import { Consultorio, Faixa } from "./sections/Consultorio";
import { Atendimento } from "./sections/Atendimento";
import { SedacaoHospitalar } from "./sections/SedacaoHospitalar";
import { ParaOsPais } from "./sections/ParaOsPais";
import { PrimeiraConsulta } from "./sections/PrimeiraConsulta";
import { Profissional } from "./sections/Profissional";
import { Estrutura } from "./sections/Estrutura";
import { Avaliacoes } from "./sections/Avaliacoes";
import { Duvidas } from "./sections/Duvidas";
import { Contato, CtaFinal } from "./sections/Contato";

/** Revela elementos .revelar quando entram na tela (só opacity e transform, via CSS). */
function useRevelar() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".revelar:not(.visivel)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const principal = useRef<HTMLElement>(null);
  useRevelar();

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-cacau px-5 py-3 font-bold text-creme focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" ref={principal} className="relative">
        <LinhaCuidado alvo={principal} />
        <Hero />
        {secaoAtiva("consultorio") && <Consultorio />}
        {secaoAtiva("faixa") && <Faixa />}
        {secaoAtiva("atendimento") && <Atendimento />}
        {secaoAtiva("sedacaoHospitalar") && <SedacaoHospitalar />}
        {secaoAtiva("paraOsPais") && <ParaOsPais />}
        {secaoAtiva("primeiraConsulta") && <PrimeiraConsulta />}
        {secaoAtiva("profissional") && <Profissional />}
        {secaoAtiva("estrutura") && <Estrutura />}
        {secaoAtiva("avaliacoes") && <Avaliacoes />}
        {secaoAtiva("duvidas") && <Duvidas />}
        {secaoAtiva("contato") && <Contato />}
        {secaoAtiva("ctaFinal") && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsAppFixo />
    </>
  );
}
