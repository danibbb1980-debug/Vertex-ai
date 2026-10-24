import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Peças 3D compartilhadas entre o V do CTA (Scene3D) e o hero (HeroGL).
 *
 * Geometria do V, em unidades de cena (1 = 100 px da logo de 1024 px).
 * Os braços internos ficam um pouco afastados do centro porque o chanfro
 * cresce para fora; o resultado mantém a fresta fina da logo.
 */
export const V_H = 1.85;
export const V_OUT = 2.15;
export const V_IN_TOP = 1.1;
export const V_GAP = 0.085;
export const V_HEIGHT = V_H * 2 + 0.1;

export function armShape(side: -1 | 1) {
  const s = new THREE.Shape();
  s.moveTo(side * V_OUT, V_H);
  s.lineTo(side * V_IN_TOP, V_H);
  s.lineTo(side * V_GAP, 0);
  s.lineTo(side * V_GAP, -V_H);
  s.closePath();
  return s;
}

/** Braço do V extrudado com chanfro, centralizado em z. */
export function armGeometry(side: -1 | 1, depth = 0.38) {
  const g = new THREE.ExtrudeGeometry(armShape(side), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.035,
    bevelSegments: 4,
    curveSegments: 1,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

const TONES = {
  // reflexos quentes para o V dourado
  warm: { stops: ["#07080b", "#2a2418", "#fff2cf", "#3a301e", "#050506"], box: "255,246,222" },
  // reflexos frios para o vidro do hero
  cool: { stops: ["#05070c", "#1a2233", "#e3ebff", "#1b2333", "#030406"], box: "235,242,255" },
} as const;

/** Mapa de ambiente procedural (gradiente em canvas + PMREM), sem downloads. */
export function ProceduralEnv({ tone = "warm" }: { tone?: keyof typeof TONES }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const t = TONES[tone];
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const bg = ctx.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, t.stops[0]);
    bg.addColorStop(0.42, t.stops[1]);
    bg.addColorStop(0.5, t.stops[2]);
    bg.addColorStop(0.56, t.stops[3]);
    bg.addColorStop(1, t.stops[4]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 256);
    // "softboxes" que desenham os reflexos
    const box = (x: number, y: number, w: number, h: number, a: number) => {
      const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, Math.max(w, h) / 1.4);
      g.addColorStop(0, `rgba(${t.box},${a})`);
      g.addColorStop(1, `rgba(${t.box},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - w, y - h, w * 3, h * 3);
    };
    box(60, 40, 90, 50, 0.95);
    box(330, 60, 120, 40, 0.7);
    box(220, 170, 60, 30, 0.35);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromEquirectangular(tex);
    scene.environment = rt.texture;
    tex.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      rt.dispose();
    };
  }, [gl, scene, tone]);
  return null;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
