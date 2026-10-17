import { MapPin, Star } from "lucide-react";
import { photos, site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="paper relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      {/* Halo de luz suave atrás da composição. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgb(197_165_114/0.16),transparent_62%)]"
      />
      <div className="container-site relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="hero-rise flex w-fit items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-[0.8rem] font-medium text-navy backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-gold-ink" aria-hidden="true" />
            No Centro de Poços de Caldas — MG
          </p>
          <p className="eyebrow hero-rise mt-9 [--d:80ms]">Odontologia com cuidado e precisão</p>
          <h1 id="hero-title" className="serif hero-rise mt-5 text-[3.1rem] leading-[0.98] [--d:160ms] sm:text-7xl lg:text-[5.4rem]">
            Um novo sorriso começa com <em className="font-medium text-gold-ink">confiança.</em>
          </h1>
          <p className="hero-rise mt-7 max-w-xl text-lg leading-relaxed text-mineral [--d:240ms] sm:text-xl">
            Implantes dentários, próteses e cuidados odontológicos com atenção individualizada, clareza em cada etapa e foco
            na sua saúde bucal.
          </p>
          <div className="hero-rise mt-10 flex flex-col gap-3 [--d:320ms] sm:flex-row sm:items-center">
            <Button href={whatsappUrl("default")} external icon={<WhatsAppIcon className="h-5 w-5" />} className="sm:min-h-14 sm:px-8">
              Agendar minha avaliação
            </Button>
            <Button href="/#tratamentos" variant="outline" arrow className="sm:min-h-14">
              Conhecer nossos tratamentos
            </Button>
          </div>
          <p className="hero-rise mt-6 max-w-md text-sm text-mineral [--d:400ms]">
            Converse com nossa equipe e descubra o próximo passo para cuidar do seu sorriso.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <PhotoFrame photo={photos.hero} priority className="hero-arch arch aspect-[4/5] w-full lg:aspect-[4/5.3]" />

          {/* Cartão da nota do Google, sobreposto à moldura. */}
          <div className="hero-rise absolute -bottom-6 left-0 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-[0_24px_50px_-28px_rgb(14_29_54/0.5)] backdrop-blur [--d:700ms] sm:-left-8">
            <div className="flex items-center gap-3">
              <span className="serif text-4xl leading-none">{site.rating.value}</span>
              <div>
                <span className="flex gap-0.5 text-gold" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                <span className="mt-1 block text-xs text-mineral">
                  {site.rating.count} avaliações no Google
                </span>
              </div>
            </div>
            <span className="sr-only">
              Nota {site.rating.value} de 5 no Google, com {site.rating.count} avaliações (referência: {site.rating.reference}).
            </span>
          </div>

          <ul
            aria-label="Tratamentos em destaque"
            className="hero-rise absolute top-8 -right-2 hidden flex-col items-end gap-2 [--d:820ms] sm:flex lg:-right-6"
          >
            {["Implantes dentários", "Próteses", "Clínica geral"].map((t) => (
              <li key={t} className="rounded-full border border-ivory/20 bg-navy/85 px-4 py-2 text-xs font-medium text-ivory backdrop-blur">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
