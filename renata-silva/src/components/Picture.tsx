import type { Foto } from "../config";

/** Foto do ambiente em AVIF/WebP, 480 e 960 px de largura (gerados por npm run assets). */
export function Picture({ foto, className = "", sizes = "100vw" }: { foto: Foto; className?: string; sizes?: string }) {
  const set = (ext: string) => `/img/${foto.arquivo}-480.${ext} 480w, /img/${foto.arquivo}-960.${ext} 960w`;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/img/${foto.arquivo}-960.webp`}
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
