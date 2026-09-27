import * as THREE from 'three';
import { plateTexture } from './plate.js';

/* ---------- materiały wspólne dla wszystkich aut: szkło, lampy, uszczelki, opony ---------- */
// kolory lakieru, felg i wnętrza ma każdy model osobno (car/models/)
export const bodyMat = o => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...o });
export const glassM = bodyMat({ color: 0x1e2a36, metalness: 0.55, roughness: 0.04, transparent: true, opacity: 0.46 });
export const trimM = bodyMat({ color: 0x111316, metalness: 0.25, roughness: 0.5 });
export const chromeM = bodyMat({ color: 0xe6eaee, metalness: 1, roughness: 0.1 });
export const lampM = bodyMat({ color: 0xe9f1f7, metalness: 0.1, roughness: 0.02, transparent: true, opacity: 0.5 });
export const reflM = bodyMat({ color: 0xf0f3f6, metalness: 1, roughness: 0.16 });
export const redM = bodyMat({ color: 0xb0121c, metalness: 0.25, roughness: 0.12, emissive: 0x420000 });
export const amberM = bodyMat({ color: 0xe8901e, metalness: 0.2, roughness: 0.2, emissive: 0x2a1200 });
export const tireM = bodyMat({ color: 0x151618, roughness: 0.95 });
// tablice rejestracyjne: przednia i tylna (z naklejką legalizacyjną)
export const plateMats = text => [false, true].map(sticker => bodyMat({ map: plateTexture(text, sticker), roughness: 0.45 }));
