import { IconAlert, IconCompass, IconRoute, IconShield } from "../components/Icons";
import { Reveal, SectionTitle } from "../components/Reveal";

const ITENS = [
  { icon: IconRoute, t: "Quem quer emagrecer com acompanhamento médico", d: "Para entender o próprio ponto de partida e seguir um plano pensado para a sua rotina." },
  { icon: IconShield, t: "Quem quer ganhar massa muscular com segurança", d: "Para alinhar treino, alimentação e saúde com orientação médica." },
  { icon: IconCompass, t: "Quem já tentou sozinho e quer orientação", d: "Para conversar com calma sobre o que foi feito até aqui e entender os próximos passos." },
];

export function ParaQuem() {
  return (
    <section id="para-quem" aria-labelledby="titulo-para-quem" className="relative py-20 sm:py-28">
      <div className="container-site relative z-10">
        <SectionTitle id="titulo-para-quem" rotulo="Para quem é" titulo="Para quem busca orientação, no seu ritmo." enfase="orientação" />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-linha bg-linha md:grid-cols-3">
          {ITENS.map((it, i) => (
            <Reveal as="li" key={it.t} delay={i * 0.08} className="bg-white p-7 sm:p-8">
              <it.icon width={30} height={30} className="text-agua-600" />
              <h3 className="mt-5 text-[1.6rem] font-semibold">{it.t}</h3>
              <p className="mt-2 text-cinza">{it.d}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-6 flex gap-3 rounded-2xl border border-agua-400/50 bg-agua-300/20 p-5 sm:items-center">
          <IconAlert width={22} height={22} className="mt-0.5 shrink-0 text-agua-700 sm:mt-0" />
          <p className="text-[0.98rem] text-petroleo-900">
            Este site é informativo e não substitui a consulta. Não inicie nem suspenda medicamentos ou dietas por conta própria.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
