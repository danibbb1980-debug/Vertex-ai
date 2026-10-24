import { Label } from "../components/SectionHead";

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
    <section aria-labelledby="padrao-title" className="on-light relative z-10 bg-ivory-2 py-20 text-cocoa sm:py-24">
      <div className="container-v">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>O padrão Vertex</Label>
            <h2 id="padrao-title" className="mt-6 text-[clamp(2rem,4vw,2.8rem)]">
              O que todo site tem, em qualquer plano.
            </h2>
          </div>
          <p className="max-w-xs text-[0.95rem] text-cocoa-2 md:pb-1">Não são extras nem pacotes: é o processo de cada projeto.</p>
        </div>
        <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map(([t, d], i) => (
            <div key={t} className="border-t border-cocoa/20 pt-4">
              <dt className="font-display text-[1.05rem] font-medium text-cocoa">
                <span className="num mb-3 block">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </dt>
              <dd className="mt-1.5 text-[0.93rem] text-cocoa-2">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
