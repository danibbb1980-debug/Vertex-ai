import { CONFIG } from "../config";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { GlifoDepilacao, GlifoDermaplaning, GlifoLimpeza, IconeSeta, IconeWhatsapp } from "./Icones";
import { Cabecalho, Revelar } from "./Revelar";
import { Spotlight } from "./Spotlight";
import { ComEnfase } from "./TextReveal";

const glifos: Record<string, typeof GlifoDepilacao> = {
  depilacao: GlifoDepilacao,
  "limpeza-de-pele": GlifoLimpeza,
  dermaplaning: GlifoDermaplaning,
};
const fundos = ["bg-nevoa-2", "bg-[#f7ece6]", "bg-[#eef1ec]"];

export function Atendimentos() {
  const lista = CONFIG.atendimentos;
  if (lista.length === 0) return null;

  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Cabecalho
            id="titulo-atendimentos"
            rotulo="Atendimentos"
            titulo={<ComEnfase text="Três cuidados, uma *avaliação* antes de cada um." />}
          />
          <p className="max-w-sm text-tinta-suave">{CONFIG.avisoIndicacao} Converse pelo WhatsApp para tirar dúvidas antes de agendar.</p>
        </div>

        <ul className={`mt-14 grid gap-5 ${lista.length >= 3 ? "lg:grid-cols-3" : lista.length === 2 ? "md:grid-cols-2" : ""}`}>
          {lista.map((a, i) => {
            const Glifo = glifos[a.id];
            return (
              <li key={a.id}>
              <Revelar delay={i * 0.08} className="h-full">
                <Spotlight as="article" className={`flex h-full flex-col rounded-xl3 border border-linha ${fundos[i % 3]} p-7 transition-transform duration-500 ease-(--ease-suave) hover:-translate-y-1 sm:p-8`}>
                  <span data-trace={`atendimento-${i}`} className="absolute left-1/2 top-28 size-px" />
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-sm italic text-tinta-suave">0{i + 1}</span>
                    {Glifo ? <Glifo className="h-16 w-24 text-ameixa/70" /> : null}
                  </div>
                  <h3 className="mt-8 font-serif text-[2rem] leading-tight tracking-[-0.01em] text-grafite">{a.nome}</h3>
                  <p className="mt-4 text-[1.02rem] text-grafite/85">{a.resumo}</p>
                  {a.apoio ? <p className="mt-3 text-[0.98rem] text-tinta-suave">{a.apoio}</p> : null}
                  {a.detalhes ? <p className="mt-3 text-[0.98rem] text-tinta-suave">{a.detalhes}</p> : null}
                  <p className="mt-6 border-t border-ameixa/10 pt-4 text-sm font-medium text-salvia-texto">{CONFIG.avisoIndicacao}</p>
                  {temWhatsapp ? (
                    <a
                      href={linkWhatsapp(CONFIG.mensagens.porAtendimento(a.nome))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/cta mt-auto inline-flex min-h-12 items-center gap-2 pt-6 font-semibold text-ameixa"
                    >
                      <IconeWhatsapp className="size-5" />
                      <span className="underline decoration-ameixa/30 underline-offset-4 group-hover/cta:decoration-ameixa">
                        Pedir informações<span className="sr-only"> sobre {a.nome.toLowerCase()} pelo WhatsApp</span>
                      </span>
                      <IconeSeta className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                    </a>
                  ) : null}
                </Spotlight>
              </Revelar>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
