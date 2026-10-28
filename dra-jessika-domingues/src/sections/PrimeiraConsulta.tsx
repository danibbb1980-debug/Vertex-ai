import { useEffect, useRef } from "react";
import { carregarEfeitos } from "../lib/movimento";
import { IconWhatsApp } from "../components/Icons";
import { BotaoWhatsApp, CabecalhoSecao } from "../components/ui";

const ETAPAS = [
  {
    titulo: "Contato pelo WhatsApp",
    texto: "Você manda uma mensagem, conta a idade e o momento do seu filho, e o horário é combinado com você.",
  },
  {
    titulo: "Conversa e conhecimento do espaço",
    texto: "Antes de tudo, uma conversa. A criança conhece a sala, os objetos e a doutora, no tempo dela.",
  },
  {
    titulo: "Avaliação gentil, no ritmo da criança",
    texto: "A avaliação é feita com calma, explicando cada passo para a criança antes de fazê-lo.",
  },
  {
    titulo: "Orientação clara aos pais",
    texto: "No fim, os pais recebem as orientações em linguagem simples, com espaço para todas as perguntas.",
  },
];

/**
 * Linha do tempo com progresso ao rolar (adaptada do padrão "progress stepper").
 * Sem JavaScript ou com "reduzir movimento", todas as etapas aparecem completas.
 */
export function PrimeiraConsulta() {
  const lista = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelar: (() => void) | undefined;
    let ativo = true;
    carregarEfeitos().then((e) => {
      if (e && ativo && lista.current && barra.current) cancelar = e.linhaDoTempo(lista.current, barra.current);
    });
    return () => {
      ativo = false;
      cancelar?.();
    };
  }, []);

  return (
    <section id="primeira-consulta" aria-labelledby="titulo-primeira" className="relative bg-cream-2 py-20 md:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <CabecalhoSecao
              id="titulo-primeira"
              eyebrow="A primeira consulta"
              titulo="Como funciona, *passo a passo*."
              texto={<p>Quatro momentos simples, do primeiro contato à orientação final.</p>}
            />
            <div className="reveal mt-9">
              <BotaoWhatsApp fase="geral" largo>Começar pelo WhatsApp</BotaoWhatsApp>
            </div>
          </div>
        </div>

        <ol ref={lista} className="relative lg:col-span-7">
          <span aria-hidden className="absolute top-3 bottom-3 left-[1.375rem] w-px bg-line" />
          <span
            ref={barra}
            aria-hidden
            className="absolute top-3 bottom-3 left-[1.3rem] w-[2px] origin-top rounded bg-sage-deep"
          />
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} data-etapa data-feita="" className="etapa group relative pb-10 pl-16 last:pb-0 md:pl-20">
              <span
                aria-hidden
                className="absolute top-0 left-0 inline-flex h-11 w-11 scale-90 items-center justify-center rounded-full border-2 border-line bg-paper font-display text-lg text-muted transition-[background-color,border-color,color,scale] duration-500 group-data-feita:scale-100 group-data-feita:border-sage-deep group-data-feita:bg-sage-deep group-data-feita:text-white"
              >
                {i === 0 ? <IconWhatsApp size={18} /> : i + 1}
              </span>
              <div className="card p-6 transition-[border-color,box-shadow] duration-500 group-data-feita:border-sage group-data-feita:shadow-[0_20px_44px_-34px_rgba(29,42,71,0.55)] md:p-7">
                <p className="text-[0.74rem] font-extrabold tracking-[0.16em] text-sage-deep uppercase">Etapa {i + 1}</p>
                <h3 className="mt-2 text-[1.45rem] leading-tight font-normal md:text-[1.6rem]">{e.titulo}</h3>
                <p className="mt-2.5">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
