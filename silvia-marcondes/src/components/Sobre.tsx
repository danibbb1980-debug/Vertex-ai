import { CONFIG } from "../config";
import { Monograma } from "./Logo";
import { Revelar } from "./Revelar";
import { ComEnfase } from "./TextReveal";
import { IconeCheck } from "./Icones";
import { horarioDoDia, resumoFds } from "../lib/horarios";

export function Sobre() {
  const p = CONFIG.profissional;
  const foto = p.foto;
  const fds = resumoFds();
  const todosOsDias = ([0, 1, 2, 3, 4, 5, 6] as const).every((d) => horarioDoDia(d));
  const pontos = [
    "Avaliação antes de cada procedimento",
    "Explicações claras, sem pressa",
    todosOsDias ? "Atendimento de segunda a domingo" : "",
    CONFIG.whatsapp ? "Agendamento pelo WhatsApp" : "",
  ].filter(Boolean);
  const extras = [p.titulo, p.formacao, p.registro, p.tempoAtuacao].filter((x) => x.trim());

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Revelar className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-md">
          {foto ? (
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-2.5 rounded-t-full rounded-b-[2.6rem] border border-ameixa/15 sm:-inset-4 sm:rounded-b-[3rem]" />
              <picture>
                <source
                  type="image/avif"
                  srcSet={foto.larguras.map((w) => `${foto.base}-${w}.avif ${w}w`).join(", ")}
                  sizes="(min-width: 1024px) 28rem, 90vw"
                />
                <source
                  type="image/webp"
                  srcSet={foto.larguras.map((w) => `${foto.base}-${w}.webp ${w}w`).join(", ")}
                  sizes="(min-width: 1024px) 28rem, 90vw"
                />
                <img
                  src={`${foto.base}-720.webp`}
                  alt={foto.alt}
                  width={foto.largura}
                  height={foto.altura}
                  loading="lazy"
                  decoding="async"
                  className="relative aspect-[4/5] w-full rounded-t-full rounded-b-[2rem] object-cover object-[50%_30%] shadow-cartao"
                />
              </picture>
              <div className="absolute -bottom-6 -right-3 flex items-center gap-3 rounded-full bg-porcelana py-2 pl-2 pr-5 shadow-cartao sm:-right-8">
                <span className="grid size-11 place-items-center rounded-full bg-nevoa text-ameixa">
                  <Monograma className="size-8" strokeWidth={2.6} />
                </span>
                <span className="leading-tight">
                  <span className="block font-serif text-lg text-grafite">{p.nome}</span>
                  <span className="block text-[0.8rem] text-tinta-suave">{p.descritor}</span>
                </span>
              </div>
            </div>
          ) : (
            <div aria-hidden="true" className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-t-full rounded-b-[2rem] border border-ameixa/15 bg-nevoa-2">
              <div className="luz absolute inset-0" />
              <Monograma className="relative w-2/3 text-ameixa" strokeWidth={1.2} />
            </div>
          )}
          <span data-trace="sobre" className="absolute -left-6 top-1/3 size-px" />
        </Revelar>

        <div>
          <p className="rotulo">Sobre</p>
          <h2 id="titulo-sobre" className="mt-4 font-serif text-[2.1rem] leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            <ComEnfase text="Atendimento individual, com *calma*." />
          </h2>
          <div className="mt-6 space-y-4 text-lg text-tinta-suave">
            <p>
              {p.nome} é {p.descritor.toLowerCase()} e atende de forma individual em {CONFIG.endereco.cidade}. Cada
              procedimento começa com uma avaliação, para entender o que você procura e explicar com clareza como o
              atendimento funciona.
            </p>
            <p>
              O horário amplo, cedo pela manhã e à noite durante a semana{fds ? ` e pela manhã aos ${fds.longo}` : ""}, ajuda
              quem tem a rotina cheia a encontrar um momento para se cuidar.
            </p>
            {extras.map((x) => (
              <p key={x}>{x}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {pontos.map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl2 bg-nevoa-2 px-4 py-3 text-[0.98rem] text-grafite">
                <IconeCheck className="mt-0.5 size-5 shrink-0 text-salvia-texto" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
