import * as THREE from 'three';
import { rng } from './random.js';

/* ---------- tekstury proceduralne rysowane na canvas ---------- */
export function canvasTex(size, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
export function speckle(base, amp, tiles, seed) {
  return canvasTex(128, (g, n) => {
    const R = rng(seed); g.fillStyle = base; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 2600; i++) { const v = (R() - 0.5) * amp; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`; g.fillRect(R() * n, R() * n, 1 + R() * 2, 1 + R() * 2); }
    if (tiles) { g.strokeStyle = 'rgba(0,0,0,.13)'; g.lineWidth = 1; for (let k = 0; k <= n; k += n / tiles) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, n); g.moveTo(0, k); g.lineTo(n, k); g.stroke(); } }
  });
}
