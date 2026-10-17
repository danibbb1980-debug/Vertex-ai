import { Reveal } from "@/components/ui/Reveal";
import { Sparkle } from "@/components/ui/Sparkle";

const items = [
  { title: "Escuta individualizada", text: "Compreender as necessidades e expectativas de cada paciente antes de qualquer indicação." },
  { title: "Clareza no atendimento", text: "Explicar as possibilidades, as etapas e os cuidados de forma compreensível." },
  { title: "Planejamento responsável", text: "Definir condutas de acordo com a avaliação profissional e as condições de cada caso." },
  { title: "Acompanhamento próximo", text: "Valorizar a comunicação e a orientação durante todo o processo de tratamento." },
];

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="on-navy relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(197_165_114/0.14),transparent_60%)]"
      />
      <div className="container-site relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Nossos compromissos</p>
          <h2 id="diferenciais-title" className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.6rem]">
            Cuidado que vai além <em className="text-gold">do procedimento.</em>
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 90} className="group bg-navy p-8 transition-colors duration-500 hover:bg-navy-2 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="serif text-5xl text-gold">0{i + 1}</span>
                <Sparkle className="h-4 w-4 text-gold/40 transition-transform duration-700 group-hover:rotate-90 group-hover:text-gold" />
              </div>
              <h3 className="serif mt-10 text-[1.7rem]">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-mist">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
