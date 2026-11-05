import { MSG, PLANEJAMENTO, waLink } from "../config";
import { Btn, IconWhats, Reveal, Rich, SectionLabel } from "./ui";

export function Planejamento() {
  return (
    <section id="planejamento" data-tone="dark" tabIndex={-1} aria-labelledby="plan-titulo" className="py-24 md:py-40">
      <div className="wrap grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="md:sticky md:top-36">
            <Reveal>
              <SectionLabel n="02">Planejamento previdenciário</SectionLabel>
              <h2 id="plan-titulo" className="h2 mt-8">
                <Rich text="Planejar é olhar adiante com *calma*." />
              </h2>
              <p className="lead mt-8 max-w-[40ch]">
                O planejamento previdenciário é uma análise cuidadosa da sua trajetória de trabalho e de contribuições. Com
                ela, você entende onde está hoje e quais caminhos podem existir até a aposentadoria.
              </p>
              <div className="mt-10">
                <Btn href={waLink(MSG.planejamento)} external icon={<IconWhats className="h-5 w-5" />}>
                  Conversar sobre planejamento
                </Btn>
              </div>
            </Reveal>
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          {PLANEJAMENTO.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.06} className="border-t border-[var(--line)] py-10 md:py-14">
              <div className="flex items-baseline gap-6">
                <span className="font-serif text-[clamp(3rem,2rem+3vw,5rem)] leading-none font-light text-[var(--accent)]">
                  {p.n}
                </span>
                <h3 className="h3 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">{p.titulo}</h3>
              </div>
              <p className="muted mt-5 max-w-[44ch] text-pretty md:ml-[calc(5rem+1.5rem)]">{p.texto}</p>
            </Reveal>
          ))}
          <li className="border-t border-[var(--line)] pt-8">
            <p className="muted max-w-[52ch] text-[0.9375rem] text-pretty">
              O planejamento mostra possibilidades a partir dos seus registros. A decisão sobre o melhor momento é sempre sua.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
