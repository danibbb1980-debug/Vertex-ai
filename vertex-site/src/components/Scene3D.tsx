import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneProps } from "./Stage3D";
import { ProceduralEnv, V_HEIGHT, armGeometry, clamp01, easeOutExpo } from "./three/shared";

function useArmGeometry(side: -1 | 1) {
  return useMemo(() => armGeometry(side), [side]);
}

function VertexV({ onReady }: { onReady: () => void }) {
  const group = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Mesh>(null!);
  const right = useRef<THREE.Mesh>(null!);
  const geoL = useArmGeometry(-1);
  const geoR = useArmGeometry(1);

  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d9a947",
        metalness: 1,
        roughness: 0.26,
        envMapIntensity: 1.3,
      }),
    [],
  );
  const champ = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f3e0aa",
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1.4,
      }),
    [],
  );

  useEffect(
    () => () => {
      geoL.dispose();
      geoR.dispose();
      gold.dispose();
      champ.dispose();
    },
    [geoL, geoR, gold, champ],
  );

  const st = useRef({
    t0: -1,
    ready: false,
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    sep: 1,
    x: 0,
    y: 0,
    s: 0,
    placed: false,
  });

  const anchors = useRef<{ hero: HTMLElement | null; cta: HTMLElement | null }>({ hero: null, cta: null });
  useEffect(() => {
    anchors.current.hero = document.getElementById("v-anchor-hero");
    anchors.current.cta = document.getElementById("v-anchor-cta");
    const fine = matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      st.current.tx = (e.clientX / innerWidth) * 2 - 1;
      st.current.ty = (e.clientY / innerHeight) * 2 - 1;
    };
    if (fine) addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const S = st.current;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    if (S.t0 < 0) S.t0 = t;
    const vh = state.size.height;
    const vw = state.size.width;

    // Qual palco está ativo: hero ou CTA final
    const cta = anchors.current.cta?.getBoundingClientRect();
    const hero = anchors.current.hero?.getBoundingClientRect();
    let rect = hero;
    let scrollSep = 0;
    if (cta && cta.top < vh * 1.15) {
      rect = cta;
      const cy = cta.top + cta.height / 2;
      scrollSep = clamp01((cy - vh * 0.5) / (vh * 0.5));
    } else if (hero) {
      scrollSep = clamp01(scrollY / (vh * 0.85));
    }
    if (!rect || rect.width === 0) return;

    // Converte o retângulo do DOM para coordenadas do mundo
    const vp = state.viewport;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const wx = (cx / vw - 0.5) * vp.width;
    const wy = -(cy / vh - 0.5) * vp.height;
    const ws = ((rect.height / vh) * vp.height) / V_HEIGHT;

    if (!S.placed) {
      S.x = wx;
      S.y = wy;
      S.s = ws;
      S.placed = true;
    }
    // A posição acompanha a rolagem de perto; a escala suaviza mudanças de layout
    S.x = THREE.MathUtils.damp(S.x, wx, 18, dt);
    S.y = THREE.MathUtils.damp(S.y, wy, 18, dt);
    S.s = THREE.MathUtils.damp(S.s, ws, 8, dt);

    const intro = easeOutExpo(clamp01((t - S.t0 - 0.1) / 1.9));
    const targetSep = (1 - intro) * 1.0 + scrollSep * 0.55;
    S.sep = THREE.MathUtils.damp(S.sep, targetSep, 6, dt);
    S.px = THREE.MathUtils.damp(S.px, S.tx, 3, dt);
    S.py = THREE.MathUtils.damp(S.py, S.ty, 3, dt);

    const g = group.current;
    g.position.set(S.x, S.y + Math.sin(t * 0.8) * 0.04 * S.s * 2.2, 0);
    g.scale.setScalar(S.s * (0.94 + intro * 0.06));
    g.rotation.y = Math.sin(t * 0.32) * 0.2 + S.px * 0.32 + scrollSep * 0.9 + (1 - intro) * -0.6;
    g.rotation.x = Math.sin(t * 0.45) * 0.05 + S.py * 0.14 - scrollSep * 0.15;
    g.rotation.z = Math.sin(t * 0.27) * 0.015;

    const sep = S.sep;
    left.current.position.set(-sep * 1.25, sep * 0.55, sep * 0.4);
    left.current.rotation.z = sep * 0.18;
    right.current.position.set(sep * 1.25, sep * 0.55, -sep * 0.4);
    right.current.rotation.z = -sep * 0.18;

    if (!S.ready) {
      S.ready = true;
      requestAnimationFrame(onReady);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={left} geometry={geoL} material={gold} />
      <mesh ref={right} geometry={geoR} material={champ} />
    </group>
  );
}

export default function Scene3D({ active, onReady, onFail }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 12], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
      }}
    >
      <ProceduralEnv />
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#fff1d0" />
      <directionalLight position={[-5, 2, -4]} intensity={3.2} color="#ffd98a" />
      <directionalLight position={[-3, -4, 5]} intensity={0.5} color="#b9c2d6" />
      <VertexV onReady={onReady} />
    </Canvas>
  );
}
