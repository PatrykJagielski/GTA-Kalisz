import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M4, instanced } from '../core/geometry.js';
import { arrGeo, newArr, pushWalls } from './mesh.js';
import { roofShape } from './roofs.js';
import { HOLE_H, RYNEK_H, RYNEK_VARIANTS, rynekFacade } from './rynek-facades.js';
import { ringArea2 } from './spatial.js';

/* ---------- pierzeje Głównego Rynku: kamienice z lat 1919–1933 i gmach Holewińskiego ---------- */
// Po zniszczeniu Kalisza w 1914 r. Rynek odbudowano z wyrównaną linią gzymsów i dachów oraz z uzgodnionymi kolorami
// elewacji: trzy kondygnacje (parter ze sklepami, dwa piętra), dach mansardowy z dachówki z lukarnami w każdej osi.
// Wyjątkiem jest pierzeja południowo-wschodnia od strony Rzeźniczej: gmach Józefa Holewińskiego (1921–1925,
// „monumentalny klasycyzm”) o czterech kondygnacjach, z kolumnami wielkiego porządku i balkonem nad parterem.
// Rynek (dm): środek, oś u wzdłuż pierzei NW i SE (na ENE), półwymiary do lica pierzei: 115 × 90 m
export const RYNEK = { c: [-12, 95], u: [0.75, -0.6615], half: [570, 455], tol: 45 };
const AXIS = 36, HOLE_AXIS = 40;                                                        // szerokość osi okiennej
// tynki wybrane z rynkowej palety: ochra, krem, łosoś, szarozielony, złamana biel, morela, szaroniebieski, róż, piasek
const PALETTE = ['#f2cd7c', '#f6e7c6', '#f0b99c', '#cfdcbd', '#f3efe6', '#f5cda0', '#d3dde2', '#f3d2c9', '#e6ca9b'];
const TILES = ['#9e3d22', '#a8452a', '#8f3a24', '#b0502e', '#94412a', '#a34a31'];
const FIREWALL = new THREE.Color('#b3aa9c');
const local = (x, z) => { const dx = x - RYNEK.c[0], dz = z - RYNEK.c[1], [ux, uz] = RYNEK.u; return [dx * ux + dz * uz, -dx * uz + dz * ux]; };

// budynki z przynajmniej jedną ścianą w licu pierzei; kolejność wzdłuż pierzei wybiera wariant elewacji i kolor sąsiadów
export function rynekPlan(rings) {
  const found = [], [ux, uz] = RYNEK.u, { half, tol } = RYNEK;
  rings.forEach((ring, bi) => {
    const s = ringArea2(ring) > 0 ? 1 : -1, front = [];
    let best = null;
    for (let i = 0; i < ring.length; i += 2) {
      const j = (i + 2) % ring.length, dx = ring[j] - ring[i], dz = ring[j + 1] - ring[i + 1], len = Math.hypot(dx, dz);
      let side = -1, q = 0;
      if (len >= 15) {
        const nx = s * dz / len, nz = -s * dx / len, nu = nx * ux + nz * uz, nv = -nx * uz + nz * ux;
        const [pu, pv] = local(ring[i] + dx / 2, ring[i + 1] + dz / 2);
        [[pu, pv, nu, 0], [-pu, pv, -nu, 0], [pv, pu, nv, 1], [-pv, pu, -nv, 1]].forEach(([p, lat, n, a], k) => {
          if (n < -0.95 && Math.abs(p - half[a]) < tol && Math.abs(lat) < half[1 - a] + 40) { side = k; q = lat; }
        });
      }
      front.push(side >= 0);
      if (side >= 0 && (!best || len > best.len)) best = { side, q, len, i };
    }
    if (best) found.push({ bi, front, ...best });
  });
  found.sort((a, b) => a.side - b.side || a.q - b.q);
  const plan = new Map();
  found.forEach((f, k) => {
    f.hole = f.side === 2 && f.len > 300;                                               // najdłuższy front pierzei SE
    f.variant = f.hole ? RYNEK_VARIANTS - 1 : (k * 3) % (RYNEK_VARIANTS - 1);
    f.col = new THREE.Color(f.hole ? '#efe6d2' : PALETTE[(k * 4) % PALETTE.length]).multiplyScalar(1.25);
    f.roof = new THREE.Color(TILES[(k * 5) % TILES.length]);
    plan.set(f.bi, f);
  });
  return plan;
}

// materiały i bufory dla wszystkich kamienic Rynku
export function rynekKit() {
  const mats = [];
  for (let v = 0; v < RYNEK_VARIANTS; v++) {
    const map = rynekFacade(v, false), lit = rynekFacade(v, true);
    for (const t of [map, lit]) t.wrapT = THREE.ClampToEdgeWrapping;
    mats.push(new THREE.MeshStandardMaterial({ map, vertexColors: true, roughness: 0.88, emissive: 0xffffff, emissiveMap: lit, emissiveIntensity: 0 }));
  }
  return { mats, fronts: mats.map(() => newArr()), dormers: [], dormerCol: [], dormerRoof: [], portico: [] };
}

// kamienica przy Rynku: front z elewacją rynkową, reszta ścian jak w starówce, dach mansardowy (gmach: kopertowy)
// x = { kit, walls, gable, tiles, roofs, flatCol, pushPoly, inConvex }; zwraca punkty kalenicy (kominy)
export function rynekHouse(f, ring, free, x) {
  const h = f.hole ? HOLE_H : RYNEK_H, y0 = -2, H = h - y0, col = f.col, A = x.kit.fronts[f.variant], sg = ringArea2(ring) > 0 ? 1 : -1;
  for (let i = 0; i < ring.length; i += 2) {
    if (!f.front[i / 2]) continue;
    const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], x1 = ring[j], z1 = ring[j + 1], len = Math.hypot(x1 - x0, z1 - z0);
    const u1 = Math.max(1, Math.round(len / (f.hole ? HOLE_AXIS : AXIS))) / 4, nx = sg * (z1 - z0) / len, nz = -sg * (x1 - x0) / len;
    const a = [x0, y0, z0, 0, 0], b = [x1, y0, z1, u1, 0], c = [x1, h, z1, u1, 1], d = [x0, h, z0, 0, 1];
    for (const v of sg > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) { A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz); A.uv.push(v[3], v[4]); A.col.push(col.r, col.g, col.b); }
    if (f.hole && i === f.i) x.kit.portico.push([x0, z0, x1, z1, nx, nz]);
  }
  pushWalls(x.walls, ring, false, y0, h, (u, v) => [u / 160, 1 - (H - v) / 132], col, f.front);
  const { faces, gables, top } = f.hole ? roofShape(ring, free, h, 0.75, 55) : roofShape(ring, free, h, 3.5, 44, { d: 6, s2: 0.42 });
  for (const fc of faces) x.pushPoly(fc.n[1] > 0.999 ? x.roofs : x.tiles, fc.pts, fc.n, fc.uv, fc.n[1] > 0.999 ? x.flatCol : f.roof);
  for (const q of gables) {                                                            // ściana ogniowa nad dachem niższego sąsiada
    const nx = q[1][2] - q[0][2], nz = -(q[1][0] - q[0][0]), l = Math.hypot(nx, nz) || 1;
    for (const s of [1, -1]) x.pushPoly(x.gable, q, [s * nx / l, 0, s * nz / l], q.map(() => [0.01, 0.01]), FIREWALL);
  }
  // lukarny w dolnej, stromej połaci mansardy: po jednej na oś, w osi okien
  if (!f.hole) for (const fc of faces) {
    const e = fc.edge; if (!fc.low || !e || e.len < 30) continue;
    const cnt = Math.max(1, Math.round(e.len / AXIS));
    for (let k = 0; k < cnt; k++) {
      const t = (k + 0.5) * e.len / cnt, px = e.a[0] + e.tx * t, pz = e.a[1] + e.tz * t;
      if (!x.inConvex(fc.pts, px + e.nx * 4 - e.tx * 8, pz + e.nz * 4 - e.tz * 8) || !x.inConvex(fc.pts, px + e.nx * 4 + e.tx * 8, pz + e.nz * 4 + e.tz * 8)) continue;
      x.kit.dormers.push(M4(px, h, pz, Math.atan2(e.nz, -e.nx))); x.kit.dormerCol.push(col); x.kit.dormerRoof.push(f.roof);
    }
  }
  return top;
}

// lukarny mansardowe (lokalnie: +x na zewnątrz, 0 = lico ściany na wysokości okapu) i kolumnada gmachu Holewińskiego
export function rynekMeshes(kit, add) {
  kit.mats.forEach((m, v) => add(arrGeo(kit.fronts[v]), m));
  const std = o => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, ...o });
  const body = new THREE.BoxGeometry(12, 15, 13).translate(-8.5, 12.5, 0);
  const win = new THREE.PlaneGeometry(8, 10).rotateY(Math.PI / 2).translate(-2.45, 12, 0);
  const cap = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-8, 20), new THREE.Vector2(8, 20), new THREE.Vector2(0, 26)]), { depth: 18.5, bevelEnabled: false })
    .rotateY(Math.PI / 2).translate(-20, 0, 0);
  const out = [instanced(body, std(), kit.dormers, kit.dormerCol), instanced(win, std({ color: 0x34475a, roughness: 0.3 }), kit.dormers),
    instanced(cap, std({ roughness: 0.9 }), kit.dormers, kit.dormerRoof)];
  const stone = [], cols = [];
  for (const [x0, z0, x1, z1, nx, nz] of kit.portico) {
    const len = Math.hypot(x1 - x0, z1 - z0), tx = (x1 - x0) / len, tz = (z1 - z0) / len, ang = Math.atan2(-tz, tx);
    const w = Math.min(len * 0.55, 6 * HOLE_AXIS), mid = len / 2, at = (t, o) => [x0 + tx * t + nx * o, z0 + tz * t + nz * o];
    const slab = (t0, t1, o0, o1, y0, y1) => { const [cx, cz] = at((t0 + t1) / 2, (o0 + o1) / 2); stone.push(new THREE.BoxGeometry(t1 - t0, y1 - y0, o1 - o0).rotateY(ang).translate(cx, (y0 + y1) / 2, cz)); };
    slab(mid - w / 2 - 6, mid + w / 2 + 6, 0, 15, 52, 57);                               // balkon nad parterem
    slab(mid - w / 2 - 6, mid + w / 2 + 6, 13.5, 15, 57, 67);                            // balustrada
    slab(mid - w / 2 - 4, mid + w / 2 + 4, 0, 13, 152, 165);                             // belkowanie
    for (let k = 0; k <= 6; k++) {
      const t = mid - w / 2 + k * w / 6, [cx, cz] = at(t, 7.5);
      cols.push(new THREE.CylinderGeometry(2.9, 3.4, 92, 14).translate(cx, 57 + 46, cz));
      slab(t - 5, t + 5, 2.5, 12.5, 57, 60); slab(t - 5, t + 5, 2.5, 12.5, 148, 152);       // baza i głowica
      slab(t - 2, t + 2, 0, 10, 46, 52);                                             // wspornik pod balkonem
    }
  }
  if (stone.length) { add(mergeGeometries(stone), std({ color: 0xf3efe6 })); add(mergeGeometries(cols), std({ color: 0xf6f3ec, roughness: 0.7 })); }
  return out;
}
