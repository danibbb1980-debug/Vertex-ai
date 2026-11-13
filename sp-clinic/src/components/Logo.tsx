import { CONFIG } from '../config'

/**
 * Redesenho vetorial do monograma "SP" do logo (S cruzando a haste inclinada de um P).
 * Coordenadas no espaço 940 × 920 do arquivo de referência (referencias/monograma.svg).
 * Quando CONFIG.logo for preenchido com o arquivo original, LogoCompleto passa a usá-lo.
 */
export const MONOGRAMA_PATHS = [
  'M566 196 C560 176 520 166 500 186 C486 200 488 226 506 256 C532 300 578 352 580 420 C582 488 532 532 470 530 C452 529 440 524 432 516 C450 520 466 522 480 520 C530 512 556 470 552 420 C548 360 512 306 490 268 C470 234 470 200 490 182 C512 162 556 170 566 196 Z',
  'M562 190 C572 198 570 212 560 213 C551 213 549 203 556 196 Z',
  'M510 336 L530 342 L398 590 C394 598 398 602 410 604 L352 604 C366 600 372 594 376 588 Z',
  'M444 322 C398 316 338 340 330 400 C324 446 352 494 390 510 C364 488 352 452 356 410 C362 362 396 330 444 326 Z',
]

/** Só o monograma, recortado (viewBox justo). */
export function Monograma({ className = '', titulo }: { className?: string; titulo?: string }) {
  return (
    <svg
      viewBox="318 160 274 456"
      className={className}
      fill="currentColor"
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
    >
      {MONOGRAMA_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/** Logo completo: arco fino + monograma + "CLINIC". `tom` = cor do traço. */
export function LogoCompleto({ className = '', tom = 'claro' }: { className?: string; tom?: 'claro' | 'escuro' }) {
  const cor = tom === 'claro' ? '#F6F0E6' : '#22160E'
  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={`${CONFIG.nome}`} className={className} />
  }
  return (
    <svg viewBox="40 50 860 830" className={className} role="img" aria-label={CONFIG.nome}>
      <path d="M207 605 V316 A248 248 0 0 1 703 316 V605" fill="none" stroke={cor} strokeWidth="2.6" opacity="0.8" />
      <g fill={cor}>
        {MONOGRAMA_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <text
        x="455"
        y="858"
        textAnchor="middle"
        fill={cor}
        style={{ fontFamily: 'Bellefair, serif', fontSize: 208, letterSpacing: '0.02em' }}
      >
        CLINIC
      </text>
    </svg>
  )
}
