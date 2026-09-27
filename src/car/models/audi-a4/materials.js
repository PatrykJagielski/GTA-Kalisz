import { bodyMat, plateMats } from '../../materials.js';

/* ---------- materiały Audi: lakier, felgi, tablice, wnętrze z czerwonym podświetleniem ---------- */
export const PLATE = 'PKA 02209';
export const paint = bodyMat({ color: 0xa4abb2, metalness: 0.9, roughness: 0.3 });          // lodowy srebrny metalik
export const rimM = bodyMat({ color: 0xc9ced3, metalness: 0.95, roughness: 0.22 });
export const [plateFrontM, plateRearM] = plateMats(PLATE);
export const interiorM = {
  leather: bodyMat({ color: 0x2c2e32, roughness: 0.72 }),
  cloth: bodyMat({ color: 0x46494f, roughness: 0.95 }),
  dash: bodyMat({ color: 0x1c1e21, roughness: 0.62 }),
  alu: bodyMat({ color: 0xaab0b6, metalness: 0.9, roughness: 0.3 }),
  head: bodyMat({ color: 0xbdb9b1, roughness: 0.95 }),
  carpet: bodyMat({ color: 0x19191b, roughness: 1 }),
  screen: bodyMat({ color: 0x07080a, roughness: 0.25 }),
  led: bodyMat({ color: 0x250302, emissive: 0xff2a14, emissiveIntensity: 0.9, roughness: 0.4 }),   // czerwone podświetlenie Audi
};
