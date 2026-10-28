import { useId, useState, type ReactNode } from "react";
import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar } from "../components/Confirmar";
import { IconeMais } from "../components/Icones";

type Pergunta = { p: string; r: ReactNode };

function perguntas(): Pergunta[] {
  const [semana, sabado] = CONFIG.horarios.linhas;
  return [
    {
      p: "Como funciona a avaliação?",
      r: "É o primeiro encontro com o profissional: uma conversa sobre o que você procura, seguida do exame clínico. A partir dela, as possibilidades indicadas para o seu caso são explicadas com clareza, para você decidir com tranquilidade.",
    },
    {
      p: "Preciso saber qual tratamento quero antes de agendar?",
      r: "Não. A avaliação existe justamente para entender o que você procura e indicar, com clareza, o que faz sentido para o seu caso.",
    },
    {
      p: "A partir de que idade as crianças podem ser atendidas?",
      r: (
        <>
          De modo geral, recomenda-se que a primeira consulta odontológica aconteça cedo, com o nascimento dos primeiros dentes.
          Fale com a equipe pelo WhatsApp para saber como o instituto organiza o atendimento infantil.
          <Confirmar />
        </>
      ),
    },
    {
      p: "O que é harmonização orofacial, de forma geral?",
      r: "É uma área da odontologia dedicada ao equilíbrio estético e funcional da face e do sorriso. Cada indicação depende de avaliação individual e de uma conversa franca sobre expectativas e limites.",
    },
    {
      p: "Como funciona a sedação, de forma geral?",
      r: "A sedação odontológica é um recurso que pode ser indicado em situações específicas, para tornar o atendimento mais tranquilo. A indicação, o tipo e os cuidados necessários são definidos na avaliação, seguindo protocolos de segurança, e explicados antes de qualquer decisão.",
    },
    {
      p: "Os valores são informados pelo site?",
      r: "Não. Cada planejamento depende da avaliação individual, e todas as informações são conversadas com transparência no atendimento.",
    },
    {
      p: "Como agendar?",
      r: (
        <>
          Pelo WhatsApp{" "}
          <a className="underline decoration-ouro underline-offset-4" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
            {CONFIG.telefoneExibicao}
          </a>
          . Você envia uma mensagem e a equipe responde para combinar o dia e o horário da avaliação.
        </>
      ),
    },
    {
      p: "Onde fica e quais são os horários?",
      r: (
        <>
          Na {CONFIG.endereco.valor}
          <Confirmar mostrar={!CONFIG.endereco.confirmado} valor={CONFIG.endereco.valor} />. Atendimento de segunda a sexta, das {semana.horas}, e aos
          sábados, das {sabado.horas}. {CONFIG.horarios.observacao}
          <Confirmar mostrar={!CONFIG.horarios.confirmado} />
        </>
      ),
    },
    ...(CONFIG.comodidades.estacionamento
      ? [{ p: "Há estacionamento?", r: "Sim, o instituto conta com estacionamento no local." }]
      : []),
  ];
}

function Item({ q, i }: { q: Pergunta; i: number }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  return (
    <li className="border-b border-linha">
      <h3>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="group flex w-full items-start gap-5 py-6 text-left md:gap-8 md:py-7"
        >
          <span className="rotulo mt-2.5 w-6 shrink-0 text-bronze tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1 font-display text-[1.55rem] leading-[1.15] font-medium md:text-[1.85rem]">{q.p}</span>
          <span
            aria-hidden="true"
            className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-suave)] ${
              aberto ? "rotate-45 border-tinta bg-tinta text-marfim" : "border-tinta/20 text-tinta group-hover:border-tinta/50"
            }`}
          >
            <IconeMais tamanho={16} />
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto} className="acordeao-painel">
        <div className="texto-corrido max-w-[62ch] pr-12 pb-8 pl-11 text-[1.03rem] leading-relaxed text-suave md:pl-14">{q.r}</div>
      </div>
    </li>
  );
}

export function Duvidas() {
  const lista = perguntas();
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="relative z-10 py-24 md:py-36">
      <div className="contem grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--topo)+48px)]">
            <CabecalhoSecao
              numero={numeroDaSecao("duvidas")}
              rotulo="Dúvidas frequentes"
              id="titulo-duvidas"
              titulo={
                <>
                  Perguntas, com <em>calma</em>.
                </>
              }
            >
              Informações gerais. Cada caso é conversado na avaliação.
            </CabecalhoSecao>
          </div>
        </div>
        <ul className="border-t border-linha lg:col-span-8">
          {lista.map((q, i) => (
            <Item key={q.p} q={q} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
