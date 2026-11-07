// Acordeão acessível (padrão WAI-ARIA): botão com aria-expanded/aria-controls e região rotulada.
// Abertura só com opacidade e transform, sem animar altura.
import { useId, useState } from "react";
import { CONFIG } from "../config";
import { curto, resumoFds } from "../lib/horarios";
import { IconeMais } from "./Icones";
import { Cabecalho } from "./Revelar";
import { ComEnfase } from "./TextReveal";

function perguntas() {
  const e = CONFIG.endereco;
  const semana = CONFIG.horarios.find((h) => h.dias.includes(1));
  const fds = resumoFds();
  const nomes = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());
  const listaAt = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0];
  const contato = [CONFIG.whatsapp && `pelo WhatsApp ${CONFIG.whatsappExibicao}`, CONFIG.instagram.url && `pelo Instagram ${CONFIG.instagram.usuario}`].filter(Boolean).join(" ou ");

  return [
    { q: "Preciso agendar?", a: "Sim. O ideal é combinar o horário antes, pelo WhatsApp ou pelo formulário de solicitação deste site." },
    listaAt && { q: "Quais atendimentos são realizados?", a: `${listaAt.charAt(0).toUpperCase() + listaAt.slice(1)}. ${CONFIG.avisoIndicacao}` },
    semana && fds && {
      q: "Quais são os horários?",
      a: `De segunda a sexta, das ${curto(semana.abre)} às ${curto(semana.fecha)}. Aos ${fds.longo}, das ${curto(fds.h.abre)} às ${curto(fds.h.fecha)}. ${CONFIG.avisoHorarios}`,
    },
    fds && { q: "Atende aos fins de semana?", a: `Sim. Aos ${fds.longo}, das ${curto(fds.h.abre)} às ${curto(fds.h.fecha)}.` },
    { q: "Onde fica?", a: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}. ${e.referencia}` },
    CONFIG.acessibilidade && { q: "A entrada é acessível?", a: `Sim. ${CONFIG.acessibilidade}.` },
    { q: "Preciso de avaliação antes do procedimento?", a: `Sim. Cada atendimento começa com uma avaliação. ${CONFIG.avisoIndicacao}` },
    { q: "O que devo informar antes do atendimento?", a: "Se você tiver alergia, alguma condição de pele ou fizer uso de medicação, conte na avaliação. Não é preciso enviar essas informações pelo site." },
    CONFIG.whatsapp && {
      q: "Como solicitar um horário?",
      a: "Envie uma mensagem pelo WhatsApp ou use o formulário de solicitação: ele monta a mensagem para você. O dia e o horário escolhidos são preferências, e a disponibilidade é combinada na conversa.",
    },
    contato && { q: "Posso tirar dúvidas antes de agendar?", a: `Sim, ${contato}.` },
  ].filter(Boolean) as { q: string; a: string }[];
}

export function Faq() {
  const lista = perguntas();
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" aria-labelledby="titulo-faq" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Cabecalho id="titulo-faq" rotulo="Dúvidas frequentes" titulo={<ComEnfase text="O que você *precisa* saber." />} />
        </div>
        <div className="divide-y divide-ameixa/12 border-y border-ameixa/12">
          {lista.map((item, i) => {
            const open = aberta === i;
            const bid = `${base}-b${i}`;
            const pid = `${base}-p${i}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={bid}
                    type="button"
                    aria-expanded={open}
                    aria-controls={pid}
                    onClick={() => setAberta(open ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl text-grafite transition-colors hover:text-ameixa sm:text-[1.4rem]"
                  >
                    {item.q}
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500 ease-(--ease-suave) ${open ? "rotate-45 bg-ameixa text-porcelana" : "bg-nevoa text-ameixa"}`}>
                      <IconeMais />
                    </span>
                  </button>
                </h3>
                <div
                  id={pid}
                  role="region"
                  aria-labelledby={bid}
                  hidden={!open}
                  className="pb-6 pr-14 text-tinta-suave motion-safe:animate-[abrir_0.5s_var(--ease-suave)]"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
