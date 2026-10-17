import { Quote, Star } from "lucide-react";
import { reviews, site } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/BrandIcons";

/**
 * Nota geral separada dos depoimentos. Trechos com a redação original, sem
 * nome nem foto dos autores, e sem estrelas individuais (não informadas).
 */
export function Reviews() {
  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-title" className="py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Avaliações</p>
          <h2 id="avaliacoes-title" className="serif mt-5 text-[2.5rem] sm:text-5xl">
            Histórias reais. <em className="text-gold-ink">Confiança construída no cuidado.</em>
          </h2>

          <div className="mt-10 rounded-2xl border border-line bg-white p-7">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GoogleIcon className="h-5 w-5" /> Nota no Google
            </div>
            <div className="mt-4 flex items-end gap-4">
              <span className="serif text-7xl leading-none">{site.rating.value}</span>
              <div className="pb-2">
                <span className="flex gap-0.5 text-gold" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <span className="mt-1 block text-sm text-mineral">de 5 · {site.rating.count} avaliações</span>
              </div>
            </div>
            <p className="sr-only">
              Nota {site.rating.value} de 5 no Google, com {site.rating.count} avaliações.
            </p>
            <p className="mt-4 text-xs text-mineral">Referência: {site.rating.reference}. Confira os dados atualizados no Google.</p>
            <Button href={site.links.maps} external variant="outline" className="mt-6 w-full">
              Ver avaliações no Google
            </Button>
          </div>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal
              as="li"
              key={r.text}
              delay={i * 90}
              className={`flex flex-col rounded-2xl border border-line bg-white p-8 sm:p-10 ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              <Quote className="h-8 w-8 text-gold" aria-hidden="true" />
              <blockquote className={`serif mt-6 flex-1 ${i === 0 ? "text-[2rem] sm:text-[2.4rem]" : "text-[1.7rem]"} leading-[1.15]`}>
                <p>“{r.text}”</p>
              </blockquote>
              <p className="mt-8 flex items-center gap-2 text-sm text-mineral">
                <GoogleIcon className="h-4 w-4" />
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    Avaliação pública no Google<span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  "Avaliação pública no Google"
                )}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
