import { useEffect, useMemo, useRef } from "react";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projetos } from "../projetos";
import { ProceduralEnv, armGeometry, clamp01, easeOutExpo } from "./three/shared";

/*
 * Fundo do hero em WebGL: o V da Vertex em vidro, cercado por telas flutuando
 * em profundidade. As telas com conteúdo são capturas reais dos projetos; as
 * demais são placas de vidro vazias (nenhuma interface inventada).
 *
 * Movimento: as telas chegam do fundo e os braços do V se encaixam; depois a
 * câmera faz um giro lento de vai-e-volta (±15°, ciclo de 18 s) com leve
 * aproximação. O cursor soma até 3° (só desktop com mouse, dentro do hero).
 * Ao rolar, a câmera recua e a cena escurece.
 *
 * Versão leve (celular ou aparelho modesto): vidro sem transmissão, menos
 * telas, dpr menor.
 */

export type HeroGLProps = {
  active: boolean;
  lite: boolean;
  /** Movimento reduzido: composição final, parada, renderizada sob demanda. */
  still?: boolean;
  onReady: () => void;
  onFail: () => void;
};

type Shot = { id: string; pos: [number, number, number]; s: number; hi?: boolean };
type Pane = { pos: [number, number, number]; w: number; h: number };

const SHOTS_FULL: Shot[] = [
  { id: "star-sorrindo", pos: [2.7, -1.35, 1.0], s: 1.05, hi: true },
  { id: "vip-shape", pos: [-2.15, 2.0, -1.0], s: 0.88 },
  { id: "natalino-polato", pos: [2.75, 2.05, -1.4], s: 0.95 },
  { id: "dra-beatryz", pos: [-2.2, -1.55, 0.1], s: 0.86 },
  { id: "rocha", pos: [0.3, 2.75, -2.7], s: 0.85 },
];
const PANES_FULL: Pane[] = [
  { pos: [-1.25, 2.35, -1.9], w: 1.8, h: 1.2 },
  { pos: [1.6, 0.55, -2.3], w: 2.2, h: 1.5 },
  { pos: [-1.85, 0.35, -2.7], w: 2.0, h: 1.3 },
  { pos: [0.85, -2.35, -1.1], w: 2.2, h: 1.4 },
  { pos: [-0.65, -2.0, 1.45], w: 1.6, h: 1.0 },
  { pos: [4.0, 0.35, -0.5], w: 1.4, h: 2.0 },
  { pos: [-2.9, 0.55, -2.1], w: 1.3, h: 0.9 },
  { pos: [1.95, 3.0, 0.3], w: 1.6, h: 1.0 },
];
const SHOTS_LITE: Shot[] = [
  { id: "star-sorrindo", pos: [0.5, -2.2, 1.0], s: 0.95, hi: true },
  { id: "vip-shape", pos: [-1.25, 2.45, -0.9], s: 0.78 },
  { id: "natalino-polato", pos: [1.35, 2.1, -1.3], s: 0.78 },
];
const PANES_LITE: Pane[] = [
  { pos: [-1.5, -1.4, -1.6], w: 1.6, h: 1.1 },
  { pos: [1.7, 0.3, -2.0], w: 1.4, h: 1.9 },
  { pos: [-0.4, 0.9, -2.8], w: 2.0, h: 1.3 },
];
const PHONE: Pane = { pos: [1.55, -0.25, 1.65], w: 0.75, h: 1.5 };

const W = 2.4;
const H = (W * 750) / 1200;
const BAR = 0.12;
const PAD = 0.03;
const SWING = THREE.MathUtils.degToRad(15);
const PERIOD = 18;
const MAX_TILT = THREE.MathUtils.degToRad(3);
const FOV = 32;

/*
 * ?capture3d (uso interno): tempo controlado quadro a quadro, para gravar o
 * vídeo usado em aparelhos sem GPU (scripts/gravar-hero.mjs).
 * window.__vertexStep(t) renderiza o instante t (em segundos).
 */
const CAPTURE = typeof location !== "undefined" && new URLSearchParams(location.search).has("capture3d");
declare global {
  interface Window {
    __vtime?: number;
    __vertexStep?: (t: number) => void;
    __vertexReady?: boolean;
  }
}

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
  return new THREE.ShapeGeometry(s, 5);
}

function Scene({ lite, still = false, onReady, onFail }: Omit<HeroGLProps, "active">) {
  const { gl, camera, size, invalidate } = useThree();
  const shotsDef = lite ? SHOTS_LITE : SHOTS_FULL;
  const failRef = useRef(onFail);
  failRef.current = onFail;
  const panesDef = lite ? PANES_LITE : PANES_FULL;

  // Geometrias e materiais compartilhados
  const res = useMemo(() => {
    const armL = armGeometry(-1, 0.5);
    const armR = armGeometry(1, 0.5);
    const glass = lite
      ? new THREE.MeshPhysicalMaterial({
          color: "#e8eeff",
          metalness: 0.3,
          roughness: 0.04,
          transparent: true,
          opacity: 0.55,
          clearcoat: 1,
          envMapIntensity: 2.2,
        })
      : new THREE.MeshPhysicalMaterial({
          color: "#eef3ff",
          metalness: 0,
          roughness: 0.02,
          transmission: 1,
          thickness: 1.2,
          ior: 1.5,
          specularIntensity: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.03,
          envMapIntensity: 0.9,
          attenuationColor: new THREE.Color("#b9cdf5"),
          attenuationDistance: 4,
        });
    const frameGeo = roundedRect(W + PAD * 2, H + BAR + PAD * 2, 0.06);
    const frameEdges = new THREE.EdgesGeometry(frameGeo, 1);
    const shotGeo = new THREE.PlaneGeometry(W, H);
    const dotGeo = new THREE.CircleGeometry(0.022, 10);
    const frameMat = new THREE.MeshBasicMaterial({ color: "#e7e4dc", toneMapped: false });
    const dotMat = new THREE.MeshBasicMaterial({ color: "#a9a6a0", toneMapped: false });
    const edgeMat = new THREE.LineBasicMaterial({ color: "#bcd0ff", transparent: true, opacity: 0.5 });
    const paneMat = new THREE.MeshPhysicalMaterial({
      color: "#dfe8ff",
      metalness: 0,
      roughness: 0.12,
      transparent: true,
      opacity: 0.1,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    return { armL, armR, glass, frameGeo, frameEdges, shotGeo, dotGeo, frameMat, dotMat, edgeMat, paneMat };
  }, [lite]);

  // Placas de vidro vazias (e a silhueta do celular), com filete de luz
  const panes = useMemo(() => {
    const list = [...panesDef, PHONE];
    return list.map((p, i) => {
      const geo = roundedRect(p.w, p.h, i === list.length - 1 ? 0.1 : 0.05);
      return { p, geo, edges: new THREE.EdgesGeometry(geo, 1) };
    });
  }, [panesDef]);

  // Capturas reais como textura (proporção 1200×750, cores fiéis)
  const shots = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return shotsDef.map((slot) => {
      const p = projetos.find((x) => x.id === slot.id)!;
      const tex = loader.load(`/exemplos/${p.desktop}-${slot.hi ? 960 : 640}.webp`, undefined, undefined, () => failRef.current());
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = aniso;
      return { slot, tex, mat: new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) };
    });
  }, [shotsDef, gl]);

  useEffect(
    () => () => {
      shots.forEach((s) => {
        s.tex.dispose();
        s.mat.dispose();
      });
      panes.forEach((p) => {
        p.geo.dispose();
        p.edges.dispose();
      });
      Object.values(res).forEach((r) => (r as { dispose?: () => void }).dispose?.());
    },
    [shots, panes, res],
  );

  // Espera as imagens antes de começar a entrada
  const loaded = useRef(false);
  useEffect(() => {
    let id = 0;
    const check = () => {
      loaded.current = shots.every((s) => (s.tex.image as HTMLImageElement | undefined)?.complete);
      if (loaded.current) invalidate();
      if (!loaded.current) id = window.setTimeout(check, 60);
    };
    check();
    return () => clearTimeout(id);
  }, [shots]);

  // Cursor (só desktop com mouse, dentro do hero)
  const st = useRef({ tx: 0, ty: 0, yaw: 0, pitch: 0, sp: 0, ready: false, t0: -1 });
  useEffect(() => {
    const hero = document.getElementById("topo");
    if (!hero || !matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
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

  // Enquadramento: desloca o conjunto para a direita (desktop) ou para baixo
  // (telas estreitas, abaixo do texto) e afasta a câmera conforme a largura.
  const frame = useMemo(() => {
    const aspect = size.width / size.height;
    const wide = size.width >= 1024;
    const radius = lite ? 3.6 : 5.8;
    const half = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dist = Math.max(13, radius / (half * aspect), (lite ? 4.6 : 4.4) / half);
    const cx = wide ? 0.71 : 0.5;
    const cy = wide ? 0.5 : 0.73;
    return { dist, cx, cy };
  }, [size, lite]);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const { width, height } = size;
    cam.setViewOffset(width, height, -(frame.cx - 0.5) * width, -(frame.cy - 0.5) * height, width, height);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
    };
  }, [camera, size, frame]);

  const items = useRef<THREE.Object3D[]>([]);
  const armL = useRef<THREE.Mesh>(null!);
  const armR = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const S = st.current;
    const dt = CAPTURE ? 1 / 24 : Math.min(delta, 1 / 20);
    // Parada: tempo congelado e entrada já concluída
    const t = CAPTURE ? (window.__vtime ?? 0) : still ? 0 : state.clock.elapsedTime;
    if (S.t0 < 0) {
      if (!loaded.current) return;
      S.t0 = t;
    }
    const el = still ? 99 : t - S.t0;

    // Entrada: telas chegam do fundo, com leve flutuação depois
    items.current.forEach((o, i) => {
      if (!o) return;
      const [x, y, z] = o.userData.pos as [number, number, number];
      const k = easeOutExpo(clamp01((el - 0.1 - i * 0.06) / 2.4));
      o.position.set(x, y + Math.sin(t * 0.5 + i * 1.3) * 0.05 * k, THREE.MathUtils.lerp(-12, z, k));
      o.rotation.set(y * 0.04, -x * 0.07, ((i % 3) - 1) * 0.02);
      o.visible = k > 0.001;
    });
    // Os braços do V se encaixam
    const kv = easeOutExpo(clamp01((el - 0.5) / 2.2));
    armL.current.position.set(-(1 - kv) * 1.6, (1 - kv) * 0.8, 0);
    armR.current.position.set((1 - kv) * 1.6, (1 - kv) * 0.8, 0);

    // Câmera: vai-e-volta lento + cursor + recuo ao rolar
    if (!still) {
      S.yaw = THREE.MathUtils.damp(S.yaw, S.tx * MAX_TILT, 3, dt);
      S.pitch = THREE.MathUtils.damp(S.pitch, S.ty * MAX_TILT, 3, dt);
    }
    const hero = document.getElementById("topo");
    if (hero && !CAPTURE) {
      const r = hero.getBoundingClientRect();
      S.sp = THREE.MathUtils.damp(S.sp, clamp01(-r.top / (r.height * 0.9)), 8, dt);
    }
    const phase = (t * 2 * Math.PI) / PERIOD;
    const yaw = Math.sin(phase) * SWING + S.yaw;
    const dist = frame.dist - Math.sin(phase - Math.PI / 2) * 0.5 + S.sp * 5;
    const pitch = 0.05 + Math.sin(t * 0.2) * 0.015 + S.pitch;
    const cam = state.camera;
    cam.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
    cam.lookAt(0, 0, 0);
    gl.domElement.style.opacity = String(1 - S.sp * 0.75);

    if (!S.ready) {
      S.ready = true;
      if (CAPTURE) window.__vertexReady = true;
      requestAnimationFrame(onReady);
    }
  });

  let idx = 0;
  const register = (pos: [number, number, number]) => {
    const i = idx++;
    return (o: THREE.Object3D | null) => {
      if (o) {
        o.userData.pos = pos;
        items.current[i] = o;
      }
    };
  };

  return (
    <>
      <ProceduralEnv tone="cool" />
      <ambientLight intensity={0.15} color="#9fb4ff" />
      <directionalLight position={[-5, 3, -4]} intensity={1.2} color="#6f8cff" />
      <directionalLight position={[4, 5, 6]} intensity={0.9} color="#ffffff" />

      {/* V de vidro */}
      <group scale={1.15}>
        <mesh ref={armL} geometry={res.armL} material={res.glass} />
        <mesh ref={armR} geometry={res.armR} material={res.glass} />
      </group>

      {/* Capturas reais em molduras de navegador */}
      {shots.map((s) => (
        <group key={s.slot.id} ref={register(s.slot.pos)} scale={s.slot.s} visible={false}>
          <mesh geometry={res.frameGeo} material={res.frameMat} position={[0, BAR / 2, -0.003]} />
          <lineSegments geometry={res.frameEdges} material={res.edgeMat} position={[0, BAR / 2, -0.002]} />
          {[0, 1, 2].map((d) => (
            <mesh key={d} geometry={res.dotGeo} material={res.dotMat} position={[-W / 2 + 0.09 + d * 0.07, H / 2 + BAR / 2, 0.001]} />
          ))}
          <mesh geometry={res.shotGeo} material={s.mat} />
        </group>
      ))}

      {/* Placas de vidro vazias e celular */}
      {panes.map(({ p, geo, edges }, i) => (
        <group key={i} ref={register(p.pos)} visible={false}>
          <mesh geometry={geo} material={res.paneMat} />
          <lineSegments geometry={edges} material={res.edgeMat} />
        </group>
      ))}
    </>
  );
}

export default function HeroGL({ active, lite, still = false, onReady, onFail }: HeroGLProps) {
  return (
    <Canvas
      frameloop={CAPTURE || !active ? "never" : still ? "demand" : "always"}
      dpr={[1, 1.5]}
      camera={{ fov: FOV, position: [0, 0, 13], near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
        if (CAPTURE) {
          window.__vertexStep = (t: number) => {
            window.__vtime = t;
            advance(performance.now());
          };
        }
      }}
    >
      <Scene lite={lite} still={still} onReady={onReady} onFail={onFail} />
    </Canvas>
  );
}
