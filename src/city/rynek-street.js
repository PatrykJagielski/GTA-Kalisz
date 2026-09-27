import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced } from '../core/geometry.js';
import { CURB } from './config.js';
import { gridPut } from './spatial.js';

/* ---------- mała architektura Rynku: czerwone ławki na płycie i ogródki kawiarniane pod pierzejami ---------- */
const std = o => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
const b = (w, h, d, x, y, z, rx = 0) => new THREE.BoxGeometry(w, h, d).rotateX(rx).translate(x, y, z);
// krzesło kawiarniane (oparcie od strony -z)
export const chairGeo = () => mergeGeometries([b(3.8, 0.5, 3.8, 0, 4.4, 0), b(3.8, 4.2, 0.4, 0, 6.6, -1.9), ...[[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]].map(([x, z]) => b(0.35, 4.2, 0.35, x, 2.1, z))]);
// przeszkoda dla auta: prostokąt o środku (x, z), półwymiarach hx (wzdłuż lx, lz) i hz (wzdłuż fx, fz)
export function block(solid, x, z, lx, lz, fx, fz, hx, hz) {
  const ring = [];
  for (const [sx, sz] of [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]]) ring.push(x + lx * sx + fx * sz, z + lz * sx + fz * sz);
  const xs = ring.filter((_, i) => i % 2 === 0), zs = ring.filter((_, i) => i % 2 === 1), bb = [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)];
  gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
}

// ławki (lokalnie: u wzdłuż pierzei NW/SE, v w stronę SE; środek i osie jak RYNEK w rynek.js): rzędy wzdłuż donic
// z drzewami po obu stronach ratusza, zwrócone do ratusza (po stronie NW tylko za ratuszem: przed nim stoją scena
// z fortepianem i namioty The Jack), i krąg wokół okrągłego trawnika przed jego frontem.
// Na zdjęciach Street View: czerwone drewniane siedziska z oparciem na ciemnych nogach.
const ROWS = [-360, -200, -20, 155, 330], ROW_V = 232, CIRCLE = [-289, -10, 76];
export function rynekBenches(R, solid) {
  const [ux, uz] = R.u, W = (pu, pv) => [R.c[0] + ux * pu - uz * pv, R.c[1] + uz * pu + ux * pv];
  const spots = [];                                                                      // [pu, pv, kierunek siedzenia (du, dv)]
  for (const u of ROWS) for (const s of u > 0 ? [1, -1] : [1]) spots.push([u, s * ROW_V, 0, -s]);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6, cu = Math.cos(a), cv = Math.sin(a); spots.push([CIRCLE[0] + cu * CIRCLE[2], CIRCLE[1] + cv * CIRCLE[2], -cu, -cv]); }
  const mats = [];
  for (const [pu, pv, du, dv] of spots) {
    const [x, z] = W(pu, pv), fx = ux * du - uz * dv, fz = uz * du + ux * dv, a = Math.atan2(fx, fz);
    mats.push(M4(x, CURB, z, a));
    block(solid, x, z, Math.cos(a), -Math.sin(a), fx, fz, 9.5, 3.5);                     // 1,9 × 0,7 m
  }
  const wood = mergeGeometries([1.6, 0.2, -1.2].map(z => b(18, 0.4, 1.25, 0, 4.5, z)).concat([6.3, 8].map(y => b(18, 1.3, 0.35, 0, y, -2.35 - (y - 6.3) * 0.18, -0.18))));
  const iron = mergeGeometries([-7.6, 7.6].flatMap(x => [b(0.6, 4.4, 0.6, x, 2.2, 1.9), b(0.6, 4.4, 0.6, x, 2.2, -1.9), b(0.6, 0.5, 4.8, x, 6.6, 0.1),
    b(0.6, 5, 0.6, x, 6.5, -2.4, -0.18), b(0.6, 0.6, 4.2, x, 4.1, 0)]));
  return [instanced(wood, std({ color: 0xb4382c }), mats), instanced(iron, std({ color: 0x26282b, roughness: 0.5, metalness: 0.5 }), mats)];
}

// ogródki (fronty: co trzecia kamienica i odcinki z kamienice/spec.js): białe parasole nad stolikami, po cztery krzesła;
// cały ogródek jest przeszkodą
const DEPTH = 28, STEP = 45;                                                             // środek ogródka 2,8 m od lica, parasole co 4,5 m
export function rynekCafes(fronts, solid) {
  const umb = [], seats = [];
  for (const F of fronts) {
    if (F.len < 60) continue;
    const tx = (F.x1 - F.x0) / F.len, tz = (F.z1 - F.z0) / F.len, ang = Math.atan2(-tz, tx), cnt = Math.max(1, Math.floor((F.len - 20) / STEP));
    const at = (t, o) => [F.x0 + tx * t + F.nx * o, F.z0 + tz * t + F.nz * o], t0 = (F.len - (cnt - 1) * STEP) / 2;
    for (let i = 0; i < cnt; i++) {
      const [x, z] = at(t0 + i * STEP, DEPTH);
      umb.push(M4(x, CURB, z, ang));
      for (let c = 0; c < 4; c++) { const a = c * Math.PI / 2, [cx, cz] = at(t0 + i * STEP + Math.cos(a) * 7, DEPTH + Math.sin(a) * 7); seats.push(M4(cx, CURB, cz, ang + a + Math.PI / 2)); }
    }
    const [mx, mz] = at(F.len / 2, DEPTH);
    block(solid, mx, mz, tx, tz, F.nx, F.nz, ((cnt - 1) * STEP) / 2 + 20, 20);
  }
  const canopy = new THREE.ConeGeometry(19, 5, 4, 1).rotateY(Math.PI / 4).translate(0, 26.5, 0);
  const frame = mergeGeometries([new THREE.CylinderGeometry(0.5, 0.5, 26, 6).translate(0, 13, 0), new THREE.CylinderGeometry(3.6, 3.6, 0.5, 16).translate(0, 7.2, 0),
    new THREE.CylinderGeometry(0.4, 0.4, 7, 6).translate(0, 3.6, 0)]);
  return [instanced(canopy, std({ color: 0xf4f1e8, roughness: 0.9, side: THREE.DoubleSide }), umb), instanced(frame, std({ color: 0x33302c, roughness: 0.5, metalness: 0.4 }), umb),
    instanced(chairGeo(), std({ color: 0x6b4a2e }), seats)];
}
