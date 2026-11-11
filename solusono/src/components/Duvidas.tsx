import { useId, useState } from "react";
import { CONFIG, enderecoLinha, horariosResumo } from "../config";
import { IconeMais } from "./Icones";

function perguntas() {
  const h = horariosResumo()
    .map((l) => `${l.dias}: ${l.horas.toLowerCase()}`)
    .join("; ");
  return [
    {
      p: "O que é apneia do sono, em termos gerais?",
      r: "São pausas ou reduções da respiração que se repetem enquanto a pessoa dorme. O sono fica mais fragmentado, mesmo quando ela não se lembra de ter acordado. Só uma avaliação profissional pode dizer se é o caso.",
    },
    {
      p: "Ronco é sempre apneia?",
      r: "Não. O ronco pode acontecer com ou sem apneia. Ele é um sinal que vale investigar, principalmente quando vem acompanhado de pausas na respiração percebidas por alguém, cansaço durante o dia ou sono que não descansa.",
    },
    {
      p: "Quando procurar uma avaliação?",
      r: "Quando o ronco incomoda você ou a família, quando alguém nota pausas na respiração, quando o cansaço ao acordar é frequente, ou quando um médico orientou investigar o sono. A conversa inicial ajuda a entender o próximo passo.",
    },
    {
      p: "O que é polissonografia?",
      r: "É um exame que registra informações do sono, como a respiração e a oxigenação, durante a noite. Na versão domiciliar, ele é feito em casa, com um equipamento portátil. A indicação depende de avaliação profissional.",
    },
    {
      p: "O que é um aparelho de CPAP, em linguagem simples?",
      r: "É um aparelho que envia um fluxo de ar por uma máscara durante o sono, ajudando a manter a passagem do ar aberta. Ele é usado quando há indicação profissional, e a adaptação costuma ser gradual.",
    },
    {
      p: "Preciso comprar um aparelho antes da avaliação?",
      r: "Não. Qualquer aparelho, máscara ou ajuste só deve ser considerado depois da avaliação e da indicação profissional. Evite comprar ou ajustar equipamentos por conta própria.",
    },
    {
      p: "Para que serve o acompanhamento na adaptação ao CPAP?",
      r: "Os primeiros tempos com o aparelho podem trazer dúvidas e incômodos, como o encaixe da máscara. O acompanhamento serve para conversar sobre isso e fazer os ajustes possíveis, sempre conforme cada caso.",
    },
    {
      p: "Vocês atendem online?",
      r: "Sim. Há consulta e acompanhamento online, por videochamada. A equipe orienta quando esse formato é adequado ao seu caso.",
    },
    {
      p: "Quais são os horários?",
      r: `${h}. ${CONFIG.avisoHorarios}`,
    },
    {
      p: "Onde fica a SoluSono?",
      r: `${enderecoLinha()}. O endereço também está no Google Maps, na seção de contato.`,
    },
  ];
}

/** Acordeão acessível, um aberto por vez (adaptado do "Single Open Accordion" do 21st.dev). */
export function Duvidas() {
  const itens = perguntas();
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId();
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-white py-24 md:py-36">
      <div className="container-site grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="rotulo">Dúvidas frequentes</p>
            <h2 id="duvidas-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Perguntas que <em>sempre</em> aparecem.
            </h2>
            <p className="mt-6 max-w-[32ch] text-muted">
              Respostas gerais. A indicação de cada atendimento depende de avaliação profissional.
            </p>
          </div>
        </div>

        <div className="border-b border-line md:col-span-7 md:col-start-6">
          {itens.map((it, i) => {
            const id = `${base}-${i}`;
            const aberto = aberta === i;
            return (
              <div key={it.p} className="border-t border-line">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b`}
                    aria-expanded={aberto}
                    aria-controls={`${id}-p`}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[1.08rem] font-semibold text-ink transition-colors group-hover:text-brand md:text-[1.2rem]">
                      {it.p}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-brand transition-colors group-aria-expanded:bg-brand group-aria-expanded:text-white">
                      <IconeMais />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
                  <p className="aparece max-w-[60ch] pb-7 pr-14 text-muted">{it.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
