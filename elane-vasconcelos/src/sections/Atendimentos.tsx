import { CONFIG } from "../config";
import { Botao } from "../components/Botao";
import { IconeWhatsApp } from "../components/Icones";
import { Revelar, TituloSecao } from "../components/Revelar";
import { waLink } from "../lib/whatsapp";

function Argola() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" fill="none" className="absolute -right-10 -top-10 h-28 w-28 sm:-right-6 sm:-top-6 sm:h-44 sm:w-44">
      <circle cx="60" cy="60" r="44" stroke="#B8956A" strokeWidth="0.9" pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:0.32] transition-[stroke-dashoffset] duration-[1200ms] ease-[var(--ease-suave)] group-hover:[stroke-dashoffset:0]" />
      <circle cx="60" cy="16" r="2.4" fill="#B8956A" />
    </svg>
  );
}

export function Atendimentos() {
  if (!CONFIG.secoes.atendimentos || CONFIG.atendimentos.length === 0) return null;
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="bg-blush-2/60 py-24 sm:py-32">
      <div className="container-site relative z-[1]">
        <TituloSecao id="titulo-atendimentos" rotulo="Atendimentos" antes="Dois cuidados, a mesma" enfase="delicadeza." />
        <Revelar atraso={0.1}>
          <p className="mt-6 max-w-xl text-texto">
            Cada atendimento começa por uma avaliação individual. É nela que conversamos sobre o que faz sentido para você ou para a sua criança.
          </p>
        </Revelar>
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {CONFIG.atendimentos.map((a, i) => (
            <Revelar key={a.id} atraso={i * 0.12} className="h-full">
              <article
                aria-labelledby={`at-${a.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-ouro/25 bg-marfim p-8 shadow-[0_20px_50px_-35px_rgba(46,33,36,0.4)] transition-transform duration-700 ease-[var(--ease-suave)] hover:-translate-y-1 sm:p-11"
              >
                <Argola />
                <p className="rotulo text-ouro-tinta">{String(i + 1).padStart(2, "0")} · {a.rotulo}</p>
                <h3 id={`at-${a.id}`} className="mt-5 max-w-[80%] text-4xl sm:text-[2.8rem]">{a.nome}</h3>
                <div className="mt-6 space-y-3 text-texto">
                  {a.descricao.map((p) => <p key={p}>{p}</p>)}
                </div>
                {a.id === "estetica" && CONFIG.procedimentos.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {CONFIG.procedimentos.map((p) => (
                      <li key={p} className="rounded-full border border-mauve/25 px-3 py-1 text-sm text-mauve">{p}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-10">
                  {CONFIG.whatsapp && (
                    <Botao href={waLink(CONFIG.mensagens.porAtendimento(a.nome))} externo variante="secundario" icone={<IconeWhatsApp className="h-5 w-5" />}>
                      Informações sobre {a.nome.toLowerCase()}
                    </Botao>
                  )}
                </div>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
