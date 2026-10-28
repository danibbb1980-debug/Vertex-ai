import { CONFIG, listaPagamentos, modoAtual } from "../config";
import { FotoFachada } from "./FotoFachada";
import { IconeCadeira, IconeCalendario, IconeCartao, IconePorta } from "./Icones";
import { Cabecalho } from "./Texto";

export function Estrutura() {
  const itens = [
    {
      icone: <IconeCadeira />,
      titulo: "Acessibilidade para cadeirantes",
      texto: "Entrada, assento, banheiro e estacionamento acessíveis.",
    },
    { icone: <IconeCalendario />, titulo: "Hora marcada", texto: "O atendimento com hora marcada é recomendado." },
    { icone: <IconePorta />, titulo: "Banheiro", texto: "Banheiro no local, também acessível." },
    { icone: <IconeCartao />, titulo: "Formas de pagamento", texto: `${listaPagamentos()}.` },
  ];
  const ambas = modoAtual() === "ambas";
  return (
    <section id="estrutura" className="py-20 md:py-28" aria-labelledby="titulo-estrutura">
      <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <figure className="revela">
          <div className="overflow-hidden rounded-[2rem] bg-marfim-2">
            <FotoFachada className="h-auto w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-tinta-2">
            {ambas
              ? "A fachada na Av. Afonso Pena, 997: o consultório da Dra. Josiane à esquerda e o castelo do Odonto Baixinhos à direita."
              : `A fachada na ${CONFIG.endereco.rua}, no centro de Alfenas.`}
          </figcaption>
        </figure>
        <div>
          <Cabecalho
            id="titulo-estrutura"
            eyebrow="Estrutura e acessibilidade"
            titulo={ambas ? "Duas portas, a mesma *acolhida*." : "Um espaço pensado para *chegar* bem."}
            texto="Informações práticas para planejar a visita."
          />
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">
            {itens.map((it, i) => (
              <li
                key={it.titulo}
                className="revela rounded-2xl border border-linha bg-marfim-2/50 p-5"
                style={{ "--atraso": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="text-ouro-texto">{it.icone}</span>
                <h3 className="mt-3 font-sans text-[1rem] font-bold tracking-normal [font-variation-settings:normal]">{it.titulo}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-tinta-2">{it.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
