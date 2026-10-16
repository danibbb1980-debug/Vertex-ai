import { Quote, Star } from "lucide-react";
import { site } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/BrandIcons";

/*
  Os comentários abaixo são RESUMOS dos temas dos comentários públicos,
  não citações. Por isso não usam aspas nem atribuem frases inventadas aos
  autores. Para publicar uma citação literal, copie o texto original do
  Google sem alterar nenhuma palavra.
*/
const highlights = [
  {
    author: "Felipe Amaro",
    topics: ["Ambiente acolhedor", "Instrutores atenciosos"],
    summary: "Destacou o ambiente acolhedor da academia e a atenção dos instrutores.",
  },
  {
    author: "Henrique Silva",
    topics: ["Equipamentos", "Atendimento"],
    summary: "Elogiou o ambiente agradável, os equipamentos e o bom atendimento.",
  },
  {
    author: "Paloma Albino",
    topics: ["Música ambiente"],
    summary: "Mencionou a música agradável que acompanha os treinos.",
  },
];

function Stars({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-orange text-orange`} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="avaliacoes"
      aria-labelledby="avaliacoes-title"
      className="relative overflow-hidden border-y border-white/8 bg-graphite py-24 sm:py-32"
    >
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Nota em destaque */}
        <Reveal variant="left" className="lg:col-span-5">
          <p className="eyebrow">Avaliações</p>
          <h2 id="avaliacoes-title" className="display mt-5 text-[2.5rem] sm:text-5xl lg:text-[4rem]">
            Quem treina aqui, <span className="text-orange">recomenda.</span>
          </h2>

          <div className="mt-10 flex items-end gap-5">
            <p className="font-display text-[6.5rem] leading-[0.8] font-bold text-white sm:text-[8rem]">
              {site.rating.value}
            </p>
            <div className="pb-1">
              <Stars />
              <p className="mt-2 text-sm text-mist">
                <span className="font-semibold text-white">{site.rating.count} avaliações</span> no Google
              </p>
            </div>
          </div>
          <p className="sr-only">
            Nota {site.rating.value} de 5 estrelas, com {site.rating.count} avaliações no Google.
          </p>
          <p className="mt-6 max-w-sm text-xs text-mist">
            Nota e número de avaliações informados pela academia em {site.rating.reference}. Confira os
            números atualizados no perfil oficial.
          </p>
          <Button
            href={site.links.maps}
            external
            variant="outline"
            icon={<GoogleIcon className="h-5 w-5" />}
            className="mt-8"
          >
            Ver avaliações no Google
          </Button>
        </Reveal>

        {/* Destaques dos comentários */}
        <div className="lg:col-span-7">
          <p className="mb-6 text-sm text-mist">
            O que os alunos destacam nos comentários — resumo dos temas, não citações literais.
          </p>
          <ul className="grid gap-4">
            {highlights.map((h, i) => (
              <Reveal
                as="li"
                key={h.author}
                delay={i * 90}
                className={`relative border-l-2 border-orange bg-ink p-7 sm:p-9 ${i === 1 ? "lg:ml-12" : ""}`}
              >
                <Quote className="absolute top-7 right-7 h-8 w-8 text-white/10" aria-hidden="true" />
                <ul className="flex flex-wrap gap-2" aria-label="Temas do comentário">
                  {h.topics.map((t) => (
                    <li
                      key={t}
                      className="border border-white/15 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.15em] text-mist uppercase"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-white sm:text-xl">{h.summary}</p>
                <p className="mt-5 flex items-center gap-3 text-sm">
                  <span className="font-semibold text-white">{h.author}</span>
                  <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                  <span className="text-mist">avaliação no Google</span>
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
