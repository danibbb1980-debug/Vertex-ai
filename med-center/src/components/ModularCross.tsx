import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";

/**
 * Momento de assinatura: módulos de cantos suaves se encaixam até formar a cruz
 * e, ao rolar, se soltam em direção à grade das áreas.
 */
type Piece = { x: number; y: number; w: number; h: number; c: string; from: [number, number]; out: [number, number] };

const B = "#1982C4";
const B2 = "#1A8BD1";
const B3 = "#1574B2";

const PIECES: Piece[] = [
  // cruz
  { x: 132, y: 28, w: 82, h: 84, c: B2, from: [0, -90], out: [40, -120] },
  { x: 132, y: 118, w: 82, h: 82, c: B, from: [0, 0], out: [0, 60] },
  { x: 220, y: 118, w: 82, h: 82, c: B3, from: [90, 0], out: [140, 20] },
  { x: 132, y: 206, w: 82, h: 84, c: B2, from: [0, 90], out: [-30, 170] },
  // braço esquerdo em "pixels"
  { x: 88, y: 132, w: 38, h: 38, c: B, from: [-60, 20], out: [-120, 40] },
  { x: 54, y: 114, w: 26, h: 26, c: B3, from: [-90, -30], out: [-170, -60] },
  { x: 58, y: 166, w: 22, h: 22, c: B2, from: [-80, 50], out: [-160, 120] },
  { x: 24, y: 144, w: 16, h: 16, c: B, from: [-110, 0], out: [-220, 10] },
];

function Block({ p, i, progress, still }: { p: Piece; i: number; progress?: MotionValue<number>; still: boolean }) {
  const fallback = useTransform(() => 0);
  const prog = progress ?? fallback;
  const tx = useTransform(prog, [0, 1], [0, p.out[0]]);
  const ty = useTransform(prog, [0, 1], [0, p.out[1]]);
  const rot = useTransform(prog, [0, 1], [0, (i % 2 ? 1 : -1) * 12]);
  const op = useTransform(prog, [0, 0.85, 1], [1, 0.9, 0.25]);

  if (still) return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={Math.min(16, p.w / 4)} fill={p.c} />;

  return (
    <motion.g style={{ x: tx, y: ty, rotate: rot, opacity: op, transformBox: "fill-box", transformOrigin: "center" }}>
      <motion.rect
        x={p.x}
        y={p.y}
        width={p.w}
        height={p.h}
        rx={Math.min(16, p.w / 4)}
        fill={p.c}
        initial={{ x: p.from[0], y: p.from[1], opacity: 0, scale: 0.6 }}
        animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.25 + i * 0.09 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </motion.g>
  );
}

export function ModularCross({ progress, className = "" }: { progress?: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="Módulos azuis formando uma cruz, como no símbolo do Med Center">
      <defs>
        <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r=".5" fill="#fff" opacity=".10" />
        </pattern>
      </defs>
      {PIECES.map((p, i) => (
        <Block key={i} p={p} i={i} progress={progress} still={!!reduce} />
      ))}
      <rect x="0" y="0" width="320" height="320" fill="url(#grain)" pointerEvents="none" />
    </svg>
  );
}
