import { Onda } from "./Onda";

const MODOS = [
  {
    nome: "Presencial",
    onde: "No consultório e em casa",
    texto:
      "Avaliação e acompanhamento no consultório, em Poços de Caldas. Alguns atendimentos, como a polissonografia domiciliar e o suporte ventilatório, acontecem na casa do paciente.",
  },
  {
    nome: "Online",
    onde: "Por videochamada",
    texto:
      "Consulta e acompanhamento a distância, para conversar, tirar dúvidas e seguir com o cuidado sem deslocamento. A equipe orienta quando o atendimento online faz sentido para o seu caso.",
  },
];

export function Modalidades() {
  return (
    <section aria-labelledby="modalidades-titulo" className="relative overflow-hidden bg-white py-24 md:py-36">
      <div className="container-site">
        <p className="rotulo">Presencial e online</p>
        <h2 id="modalidades-titulo" className="titulo mt-5 max-w-[14ch] text-[clamp(2.4rem,5.4vw,4.4rem)]">
          Perto de você, de duas <em>formas</em>.
        </h2>
      </div>

      <Onda className="my-14 h-24 w-full md:my-20 md:h-32" linhas={6} />

      <div className="container-site grid gap-y-14 md:grid-cols-2 md:gap-x-0">
        {MODOS.map((m, i) => (
          <div key={m.nome} className={i === 1 ? "md:border-l md:border-line md:pl-12 lg:pl-20" : "md:pr-12 lg:pr-20"}>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{m.onde}</p>
            <h3 className="titulo mt-3 text-[clamp(3rem,7vw,5.5rem)]">{i === 1 ? <em>{m.nome}</em> : m.nome}</h3>
            <p className="mt-6 max-w-[46ch] text-muted">{m.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
