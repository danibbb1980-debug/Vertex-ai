import { useId, useState } from "react";
import { atendimentosAtivos, CONFIG, enderecoLinha } from "../config";
import { horaFala } from "../tempo";
import { Hora } from "./ui";

function lista(itens: string[]) {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

function perguntas() {
  const d = CONFIG.horarios.dias;
  const sem = d[1];
  const sab = d[6];
  const nomes = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const q: { p: string; r: string }[] = [];

  if (CONFIG.usarWhatsapp && CONFIG.whatsapp)
    q.push({
      p: "Como agendar?",
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}. Você diz o atendimento e o dia que prefere, e a Andrea responde com os horários livres.`,
    });
  q.push({
    p: "Como é o primeiro atendimento?",
    r: "Começa com uma conversa sobre o que você procura e uma avaliação individual. A partir dela, o atendimento é definido em conjunto.",
  });
  q.push({
    p: "O que levar?",
    r: "Não é preciso levar nada específico. Se surgir alguma dúvida sobre o atendimento escolhido, pergunte na hora de agendar.",
  });
  if (nomes.length)
    q.push({
      p: "Quais atendimentos de estética e bem-estar são oferecidos?",
      r: `${lista(nomes).replace(/^./, (c) => c.toUpperCase())}. Todos com horário marcado.`,
    });
  q.push({
    p: "Todo atendimento serve para todas as pessoas?",
    r: "Não necessariamente. A indicação de cada atendimento depende de avaliação individual, feita antes de começar.",
  });
  if (sem)
    q.push({
      p: "Quais são os horários?",
      r: `De segunda a sexta, das ${horaFala(sem.abre)} às ${horaFala(sem.fecha)}${
        sab ? `; aos sábados, das ${horaFala(sab.abre)} às ${horaFala(sab.fecha)}` : ""
      }. ${CONFIG.horarios.aviso}`,
    });
  if (sab)
    q.push({
      p: "Atende aos sábados?",
      r: `Sim, das ${horaFala(sab.abre)} às ${horaFala(sab.fecha)}.`,
    });
  if (!d[0])
    q.push({
      p: "E aos domingos?",
      r: "Não. Aos domingos o espaço fica fechado.",
    });
  q.push({
    p: "Onde fica?",
    r: `${enderecoLinha()}.`,
  });
  if (CONFIG.secoes.agendar && CONFIG.usarWhatsapp)
    q.push({
      p: "Posso agendar pelo site?",
      r: "Pelo site você envia uma solicitação: o formulário monta a mensagem e abre o WhatsApp. O horário fica marcado depois que a Andrea responder com a disponibilidade.",
    });
  return q;
}

/** FAQ em acordeão (estrutura inspirada no "Ghost Accordion" do 21st.dev, refeita sem dependências). */
export default function Duvidas({ hora }: { hora: string }) {
  const q = perguntas();
  const [aberto, setAberto] = useState(0);
  const id = useId();

  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="border-t border-grafite/20 bg-linho-2/60">
      <div className="mx-auto grid max-w-[1240px] gap-y-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <Hora hora={hora} />
          <h2 id="t-duvidas" className="titulo mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)]">
            Dúvidas <span className="enfase">frequentes</span>
          </h2>
          <p className="mt-6 max-w-[20rem] text-grafite/85">
            Ficou alguma pergunta de fora? Ela pode ir junto no pedido de agendamento.
          </p>
        </div>
        <div className="lg:col-span-8">
          {q.map((x, i) => {
            const open = aberto === i;
            return (
              <div key={x.p} className="border-t border-grafite/25 last:border-b">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-r${i}`}
                    onClick={() => setAberto(open ? -1 : i)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left text-[1.12rem] font-medium"
                  >
                    {x.p}
                    <span aria-hidden="true" className="relative size-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-grafite" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-px bg-grafite transition-transform duration-300 ${open ? "scale-y-0" : ""}`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-r${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  inert={!open}
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-lento)] ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[40rem] pb-6 text-grafite/85">{x.r}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
