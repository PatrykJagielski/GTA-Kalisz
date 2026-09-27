import * as THREE from 'three';
import { M4, instanced } from '../core/geometry.js';
import { RYNEK_PLAN } from './rynek-facades.js';

/* ---------- detale kamienic Rynku w 3D: opaski, parapety i naczółki okien, szyby, gzymsy, pilastry, balkony ---------- */
// Wymiary jak na teksturze elewacji (rynek-facades.js), przeliczone z pikseli osi okiennej na ułamek szerokości osi:
// okno 0,344 osi, opaska 0,055, naczółek 0,53. Wszystko wystaje z lica ściany, więc elewacja dostaje relief i cień.
const WIN = 0.344, JAMB = 0.055, PED = 0.53, FRAME = new THREE.Color('#f3f0e9');
const GLASS = (o = {}) => new THREE.MeshStandardMaterial({ color: 0x3c4c5a, roughness: 0.12, metalness: 0.55, ...o });
export const rynekGlowM = () => GLASS({ emissive: 0xffc070, emissiveIntensity: 0 });   // w sky.js razem z elewacjami Rynku
const unitTri = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-0.5, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0, 1)]), { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
const unitSeg = new THREE.ExtrudeGeometry(new THREE.Shape(Array.from({ length: 13 }, (_, i) => new THREE.Vector2(0.5 * Math.cos(Math.PI * i / 12), Math.sin(Math.PI * i / 12)))), { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);

// układy balkonów ze zdjęć pierzei, po jednym na kamienicę (k % 5): [piętro, pierwsza oś, liczba osi] dla balkonów
// (oś ujemna = od końca, 'mid' = środek) i piętra z balustradkami w oknach
const BALCONIES = [
  { bal: [[0, 'mid', 1], [1, 'mid', 1], [2, 'mid', 1]], french: [] },                        // pionem w osi środkowej
  { bal: [[0, 'mid', 3]], french: [1] },                                                    // długi na I piętrze
  { bal: [[0, 0, 1], [0, -1, 1], [1, 0, 1], [1, -1, 1]], french: [2] },                     // w skrajnych osiach
  { bal: [[1, 'mid', 1], [2, 'mid', 1]], french: [0] },
  { bal: [[0, 'mid', 1]], french: [1, 2] },
];
// fronty: { x0, z0, x1, z1, nx, nz, len, axes, variant, col, k }; glowM = materiał szyb zapalonych nocą
export function rynekFacadeDetails(fronts, glowM) {
  const L = { box: [], boxC: [], tri: [], triC: [], seg: [], segC: [], iron: [], glass: [], glow: [] };
  let n = 0;
  for (const F of fronts) {
    const P = RYNEK_PLAN[F.variant], tx = (F.x1 - F.x0) / F.len, tz = (F.z1 - F.z0) / F.len, ang = Math.atan2(-tz, tx), aw = F.len / F.axes;
    const light = F.col.clone().multiplyScalar(1.12), base = F.col.clone().multiplyScalar(0.78), lay = BALCONIES[F.k % BALCONIES.length];
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
        if (lay.french.includes(fl)) {                                                    // balustradka w oknie
          iron(tc, w, y0 + 6, y0 + 6.6, 0.5, 1.8);
          for (let s = -w / 2 + 0.8; s < w / 2; s += 1.4) iron(tc + s, 0.3, y0 - 1.8, y0 + 6, 0.3, 1.9);
        }
      });
    }
    // balkony: płyta na wspornikach, kuta balustrada
    for (const [fl, first, want] of lay.bal) {
      const nb = Math.min(want, F.axes >= 3 ? want : 1), c0 = first === 'mid' ? Math.floor((F.axes - nb) / 2) : first < 0 ? F.axes + first : first;
      if (F.axes < 2 && first !== 'mid') continue;
      const y = P.floors[fl][0], t0 = c0 * aw + 0.12 * aw, t1 = (c0 + nb) * aw - 0.12 * aw, D = 11;
      box((t0 + t1) / 2, t1 + 1 - t0, y - 4.4, y - 2, D);
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
