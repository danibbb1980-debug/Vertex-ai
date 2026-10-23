import { Em, SectionHead } from "../components/SectionHead";

const itens = [
  ["Design personalizado", "Pensado para o seu segmento e para o seu público, não um modelo pronto com outro logo."],
  ["Primeiro para o celular", "É onde a maioria dos seus clientes vai abrir o site. Ele é desenhado a partir dessa tela."],
  ["WhatsApp em destaque", "O botão para falar com você aparece nos pontos certos, sem atrapalhar a leitura."],
  ["SEO técnico básico", "Títulos, descrições e estrutura organizados para o Google entender do que se trata o seu negócio."],
  ["Acessibilidade", "Contraste, navegação por teclado e textos alternativos para que todas as pessoas consigam usar."],
  ["Carregamento rápido", "Imagens otimizadas e código enxuto, para o site abrir bem mesmo no 4G."],
  ["Textos reais", "Nada de promessas inventadas, números sem fonte ou depoimentos que não existem."],
  ["Regras da sua profissão", "Respeito às normas de publicidade de cada área, como CFO, CFM e OAB."],
];

export function Padrao() {
  return (
    <section aria-labelledby="padrao-title" className="on-light relative z-10 bg-ivory py-24 text-cocoa sm:py-32">
      <div className="container-v">
        <SectionHead
          id="padrao-title"
          num="05"
          label="O padrão Vertex"
          title={
            <>
              O que todo site da Vertex <Em>tem.</Em>
            </>
          }
          intro="Não são extras nem pacotes. É o nosso processo, aplicado a cada projeto, do Essencial ao Completo."
        />
        <ul className="mt-16 grid border-t border-cocoa/15 sm:grid-cols-2">
          {itens.map(([t, d], i) => (
            <li
              key={t}
              data-reveal
              style={{ ["--d" as string]: `${(i % 2) * 90}ms` }}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-cocoa/15 py-7 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
            >
              <span className="num pt-1.5">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[1.3rem] text-cocoa">{t}</h3>
                <p className="mt-2 text-cocoa-2">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
