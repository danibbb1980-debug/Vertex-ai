import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projetos } from "../projetos";

/*
 * Hero em WebGL: as capturas reais dos projetos como painéis em profundidade.
 *
 * Movimento adaptado do "Spatial Depth Hero" (21st.dev): os painéis começam
 * empilhados no centro e se espalham em profundidade, cada um inclinado para
 * dentro, de frente para o centro. Depois, flutuação lenta, inclinação da cena
 * pelo cursor (no máximo 4°, amortecida) e leve afastamento ao rolar.
 *
 * As capturas usam MeshBasicMaterial sem tone mapping: cores fiéis ao site.
 * Proporção 1200×750 preservada.
 */

export type HeroGLProps = {
  active: boolean;
  lite: boolean;
  /** Movimento reduzido: composição final, parada, renderizada sob demanda. */
  still?: boolean;
  onReady: () => void;
  onFail: () => void;
};

type Slot = { id: string; pos: [number, number, number]; s: number; hi?: boolean };

const LAYOUT_FULL: Slot[] = [
  { id: "star-sorrindo", pos: [-0.05, -0.3, 1.2], s: 1.22, hi: true },
  { id: "vip-shape", pos: [-1.6, 1.5, -1.2], s: 0.8 },
  { id: "natalino-polato", pos: [1.75, 1.2, -0.6], s: 0.8 },
  { id: "dra-beatryz", pos: [-1.95, -1.6, -2.3], s: 0.7 },
  { id: "rocha", pos: [2.05, -1.65, -2.7], s: 0.7 },
];
const LAYOUT_LITE: Slot[] = [
  { id: "star-sorrindo", pos: [0, -0.7, 1.0], s: 1.42, hi: true },
  { id: "vip-shape", pos: [-1.5, 1.05, -1.2], s: 0.92 },
  { id: "natalino-polato", pos: [1.6, 0.85, -0.8], s: 0.92 },
];

const W = 3.2;
const H = (W * 750) / 1200;
const BAR = 0.15;
const PAD = 0.035;
const MAX_TILT = THREE.MathUtils.degToRad(4);

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Retângulo arredondado como geometria plana. */
function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 6);
}

/** Textura de "retângulo suave" (sombra e brilho), gerada em canvas. */
function softRectTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.filter = "blur(22px)";
  g.fillStyle = "#fff";
  g.fillRect(48, 40, 160, 80);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function radialTexture(rgba: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, rgba);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function Scene({ lite, still = false, onReady, onFail }: Omit<HeroGLProps, "active">) {
  const { gl, invalidate } = useThree();
  const layout = lite ? LAYOUT_LITE : LAYOUT_FULL;

  // Recursos compartilhados
  const res = useMemo(() => {
    const frameGeo = roundedRect(W + PAD * 2, H + BAR + PAD * 2, 0.07);
    const shotGeo = new THREE.PlaneGeometry(W, H);
    const dotGeo = new THREE.CircleGeometry(0.024, 12);
    const softGeo = new THREE.PlaneGeometry(1, 1);
    const frameMat = new THREE.MeshBasicMaterial({ color: "#1b1c23", toneMapped: false });
    const dotMat = new THREE.MeshBasicMaterial({ color: "#4a4b55", toneMapped: false });
    const soft = softRectTexture();
    const shadowMat = new THREE.MeshBasicMaterial({ map: soft, color: "#000", transparent: true, opacity: 0.75, depthWrite: false });
    const rimMat = new THREE.MeshBasicMaterial({
      map: soft,
      color: "#4f74ff",
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowTex = radialTexture("rgba(70,104,220,0.5)");
    const goldGlowTex = radialTexture("rgba(201,162,75,0.14)");
    return { frameGeo, shotGeo, dotGeo, softGeo, frameMat, dotMat, soft, shadowMat, rimMat, glowTex, goldGlowTex };
  }, []);

  // Capturas reais como textura
  const shots = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const maxAniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return layout.map((slot) => {
      const p = projetos.find((x) => x.id === slot.id)!;
      const size = slot.hi ? 960 : 640;
      const tex = loader.load(`/exemplos/${p.desktop}-${size}.webp`, undefined, undefined, () => onFail());
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
      return { slot, tex, mat };
    });
  }, [lite]);

  // Espera as imagens antes de começar a entrada
  const loaded = useRef(0);
  const startAt = useRef<number | null>(null);
  useEffect(() => {
    let done = 0;
    const check = () => {
      done = shots.filter((s) => s.tex.image && (s.tex.image as HTMLImageElement).complete).length;
      loaded.current = done;
      if (done < shots.length) id = window.setTimeout(check, 60);
      else invalidate();
    };
    let id = window.setTimeout(check, 0);
    return () => clearTimeout(id);
  }, [shots]);

  useEffect(
    () => () => {
      shots.forEach((s) => {
        s.tex.dispose();
        s.mat.dispose();
      });
      Object.values(res).forEach((r) => (r as { dispose?: () => void }).dispose?.());
    },
    [shots, res],
  );

  // Poeira dourada (só na versão completa)
  const dust = useMemo(() => {
    if (lite) return null;
    const N = 120;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -4.5 + Math.random() * 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: "#c9a24b", size: 0.028, transparent: true, opacity: 0.5, depthWrite: false });
    return { geo, mat };
  }, [lite]);
  useEffect(() => () => {
    dust?.geo.dispose();
    dust?.mat.dispose();
  }, [dust]);

  // Estado do movimento
  const rig = useRef<THREE.Group>(null!);
  const groups = useRef<THREE.Group[]>([]);
  const st = useRef({ tx: 0, ty: 0, rx: 0, ry: 0, sp: 0, ready: false });

  useEffect(() => {
    const hero = document.getElementById("topo");
    const canTilt = matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    if (!hero || !canTilt) return;
    const onMove = (e: PointerEvent) => {
      st.current.tx = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
      st.current.ty = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));
    };
    const onLeave = () => {
      st.current.tx = 0;
      st.current.ty = 0;
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const S = st.current;
    const dt = Math.min(delta, 1 / 20);
    // Parada: tempo congelado e entrada já concluída
    const t = still ? 0 : state.clock.elapsedTime;

    if (startAt.current === null) {
      if (loaded.current < shots.length) return;
      startAt.current = t;
    }
    const el = still ? 99 : t - startAt.current;

    shots.forEach((s, i) => {
      const g = groups.current[i];
      if (!g) return;
      const [x, y, z] = s.slot.pos;
      const k = easeOutExpo(clamp01((el - 0.1 - i * 0.12) / 2.2));
      // empilhado no centro → posição final, inclinado para o centro
      const rzStart = (i - (shots.length - 1) / 2) * 0.07;
      const rzEnd = (i - (shots.length - 1) / 2) * 0.012;
      g.position.set(
        x * k,
        y * k + Math.sin(t * 0.55 + i * 1.7) * 0.035 * k,
        THREE.MathUtils.lerp(-3 - i * 0.05, z, k),
      );
      g.rotation.set(y * 0.055 * k, -x * 0.085 * k, THREE.MathUtils.lerp(rzStart, rzEnd, k));
      g.scale.setScalar(s.slot.s * THREE.MathUtils.lerp(0.6, 1, k));
      g.visible = true;
    });

    // Inclinação pelo cursor, amortecida (sem molejo)
    if (!still) {
      S.ry = THREE.MathUtils.damp(S.ry, S.tx * MAX_TILT, 3, dt);
      S.rx = THREE.MathUtils.damp(S.rx, S.ty * MAX_TILT, 3, dt);
    }
    // Rolagem: afasta e inclina levemente ao sair do hero
    const hero = document.getElementById("topo");
    if (hero) {
      const r = hero.getBoundingClientRect();
      const sp = clamp01(-r.top / (r.height * 0.9));
      S.sp = THREE.MathUtils.damp(S.sp, sp, 8, dt);
    }
    rig.current.rotation.set(S.rx + S.sp * 0.16, S.ry - S.sp * 0.1, 0);
    rig.current.position.set(0, S.sp * 0.9, -S.sp * 1.2);

    if (!S.ready) {
      S.ready = true;
      requestAnimationFrame(onReady);
    }
  });

  return (
    <>
      <sprite position={[0.3, 0, -3.5]} scale={[9, 6.5, 1]}>
        <spriteMaterial map={res.glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {!lite && (
        <sprite position={[-2.4, -2.4, -3]} scale={[5, 3.5, 1]}>
          <spriteMaterial map={res.goldGlowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
      <group ref={rig}>
        {dust && <points geometry={dust.geo} material={dust.mat} />}
        {shots.map((s, i) => (
          <group
            key={s.slot.id}
            visible={false}
            ref={(g) => {
              if (g) groups.current[i] = g;
            }}
          >
            {/* sombra suave */}
            <mesh geometry={res.softGeo} material={res.shadowMat} position={[0.12, -0.32, -0.35]} scale={[W * 1.55, H * 1.7, 1]} />
            {/* luz azul nas bordas */}
            <mesh geometry={res.softGeo} material={res.rimMat} position={[-0.08, 0.05, -0.05]} scale={[W * 1.32, H * 1.5, 1]} />
            {/* moldura com barra de navegador */}
            <mesh geometry={res.frameGeo} material={res.frameMat} position={[0, BAR / 2, -0.002]} />
            {[0, 1, 2].map((d) => (
              <mesh key={d} geometry={res.dotGeo} material={res.dotMat} position={[-W / 2 + 0.1 + d * 0.075, H / 2 + BAR / 2, 0.001]} />
            ))}
            {/* captura real */}
            <mesh geometry={res.shotGeo} material={s.mat} />
          </group>
        ))}
      </group>
    </>
  );
}

export default function HeroGL({ active, lite, still = false, onReady, onFail }: HeroGLProps) {
  return (
    <Canvas
      frameloop={!active ? "never" : still ? "demand" : "always"}
      dpr={lite ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 10.5], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
      }}
    >
      <Scene lite={lite} still={still} onReady={onReady} onFail={onFail} />
    </Canvas>
  );
}
