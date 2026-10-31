import { useUnidade } from "../../lib/unidade";
import { fechamentoMaisTarde, resumoHorarios } from "../../lib/horarios";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

export function Clinica() {
  const { unidade } = useUnidade();
  const abertos = resumoHorarios(unidade.horarios).filter((h) => !h.fechado);
  const ate = fechamentoMaisTarde(unidade.horarios);

  const pilares = [
    {
      titulo: "Planejamento caso a caso",
      texto: "Cada pessoa chega com uma história. O plano é pensado a partir da sua avaliação, nunca de um pacote pronto.",
    },
    {
      titulo: "Hora marcada",
      texto: "O atendimento é organizado por agendamento, para que a consulta aconteça com calma e sem pressa.",
    },
    abertos.length > 0 &&
      ate && {
        titulo: "Horário estendido",
        texto: `${abertos.map((h) => h.rotulo).join(" e ")}, até as ${ate}, para caber na rotina de quem trabalha ou estuda.`,
      },
  ].filter(Boolean) as { titulo: string; texto: string }[];

  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="relative py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Revelar>
          <TituloSecao
            id="titulo-clinica"
            rotulo="A clínica"
            titulo="Cuidado que começa por uma boa *conversa*."
          />
          <div className="mt-7 max-w-xl space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
            <p>
              A {unidade.nomeCurto} da Clínica Dental fica em {unidade.endereco.cidade} e atende com hora marcada. Antes de
              qualquer proposta, ouvimos o que você procura e examinamos com atenção.
            </p>
            <p>
              Depois, explicamos as possibilidades em linguagem simples, com tempo para perguntas, para que cada decisão
              seja sua, tomada com informação e tranquilidade.
            </p>
          </div>
        </Revelar>

        <ol className="relative space-y-4">
          {pilares.map((p, i) => (
            <li key={p.titulo}>
              <Revelar atraso={i * 0.12} className="group relative flex gap-6 rounded-3xl border border-line bg-white p-7 transition-[box-shadow] duration-500 hover:shadow-[0_24px_50px_-30px_rgb(2_24_38/0.45)] sm:p-8">
                <span className="font-serif text-4xl leading-none text-gold-500 italic" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl text-navy-900">{p.titulo}</h3>
                  <p className="mt-2 text-ink-soft">{p.texto}</p>
                </div>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
