import * as THREE from 'three';
import { circle, rect, strip } from '../../decals.js';
import { amberM, chromeM, lampM, reflM, trimM } from '../../materials.js';
import { plateFrontM, ringM, roundelM, slatM } from './materials.js';

// wielokąt z zaokrąglonymi narożnikami (łuk Béziera w każdym wierzchołku)
export function rounded(pts, r, seg = 5) {
  const out = [];
  pts.forEach((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]), k = Math.min(r, la / 2, lb / 2);
    const p0 = [p[0] + (a[0] - p[0]) / la * k, p[1] + (a[1] - p[1]) / la * k], p1 = [p[0] + (b[0] - p[0]) / lb * k, p[1] + (b[1] - p[1]) / lb * k];
    for (let s = 0; s <= seg; s++) {
      const t = s / seg, u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p1[1]]);
    }
  });
  return out;
}

/* ---------- przód E63: nerki, reflektory z ringami, zderzak z halogenami, logo na masce ---------- */
export function buildFront(car, P, { faceDecal }) {
  // nerki: chromowana ramka, czarne wnętrze, pionowe listwy; górna krawędź opada na zewnątrz jak linia maski
  const kidney = rounded([[0.4, 5.35], [3.0, 5.45], [3.2, 6.85], [0.4, 7.05]], 0.38);
  const grow = (pts, d) => { const cz = 1.8, cy = 6.2; return pts.map(([z, y]) => [cz + (z - cz) * (1 + d / 1.4), cy + (y - cy) * (1 + d / 0.85)]); };
  faceDecal(grow(kidney, 0.13), true, 0.05, chromeM);
  faceDecal(kidney, true, 0.09, trimM);
  for (let z = 0.68; z < 3.0; z += 0.29) {
    const top = 7.05 - (z - 0.4) / 2.8 * 0.2 - 0.12;
    faceDecal(rect(z - 0.045, 5.5, z + 0.045, top), true, 0.12, slatM);
  }
  faceDecal(strip([[-3.6, 7.16], [0, 7.26], [3.6, 7.16]], 0.05), true, 0.02, trimM, false);   // szczelina maski nad nerkami

  // reflektory: wydłużone, zawinięte na błotnik, z wcięciem u dołu; dwa ringi i kierunkowskaz w górnej części
  const headL = rounded([[3.42, 5.9], [3.55, 6.98], [4.6, 7.16], [6.2, 7.32], [7.6, 7.48], [8.5, 7.54], [9.0, 7.34], [9.05, 6.9], [8.2, 6.52],
    [7.2, 6.02], [6.1, 5.6], [4.2, 5.45], [3.6, 5.55]], 0.14, 2);
  faceDecal(headL, true, 0.03, trimM);
  faceDecal(headL.map(([z, y]) => [5.6 + (z - 5.6) * 0.95, 6.6 + (y - 6.6) * 0.88]), true, 0.05, reflM);
  for (const [cz, cy, r] of [[4.72, 6.32, 0.56], [6.4, 6.55, 0.52]]) {
    faceDecal(circle(cz, cy, r), true, 0.07, ringM);                 // świecący ring
    faceDecal(circle(cz, cy, r * 0.8), true, 0.09, chromeM);
    faceDecal(circle(cz, cy, r * 0.42), true, 0.11, trimM);          // soczewka
  }
  faceDecal([[7.2, 7.2], [8.4, 7.38], [8.75, 7.28], [7.3, 7.06]], true, 0.08, amberM);
  faceDecal(headL, true, 0.13, lampM);

  // zderzak: tablica pod nerkami, centralny wlot z siatką, okrągłe halogeny we wnękach
  faceDecal(rect(-2.6, 4.1, 2.6, 5.24), true, 0.14, plateFrontM, false, [-2.6, 4.1, 2.6, 5.24]);
  const intake = rounded([[-4.5, 2.72], [4.5, 2.72], [4.05, 4.02], [-4.05, 4.02]], 0.3);
  faceDecal(intake, true, 0.04, trimM, false);
  for (let y = 3.0; y < 3.9; y += 0.26) faceDecal(rect(-4.1 + (y - 2.72) * 0.3, y, 4.1 - (y - 2.72) * 0.3, y + 0.05), true, 0.07, slatM, false);
  const fogBay = rounded([[5.35, 2.85], [7.6, 2.95], [7.75, 3.95], [5.5, 4.0]], 0.35);
  faceDecal(fogBay, true, 0.04, trimM);
  faceDecal(circle(6.5, 3.42, 0.4), true, 0.07, chromeM);
  faceDecal(circle(6.5, 3.42, 0.33), true, 0.09, reflM);
  faceDecal(circle(6.5, 3.42, 0.33), true, 0.11, lampM);
  for (const z of [5.2, 7.9]) faceDecal(circle(z, 4.55, 0.12, 14), true, 0.03, slatM);   // czujniki parkowania

  // logo na przedniej krawędzi maski, leży na jej powierzchni
  // (góra logo w stronę szyby, żeby czytać je stojąc przed autem)
  const x = 22.35, e = 0.1, k = (P.topY(x + e) - P.topY(x - e)) / (2 * e);
  const n = new THREE.Vector3(-k, 1, 0).normalize(), up = new THREE.Vector3(-1, -k, 0).normalize();
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.42, 36), roundelM);
  badge.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(up, n), up, n));
  badge.position.set(x, P.topY(x) + 0.1, 0);
  car.add(badge);
}
