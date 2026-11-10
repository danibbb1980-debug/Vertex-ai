import { useRef } from "react";
import { Titulo } from "../components/Titulo";
import { useProgressoRolagem } from "../lib/useProgressoRolagem";

const ETAPAS = [
  { t: "Contato e agendamento", d: "Você envia uma mensagem ou liga. A equipe verifica a agenda e confirma o dia e o horário." },
  { t: "Consulta e avaliação", d: "No horário combinado, o médico ou a médica conversa com você e faz a avaliação individual." },
  { t: "Orientações", d: "As orientações são explicadas na própria consulta, em linguagem simples, e você pode tirar suas dúvidas." },
  { t: "Acompanhamento", d: "Quando houver indicação médica, um retorno pode ser combinado com a equipe da clínica." },
];

/** Linha do tempo com progresso ao rolar (só transform: scaleY). */
export function ComoFunciona() {
  const lista = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);

  useProgressoRolagem(lista, (p) => {
    if (barra.current) barra.current.style.transform = `scaleY(${p})`;
    itens.current.forEach((li, i) => {
      if (!li) return;
      const limite = i / ETAPAS.length;
      li.dataset.ativo = p > limite + 0.02 || p >= 1 ? "true" : "false";
    });
  });

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="py-24 lg:py-32">
      <div className="container-phd grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Titulo
              id="titulo-como"
              rotulo="Como funciona"
              apoio={<p>Cada etapa é combinada com a equipe da clínica.</p>}
            >
              Do contato ao <em>retorno</em>
            </Titulo>
          </div>
        </div>
        <ol ref={lista} className="relative lg:col-span-6 lg:col-start-7">
          <div aria-hidden="true" className="absolute bottom-6 left-[1.05rem] top-3 w-[7px] border-x-[1.5px] border-bronze/30" />
          <div
            ref={barra}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.05rem] top-3 w-[7px] origin-top border-x-[1.5px] border-bronze-escuro will-change-transform"
            style={{ transform: "scaleY(0)" }}
          />
          {ETAPAS.map((e, i) => (
            <li
              key={e.t}
              ref={(el) => {
                itens.current[i] = el;
              }}
              data-ativo="false"
              className="etapa group relative grid grid-cols-[3.25rem_1fr] gap-5 pb-14 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="relative z-10 mt-0.5 flex size-[2.6rem] items-center justify-center rounded-[2px_999px_999px_2px] border-[1.5px] border-bronze-escuro bg-creme font-serif text-[1.05rem] text-grafite transition-colors duration-500 group-data-[ativo=true]:border-grafite group-data-[ativo=true]:bg-grafite group-data-[ativo=true]:text-creme"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-texto">Etapa {i + 1}</p>
                <h3 className="mt-2 text-[1.75rem] sm:text-[2rem]">{e.t}</h3>
                <p className="mt-3 max-w-md text-cinza-texto">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
