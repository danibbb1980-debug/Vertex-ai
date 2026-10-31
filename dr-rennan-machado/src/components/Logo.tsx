import { CONFIG } from '../config';

/** Logo original (sem redesenho), recortado em círculo sobre o próprio fundo creme. */
export function Logo({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <picture>
      <source srcSet={CONFIG.logo.src} type="image/webp" />
      <img
        src={CONFIG.logo.fallback}
        width={size}
        height={size}
        alt=""
        decoding="async"
        className={`rounded-full ring-1 ring-gold/40 ${className}`}
        style={{ width: size, height: size }}
      />
    </picture>
  );
}
