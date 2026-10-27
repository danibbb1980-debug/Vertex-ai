"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export const MODEL_URL = "/models/tooth-volte-a-sorrir.glb";

export type PointerState = { x: number; y: number };

type Props = {
  /** false com prefers-reduced-motion: pose fixa, sem flutuação nem cursor. */
  motion: boolean;
  /** false fora da tela ou com a aba oculta: o loop de renderização para. */
  active: boolean;
  /** Celular: menos pixels. */
  compact: boolean;
  /** Posição do cursor (-1..1), atualizada fora do React. */
  pointer: RefObject<PointerState>;
  onReady: () => void;
  /** Modo de captura do pôster (scripts/render-poster.mjs). */
  capture?: boolean;
};

/** Pose de repouso: três-quartos, mostrando vestibular, mesial e um pouco da oclusal. */
const REST = { x: 0.2, y: -0.62, z: -0.1 };

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

function Tooth({ motion, pointer, onReady, capture }: Pick<Props, "motion" | "pointer" | "onReady" | "capture">) {
  // Modelo com compressão meshopt (ver scripts/generate-tooth.mjs).
  const gltf = useLoader(GLTFLoader, MODEL_URL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder));
  const geometry = useMemo(() => {
    let found: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = (o as THREE.Mesh).geometry;
    });
    return found!;
  }, [gltf]);

  // Esmalte: branco natural, verniz suave e brilho controlado. A variação de
  // tom (coroa × raiz, sulcos) vem das cores por vértice do modelo.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        color: "#ffffff",
        roughness: 0.26,
        metalness: 0,
        ior: 1.62,
        specularIntensity: 0.75,
        clearcoat: 0.7,
        clearcoatRoughness: 0.09,
        sheen: 0.3,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color("#fff3d6"),
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  // Sem movimento (captura ou reduced-motion), começa direto na pose final.
  const state = useRef({ time: 0, entry: capture || !motion ? 1 : 0, px: 0, py: 0, motion: motion ? 1 : 0 });
  const readyCalled = useRef(false);

  // Com renderização sob demanda (reduced-motion), pede o quadro que mostra o
  // dente assim que o modelo termina de carregar.
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => invalidate(), [invalidate]);

  const shadowTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(14,40,55,0.55)");
    g.addColorStop(0.45, "rgba(14,40,55,0.22)");
    g.addColorStop(1, "rgba(14,40,55,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);

  useFrame((_, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 1 / 30); // sem saltos ao voltar de uma pausa
    const s = state.current;

    s.motion = damp(s.motion, motion ? 1 : 0, 3, dt);
    s.time += dt * s.motion;
    s.entry = damp(s.entry, 1, 1.6, dt);

    const t = s.time;
    const m = s.motion;
    const e = s.entry;

    // Cursor: reação limitada e amortecida.
    const p = pointer.current ?? { x: 0, y: 0 };
    s.px = damp(s.px, p.x * m, 2.2, dt);
    s.py = damp(s.py, p.y * m, 2.2, dt);

    // Parallax de rolagem: o dente sobe e inclina um pouco ao sair do hero.
    const scroll = typeof window === "undefined" ? 0 : Math.min(window.scrollY / window.innerHeight, 1.2) * m;

    const sway = Math.sin(t * 0.3) * 0.34 + Math.sin(t * 0.13) * 0.12; // rotação lenta, sem giro completo
    const bob = Math.sin(t * 0.78) * 0.07; // flutuação vertical

    g.rotation.set(
      REST.x + Math.sin(t * 0.47) * 0.035 + s.py * -0.16 + scroll * 0.18,
      REST.y + sway * m + s.px * 0.32 - (1 - e) * 0.35,
      REST.z + Math.sin(t * 0.41) * 0.03 + s.px * -0.05,
    );
    g.position.set(s.px * 0.06, bob + scroll * 0.45 - (1 - e) * 0.18, 0);
    g.scale.setScalar(0.965 + 0.035 * e);

    if (shadow.current) {
      const lift = bob + scroll * 0.45;
      shadow.current.scale.setScalar(1.45 - lift * 0.9);
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = (0.42 - lift * 0.8) * e;
    }

    if (!readyCalled.current) {
      readyCalled.current = true;
      // Dois quadros depois, a cena já está na tela: o pôster pode sumir.
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }
  });

  return (
    <>
      <group ref={group}>
        <mesh geometry={geometry} material={material} />
      </group>
      <mesh ref={shadow} position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  );
}

type Softbox = {
  color?: string;
  intensity: number;
  position: [number, number, number];
  scale: [number, number];
  ring?: boolean;
};

/** Painéis de luz do estúdio virtual, refletidos no esmalte. */
const SOFTBOXES: Softbox[] = [
  // Softbox principal, acima e à frente.
  { intensity: 5, position: [0, 4.5, 3.5], scale: [7, 2.6] },
  // Faixa lateral esquerda: desenha o contorno vertical.
  { intensity: 3.6, position: [-5, 0.5, 2], scale: [1.8, 7] },
  // Preenchimento frontal: mantém o esmalte branco, sem sombras pretas.
  { intensity: 0.7, position: [0, 0, 6], scale: [6, 6] },
  // Rebatedor quente à direita: o amarelo da página refletido no esmalte.
  { intensity: 0.9, color: "#ffe9a3", position: [5, -0.5, 1.5], scale: [3, 6] },
  // Contraluz em anel: separa a silhueta do fundo.
  { intensity: 4, position: [1.5, 2.5, -5], scale: [3.2, 3.2], ring: true },
  // Chão amarelo suave.
  { intensity: 0.35, color: "#ffe38a", position: [0, -5, 0], scale: [12, 12] },
];

/**
 * Iluminação de estúdio procedural: os painéis são renderizados uma vez num
 * mapa de ambiente (PMREM). Nada de HDRI externo para baixar.
 */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl);

  const environment = useMemo(() => {
    const studio = new THREE.Scene();
    const plane = new THREE.PlaneGeometry(1, 1);
    const ring = new THREE.RingGeometry(0.35, 0.5, 48);
    for (const box of SOFTBOXES) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(box.color ?? "#ffffff").multiplyScalar(box.intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(box.ring ? ring : plane, material);
      mesh.position.set(...box.position);
      mesh.scale.set(box.scale[0], box.scale[1], 1);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
    }
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(studio, 0.02);
    // O estúdio só existe para gerar o mapa: libera tudo menos a textura final.
    pmrem.dispose();
    plane.dispose();
    ring.dispose();
    studio.traverse((o) => ((o as THREE.Mesh).material as THREE.Material | undefined)?.dispose());
    return target;
  }, [gl]);
  // Sem dispose em efeito: no StrictMode a limpeza simulada liberaria o mapa
  // ainda em uso. Ele é liberado junto com o renderer ao desmontar o canvas.

  return (
    <>
      {/* Elemento de topo: "attach" define scene.environment. */}
      <primitive object={environment.texture} attach="environment" />
      <directionalLight position={[3.5, 5, 4.5]} intensity={1.6} color="#fffaf2" />
      <directionalLight position={[-4, 1.5, -3]} intensity={0.8} color="#fff6e2" />
      <ambientLight intensity={0.16} />
    </>
  );
}

export default function ToothCanvas({ motion, active, compact, pointer, onReady, capture = false }: Props) {
  return (
    <Canvas
      className="tooth-canvas"
      // Com movimento: loop contínuo só enquanto visível. Sem movimento: um quadro por mudança.
      frameloop={capture ? "always" : !active ? "never" : motion ? "always" : "demand"}
      dpr={capture ? 2 : compact ? [1, 1.5] : [1, 1.75]}
      // Mesma câmera em qualquer tela: o palco tem proporção fixa (4:5), então o
      // enquadramento é idêntico ao do pôster pré-renderizado.
      camera={{ fov: 24, position: [0, 0.02, 7.7], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: capture }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden
    >
      {/* Fora do Suspense: enquanto o modelo carrega, o React descarta as
          renderizações suspensas, e o mapa de ambiente seria recalculado a cada
          tentativa. Aqui ele é criado uma única vez. */}
      <StudioEnvironment />
      <Suspense fallback={null}>
        <Tooth motion={motion && !capture} pointer={pointer} onReady={onReady} capture={capture} />
      </Suspense>
    </Canvas>
  );
}
