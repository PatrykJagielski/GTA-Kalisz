import { active } from '../car/index.js';
import { CURB } from '../city/config.js';
import { GRID, cellOf, inGrid } from '../city/spatial.js';
import { drive } from './state.js';

/* ---------- kolizje i podłoże ---------- */
// obrys auta (hit w modelu): punkty w układzie lokalnym (x wzdłuż auta, z w bok) sprawdzane z budynkami, wodą
// i granicą mapy oraz prostokąt [pół długości, pół szerokości] sprawdzany ze słupkami
export function hits(cx, cz, psi) {
  const { cp: CP, box: [hx, hz] } = active.model.hit;
  const C = drive.city, [bx0, bz0, bx1, bz1] = C.bounds, c = Math.cos(psi), s = Math.sin(psi);
  for (const [lx, lz] of CP) {
    const x = cx + lx * c + lz * s, z = cz - lx * s + lz * c;
    if (x < bx0 + 4 || x > bx1 - 4 || z < bz0 + 4 || z > bz1 - 4 || inGrid(C.solid, x, z)) return true;
  }
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {                // słupek w obrysie auta (układ lokalny)
    for (const [px, pz, r] of cellOf(C.posts, cx + i * GRID, cz + j * GRID)) {
      const dx = px - cx, dz = pz - cz;
      if (Math.abs(dx) > 30 || Math.abs(dz) > 30) continue;
      const lx = dx * c - dz * s, lz = dx * s + dz * c;
      if (Math.abs(lx) < hx + r && Math.abs(lz) < hz + r) return true;
    }
  }
  return false;
}
// podłoże: 0 = jezdnia, 1 = chodnik / podwórko (krawężnik 14 cm), 2 = trawnik (lekko nierówny)
export function surfaceAt(x, z) {
  const C = drive.city, f = C.fountain;
  if (f && (x - f.c[0]) ** 2 + (z - f.c[1]) ** 2 < f.r * f.r) return 1;             // granitowy plac przy fontannie
  if (!inGrid(C.blockG, x, z)) return 0;
  return inGrid(C.greenG, x, z) ? 2 : 1;
}
export const heightOf = (k, x, z) => k === 0 ? 0 : k === 1 ? CURB : CURB + 0.25 + 0.25 * Math.sin(x * 0.23) * Math.sin(z * 0.19);
