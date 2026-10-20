import Image from "next/image";
import { HeartHandshake, MessagesSquare, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { photos, site } from "@/lib/site-data";

const pillars: { icon: LucideIcon; title: string; text: string; tone: string }[] = [
  {
    icon: HeartHandshake,
    title: "Acolhimento no tempo da criança",
    text: "Cada criança tem o seu ritmo. O cuidado começa pela conversa, para que ela se sinta à vontade.",
    tone: "bg-mint-50",
  },
  {
    icon: MessagesSquare,
    title: "Família por perto",
    text: "Pais e responsáveis fazem parte do cuidado, com espaço para tirar dúvidas e entender cada etapa.",
    tone: "bg-sky-100",
  },
  {
    icon: Sprout,
    title: "Hábitos desde cedo",
    text: "Cuidar dos dentinhos desde pequeno ajuda a construir uma rotina de higiene e uma boa relação com o dentista.",
    tone: "bg-lilac-100",
  },
];

export function Approach() {
  return (
    <section id="abordagem" aria-labelledby="abordagem-title" className="bg-paper py-20 sm:py-28">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:max-w-none">
            <div aria-hidden="true" className="blob-frame absolute inset-0 translate-x-4 translate-y-4 bg-mint-200" />
            <Image
              src={photos.retrato.src}
              width={photos.retrato.width}
              height={photos.retrato.height}
              alt={photos.retrato.alt}
              sizes="(min-width: 1024px) 400px, 320px"
              className="blob-frame relative aspect-[344/406] w-full object-cover"
            />
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">Abordagem</p>
            <h2 id="abordagem-title" className="mt-4 text-[2.15rem] sm:text-5xl">
              Um começo leve para uma relação <em className="text-teal">tranquila</em> com o dentista.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-lg text-muted">
              <p>
                A odontopediatria cuida da saúde bucal de bebês, crianças e adolescentes, respeitando cada fase do
                crescimento.
              </p>
              <p>
                Com a {site.professional}, a Tia Lili, a proposta é fazer de cada consulta um momento de confiança:
                com tempo para conversar, explicar os passos com palavras simples e acolher também quem acompanha a
                criança.
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3 md:gap-5">
          {pillars.map(({ icon: Icon, title, text, tone }) => (
            <li key={title} className={`rounded-[2rem] p-7 sm:p-8 ${tone}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-teal">
                <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 text-2xl">{title}</h3>
              <p className="mt-3 text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
