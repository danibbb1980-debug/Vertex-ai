import { hasGalleryPhotos, photos, site } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/BrandIcons";

/** Galeria com fotos reais da clínica (lib/site-data.ts → photos.gallery). */
export function Experience() {
  if (!hasGalleryPhotos) return null;
  const [wide, ...rest] = photos.gallery;
  return (
    <section id="experiencia" aria-labelledby="experiencia-title" className="bg-sand py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">A experiência na clínica</p>
            <h2 id="experiencia-title" className="serif mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.4rem]">
              Um espaço pensado para <em className="text-gold-ink">receber você.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Button href={site.links.instagram} external variant="outline" icon={<InstagramIcon className="h-5 w-5" />}>
              Mais no Instagram
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-12">
          <Reveal as="figure" className="md:col-span-8 md:row-span-2">
            <PhotoFrame photo={wide} sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[5/4] w-full rounded-2xl md:aspect-auto md:h-[35.25rem]" />
            <figcaption className="mt-3 text-sm text-mineral">{wide.label}</figcaption>
          </Reveal>
          {rest.map((p, i) => (
            <Reveal as="figure" key={p.label} delay={(i + 1) * 100} className="md:col-span-4">
              <PhotoFrame photo={p} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full rounded-2xl md:aspect-auto md:h-[15.5rem]" />
              <figcaption className="mt-3 text-sm text-mineral">{p.label}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
