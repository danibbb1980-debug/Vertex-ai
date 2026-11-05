import type { Foto } from "../config";

export function Picture({ foto, className = "", sizes }: { foto: Foto; className?: string; sizes?: string }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`/img/${foto.arquivo}.avif ${foto.largura}w`} sizes={sizes} />
      <source type="image/webp" srcSet={`/img/${foto.arquivo}.webp ${foto.largura}w`} sizes={sizes} />
      <img
        src={`/img/${foto.arquivo}.webp`}
        alt={foto.alt}
        width={foto.largura}
        height={foto.altura}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
