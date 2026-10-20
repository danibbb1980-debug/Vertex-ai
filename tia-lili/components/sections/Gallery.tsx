import Image from "next/image";
import { photos } from "@/lib/site-data";
import type { Photo } from "@/lib/site-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/*
  Grade de fotos: 2 colunas no celular e mosaico 4×2 no desktop.
  Todas abaixo da dobra, com lazy-load padrão do next/image.
*/
const items: { photo: Photo; className: string }[] = [
  { photo: photos.atendimentoMesa, className: "aspect-[4/5] lg:row-span-2 lg:aspect-auto" },
  { photo: photos.recepcao, className: "aspect-[4/5] lg:aspect-auto" },
  { photo: photos.tchauChupeta, className: "aspect-[4/5] lg:aspect-auto" },
  { photo: photos.mesaAtividades, className: "aspect-[4/5] lg:row-span-2 lg:aspect-auto" },
  { photo: photos.consultorio, className: "col-span-2 aspect-[16/10] lg:aspect-auto" },
];

export function Gallery() {
  return (
    <section id="consultorio" aria-labelledby="consultorio-title" className="py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          id="consultorio-title"
          eyebrow="Consultório"
          title={
            <>
              Um pouquinho do <em className="text-teal">nosso dia a dia</em>
            </>
          }
          intro="Imagens do consultório e de momentos do atendimento, compartilhadas no perfil da Tia Lili."
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[36rem] lg:grid-cols-4 lg:grid-rows-2">
          {items.map(({ photo, className }) => (
            <li key={photo.src} className={`overflow-hidden rounded-[1.75rem] bg-mint-50 ${className}`}>
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                sizes="(min-width: 1024px) 280px, 50vw"
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
