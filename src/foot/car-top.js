import * as THREE from 'three';
import { active, carParts } from '../car/index.js';
import { drive, st } from '../drive/state.js';

/* ---------- wierzch auta: maska, dach i bagażnik, na które da się wskoczyć (własnego i innych graczy) ---------- */
// mapa wysokości nadwozia w układzie auta (siatka co 1 dm), liczona raz na model promieniami z góry na kopii auta
// ustawionej w początku układu (x = przód, z = bok), więc nie zależy od tego, gdzie auto akurat stoi
const CELL = 1;
const maps = new Map();
const ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0), from = new THREE.Vector3();

function topMap(model) {
  if (maps.has(model.id)) return maps.get(model.id);
  const [hx, hz] = model.hit.box, nx = Math.ceil(2 * hx / CELL) + 1, nz = Math.ceil(2 * hz / CELL) + 1;
  const h = new Float32Array(nx * nz), body = carParts(model).car.clone();
  body.position.set(0, 0, 0); body.rotation.set(0, 0, 0); body.updateMatrixWorld(true);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    ray.set(from.set(-hx + i * CELL, 60, -hz + j * CELL), down);
    const hit = ray.intersectObject(body, true)[0];
    h[i * nz + j] = hit ? hit.point.y : 0;
  }
  const map = { h, nx, nz, hx, hz };
  maps.set(model.id, map);
  return map;
}
// wysokość wierzchu auta (model, środek cx cz, kurs psi, podłoże y) nad punktem (x, z) albo 0 poza obrysem
function topAt(model, cx, cz, psi, y, x, z) {
  const { h, nx, nz, hx, hz } = topMap(model), c = Math.cos(psi), s = Math.sin(psi), dx = x - cx, dz = z - cz;
  const i = Math.round((dx * c - dz * s + hx) / CELL), j = Math.round((dx * s + dz * c + hz) / CELL);
  if (i < 0 || j < 0 || i >= nx || j >= nz) return 0;
  const top = h[i * nz + j];
  return top > 0 ? y + top : 0;
}
// własne (zaparkowane) auto
export function carTopAt(x, z) {
  const { REAR } = active.geo, c = Math.cos(st.psi), s = Math.sin(st.psi);
  return topAt(active.model, st.x + c * REAR, st.z - s * REAR, st.psi, st.y, x, z);
}
// auta innych graczy (drive.traffic.cars): najwyższy wierzch pod punktem i auto, do którego należy
export function othersTopAt(x, z) {
  let top = 0, car = null;
  for (const c of drive.traffic.cars) {
    if (Math.abs(x - c.cx) > c.hx + c.hz || Math.abs(z - c.cz) > c.hx + c.hz) continue;
    const t = topAt(c.model, c.cx, c.cz, c.psi, c.y, x, z);
    if (t > top) { top = t; car = c; }
  }
  return { top, car };
}
