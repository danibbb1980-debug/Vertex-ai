import { CONFIG } from "./config";
import { ROMANOS, advogadosValidos, temAreas } from "./lib/util";
import { FaixaRascunho, Header } from "./components/Header";
import { Prumo } from "./components/Prumo";
import { Logo } from "./components/Logo";
import { Agendar } from "./components/Agendar";
import {
  Advogados,
  Atuacao,
  ComoFunciona,
  Contato,
  CtaFinal,
  Duvidas,
  Escritorio,
  Espaco,
  Hero,
  QuandoProcurar,
  Rodape,
  WhatsFixo,
} from "./components/Secoes";

type Bloco = { id: string; mostrar: boolean; render: (n: string) => React.ReactNode };

export default function App() {
  const s = CONFIG.secoes;
  // A ordem aqui é a ordem da página; o numeral romano é atribuído só às seções renderizadas.
  const blocos: Bloco[] = [
    { id: "escritorio", mostrar: s.escritorio, render: (n) => <Escritorio n={n} /> },
    { id: "espaco", mostrar: s.espaco && CONFIG.fotos.length > 1, render: (n) => <Espaco n={n} /> },
    { id: "advogados", mostrar: s.advogados && advogadosValidos().length > 0, render: (n) => <Advogados n={n} /> },
    { id: "atuacao", mostrar: s.atuacao && temAreas(), render: (n) => <Atuacao n={n} /> },
    { id: "quando", mostrar: s.quandoProcurar, render: (n) => <QuandoProcurar n={n} /> },
    { id: "como", mostrar: s.comoFunciona, render: (n) => <ComoFunciona n={n} /> },
    { id: "duvidas", mostrar: s.duvidas, render: (n) => <Duvidas n={n} /> },
    { id: "contato", mostrar: s.contato, render: (n) => <Contato n={n} /> },
    { id: "agendar", mostrar: s.agendar && CONFIG.usarWhatsapp, render: (n) => <Agendar n={n} /> },
  ];
  const visiveis = blocos.filter((b) => b.mostrar);

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-10 z-[60] -translate-y-24 bg-preto px-4 py-3 text-nevoa focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo" className="relative">
        <Prumo />
        <Hero />
        {visiveis.map((b, i) => (
          <div key={b.id}>{b.render(ROMANOS[i])}</div>
        ))}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape logo={<Logo tom="ouro" className="h-12 w-auto" />} />
      <WhatsFixo />
    </>
  );
}
