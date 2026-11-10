import { CONFIG, areasAtivas, profissionaisVisiveis } from "../config";
import { Revela } from "../components/Revela";
import { resumoHorarios } from "../lib/horarios";

export function Sobre() {
  const abertos = resumoHorarios().filter((g) => g.aberto);
  const fatos = [
    areasAtivas.length ? { n: String(areasAtivas.length), t: areasAtivas.length === 1 ? "área de atendimento" : "áreas de atendimento" } : null,
    profissionaisVisiveis.length ? { n: String(profissionaisVisiveis.length), t: "médicos no corpo clínico" } : null,
    abertos.length ? { n: abertos[0].texto.replace(" às ", "–"), t: abertos[0].dias.toLowerCase() } : null,
  ].filter(Boolean) as { n: string; t: string }[];

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="py-24 lg:py-32">
      <div className="container-phd grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Revela className="lg:col-span-5">
          <p className="rotulo">A clínica</p>
          <h2 id="titulo-sobre" className="mt-5 text-[2.15rem] sm:text-[2.6rem] lg:text-[3.1rem]">
            Várias áreas, um <em>mesmo</em> endereço.
          </h2>
        </Revela>
        <div className="lg:col-span-6 lg:col-start-7">
          <Revela className="space-y-5 text-lg text-cinza-texto" atraso={120}>
            <p>
              A {CONFIG.nome} reúne profissionais de diferentes áreas da medicina em um só lugar, na {CONFIG.endereco.bairro}, em{" "}
              {CONFIG.cidade}. Assim, a família encontra no mesmo endereço atendimentos que, muitas vezes, estariam em lugares diferentes.
            </p>
            <p>
              As consultas são feitas com hora marcada. Em cada atendimento, a avaliação é individual e as orientações são explicadas em
              linguagem simples.
            </p>
          </Revela>
          {fatos.length ? (
            <Revela atraso={220}>
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-y border-bronze/40 sm:grid-cols-3">
                {fatos.map((f) => (
                  <div key={f.t} className="flex flex-row items-baseline gap-4 py-5 sm:flex-col sm:gap-1 sm:py-6">
                    <dt className="order-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-bronze-texto sm:order-2">{f.t}</dt>
                    <dd className="order-1 font-serif text-[2.4rem] leading-none text-grafite">{f.n}</dd>
                  </div>
                ))}
              </dl>
            </Revela>
          ) : null}
        </div>
      </div>
    </section>
  );
}
