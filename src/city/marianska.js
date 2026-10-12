import * as THREE from 'three';
import { herbRound } from './landmarks/mural-drawing.js';

/* ---------- ulica Mariańska: herb Kalisza wmurowany w bruk jezdni ---------- */
// Wygląd tylko przybliżony (brak dostępu do Street View): znany jest sam fakt, że herb jest w nawierzchni ulicy.
// Położenie: środek osi ulicy z danych OSM (dm), promień ok. 2 m.
const POS = [1145, -263], R = 20;

export function buildMarianska(group) {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#8a8076'; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 2, 0, 7); g.fill();
  g.strokeStyle = '#e9e1cf'; g.fillStyle = '#e9e1cf'; g.lineWidth = 3.2;
  herbRound(g, S / 2, S / 2, 44);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.CircleGeometry(R, 40).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -12 }));
  m.position.set(POS[0], 0.05, POS[1]); group.add(m);
}
