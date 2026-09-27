import * as THREE from 'three';
import { active, rig } from '../car/index.js';
import { st } from '../drive/state.js';

/* ---------- wierzch zaparkowanego auta: maska, dach i bagażnik, na które da się wskoczyć ---------- */
// mapa wysokości nadwozia w układzie auta (siatka co 1 dm), liczona raz na model promieniami z góry
const CELL = 1;
const maps = new Map();
const ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0), from = new THREE.Vector3();

function buildMap(model) {
  const [hx, hz] = model.hit.box, nx = Math.ceil(2 * hx / CELL) + 1, nz = Math.ceil(2 * hz / CELL) + 1;
  const h = new Float32Array(nx * nz), body = rig.children[0];              // [0] = bryła auta, [1] = cień
  const c = Math.cos(st.psi), s = Math.sin(st.psi);
  rig.updateMatrixWorld(true);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const lx = -hx + i * CELL, lz = -hz + j * CELL;
    from.set(rig.position.x + lx * c + lz * s, rig.position.y + 60, rig.position.z - lx * s + lz * c);
    ray.set(from, down);
    const hit = ray.intersectObject(body, true)[0];
    h[i * nz + j] = hit ? hit.point.y - rig.position.y : 0;
  }
  return { h, nx, nz, hx, hz };
}

// wysokość wierzchu auta nad punktem (x, z) albo 0 poza obrysem
export function carTopAt(x, z) {
  const m = active.model;
  if (!maps.has(m.id)) maps.set(m.id, buildMap(m));
  const { h, nx, nz, hx, hz } = maps.get(m.id), { REAR } = active.geo, c = Math.cos(st.psi), s = Math.sin(st.psi);
  const dx = x - (st.x + c * REAR), dz = z - (st.z - s * REAR);
  const i = Math.round((dx * c - dz * s + hx) / CELL), j = Math.round((dx * s + dz * c + hz) / CELL);
  if (i < 0 || j < 0 || i >= nx || j >= nz) return 0;
  const top = h[i * nz + j];
  return top > 0 ? st.y + top : 0;
}
