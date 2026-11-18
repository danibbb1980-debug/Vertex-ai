import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { CONFIG } from './config';
import { Cabecalho, FaixaRascunho, Hero } from './sections/Topo';
import { Atendimento, Avaliacao, ComoFunciona, Duvidas, Profissional } from './sections/Meio';
import { Agendar, AtalhosAgendamento, CtaFinal, Local, Rodape } from './sections/Fim';

if (CONFIG.rascunho) document.documentElement.setAttribute('data-rascunho', '');

function App() {
  const s = CONFIG.secoes;
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[60] focus:bg-ameixa focus:p-3 focus:text-nevoa">
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Cabecalho />
      <main id="conteudo">
        {s.hero && <Hero />}
        {s.avaliacao && <Avaliacao />}
        {s.atendimento && <Atendimento />}
        {s.profissional && <Profissional />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.local && <Local />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      {CONFIG.usarWhatsapp && <AtalhosAgendamento />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
