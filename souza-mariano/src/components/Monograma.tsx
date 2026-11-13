import { motion, useReducedMotion } from "motion/react";

/**
 * Monograma "SM" redesenhado em SVG a partir da placa do escritório:
 * M de alto contraste (haste fina à esquerda, diagonal e haste grossas),
 * S alongado entrelaçado ao M e uma moldura ovalada na base.
 * O S passa por cima da diagonal e por baixo da haste fina: o entrelaçado.
 */
interface Props {
  cor?: string;
  fundo?: string;
  className?: string;
  titulo?: string;
  animado?: boolean;
}

const S_PATH = "M62 30 C57 18 30 16 30 40 C30 63 66 68 66 95 C66 121 42 131 31 116";

export function Monograma({ cor = "currentColor", fundo = "#F5F0E7", className, titulo, animado = false }: Props) {
  const reduz = useReducedMotion();
  // Mesmo estado inicial no HTML pré-renderizado e no cliente; com movimento reduzido, a duração vai a zero.
  const desenho = (atraso: number, dur = 1.6) =>
    animado
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: reduz
            ? { duration: 0 }
            : { pathLength: { duration: dur, delay: atraso, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.2, delay: atraso } },
        }
      : {};
  const surge = (atraso: number) =>
    animado ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: reduz ? { duration: 0 } : { duration: 0.9, delay: atraso } } : {};

  return (
    <svg
      viewBox="20 8 96 128"
      className={className}
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      fill="none"
    >
      {/* moldura ovalada */}
      <motion.ellipse cx="46" cy="105" rx="25" ry="29" stroke={cor} strokeWidth="1.3" {...desenho(0.2, 1.8)} />
      {/* M: diagonal grossa, diagonal fina, haste grossa e serifas */}
      <motion.g fill={cor} {...surge(0.9)}>
        <polygon points="40.5,16 51,16 75,122 71.5,128" />
        <polygon points="70.6,128 72.8,128 99.4,16 97.2,16" />
        <rect x="95" y="16" width="9" height="111" />
        <rect x="33" y="14" width="18" height="2.2" />
        <rect x="92" y="14" width="18" height="2.2" />
        <rect x="89" y="125.8" width="21" height="2.2" />
      </motion.g>
      {/* S com contorno da cor do fundo para passar "por cima" da diagonal */}
      <motion.path d={S_PATH} stroke={fundo} strokeWidth="10.5" strokeLinecap="butt" {...desenho(0.4)} />
      <motion.path d={S_PATH} stroke={cor} strokeWidth="5.6" strokeLinecap="butt" {...desenho(0.4)} />
      {/* haste fina do M redesenhada por cima: o S passa por baixo dela */}
      <motion.g fill={cor} {...surge(0.9)}>
        <rect x="39.4" y="16" width="2.3" height="111" />
        <rect x="33" y="125.8" width="17" height="2.2" />
      </motion.g>
    </svg>
  );
}
