import { ArrowUpRight } from "lucide-react";
import { CONFIG, type Atendimento } from "../config";
import { FadeIn, RevealTitle } from "../components/Reveal";
import { SpotlightCard } from "../components/SpotlightCard";
import { WhatsAppIcon } from "../components/icons";
import { waAtendimento } from "../lib/whatsapp";

export const FRENTES = [
  { id: "facial", titulo: "Facial", resumo: "Cuidados com a pele do rosto, sempre a partir da avaliação." },
  { id: "corporal", titulo: "Corporal", resumo: "Tecnologias e técnicas para o corpo, com indicação individual." },
] as const;

export const atendimentosVisiveis = (): Atendimento[] =>
  CONFIG.atendimentos.filter((a) => !a.medico || CONFIG.mostrarProcedimentosMedicos);

function Card({ a, i }: { a: Atendimento; i: number }) {
  return (
    <FadeIn as="li" delay={(i % 4) * 0.06} className="h-full">
      <SpotlightCard className="flex h-full flex-col rounded-3xl border border-rose-300/12 bg-navy-850/70 p-7 transition-colors duration-500 hover:bg-navy-800/70 md:p-8">
        <h4 className="title text-[1.75rem] text-pearl">{a.nome}</h4>
        <p className="mt-3 flex-1 text-[0.97rem] leading-relaxed text-mist">{a.descricao}</p>
        <p className="mt-5 border-t border-rose-300/10 pt-4 text-[0.82rem] italic text-mist">{CONFIG.avisoAvaliacao}</p>
        <a
          href={waAtendimento(a.nome)}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link relative z-[1] mt-5 inline-flex min-h-12 items-center gap-2 self-start font-label text-[0.78rem] uppercase tracking-[0.18em] text-rose-300 hover:text-rose-200"
          aria-label={`Pedir informações sobre ${a.nome} pelo WhatsApp`}
        >
          <WhatsAppIcon size={15} />
          Pedir informações
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
        </a>
      </SpotlightCard>
    </FadeIn>
  );
}

export function Atendimentos() {
  const lista = atendimentosVisiveis();
  if (!CONFIG.secoes.atendimentos || lista.length === 0) return null;

  return (
    <section id="atendimentos" data-line="right" aria-labelledby="atendimentos-titulo" className="on-dark relative bg-navy-900 py-24 text-pearl md:py-36">
      <div aria-hidden="true" className="grid-fine absolute inset-0 opacity-60 [mask-image:linear-gradient(#000,transparent_40%)]" />
      <div className="container-site relative z-[2]">
        <div className="max-w-[44rem]">
          <p className="eyebrow mb-6 text-rose-300">Atendimentos</p>
          <RevealTitle id="atendimentos-titulo" text="Duas frentes, uma mesma *escuta*." className="text-[2.6rem] md:text-[3.8rem]" />
          <FadeIn>
            <p className="mt-6 text-[1.05rem] text-mist">
              Conheça os atendimentos da clínica. As descrições são informativas: o que é indicado para você é definido na avaliação
              individual.
            </p>
          </FadeIn>
        </div>

        {FRENTES.map((f) => {
          const itens = lista.filter((a) => a.frente === f.id);
          if (!itens.length) return null;
          return (
            <div key={f.id} className="mt-20">
              <div className="mb-8 grid gap-3 md:grid-cols-[14rem_1fr] md:items-end md:gap-10">
                <h3 className="title text-[2.4rem] md:text-[2.8rem]">
                  <em>{f.titulo}</em>
                </h3>
                <div className="flex items-center gap-6">
                  <p className="text-mist">{f.resumo}</p>
                  <div className="filete hidden flex-1 md:block" aria-hidden="true" />
                </div>
              </div>
              <ul className={`grid gap-5 sm:grid-cols-2 ${itens.length % 3 === 0 ? "lg:grid-cols-3" : itens.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                {itens.map((a, i) => (
                  <Card key={a.id} a={a} i={i} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
