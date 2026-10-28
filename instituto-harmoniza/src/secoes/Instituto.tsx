import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar } from "../components/Confirmar";
import { Revelar } from "../components/Revelar";

// CONFIRMAR COM A CLÍNICA: compromissos propostos, a validar.
const pilares = [
  {
    titulo: "Avaliação individual",
    texto: "Cada pessoa é avaliada com tempo e atenção, sem soluções prontas.",
  },
  {
    titulo: "Planejamento explicado",
    texto: "Você entende cada etapa sugerida antes de decidir qualquer coisa.",
  },
  {
    titulo: "Atendimento para toda a família",
    texto: "Do cuidado das crianças ao dos adultos, no mesmo endereço.",
  },
];

export function Instituto() {
  return (
    <section id="instituto" aria-labelledby="titulo-instituto" className="relative z-10 py-24 md:py-36">
      <div className="contem">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <CabecalhoSecao
            className="lg:col-span-6"
            numero={numeroDaSecao("instituto")}
            rotulo="O instituto"
            id="titulo-instituto"
            titulo={
              <>
                Saúde, função e estética, em <em>equilíbrio</em>.
              </>
            }
          />
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <Revelar className="texto-corrido space-y-5 text-[1.08rem] leading-relaxed text-suave">
              <p className="font-display text-[1.75rem] leading-[1.25] text-tinta md:text-[2rem]">
                No Instituto Harmoniza, cada atendimento começa pela escuta.
              </p>
              <p>
                Antes de qualquer indicação, olhamos para o conjunto: a saúde da boca, o funcionamento do sorriso e a expressão do
                rosto.
              </p>
              <p>
                A estética vem como parte de um cuidado bem planejado, explicado com clareza e no tempo de cada pessoa.
              </p>
            </Revelar>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <Revelar className="flex flex-wrap items-center gap-3 text-cinza">
            <h3 className="rotulo">Nossos compromissos</h3>
            <Confirmar />
          </Revelar>
          <ol className="mt-6 grid border-t border-linha md:grid-cols-3">
            {pilares.map((p, i) => (
              <Revelar
                como="li"
                key={p.titulo}
                atraso={i * 110}
                className="group relative border-b border-linha py-8 md:border-b-0 md:py-10 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10"
              >
                <span className="font-display text-[1.05rem] text-bronze italic">{["i.", "ii.", "iii."][i]}</span>
                <p className="mt-3 font-display text-[1.9rem] leading-[1.08] font-medium">{p.titulo}</p>
                <p className="texto-corrido mt-3 max-w-[34ch] text-suave">{p.texto}</p>
              </Revelar>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
