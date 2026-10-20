import Image from "next/image";
import { photos } from "@/lib/site-data";
import type { Photo } from "@/lib/site-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/*
  Grade de fotos: 2 colunas no celular e 4 no desktop.
  Todas abaixo da dobra, com lazy-load padrão do next/image.
*/
const items: Photo[] = [photos.atendimentoMesa, photos.recepcao, photos.tchauChupeta, photos.mesaAtividades];

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

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((photo) => (
            <li key={photo.src} className="aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-mint-50">
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
