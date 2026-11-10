import { areasAtivas } from "../config";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";

export function AntesConsulta() {
  const temPediatria = areasAtivas.some((a) => a.slug === "pediatria");
  const itens = [
    { t: "Agende antes", d: "O atendimento é com hora marcada. A equipe confirma o dia e o horário com você." },
    { t: "Documento e antecedência", d: "Leve um documento de identidade com foto e chegue com alguns minutos de antecedência." },
    { t: "Exames e receitas anteriores", d: "Se tiver, leve exames, receitas e relatórios de consultas anteriores." },
    { t: "Alergias e medicamentos", d: "Avise sobre alergias e sobre os medicamentos que estiver usando." },
    temPediatria
      ? { t: "Consultas de crianças", d: "Leve o cartão de vacinação. A criança deve vir acompanhada do responsável legal." }
      : null,
  ].filter(Boolean) as { t: string; d: string }[];

  return (
    <section id="antes-da-consulta" aria-labelledby="titulo-antes" className="bg-areia/55 py-24 lg:py-32">
      <div className="container-phd grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Titulo id="titulo-antes" rotulo="Antes da consulta">
              O que levar e o que <em>avisar</em>
            </Titulo>
            <Revela atraso={150}>
              <p className="mt-8 max-w-sm border-l-[1.5px] border-bronze-escuro pl-5 font-serif text-xl italic text-grafite">
                As orientações são dadas na consulta.
              </p>
            </Revela>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {itens.map((it, i) => (
            <Revela as="li" key={it.t} atraso={i * 60} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-bronze/45 py-7 last:border-b sm:grid-cols-[4.5rem_1fr]">
              <span aria-hidden="true" className="font-serif text-[2rem] leading-none text-bronze-escuro">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-[1.15rem] font-semibold tracking-normal">{it.t}</h3>
                <p className="mt-2 text-cinza-texto">{it.d}</p>
              </div>
            </Revela>
          ))}
        </ol>
      </div>
    </section>
  );
}
