"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { DentalGeometries, Quality } from "@/lib/three/build-geometries";

export type SceneInputs = {
  /** Progresso da rolagem dentro do hero, 0 → 1. */
  scroll: number;
  /** Ponteiro normalizado em [-1, 1]. */
  pointerX: number;
  pointerY: number;
};

type Props = {
  inputs: RefObject<SceneInputs>;
  geometries: DentalGeometries;
  quality: Quality;
  reducedMotion: boolean;
  /** Chamado quando os shaders terminam de compilar e o primeiro quadro foi desenhado. */
  onReady?: () => void;
};

const damp = THREE.MathUtils.damp;
/** Centro vertical do conjunto (coroa + implante ≈ 3,1 unidades de altura). */
const BASE_Y = 0.42;
/** Inclinação para a câmera: deixa ver a face oclusal da coroa. */
const BASE_TILT = 0.12;

/**
 * Coroa cerâmica sobre pilar e implante de titânio.
 * Toda a geometria é procedural (lib/three); nada é baixado.
 */
export function DentalScene({ inputs, geometries, quality, reducedMotion, onReady }: Props) {
  const high = quality === "high";

  // No modo leve (celulares) os metais usam MeshStandardMaterial e a cerâmica
  // dispensa o sheen: shaders bem mais baratos, diferença visual pequena.
  const materials = useMemo(
    () => ({
      ceramic: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.26,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.09,
        ...(high ? { sheen: 0.35, sheenRoughness: 0.45, sheenColor: new THREE.Color("#ffffff") } : {}),
        specularIntensity: 0.7,
        ior: 1.52,
      }),
      polished: high
        ? new THREE.MeshPhysicalMaterial({
            color: "#d6d6d3",
            metalness: 1,
            roughness: 0.14,
            clearcoat: 0.4,
            clearcoatRoughness: 0.05,
          })
        : new THREE.MeshStandardMaterial({ color: "#d6d6d3", metalness: 1, roughness: 0.14 }),
      machined: new THREE.MeshStandardMaterial({ color: "#b9b9b6", metalness: 1, roughness: 0.36 }),
      access: new THREE.MeshStandardMaterial({ color: "#3a3e43", metalness: 0.6, roughness: 0.5 }),
    }),
    [high],
  );

  // As geometrias pertencem ao HeroCanvas, que as descarta; aqui só os materiais.
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  const root = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const ready = useRef(false);
  const compiled = useRef(false);
  const { gl, scene, camera, invalidate } = useThree();

  // Compila os shaders de forma assíncrona (KHR_parallel_shader_compile)
  // antes de mostrar o canvas, em vez de travar o primeiro quadro.
  useEffect(() => {
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        compiled.current = true;
        invalidate();
      });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, invalidate]);

  useFrame((state, delta) => {
    const g = root.current;
    const c = crown.current;
    if (!g || !c) return;
    const i = inputs.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20);

    const explode = reducedMotion ? 0 : THREE.MathUtils.smoothstep(i.scroll, 0.02, 0.7);

    if (reducedMotion) {
      g.rotation.set(BASE_TILT, -0.55, 0.06);
      g.position.y = BASE_Y;
      c.position.y = 0;
      c.rotation.set(0, 0, 0);
    } else {
      const idle = t * 0.16;
      const targetY = -0.55 + Math.sin(idle) * 0.35 + i.pointerX * 0.35 + explode * 0.9;
      const targetX = BASE_TILT + i.pointerY * 0.1 - explode * 0.08;
      g.rotation.y = damp(g.rotation.y, targetY, 3, dt);
      g.rotation.x = damp(g.rotation.x, targetX, 3, dt);
      g.rotation.z = damp(g.rotation.z, 0.06 - i.pointerX * 0.03, 3, dt);
      g.position.y = BASE_Y + Math.sin(t * 0.7) * 0.05 - explode * 0.2;

      c.position.y = damp(c.position.y, explode * 0.62, 6, dt);
      c.rotation.y = damp(c.rotation.y, explode * 0.5, 6, dt);
      c.rotation.z = damp(c.rotation.z, -explode * 0.08, 6, dt);
    }

    if (compiled.current && !ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  return (
    <>
      <Environment resolution={high ? 256 : 96} frames={1}>
        {/* Fundo do estúdio no mesmo azul acinzentado do hero: é o que o metal reflete. */}
        <mesh scale={50}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#8e9caa" side={THREE.BackSide} />
        </mesh>
        {/* Softbox principal acima e à esquerda. */}
        <Lightformer form="rect" intensity={4.5} color="#ffffff" position={[-3, 4, 3]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        {/* Faixas verticais: desenham os reflexos longos no titânio. */}
        <Lightformer form="rect" intensity={3} color="#f3f6fa" position={[4, 0.5, 2]} scale={[1, 9, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#eef3f8" position={[-4.5, 0, -1]} scale={[0.6, 9, 1]} target={[0, 0, 0]} />
        {/* Luz de recorte por trás e preenchimento frio por baixo. */}
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 3, -5]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.9} color="#c7d3df" position={[0, -5, 2]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.6} color="#ffffff" position={[2.5, 2.5, 4]} scale={1.4} target={[0, 0, 0]} />
      </Environment>

      <directionalLight position={[-2.5, 4, 3]} intensity={1.1} color="#fffdf8" />
      <directionalLight position={[3, -1, 2]} intensity={0.25} color="#cfdbe6" />

      <group ref={root} position={[0, BASE_Y, 0]} rotation={[BASE_TILT, -0.55, 0.06]}>
        <group ref={crown} position={[0, 0, 0]}>
          <mesh geometry={geometries.crown} material={materials.ceramic} scale={1.08} />
        </group>
        <mesh geometry={geometries.abutment} material={materials.polished} />
        <mesh position={[0, 0.232, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.access}>
          <circleGeometry args={[0.06, 40]} />
        </mesh>
        <mesh geometry={geometries.neck} material={materials.polished} />
        <mesh geometry={geometries.body} material={materials.machined} />
      </group>
    </>
  );
}
