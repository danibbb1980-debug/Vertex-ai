import { Compass, HeartHandshake, MessageCircleMore } from "lucide-react";
import { photos } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Atendimento humanizado",
    text: "Receber cada pessoa com respeito, escuta e tempo para entender sua história.",
  },
  {
    icon: MessageCircleMore,
    title: "Orientação clara em cada etapa",
    text: "Explicar as possibilidades de tratamento com linguagem simples, sem pressa.",
  },
  {
    icon: Compass,
    title: "Cuidado individualizado",
    text: "Definir os próximos passos de acordo com a avaliação e as necessidades de cada caso.",
  },
];

export function About() {
  const hasPhoto = Boolean(photos.facade.src);
  return (
    <section id="clinica" aria-labelledby="clinica-title" className="py-24 sm:py-32">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">A clínica</p>
            <h2 id="clinica-title" className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.6rem]">
              Cuidar do seu sorriso é <em className="text-gold-ink">cuidar de você.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-6 lg:pt-12">
            <p className="text-lg leading-relaxed text-mineral sm:text-xl">
              Na Star Sorrindo, cada pessoa tem uma história, necessidades e expectativas próprias. Nosso compromisso é
              oferecer um atendimento acolhedor, explicar as possibilidades de tratamento com clareza e ajudar cada paciente
              a tomar decisões conscientes sobre sua saúde bucal.
            </p>
          </Reveal>
        </div>

        <div className={`mt-16 grid gap-6 ${hasPhoto ? "lg:grid-cols-12" : ""}`}>
          {hasPhoto && (
            <Reveal className="lg:col-span-5">
              <PhotoFrame photo={photos.facade} className="h-full min-h-80 rounded-2xl" />
            </Reveal>
          )}
          <ul className={`grid gap-6 md:grid-cols-3 ${hasPhoto ? "lg:col-span-7 lg:grid-cols-1" : ""}`}>
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={i * 90}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-white p-8 transition-[border-color,box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_30px_60px_-40px_rgb(14_29_54/0.45)]"
                >
                  <span className="serif absolute top-6 right-7 text-5xl text-sand-2 transition-colors duration-500 group-hover:text-gold/40" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="serif mt-8 text-[1.75rem]">{p.title}</h3>
                  <p className="mt-3 text-mineral">{p.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
