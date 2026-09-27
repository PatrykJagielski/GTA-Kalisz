import * as THREE from 'three';
import { bodyMat, plateMats } from '../../materials.js';

/* ---------- materiały BMW: lakier, felgi, logo, wnętrze z pomarańczowym podświetleniem ---------- */
export const PLATE = 'S E6T';
export const paint = bodyMat({ color: 0x7a1424, metalness: 0.7, roughness: 0.28 });          // ciemnoczerwony metalik
export const rimM = bodyMat({ color: 0xc3c8cd, metalness: 0.95, roughness: 0.2 });
export const roofGlassM = bodyMat({ color: 0x0b0e12, metalness: 0.6, roughness: 0.05 });       // szklany szyberdach
export const slatM = bodyMat({ color: 0x2a2d31, metalness: 0.4, roughness: 0.35 });            // listwy nerek
export const ringM = bodyMat({ color: 0xf4f7ff, emissive: 0xdfe8ff, emissiveIntensity: 0.55, roughness: 0.2 });   // ringi „angel eyes”
export const [plateFrontM, plateRearM] = plateMats(PLATE);

// logo: czarny pierścień z literami BMW, w środku ćwiartki niebieskie i białe
function roundelTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#c9ced4'; g.beginPath(); g.arc(128, 128, 128, 0, 7); g.fill();
  g.fillStyle = '#0d0e10'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill();
  g.fillStyle = '#e9ecef'; g.font = '700 50px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  [['B', -2.25], ['M', -1.5708], ['W', -0.89]].forEach(([ch, a]) => {
    g.save(); g.translate(128 + 94 * Math.cos(a), 128 + 94 * Math.sin(a)); g.rotate(a + Math.PI / 2); g.fillText(ch, 0, 2); g.restore();
  });
  g.fillStyle = '#c9ced4'; g.beginPath(); g.arc(128, 128, 72, 0, 7); g.fill();
  [[0, '#f4f5f7'], [1, '#1c69d4'], [2, '#f4f5f7'], [3, '#1c69d4']].forEach(([q, col]) => {
    g.fillStyle = col; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 67, q * Math.PI / 2, (q + 1) * Math.PI / 2); g.fill();
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
export const roundelM = bodyMat({ map: roundelTexture(), metalness: 0.3, roughness: 0.25 });

export const interiorM = {
  leather: bodyMat({ color: 0x6a2418, roughness: 0.6 }),        // czerwono-brązowa skóra
  cloth: bodyMat({ color: 0x7a2c1f, roughness: 0.7 }),
  dash: bodyMat({ color: 0x17181a, roughness: 0.6 }),
  alu: bodyMat({ color: 0x9aa0a6, metalness: 0.9, roughness: 0.32 }),
  head: bodyMat({ color: 0x8f8a82, roughness: 0.95 }),
  carpet: bodyMat({ color: 0x19191b, roughness: 1 }),
  screen: bodyMat({ color: 0x07080a, roughness: 0.25 }),
  wheel: bodyMat({ color: 0x1b1b1d, roughness: 0.55 }),        // kierownica z czarnej skóry
  led: bodyMat({ color: 0x2a1000, emissive: 0xff7a1a, emissiveIntensity: 0.9, roughness: 0.4 }),   // pomarańczowe podświetlenie BMW
};
