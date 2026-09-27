import * as THREE from 'three';
import { active } from '../car/index.js';
import { createShadow } from '../car/shadow.js';
import { box } from '../core/geometry.js';
import { scene } from '../core/renderer.js';
import { GRID, cellOf, inGrid } from '../city/spatial.js';
import { drive, st } from '../drive/state.js';

/* ---------- postać pieszego: prosta bryła bez animacji, kolizje z miastem i autem ---------- */
// układ postaci jak auta: x = przód, z = w bok; obrót wokół osi Y o kurs psi
export const R = 2.2;                          // promień obrysu postaci (dm)
export const HEAD = 16.5;                      // wysokość oczu (kamera z pierwszej osoby)
let body = null, shadow = null;

function buildPerson() {
  const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
  const jeans = mat(0x2f4a6e), jacket = mat(0xe0a02a), skin = mat(0xd9a782);
  const g = new THREE.Group();
  const part = (geom, m, x, y, z) => { const p = new THREE.Mesh(geom, m); p.position.set(x, y, z); g.add(p); };
  for (const s of [-1, 1]) {
    part(box(1.6, 8, 1.5), jeans, 0, 4, s * 1.05);               // nogi
    part(box(1.3, 6.2, 1.3), jacket, 0, 10.6, s * 2.75);         // ręce
  }
  part(box(2.4, 6.4, 4.2), jacket, 0, 11, 0);                     // tułów
  part(new THREE.SphereGeometry(1.55, 16, 12), skin, 0.1, 15.9, 0); // głowa
  return g;
}
export function showPerson(on) {
  if (!body) {
    body = buildPerson();
    shadow = createShadow(); shadow.scale.set(0.16, 0.3, 1);
    scene.add(body, shadow);
  }
  body.visible = shadow.visible = on;
}
export function placePerson(p, ground) {
  body.position.set(p.x, p.y, p.z); body.rotation.y = p.psi;
  shadow.position.set(p.x, ground + 0.03, p.z);
}

// odległość punktu od obrysu zaparkowanego auta (0 = w środku)
export function carGap(x, z) {
  const { box: [hx, hz] } = active.model.hit, { REAR } = active.geo, c = Math.cos(st.psi), s = Math.sin(st.psi);
  const dx = x - (st.x + c * REAR), dz = z - (st.z - s * REAR);
  const lx = dx * c - dz * s, lz = dx * s + dz * c;
  return Math.hypot(Math.max(Math.abs(lx) - hx, 0), Math.max(Math.abs(lz) - hz, 0));
}
// punkt w układzie auta (lx wzdłuż, lz w bok, lewa strona = -lz) na mapie
export function carPoint(lx, lz) {
  const { REAR } = active.geo, c = Math.cos(st.psi), s = Math.sin(st.psi);
  const cx = st.x + c * REAR, cz = st.z - s * REAR;
  return [cx + lx * c + lz * s, cz - lx * s + lz * c];
}

// budynki, woda, granica mapy, słupki, drzewa, latarnie i auto
const RING = [[R, 0], [-R, 0], [0, R], [0, -R], [0.7 * R, 0.7 * R], [0.7 * R, -0.7 * R], [-0.7 * R, 0.7 * R], [-0.7 * R, -0.7 * R]];
export function blocked(x, z) {
  const C = drive.city, [bx0, bz0, bx1, bz1] = C.bounds;
  if (x < bx0 + 4 || x > bx1 - 4 || z < bz0 + 4 || z > bz1 - 4) return true;
  for (const [ox, oz] of RING) if (inGrid(C.solid, x + ox, z + oz)) return true;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
    for (const [px, pz, r] of cellOf(C.posts, x + i * GRID, z + j * GRID)) {
      if ((px - x) ** 2 + (pz - z) ** 2 < (r + R) ** 2) return true;
    }
  }
  return carGap(x, z) < R;
}
