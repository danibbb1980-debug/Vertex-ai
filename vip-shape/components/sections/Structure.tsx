import { photos, site, whatsappUrl, type Photo as PhotoData } from "@/lib/site-data";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

type Tile = { photo: PhotoData; caption: string; area: string; className: string; sizes: string };

/*
  Grade editorial com fotos em proporções diferentes.
  No mobile vira um carrossel horizontal com scroll-snap (sem JS), o que
  mantém cada foto grande o bastante para ser vista no celular.
*/
const tiles: Tile[] = [
  {
    photo: photos.corredor,
    caption: "Corredor de máquinas",
    area: "Musculação",
    className: "lg:col-span-7 lg:row-span-2 lg:aspect-auto",
    sizes: "(min-width: 1024px) 50vw, 82vw",
  },
  {
    photo: photos.pesosLivres,
    caption: "Halteres e bancos",
    area: "Pesos livres",
    className: "lg:col-span-5 lg:aspect-[16/11]",
    sizes: "(min-width: 1024px) 36vw, 82vw",
  },
  {
    photo: photos.salao,
    caption: "Salão principal",
    area: "Ambiente interno",
    className: "lg:col-span-5 lg:aspect-[16/11]",
    sizes: "(min-width: 1024px) 36vw, 82vw",
  },
  {
    photo: photos.corredorLaranja,
    caption: "Máquinas para membros inferiores",
    area: "Equipamentos",
    className: "lg:col-span-4 lg:aspect-[4/5]",
    sizes: "(min-width: 1024px) 28vw, 82vw",
  },
  {
    photo: photos.funcional,
    caption: "Máquinas articuladas",
    area: "Espaço de treino",
    className: "lg:col-span-4 lg:aspect-[4/5]",
    sizes: "(min-width: 1024px) 28vw, 82vw",
  },
  {
    photo: photos.esteiras,
    caption: "Esteiras e telão",
    area: "Cardio",
    className: "lg:col-span-4 lg:aspect-[4/5]",
    sizes: "(min-width: 1024px) 28vw, 82vw",
  },
];

export function Structure() {
  return (
    <section
      id="estrutura"
      aria-labelledby="estrutura-title"
      className="texture-grid relative overflow-hidden border-y border-white/8 bg-graphite py-24 sm:py-32"
    >
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal variant="left" className="max-w-3xl">
            <p className="eyebrow">Estrutura</p>
            <h2 id="estrutura-title" className="display mt-5 text-[2.6rem] sm:text-6xl lg:text-[5.2rem]">
              Espaço para <br className="hidden sm:block" />
              ir <span className="text-orange">mais longe.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-sm">
            <p className="text-mist">
              Musculação, pesos livres, cardio e máquinas modernas em um ambiente amplo, iluminado e
              organizado.
            </p>
          </Reveal>
        </div>

        <ul
          className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-12 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Fotos da estrutura"
        >
          {tiles.map((tile, i) => (
            <Reveal
              as="li"
              key={tile.photo.src}
              delay={(i % 3) * 90}
              variant="scale"
              className={`group relative aspect-[4/5] w-[82%] shrink-0 snap-start sm:w-[55%] lg:w-auto ${tile.className}`}
            >
              <figure className="absolute inset-0 overflow-hidden">
                <Photo
                  photo={tile.photo}
                  sizes={tile.sizes}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/10 to-transparent" />
                {/* O número é decorativo e vem do CSS, para não colar no texto da legenda. */}
                <figcaption
                  data-n={String(i + 1).padStart(2, "0")}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 after:font-display after:text-sm after:text-white/50 after:content-[attr(data-n)] sm:p-6"
                >
                  <span>
                    <span className="block text-[0.72rem] font-semibold tracking-[0.22em] text-orange uppercase">
                      {tile.area}
                    </span>
                    <span className="sr-only"> – </span>
                    <span className="mt-1 block font-display text-lg font-bold text-white uppercase sm:text-xl">
                      {tile.caption}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="mt-3 text-xs text-mist lg:hidden" aria-hidden="true">
          Deslize para ver mais fotos →
        </p>

        <Reveal className="mt-14 flex flex-col items-start gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg font-display text-2xl font-bold text-white uppercase sm:text-3xl">
            Nada substitui ver de perto.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappUrl("visit")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
              Venha conhecer de perto
            </Button>
            <Button href={site.links.instagram} external variant="outline">
              Mais fotos no Instagram
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
