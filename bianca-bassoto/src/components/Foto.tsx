/** Foto com srcset WebP (480/800/1120) e proporção 4:5 reservada (sem salto de layout). */
export function Foto({ base, alt, className = '', sizes }: { base: string; alt: string; className?: string; sizes: string }) {
  if (!base) return null;
  return (
    <figure className={`foto ${className}`}>
      <img
        src={`${base}-800.webp`}
        srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1120.webp 1120w`}
        sizes={sizes}
        alt={alt}
        width={800}
        height={1000}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
