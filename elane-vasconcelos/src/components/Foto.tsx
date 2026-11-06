import type { Foto as FotoT } from "../config";
import { cn } from "../lib/cn";

/** <picture> responsivo AVIF/WebP com dimensões reservadas (CLS baixo). */
export function Foto({ foto, sizes, className, prioridade = false, imgClassName }: {
  foto: FotoT; sizes: string; className?: string; prioridade?: boolean; imgClassName?: string;
}) {
  const [p, g] = foto.larguras;
  const src = (w: number, ext: string) => `${foto.base}-${w}.${ext}`;
  return (
    <picture className={cn("block", className)}>
      <source type="image/avif" srcSet={`${src(p, "avif")} ${p}w, ${src(g, "avif")} ${g}w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${src(p, "webp")} ${p}w, ${src(g, "webp")} ${g}w`} sizes={sizes} />
      <img
        src={src(g, "webp")}
        alt={foto.alt}
        width={g}
        height={Math.round(g / foto.proporcao)}
        loading={prioridade ? "eager" : "lazy"}
        {...({ fetchpriority: prioridade ? "high" : "auto" } as Record<string, string>)}
        decoding={prioridade ? "sync" : "async"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
