import { CONFIG, modoAtual } from "../config";
import { moverLuz } from "../lib/useRevela";
import { CartaoProfissional } from "./CartaoProfissional";
import { Foto } from "./Foto";
import { IconeEscuta, IconeFolha, IconeCoracao } from "./Icones";
import { Brilho } from "./Ornamentos";
import { Cabecalho } from "./Texto";

const COMPROMISSOS = [
  {
    icone: <IconeEscuta />,
    titulo: "Tempo para ouvir",
    texto: "A consulta começa pela conversa: o que você sente, o que espera e o que te preocupa.",
  },
  {
    icone: <IconeFolha />,
    titulo: "Explicação clara",
    texto: "Cada etapa é explicada antes de acontecer, com espaço para perguntas.",
  },
  {
    icone: <IconeCoracao />,
    titulo: "Respeito ao seu ritmo",
    texto: "Decisões tomadas em conjunto, respeitando seus medos e suas expectativas.",
  },
];

export function SecaoJosiane() {
  const pro = CONFIG.profissionais.josiane;
  const solo = modoAtual() === "josiane";
  return (
    <section id="dra-josiane" className="tema-josiane relative isolate overflow-hidden bg-creme py-20 md:py-28" aria-labelledby="titulo-josiane">
      <div className="filete absolute inset-x-0 top-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{ background: "radial-gradient(30rem 26rem at 0% 90%, color-mix(in srgb, var(--color-pessego) 45%, transparent), transparent 70%)" }}
      />
      <div className="container-site">
        <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="revela relative order-2 mx-auto w-full max-w-[24rem] md:order-1">
            <div className="relative rounded-t-[999px] bg-gradient-to-b from-[#d2ad80] to-madeira p-3 pb-0 shadow-[0_30px_60px_-30px_rgba(27,36,64,.4)]">
              <Brilho className="absolute -top-7 left-1/2 h-5 w-5 -translate-x-1/2 text-ouro" />
              <div className="overflow-hidden rounded-t-[999px] ring-1 ring-ouro-claro">
                <Foto
                  base={pro.foto.base}
                  larguras={pro.foto.larguras}
                  alt={pro.foto.alt}
                  sizes="(min-width: 768px) 384px, 90vw"
                  largura={809}
                  altura={1011}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
            <CartaoProfissional pro={pro} className="relative -mt-12 mx-3 md:-mx-6" />
          </div>

          <div className="order-1 md:order-2">
            <img
              src={pro.logo.src}
              alt={pro.logo.alt}
              width={pro.logo.largura}
              height={pro.logo.altura}
              loading="lazy"
              decoding="async"
              className="revela mb-8 h-auto w-44 md:w-52"
            />
            <Cabecalho
              id="titulo-josiane"
              eyebrow={solo ? "Sobre o atendimento" : "Dra. Josiane Silva · Adultos"}
              titulo="Cuidado que começa pela *escuta*."
              texto={
                <p>
                  Cada pessoa chega ao consultório com uma história, necessidades, medos e expectativas. O atendimento da
                  Dra. Josiane parte daí: ouvir com calma, explicar com clareza e definir junto com você o plano de cuidado.
                </p>
              }
            />
            <ul className="mt-9 grid gap-5 sm:grid-cols-3">
              {COMPROMISSOS.map((c, i) => (
                <li key={c.titulo} className="revela" style={{ "--atraso": `${i * 90}ms` } as React.CSSProperties}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ouro/60 text-caramelo">{c.icone}</span>
                  <h3 className="mt-4 text-[1.3rem] leading-tight">{c.titulo}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-tinta-2">{c.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <div className="revela flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h3 className="text-3xl md:text-[2.5rem]">
              <em>Atendimentos</em>
            </h3>
            <p className="max-w-md text-tinta-2">
              Odontologia geral e cuidado individualizado. A indicação de cada atendimento depende de avaliação individual.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pro.atendimentos.map((a, i) => (
              <li
                key={a.id}
                onPointerMove={moverLuz}
                className={`cartao-luz revela flex flex-col rounded-[var(--radius-cartao)] bg-marfim p-6 ${
                  a.confirmado ? "border border-linha" : "border border-dashed border-ouro/70"
                }`}
                style={{ "--atraso": `${i * 90}ms`, "--luz": "rgba(217,185,127,.22)" } as React.CSSProperties}
              >
                <span className="font-display text-sm italic text-ouro-texto">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-4 font-display text-[1.35rem] leading-tight [font-variation-settings:'SOFT'_0]">{a.titulo}</h4>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-tinta-2">{a.descricao}</p>
                {!a.confirmado ? (
                  <p className="mt-5">
                    <span className="confirmar">a confirmar com a clínica</span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
