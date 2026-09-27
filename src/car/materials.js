import * as THREE from 'three';
import { PLATE, plateTexture } from './plate.js';

/* ---------- materiały auta: nadwozie, szkło, lampy, tablice, koła, wnętrze ---------- */
export const bodyMat = o => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...o });
export const paint = bodyMat({ color: 0xa4abb2, metalness: 0.9, roughness: 0.3 });          // lodowy srebrny metalik
export const glassM = bodyMat({ color: 0x1e2a36, metalness: 0.55, roughness: 0.04, transparent: true, opacity: 0.46 });
export const trimM = bodyMat({ color: 0x111316, metalness: 0.25, roughness: 0.5 });
export const chromeM = bodyMat({ color: 0xe6eaee, metalness: 1, roughness: 0.1 });
export const lampM = bodyMat({ color: 0xe9f1f7, metalness: 0.1, roughness: 0.02, transparent: true, opacity: 0.5 });
export const reflM = bodyMat({ color: 0xf0f3f6, metalness: 1, roughness: 0.16 });
export const redM = bodyMat({ color: 0xb0121c, metalness: 0.25, roughness: 0.12, emissive: 0x420000 });
export const amberM = bodyMat({ color: 0xe8901e, metalness: 0.2, roughness: 0.2, emissive: 0x2a1200 });
export const plateFrontM = bodyMat({ map: plateTexture(PLATE, false), roughness: 0.45 });
export const plateRearM = bodyMat({ map: plateTexture(PLATE, true), roughness: 0.45 });
export const tireM = bodyMat({ color: 0x151618, roughness: 0.95 });
export const rimM = bodyMat({ color: 0xc9ced3, metalness: 0.95, roughness: 0.22 });
// wnętrze (widoczne przez szyby)
export const leatherM = bodyMat({ color: 0x2c2e32, roughness: 0.72 });
export const clothM = bodyMat({ color: 0x46494f, roughness: 0.95 });
export const dashM = bodyMat({ color: 0x1c1e21, roughness: 0.62 });
export const aluM = bodyMat({ color: 0xaab0b6, metalness: 0.9, roughness: 0.3 });
export const headM = bodyMat({ color: 0xbdb9b1, roughness: 0.95 });
export const carpetM = bodyMat({ color: 0x19191b, roughness: 1 });
export const screenM = bodyMat({ color: 0x07080a, roughness: 0.25 });
export const ledM = bodyMat({ color: 0x250302, emissive: 0xff2a14, emissiveIntensity: 0.9, roughness: 0.4 });   // czerwone podświetlenie Audi
