import { CONFIG, atendimentosAtivos, formacaoAtiva, frentesAtivas, temCrn } from './config';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Atendimentos } from './sections/Atendimentos';
import { Consulta } from './sections/Consulta';
import { Sobre } from './sections/Sobre';
import { ComoFunciona } from './sections/ComoFunciona';
import { Horarios } from './sections/Horarios';
import { Duvidas } from './sections/Duvidas';
import { Contato } from './sections/Contato';
import { Agendar } from './sections/Agendar';
import { CtaFinal, DraftBar, FloatCta, Footer, MobileBar } from './sections/Final';

type Sec = { key: keyof typeof CONFIG.secoes; ok: boolean; C: React.ComponentType<{ num: string }> };

export function App() {
  const s = CONFIG.secoes;
  const lista: Sec[] = [
    { key: 'atendimentos', ok: atendimentosAtivos().length > 0, C: Atendimentos },
    { key: 'consulta', ok: true, C: Consulta },
    { key: 'sobre', ok: formacaoAtiva().length > 0 || temCrn() || !!CONFIG.foto, C: Sobre },
    { key: 'comoFunciona', ok: frentesAtivas().length > 0, C: ComoFunciona },
    { key: 'horarios', ok: CONFIG.horarios.length > 0, C: Horarios },
    { key: 'duvidas', ok: true, C: Duvidas },
    { key: 'contato', ok: true, C: Contato },
    { key: 'agendar', ok: CONFIG.usarWhatsapp, C: Agendar },
  ];
  const visiveis = lista.filter((x) => s[x.key] && x.ok);
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {visiveis.map(({ key, C }, i) => (
          <C key={key} num={String(i + 1).padStart(2, '0')} />
        ))}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <FloatCta />
      <MobileBar />
    </>
  );
}
