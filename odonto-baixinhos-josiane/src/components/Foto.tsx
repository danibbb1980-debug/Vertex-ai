interface Props {
  base: string; // "/img/dra-aline"
  larguras: number[];
  alt: string;
  sizes: string;
  className?: string;
  prioridade?: boolean;
  largura: number;
  altura: number;
}

/** <picture> com AVIF + WebP, dimensões reservadas (sem CLS) e lazy por padrão. */
export function Foto({ base, larguras, alt, sizes, className, prioridade, largura, altura }: Props) {
  const set = (ext: string) => larguras.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-${larguras[larguras.length - 1]}.webp`}
        alt={alt}
        width={largura}
        height={altura}
        loading={prioridade ? "eager" : "lazy"}
        decoding={prioridade ? "sync" : "async"}
        {...(prioridade ? { fetchPriority: "high" as const } : {})}
        className={className}
      />
    </picture>
  );
}
