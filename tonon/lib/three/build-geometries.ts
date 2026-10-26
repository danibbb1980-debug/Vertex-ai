import type * as THREE from "three";
import { createCrownGeometry } from "./crown-geometry";
import { createAbutmentGeometry, createNeckGeometry, createThreadedBodyGeometry } from "./implant-geometry";

export type Quality = "high" | "low";

export type DentalGeometries = {
  crown: THREE.BufferGeometry;
  abutment: THREE.BufferGeometry;
  neck: THREE.BufferGeometry;
  body: THREE.BufferGeometry;
};

/** Devolve a thread principal ao navegador entre uma peça e outra. */
function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Gera as malhas procedurais em etapas, cedendo a thread entre elas, para
 * não criar uma única tarefa longa que atrase cliques e rolagem.
 */
export async function buildDentalGeometries(quality: Quality): Promise<DentalGeometries> {
  const high = quality === "high";
  const crown = createCrownGeometry(
    high ? { radialSegments: 200, profileSegments: 160 } : { radialSegments: 120, profileSegments: 96 },
  );
  await yieldToMain();
  const abutment = createAbutmentGeometry(high ? 128 : 72);
  const neck = createNeckGeometry(high ? 128 : 72);
  await yieldToMain();
  const body = createThreadedBodyGeometry(
    high ? { radialSegments: 168, heightSegments: 480 } : { radialSegments: 104, heightSegments: 300 },
  );
  await yieldToMain();
  return { crown, abutment, neck, body };
}
