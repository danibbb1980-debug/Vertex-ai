import { useEffect, useRef, useState } from "react";
import { linkWhatsApp } from "../lib/whatsapp";
import { numeroDaSecao } from "../lib/secoes";
import { carregarMotion, prefereMenosMovimento } from "../lib/movimento";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Botao } from "../components/Botao";

const etapas = [
  {
    titulo: "Conversa pelo WhatsApp",
    texto: "Você envia uma mensagem, tira as primeiras dúvidas e combina com a equipe um horário para a avaliação.",
  },
  {
    titulo: "Avaliação e escuta das expectativas",
    texto: "Na consulta, o profissional ouve o que você procura e avalia com atenção a saúde bucal e o conjunto do rosto.",
  },
  {
    titulo: "Planejamento explicado com clareza",
    texto: "Você conhece as possibilidades indicadas para o seu caso, com cada etapa explicada antes de qualquer decisão.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Ao longo do cuidado, a equipe segue por perto, com retornos e orientações para cada fase.",
  },
];

export function ComoFunciona() {
  const listaRef = useRef<HTMLOListElement>(null);
  const trilhoRef = useRef<HTMLSpanElement>(null);
  const [menos, setMenos] = useState(false);
  const [ativa, setAtiva] = useState(-1);

  // Progresso da linha ligado à rolagem (ScrollTimeline do navegador via motion) e etapa ativa.
  useEffect(() => {
    const lista = listaRef.current;
    const trilho = trilhoRef.current;
    if (!lista || !trilho) return;
    if (prefereMenosMovimento()) {
      setMenos(true);
      return;
    }
    let paradas: Array<() => void> = [];
    let cancelado = false;
    carregarMotion().then(({ animate, scroll }) => {
      if (cancelado) return;
      const opcoes = { target: lista, offset: ["start 72%", "end 55%"] as ["start 72%", "end 55%"] };
      paradas = [
        scroll(animate(trilho, { scaleY: [0, 1] }, { ease: "linear" }), opcoes),
        scroll((v: number) => {
          setAtiva(v <= 0 ? -1 : Math.min(etapas.length - 1, Math.floor(v * etapas.length + 0.15)));
        }, opcoes),
      ];
    });
    return () => {
      cancelado = true;
      paradas.forEach((p) => p());
    };
  }, []);
  const marcada = (i: number) => menos || i <= ativa;

  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="relative z-10 py-24 md:py-36">
      <div className="contem grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--topo)+48px)]">
            <CabecalhoSecao
              numero={numeroDaSecao("comoFunciona")}
              rotulo="Como funciona"
              id="titulo-como-funciona"
              titulo={
                <>
                  Do primeiro contato ao <em>acompanhamento</em>.
                </>
              }
            >
              Quatro etapas simples, para você saber o que esperar desde a primeira mensagem.
            </CabecalhoSecao>
            <div className="mt-10 hidden lg:block">
              <Botao href={linkWhatsApp()} externo icone="whatsapp" variante="secundario">
                Começar pela conversa
              </Botao>
            </div>
          </div>
        </div>

        <ol ref={listaRef} className="relative lg:col-span-6 lg:col-start-7">
          {/* trilho e progresso */}
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[15px] w-px bg-linha" />
          <span
            ref={trilhoRef}
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[15px] w-px origin-top scale-y-0 bg-ouro data-[cheio=true]:scale-y-100"
            data-cheio={menos || undefined}
          />
          {etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[32px_1fr] gap-6 pb-14 last:pb-0 md:gap-10 md:pb-20">
              <span
                aria-hidden="true"
                className={`relative z-10 mt-1 grid size-[31px] place-items-center rounded-full border transition-[background-color,border-color] duration-500 ${
                  marcada(i) ? "border-ouro bg-tinta" : "border-tinta/20 bg-marfim"
                }`}
              >
                <span className={`size-1.5 rounded-full transition-colors duration-500 ${marcada(i) ? "bg-champanhe" : "bg-tinta/25"}`} />
              </span>
              <div className="[&_*]:transition-colors [&_*]:duration-700">
                <span className={`rotulo tabular-nums ${marcada(i) ? "text-bronze" : "text-cinza"}`}>Etapa {String(i + 1).padStart(2, "0")}</span>
                <h3 className={`mt-3 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.05] font-medium ${marcada(i) ? "text-tinta" : "text-cinza"}`}>
                  {e.titulo}
                </h3>
                <p className={`texto-corrido mt-4 max-w-[46ch] text-[1.03rem] leading-relaxed ${marcada(i) ? "text-suave" : "text-cinza"}`}>{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
