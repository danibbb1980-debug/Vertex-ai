import type { PhotoSlot } from "@/lib/site-data";
import { Sparkle } from "./Sparkle";

type Props = {
  photo: PhotoSlot;
  className?: string;
  /** true só para a imagem acima da dobra (LCP). */
  priority?: boolean;
  sizes?: string;
};

/**
 * Mostra a foto real quando `src` estiver preenchido em lib/site-data.ts.
 * Sem foto, desenha uma composição abstrata (luz suave e brilhos), que não
 * finge ser um ambiente da clínica — por isso fica aria-hidden.
 */
export function PhotoFrame({ photo, className = "", priority = false, sizes = "(min-width: 1024px) 40vw, 100vw" }: Props) {
  if (photo.src) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- exportação estática, sem otimizador */}
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={photo.srcSet ? sizes : undefined}
          alt={photo.alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={photo.position ? { objectPosition: photo.position } : undefined}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-navy ${className}`}
      aria-hidden="true"
      data-photo-slot={photo.label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_15%,#2b4a78_0%,#162a4a_45%,#0e1d36_100%)]" />
      <div className="absolute -top-1/4 left-1/2 h-[90%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(197_165_114/0.28),transparent_65%)] blur-2xl" />
      {/* Linhas finas em arco, ecoando a moldura. */}
      <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${40 + i * 30} 520 V ${260 - i * 6} a ${160 - i * 30} ${160 - i * 30} 0 0 1 ${320 - i * 60} 0 V 520`}
            stroke="rgb(197 165 114 / 0.18)"
            strokeWidth="1"
          />
        ))}
        <path
          className="draw"
          style={{ ["--len" as string]: 420 }}
          d="M 92 330 C 140 392, 260 392, 308 330"
          stroke="#c5a572"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <Sparkle className="twinkle absolute top-[22%] left-[28%] h-5 w-5 text-gold" />
      <Sparkle className="twinkle absolute top-[34%] right-[24%] h-3 w-3 text-gold/80 [--d:1.2s]" />
      <Sparkle className="twinkle absolute bottom-[26%] left-[62%] h-2.5 w-2.5 text-ivory/70 [--d:2.1s]" />
    </div>
  );
}
