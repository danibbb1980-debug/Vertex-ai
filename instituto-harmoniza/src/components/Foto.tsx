import type { Foto as FotoConfig } from "../config";

/**
 * Foto responsiva (AVIF + WebP, duas larguras quando houver versão menor).
 * `prioridade` só desliga o lazy loading: no celular a foto do hero fica abaixo da
 * dobra e não deve disputar banda com o título.
 */
export function Foto({
  foto,
  sizes,
  prioridade = false,
  className = "",
}: {
  foto: FotoConfig;
  sizes: string;
  prioridade?: boolean;
  className?: string;
}) {
  const conjunto = (ext: string) =>
    foto.menor ? `${foto.menor}.${ext} 600w, ${foto.src}.${ext} ${foto.largura}w` : `${foto.src}.${ext} ${foto.largura}w`;
  return (
    <picture>
      <source type="image/avif" srcSet={conjunto("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={conjunto("webp")} sizes={sizes} />
      <img
        src={`${foto.src}.webp`}
        alt={foto.alt}
        width={foto.largura}
        height={foto.altura}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        className={className}
        style={{ objectPosition: foto.foco }}
      />
    </picture>
  );
}
