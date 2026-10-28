import { useCallback, useRef } from "react";
import { progressoNaTela, useMovimentoReduzido, useRolagem } from "../components/rolagem";
import { Secao, Cabecalho } from "../components/Secao";
import { BotaoWhatsApp } from "../components/Botoes";

const ETAPAS = [
  {
    titulo: "Contato pelo WhatsApp e agendamento",
    texto:
      "Você manda uma mensagem, conta um pouco sobre seu filho e combina um horário. O atendimento é sempre com hora marcada, para que ninguém precise ter pressa.",
  },
  {
    titulo: "Conversa e conhecimento do espaço",
    texto:
      "Na chegada, a criança conhece a sala, a cadeira e os objetos com calma. A família conversa com a doutora sobre a rotina e as dúvidas.",
  },
  {
    titulo: "Avaliação gentil, no ritmo da criança",
    texto: "A avaliação acontece passo a passo, com uma explicação simples para a criança antes de cada etapa.",
  },
  {
    titulo: "Orientação clara aos pais",
    texto:
      "Ao final, a doutora explica o que observou e orienta sobre os cuidados em casa e os próximos passos, quando houver.",
  },
];

/** Linha do tempo com progresso ao rolar (inspirada no Animated Progress Stepper / Scroll Progress do 21st.dev). */
export function PrimeiraConsulta() {
  const lista = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const reduzido = useMovimentoReduzido();
  const atualizar = useCallback(() => {
    if (!lista.current || !barra.current) return;
    barra.current.style.transform = `scaleY(${progressoNaTela(lista.current, 0.75, 0.55).toFixed(3)})`;
  }, []);
  useRolagem(atualizar, !reduzido);

  return (
    <Secao id="primeira-consulta">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Cabecalho
              id="primeira-consulta"
              eyebrow="A primeira consulta"
              titulo="Como *funciona*, passo a passo."
              texto={<p>Sem pressa e sem surpresas: cada etapa é explicada antes de acontecer.</p>}
            />
            <div className="revelar mt-8">
              <BotaoWhatsApp>Agendar a primeira consulta</BotaoWhatsApp>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:pt-4">
          <div className="absolute bottom-6 left-[1.4rem] top-10 lg:top-10 w-0.5 rounded-full bg-areia" aria-hidden />
          <div
            ref={barra}
            className="absolute bottom-6 left-[1.4rem] top-10 w-0.5 origin-top rounded-full bg-menta-escuro transition-transform duration-300 ease-out"
            style={{ transform: reduzido ? "none" : "scaleY(0)" }}
            aria-hidden
          />
          <ol ref={lista} className="relative">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="revelar relative grid grid-cols-[2.9rem_1fr] gap-5 pb-12 last:pb-0 md:gap-7" style={{ ["--atraso" as string]: `${i * 0.05}s` }}>
              <span className="relative z-[1] grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full bg-creme font-display text-lg font-medium text-menta-profundo ring-2 ring-menta">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[1.55rem] font-medium md:text-[1.8rem]">{e.titulo}</h3>
                <p className="mt-2.5 max-w-xl leading-relaxed text-cacau-2">{e.texto}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </Secao>
  );
}
