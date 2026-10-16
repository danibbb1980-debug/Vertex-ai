import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/site-data";

type PhotoProps = {
  photo: PhotoData;
  /** Atributo sizes do next/image — descreva a largura real em cada breakpoint. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Tratamento de cor da marca: escurece levemente e aquece os tons. */
  graded?: boolean;
};

/**
 * Foto com preenchimento do container (o container define a proporção, o que
 * evita layout shift) e o mesmo tratamento visual em todo o site.
 */
export function Photo({ photo, sizes, className = "", imgClassName = "", priority = false, graded = true }: PhotoProps) {
  return (
    <div className={`grain relative overflow-hidden bg-graphite ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={82}
        className={`object-cover ${graded ? "contrast-[1.06] saturate-[1.08]" : ""} ${imgClassName}`}
      />
    </div>
  );
}
