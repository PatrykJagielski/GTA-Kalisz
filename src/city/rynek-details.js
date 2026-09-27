import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced } from '../core/geometry.js';
import { CURB } from './config.js';
import { RYNEK_PLAN } from './rynek-facades.js';
import { gridPut } from './spatial.js';

/* ---------- detale Rynku w 3D: opaski, parapety i naczółki okien, gzymsy, pilastry, balkony, ławki ---------- */
// Wymiary jak na teksturze elewacji (rynek-facades.js), przeliczone z pikseli osi okiennej na ułamek szerokości osi:
// okno 0,344 osi, opaska 0,055, naczółek 0,53. Wszystko wystaje z lica ściany, więc elewacja dostaje relief i cień.
const WIN = 0.344, JAMB = 0.055, PED = 0.53, FRAME = new THREE.Color('#f3f0e9');
const GLASS = (o = {}) => new THREE.MeshStandardMaterial({ color: 0x3c4c5a, roughness: 0.12, metalness: 0.55, ...o });
export const rynekGlowM = () => GLASS({ emissive: 0xffc070, emissiveIntensity: 0 });   // w sky.js razem z elewacjami Rynku
const unitTri = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-0.5, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0, 1)]), { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
const unitSeg = new THREE.ExtrudeGeometry(new THREE.Shape(Array.from({ length: 13 }, (_, i) => new THREE.Vector2(0.5 * Math.cos(Math.PI * i / 12), Math.sin(Math.PI * i / 12)))), { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);

// fronty: { x0, z0, x1, z1, nx, nz, len, axes, variant, col, bal, french }; glowM = materiał szyb zapalonych nocą
export function rynekFacadeDetails(fronts, glowM) {
  const L = { box: [], boxC: [], tri: [], triC: [], seg: [], segC: [], iron: [], glass: [], glow: [] };
  let n = 0;
  for (const F of fronts) {
    const P = RYNEK_PLAN[F.variant], tx = (F.x1 - F.x0) / F.len, tz = (F.z1 - F.z0) / F.len, ang = Math.atan2(-tz, tx), aw = F.len / F.axes;
    const light = F.col.clone().multiplyScalar(1.12), base = F.col.clone().multiplyScalar(0.78);
    const at = (t, o) => [F.x0 + tx * t + F.nx * o, F.z0 + tz * t + F.nz * o];
    // prostopadłościan: środek t wzdłuż ściany, szerokość w, wysokość y0..y1, głębokość d od lica przesuniętego o o
    const box = (t, w, y0, y1, d, o = 0, c = light) => {
      const [px, pz] = at(t, o + d / 2); L.box.push(M4(px, (y0 + y1) / 2, pz, ang, w, y1 - y0, d)); L.boxC.push(c);
    };
    const iron = (t, w, y0, y1, d, o) => { const [px, pz] = at(t, o + d / 2); L.iron.push(M4(px, (y0 + y1) / 2, pz, ang, w, y1 - y0, d)); };
    const prism = (list, cols, t, w, y, hgt, d) => { const [px, pz] = at(t, d / 2); list.push(M4(px, y, pz, ang, w, hgt, d)); cols.push(light); };
    // szyba (nie barwiona tynkiem, z odbiciem nieba) ze szprosami; część okien świeci nocą
    const pane = (t, w, y0, y1, transom) => {
      const [px, pz] = at(t, 0.25); (n++ * 7 % 10 < 4 ? L.glow : L.glass).push(M4(px, (y0 + y1) / 2, pz, ang, w, y1 - y0, 0.1));
      box(t, 0.5, y0, y1, 0.5, 0.2, FRAME); box(t, w, transom - 0.25, transom + 0.25, 0.5, 0.2, FRAME);
    };
    // gzymsy przez całą szerokość frontu: cokół, kordonowy nad parterem, koronujący pod dachem (dwa uskoki)
    box(F.len / 2, F.len, -2, 5, 0.8, 0, base);
    box(F.len / 2, F.len + 4, P.kordon, P.kordon + 5, 1.8);
    box(F.len / 2, F.len + 6, P.frieze + 5, P.frieze + 9, 2.6);
    box(F.len / 2, F.len + 10, P.frieze + 9, P.H + 1, 4.6);
    for (let k = 0; k <= F.axes; k++) {
      box(k * aw, 0.12 * aw, -2, P.kordon, 1.2);                                          // filary między witrynami
      if (P.pil) { box(k * aw, 0.11 * aw, P.kordon + 5, P.frieze - 4, 1); box(k * aw, 0.16 * aw, P.frieze - 5, P.frieze, 1.7); }
    }
    for (let k = 0; k < F.axes; k++) {
      const tc = (k + 0.5) * aw, w = WIN * aw, j = JAMB * aw, [s0, s1, arch] = P.shop;
      if (!arch) pane(tc, 0.62 * aw, s0, s1, s1 - 7);                                  // witryna sklepu
      P.floors.forEach(([y0, y1, ped], fl) => {
        pane(tc, w, y0, y1, y1 - (y1 - y0) * 0.3);
        box(tc - w / 2 - j / 2, j, y0 - 1.8, y1 + 2.5, 1); box(tc + w / 2 + j / 2, j, y0 - 1.8, y1 + 2.5, 1);   // opaska
        box(tc, w + 2 * j, y1, y1 + 2.5, 1);
        box(tc, w + 0.16 * aw, y0 - 3.2, y0 - 1.8, 2.6);                                  // parapet
        if (ped === 'tri') prism(L.tri, L.triC, tc, PED * aw, y1 + 2.5, 5.5, 1.6);
        if (ped === 'seg') prism(L.seg, L.segC, tc, PED * aw, y1 + 2.5, 3.8, 1.6);
        if (ped === 'hood') box(tc, PED * aw, y1 + 2.5, y1 + 4.8, 2.2);
        if (ped === 'key') box(tc, 2.4, y1 + 1, y1 + 5.2, 1.4);
        if (F.french && fl === 1) {                                                       // balustradka w oknie II piętra
          iron(tc, w, y0 + 6, y0 + 6.6, 0.5, 1.8);
          for (let s = -w / 2 + 0.8; s < w / 2; s += 1.4) iron(tc + s, 0.3, y0 - 1.8, y0 + 6, 0.3, 1.9);
        }
      });
    }
    // balkon na I piętrze: płyta na wspornikach, kuta balustrada; nad 3 środkowymi osiami (albo nad jedną w wąskim domu)
    if (F.bal) {
      const y = P.floors[0][0], nb = F.axes >= 5 ? 3 : 1, c0 = Math.floor((F.axes - nb) / 2), t0 = c0 * aw + 0.12 * aw, t1 = (c0 + nb) * aw - 0.12 * aw, D = 10;
      box((t0 + t1) / 2, t1 - t0, y - 3.8, y - 2, D);
      for (const t of nb > 1 ? [t0 + 2, (t0 + t1) / 2, t1 - 2] : [t0 + 2, t1 - 2]) box(t, 1.8, y - 9, y - 3.8, D - 2);
      iron((t0 + t1) / 2, t1 - t0, y + 7.4, y + 8.2, 0.8, D - 1);
      for (const t of [t0 + 0.4, t1 - 0.4]) iron(t, 0.8, y + 7.4, y + 8.2, D - 1, 0);
      for (let t = t0 + 0.4; t < t1; t += 1.3) iron(t, 0.35, y - 2, y + 7.4, 0.35, D - 0.8);
      for (let o = 1; o < D - 0.8; o += 1.3) for (const t of [t0 + 0.4, t1 - 0.4]) iron(t, 0.35, y - 2, y + 7.4, 0.35, o);
    }
  }
  const std = o => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, ...o });
  const stucco = std();
  return [instanced(new THREE.BoxGeometry(1, 1, 1), stucco, L.box, L.boxC), instanced(unitTri, stucco, L.tri, L.triC), instanced(unitSeg, stucco, L.seg, L.segC),
    instanced(new THREE.BoxGeometry(1, 1, 1), std({ color: 0x2a2c2f, roughness: 0.5, metalness: 0.5 }), L.iron),
    instanced(new THREE.BoxGeometry(1, 1, 1), GLASS(), L.glass), instanced(new THREE.BoxGeometry(1, 1, 1), glowM, L.glow)];
}

// ławki na płycie Rynku (lokalnie: u wzdłuż pierzei NW/SE, v w stronę SE; środek i osie jak RYNEK w rynek.js):
// rzędy wzdłuż donic z drzewami po obu stronach ratusza, zwrócone do ratusza, i krąg wokół okrągłego trawnika przed jego frontem
const ROWS = [-360, -200, -20, 155, 330], ROW_V = 232, CIRCLE = [-289, -10, 76];
function benchGeos() {
  const b = (w, h, d, x, y, z, rx = 0) => new THREE.BoxGeometry(w, h, d).rotateX(rx).translate(x, y, z);
  const wood = mergeGeometries([1.6, 0.2, -1.2].map(z => b(18, 0.4, 1.25, 0, 4.5, z)).concat([6.3, 8].map(y => b(18, 1.3, 0.35, 0, y, -2.35 - (y - 6.3) * 0.18, -0.18))));
  const iron = mergeGeometries([-7.6, 7.6].flatMap(x => [b(0.6, 4.4, 0.6, x, 2.2, 1.9), b(0.6, 4.4, 0.6, x, 2.2, -1.9), b(0.6, 0.5, 4.8, x, 6.6, 0.1),
    b(0.6, 5, 0.6, x, 6.5, -2.4, -0.18), b(0.6, 0.6, 4.2, x, 4.1, 0)]));
  return { wood, iron };
}
export function rynekBenches(R, solid) {
  const [ux, uz] = R.u, W = (pu, pv) => [R.c[0] + ux * pu - uz * pv, R.c[1] + uz * pu + ux * pv];
  const spots = [];                                                                      // [pu, pv, kierunek siedzenia (du, dv)]
  for (const u of ROWS) for (const s of [1, -1]) spots.push([u, s * ROW_V, 0, -s]);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6, cu = Math.cos(a), cv = Math.sin(a); spots.push([CIRCLE[0] + cu * CIRCLE[2], CIRCLE[1] + cv * CIRCLE[2], -cu, -cv]); }
  const mats = [];
  for (const [pu, pv, du, dv] of spots) {
    const [x, z] = W(pu, pv), fx = ux * du - uz * dv, fz = uz * du + ux * dv, a = Math.atan2(fx, fz);
    mats.push(M4(x, CURB, z, a));
    const lx = Math.cos(a), lz = -Math.sin(a), ring = [];                                   // obrys do kolizji: 1,9 × 0,7 m
    for (const [sx, sz] of [[-9.5, -3.5], [9.5, -3.5], [9.5, 3.5], [-9.5, 3.5]]) ring.push(x + lx * sx + fx * sz, z + lz * sx + fz * sz);
    const xs = ring.filter((_, i) => i % 2 === 0), zs = ring.filter((_, i) => i % 2 === 1), bb = [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)];
    gridPut(solid, bb[0], bb[1], bb[2], bb[3], { p: [ring], b: bb });
  }
  const { wood, iron } = benchGeos();
  return [instanced(wood, new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.8 }), mats),
    instanced(iron, new THREE.MeshStandardMaterial({ color: 0x26282b, roughness: 0.5, metalness: 0.5 }), mats)];
}
