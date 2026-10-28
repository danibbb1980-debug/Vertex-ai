import { numeroDaSecao } from "../lib/secoes";
import { CONFIG } from "../config";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Revelar } from "../components/Revelar";
import { IconeSeta } from "../components/Icones";

const perfis = [
  { titulo: "Adultos que buscam a estética do sorriso", atendimento: "estetica" },
  { titulo: "Crianças e suas famílias", atendimento: "pediatrico" },
  { titulo: "Quem busca equilíbrio facial", atendimento: "harmonizacao" },
] as const;

export function ParaQuem() {
  const itens = perfis
    .map((p) => ({ ...p, a: CONFIG.atendimentos.find((a) => a.id === p.atendimento && a.ativo) }))
    .filter((p) => p.a);
  return (
    <section id="para-quem" aria-labelledby="titulo-para-quem" className="relative z-10 py-24 md:py-36">
      <div className="contem">
        <CabecalhoSecao
          numero={numeroDaSecao("paraQuem")}
          rotulo="Para quem"
          id="titulo-para-quem"
          titulo={
            <>
              Para quem procura cuidado <em>sem pressa</em>.
            </>
          }
        />
        <ul className="mt-14 grid gap-4 md:mt-20 md:gap-6 lg:grid-cols-3">
          {itens.map((p, i) => (
            <Revelar como="li" key={p.titulo} atraso={i * 120}>
              <a
                href={`#atendimento-${p.atendimento}`}
                className="group flex h-full flex-col justify-between gap-10 rounded-[24px] border border-linha bg-branco p-7 transition-colors duration-500 hover:border-ouro/60 md:p-9"
              >
                <div>
                  <span className="font-display text-[1.05rem] text-bronze italic">Para</span>
                  <h3 className="mt-2 font-display text-[1.95rem] leading-[1.06] font-medium">{p.titulo}</h3>
                  <p className="texto-corrido mt-4 text-suave">{p.a!.resumo}</p>
                </div>
                <span className="flex items-center justify-between border-t border-linha pt-5 text-[0.88rem] text-tinta">
                  <span>
                    <span className="sr-only">Atendimento relacionado: </span>
                    {p.a!.titulo}
                  </span>
                  <IconeSeta tamanho={18} className="text-bronze transition-transform duration-500 ease-[var(--ease-suave)] group-hover:translate-x-1" />
                </span>
              </a>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}
