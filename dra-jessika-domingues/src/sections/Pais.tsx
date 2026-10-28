import { Blob, Sparkle } from "../components/Decor";
import { IconCheck } from "../components/Icons";
import { CabecalhoSecao, Confirmar } from "../components/ui";

const DICAS = [
  "Fale da consulta com naturalidade, alguns dias antes.",
  "Use palavras simples, como “a doutora vai contar e olhar os seus dentes”.",
  "Evite prometer que “não vai sentir nada” ou usar o dentista como ameaça. Prefira a verdade, dita com carinho.",
  "Se possível, escolha um horário em que a criança costuma estar descansada.",
  "Anote suas dúvidas para levar: elas são bem-vindas.",
];

export function Pais() {
  return (
    <section id="pais" aria-labelledby="titulo-pais" className="relative py-20 md:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <CabecalhoSecao
              id="titulo-pais"
              eyebrow="Para os pais"
              titulo="Ficar ansioso é *normal*."
              texto={
                <p>
                  A primeira ida ao dentista costuma gerar dúvidas na família inteira. Aqui está o que esperar e algumas
                  ideias para preparar o seu filho.
                </p>
              }
            />
            <div aria-hidden className="relative mt-12 hidden h-44 lg:block">
              <Blob variant="c" className="absolute left-0 h-44 w-44 text-butter-50" />
              <Sparkle filled className="cintilar absolute top-6 left-28 h-6 w-6 text-coral" />
              <Sparkle className="cintilar absolute top-20 left-10 h-4 w-4 text-sage-deep" style={{ animationDelay: "-2s" }} />
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-7">
          <article className="reveal card p-7 md:p-9">
            <p className="font-display text-5xl leading-none text-sage italic" aria-hidden>
              01
            </p>
            <h3 className="mt-3 text-[1.6rem] leading-tight font-normal">Na primeira visita</h3>
            <p className="mt-3">
              A primeira visita costuma ser um momento de apresentação: conhecer o espaço, conversar e, quando a criança
              estiver à vontade, fazer a avaliação. Cada criança reage de um jeito, e tudo bem.
            </p>
          </article>

          <article className="reveal card p-7 md:p-9" style={{ ["--d" as string]: "100ms" }}>
            <p className="font-display text-5xl leading-none text-coral italic" aria-hidden>
              02
            </p>
            <h3 className="mt-3 text-[1.6rem] leading-tight font-normal">Como preparar a criança</h3>
            <ul className="mt-5 space-y-3.5">
              {DICAS.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-deep">
                    <IconCheck size={15} />
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="reveal card p-7 md:p-9" style={{ ["--d" as string]: "200ms" }}>
            <p className="font-display text-5xl leading-none text-butter italic" aria-hidden>
              03
            </p>
            <h3 className="mt-3 text-[1.6rem] leading-tight font-normal">
              Os pais por perto
              <Confirmar />
            </h3>
            <p className="mt-3">
              Os pais acompanham o atendimento conforme a rotina da clínica. Se tiver alguma preferência ou se a criança
              precisar de algo especial, é só contar ao agendar.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
