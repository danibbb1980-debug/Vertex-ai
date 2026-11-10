import { useId, useState } from "react";
import { CONFIG, enderecoLinha } from "../config";
import { IconPlus } from "../components/Icons";
import { Reveal, SectionTitle } from "../components/Reveal";
import { resumoHorarios } from "../lib/horarios";

function perguntas() {
  const horas = resumoHorarios().map((h) => `${h.dias}: ${h.horas}`).join(". ");
  const canal = CONFIG.secoes.agendar ? `pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário deste site` : `pelo WhatsApp ${CONFIG.whatsappExibicao}`;
  const at = CONFIG.atendimentos.map((a) => a.titulo.toLowerCase() + (a.id === "hipertrofia" ? " (ganho de massa muscular)" : ""));
  const lista = [
    { q: "Preciso agendar a consulta?", a: `Sim. O atendimento é com hora marcada. Você pode pedir um horário ${canal}, e a equipe confirma a disponibilidade.` },
    { q: "Como é a primeira consulta?", a: "É uma conversa com tempo para entender seus objetivos, seu histórico de saúde, sua rotina e seus hábitos, com avaliação clínica. Ao final, o médico explica com clareza os caminhos possíveis e como será o acompanhamento." },
    at.length ? { q: "Quais atendimentos são realizados?", a: `Acompanhamento médico para ${at.join(" e para ")}. A indicação de qualquer conduta depende de avaliação médica individual.` } : null,
    { q: "Emagrecimento e ganho de massa muscular podem ser acompanhados juntos?", a: "Em muitos casos, esses objetivos podem ser trabalhados em conjunto. Se isso faz sentido para você, e de que forma, é algo definido na consulta, depois da avaliação." },
    { q: "O que levar na primeira consulta?", a: "De forma geral: um documento com foto, exames anteriores (se houver) e a relação dos medicamentos que você usa no dia a dia. Se quiser, anote suas dúvidas para não esquecer nenhuma." },
    { q: "Preciso fazer exames antes da consulta?", a: "Não é necessário. Se você tiver exames recentes, leve. Na consulta, o médico avalia se algum exame é indicado para o seu caso." },
    { q: "Posso começar uma dieta ou usar medicamentos antes da consulta?", a: "Não é recomendado iniciar nem suspender medicamentos ou dietas por conta própria. As orientações são definidas depois da avaliação médica." },
    { q: "Os resultados são iguais para todas as pessoas?", a: "Não. Cada organismo responde de um jeito, e cada pessoa tem uma rotina e uma história diferentes. Por isso o acompanhamento é individual e não há como prometer resultados." },
    { q: "Quais são os horários de atendimento?", a: `${horas}. ${CONFIG.avisoHorarios}` },
    { q: "Onde fica o consultório?", a: `${enderecoLinha()}.` },
  ];
  return lista.filter(Boolean) as { q: string; a: string }[];
}

/** Acordeão acessível (inspirado no "FAQ Accordion Reveal" do 21st.dev). */
export function Duvidas() {
  const itens = perguntas();
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  if (!itens.length) return null;
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="relative py-20 sm:py-28">
      <div className="container-site relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionTitle id="titulo-duvidas" rotulo="Dúvidas frequentes" titulo="Perguntas comuns, respostas diretas." enfase="diretas" intro={<p>Informações gerais. Questões sobre o seu caso são conversadas na consulta.</p>} />
        <Reveal>
          <ul className="divide-y divide-linha border-y border-linha">
            {itens.map((it, i) => {
              const isOpen = open === i;
              const bid = `${base}-b${i}`;
              const pid = `${base}-p${i}`;
              return (
                <li key={it.q}>
                  <h3 className="!font-sans !text-base">
                    <button
                      id={bid}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={pid}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left"
                    >
                      <span className={`font-display text-[1.35rem] font-semibold leading-snug transition-colors sm:text-[1.5rem] ${isOpen ? "text-agua-700" : "text-petroleo-900 group-hover:text-agua-700"}`}>{it.q}</span>
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-300 ${isOpen ? "rotate-45 border-agua-600 bg-agua-600 text-white" : "border-linha bg-white text-petroleo-800"}`}>
                        <IconPlus width={18} height={18} />
                      </span>
                    </button>
                  </h3>
                  <div id={pid} role="region" aria-labelledby={bid} hidden={!isOpen}>
                    <p className="max-w-2xl pb-6 pr-14 text-cinza motion-safe:animate-[faq-in_.35s_ease-out]">{it.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
