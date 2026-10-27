import { CONFIG } from "../config";

/** Logotipo oficial (recortado da arte do instituto, sem redesenho). */
export function Logo({ largura = 150, prioridade = false }: { largura?: number; prioridade?: boolean }) {
  const altura = Math.round((largura * 105) / 411);
  return (
    <picture>
      <source srcSet={`${CONFIG.logo}.avif`} type="image/avif" />
      <source srcSet={`${CONFIG.logo}.webp`} type="image/webp" />
      <img
        src={`${CONFIG.logo}.png`}
        alt="Instituto Harmoniza"
        width={largura}
        height={altura}
        decoding="async"
        fetchPriority={prioridade ? "high" : "auto"}
        className="block h-auto"
        style={{ width: largura }}
      />
    </picture>
  );
}
