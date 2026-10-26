import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/*
  Valores da marca, tirados do posicionamento informado. Sem números ou
  estatísticas: nada aqui foi medido, então nada é quantificado.
*/
const values = [
  {
    title: "Precisão técnica",
    text: "Cada etapa é conduzida com rigor, do planejamento ao acabamento final.",
  },
  {
    title: "Excelência estética",
    text: "Forma, cor e textura pensadas para um resultado natural e harmônico.",
  },
  {
    title: "Cuidado com os detalhes",
    text: "Atenção ao que faz diferença: proporção, contorno e brilho.",
  },
  {
    title: "Atendimento humano",
    text: "Um ambiente acolhedor, com tempo para ouvir e explicar cada passo.",
  },
];

export function Positioning() {
  return (
    <section id="laboratorio" aria-labelledby="laboratorio-title" className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <SectionLabel index="01">O laboratório</SectionLabel>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-9">
            <h2 id="laboratorio-title" className="display h-statement max-w-[22ch] text-graphite">
              Alta performance em reabilitação oral, com o rigor de quem trabalha <em>no detalhe</em>.
            </h2>
            <p className="lead mt-8 max-w-[38rem] text-ink">
              O Laboratório Tonon, em São João da Boa Vista, é conduzido por Matheus Tonon, especialista em
              reabilitação estética. Um trabalho guiado por precisão técnica e sensibilidade estética, em um
              ambiente pensado para receber bem.
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 grid border-t border-graphite/15 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal
              as="li"
              key={v.title}
              delay={i * 90}
              className="border-b border-graphite/15 py-8 sm:px-0 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-l lg:px-8 lg:odd:pr-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-serif text-lg text-sage italic tabular-nums">{["i", "ii", "iii", "iv"][i]}.</span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-graphite">{v.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{v.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
