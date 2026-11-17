import type { Foto as TFoto } from "../config";

type Props = {
  foto: TFoto;
  sizes: string;
  className?: string;
  imgClassName?: string;
  prioridade?: boolean;
};

/** Foto autorizada em recorte sóbrio (webp em 560 e 900 px). */
export default function Foto({ foto, sizes, className = "", imgClassName = "", prioridade = false }: Props) {
  return (
    <div className={`overflow-hidden bg-gesso-2 ${className}`}>
      <img
        src={`${foto.src}-900.webp`}
        srcSet={`${foto.src}-560.webp 560w, ${foto.src}-900.webp 900w`}
        sizes={sizes}
        width={foto.largura}
        height={foto.altura}
        alt={foto.alt}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
