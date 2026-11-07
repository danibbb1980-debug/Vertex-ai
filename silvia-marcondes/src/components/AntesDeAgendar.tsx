import { CONFIG } from "../config";
import { Revelar } from "./Revelar";
import { ComEnfase } from "./TextReveal";

const itens = [
  { t: "Agendamento pelo WhatsApp", d: "Você envia uma mensagem e combina o dia e o horário diretamente com a Silvia." },
  { t: "Conte o que for importante", d: "Se tiver alergia, alguma condição de pele ou fizer uso de medicação, informe antes do procedimento para que a profissional possa avaliar." },
  { t: "Chegue com calma", d: "Procure chegar com alguns minutos de antecedência." },
  { t: "Ficou com dúvida?", d: "Converse pelo WhatsApp antes do atendimento. Toda pergunta é bem-vinda." },
  { t: "Imprevistos acontecem", d: "Se precisar mudar o horário, avise pelo WhatsApp." },
];

export function AntesDeAgendar() {
  return (
    <section aria-labelledby="titulo-antes" className="relative bg-porcelana-2 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="rotulo">Antes de agendar</p>
          <h2 id="titulo-antes" className="mt-4 font-serif text-[2.1rem] leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            <ComEnfase text="Algumas orientações *gerais*." />
          </h2>
          <p className="mt-5 text-lg text-tinta-suave">As orientações são dadas no atendimento.</p>
        </div>
        <ol className="divide-y divide-ameixa/10 rounded-xl3 bg-porcelana px-6 shadow-suave sm:px-8">
          {itens.map((it, i) => (
            <li key={it.t}>
              <Revelar delay={i * 0.04} y={10} className="flex gap-5 py-6">
                <span aria-hidden="true" className="w-6 shrink-0 font-serif text-xl italic text-salvia-texto">{i + 1}.</span>
                <div>
                  <h3 className="font-semibold text-grafite">{it.t}</h3>
                  <p className="mt-1 text-tinta-suave">{it.d}</p>
                </div>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
      <span className="sr-only">{CONFIG.avisoIndicacao}</span>
    </section>
  );
}
