import { useId, useRef, useState, type ReactNode } from "react";
import { CONFIG, listaPagamentos, modoAtual } from "../config";
import { linhasDeHorario } from "../lib/horarios";
import { IconeMais } from "./Icones";
import { Cabecalho } from "./Texto";

interface Pergunta {
  p: string;
  r: ReactNode;
}
interface Grupo {
  id: string;
  rotulo: string;
  itens: Pergunta[];
}

function grupos(): Grupo[] {
  const modo = modoAtual();
  const horarios = linhasDeHorario()
    .map((l) => `${l.dias}: ${l.fechado ? "fechado" : l.texto.replace(/ · /g, " e ")}`)
    .join("; ");
  const e = CONFIG.endereco;
  const lista: Grupo[] = [];

  if (CONFIG.mostrarAline)
    lista.push({
      id: "criancas",
      rotulo: "Para crianças",
      itens: [
        {
          p: "Com que idade levar a criança ao dentista pela primeira vez?",
          r: "A orientação geral é que a primeira visita aconteça cedo, ainda no primeiro ano de vida, por volta do nascimento dos primeiros dentes. A doutora orienta cada família na avaliação, de acordo com a fase da criança.",
        },
        {
          p: "Como é a primeira consulta da criança?",
          r: "É um momento de conhecer. A criança vê o consultório, a doutora conversa com ela e com os pais, e a avaliação acontece no ritmo dela, com cada etapa explicada antes.",
        },
        {
          p: "O consultório atende pessoas com deficiência e gestantes?",
          r: "Sim. A Dra. Aline atende bebês, crianças, pessoas com deficiência, incluindo crianças atípicas, e gestantes. Conte as necessidades no primeiro contato para que a consulta seja planejada com a família.",
        },
      ],
    });

  if (CONFIG.mostrarJosiane)
    lista.push({
      id: "adultos",
      rotulo: modo === "josiane" ? "Atendimento" : "Para adultos",
      itens: [
        {
          p: modo === "josiane" ? "Como é a primeira consulta?" : "Como é a primeira consulta com a Dra. Josiane?",
          r: "Começa por uma conversa sobre o que você sente, suas necessidades, seus medos e suas expectativas. Depois vem a avaliação e a explicação do que foi observado, para você decidir com informação.",
        },
        {
          p: "Quais atendimentos a Dra. Josiane realiza?",
          r: (
            <>
              Odontologia geral, com cuidado individualizado. Para saber se o seu caso é atendido, fale pelo WhatsApp.{" "}
              {/* CONFIRMAR COM A CLÍNICA: lista de atendimentos */}
              <span className="confirmar">lista a confirmar</span>
            </>
          ),
        },
      ],
    });

  lista.push({
    id: "geral",
    rotulo: "Geral",
    itens: [
      {
        p: "Como agendar?",
        r:
          modo === "ambas"
            ? "Pelo WhatsApp de cada profissional ou pelo formulário de solicitação nesta página. A clínica confirma a disponibilidade pelo próprio WhatsApp."
            : "Pelo WhatsApp ou pelo formulário de solicitação nesta página. A disponibilidade é confirmada pelo próprio WhatsApp.",
      },
      {
        p: "Onde fica e quais são os horários?",
        r: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}. ${horarios}. ${CONFIG.observacaoHorarios}`,
      },
      {
        p: "Há acessibilidade?",
        r: "Sim. Há entrada, assento, banheiro e estacionamento acessíveis para cadeirantes.",
      },
      {
        p: "Quais são as formas de pagamento?",
        r: `${listaPagamentos()}.`,
      },
      {
        p: "Preciso marcar horário?",
        r: "O atendimento com hora marcada é recomendado. Combine o dia e o horário pelo WhatsApp antes de ir.",
      },
    ],
  });
  return lista;
}

function Item({ q, aberto, onToggle }: { q: Pergunta; aberto: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-linha">
      <h3 className="font-sans text-base tracking-normal [font-variation-settings:normal]">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-bold leading-snug md:text-[1.12rem]"
        >
          {q.p}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tinta/15 transition-transform duration-500 ${
              aberto ? "rotate-45 bg-tinta text-marfim" : ""
            }`}
            aria-hidden="true"
          >
            <IconeMais tamanho={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
        <p className="abre max-w-3xl pb-6 pr-12 leading-relaxed text-tinta-2">{q.r}</p>
      </div>
    </li>
  );
}

export function Duvidas() {
  const lista = grupos();
  const [aba, setAba] = useState(lista[0].id);
  const [aberta, setAberta] = useState<string | null>(`${lista[0].id}-0`);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const atual = lista.find((g) => g.id === aba) ?? lista[0];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + lista.length) % lista.length;
    setAba(lista[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <section id="duvidas" className="py-20 md:py-28" aria-labelledby="titulo-duvidas">
      <div className="container-site grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div>
          <Cabecalho
            id="titulo-duvidas"
            eyebrow="Dúvidas frequentes"
            titulo="Perguntas que *chegam* sempre."
            texto="Respostas gerais. As orientações para cada caso são dadas na avaliação."
          />
        </div>
        <div className="revela">
          <div role="tablist" aria-label="Grupos de perguntas" className="flex flex-wrap gap-2">
            {lista.map((g, i) => (
              <button
                key={g.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`aba-${g.id}`}
                aria-selected={aba === g.id}
                aria-controls={`painel-${g.id}`}
                tabIndex={aba === g.id ? 0 : -1}
                onKeyDown={(e) => onKey(e, i)}
                onClick={() => setAba(g.id)}
                className={`min-h-12 rounded-full px-5 text-sm font-bold transition-colors duration-300 ${
                  aba === g.id ? "bg-tinta text-marfim" : "border border-tinta/15 text-tinta-2 hover:text-tinta"
                }`}
              >
                {g.rotulo}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`painel-${atual.id}`} aria-labelledby={`aba-${atual.id}`} className="mt-6" tabIndex={-1}>
            <ul className="border-t border-linha">
              {atual.itens.map((q, i) => {
                const k = `${atual.id}-${i}`;
                return <Item key={k} q={q} aberto={aberta === k} onToggle={() => setAberta(aberta === k ? null : k)} />;
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
