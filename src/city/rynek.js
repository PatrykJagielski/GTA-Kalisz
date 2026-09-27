import * as THREE from 'three';
import { M4, instanced } from '../core/geometry.js';
import { arrGeo, newArr, pushWalls } from './mesh.js';
import { roofShape } from './roofs.js';
import { rynekFacadeDetails, rynekGlowM } from './rynek-details.js';
import { RYNEK_H, RYNEK_VARIANTS, rynekFacade } from './rynek-facades.js';
import { rynekSquare } from './rynek-square.js';
import { rynekBenches, rynekCafes } from './rynek-street.js';
import { ringArea2 } from './spatial.js';

/* ---------- pierzeje Głównego Rynku: kamienice z lat 1919–1933 ---------- */
// Po zniszczeniu Kalisza w 1914 r. Rynek odbudowano z wyrównaną linią gzymsów i dachów oraz z uzgodnionymi kolorami
// elewacji. Według zdjęć Street View: parter ze sklepami i trzy piętra, stromy dach z czerwonej dachówki z lukarnami,
// wąskie kamienice po 4–7 osi w różnych kolorach tynku, kute balkony na kilku piętrach.
// Obrysy OSM często łączą kilka kamienic, więc długi front dzielony jest na odcinki po ok. 6 osi, każdy z własnym
// kolorem, wariantem elewacji i układem balkonów.
// Rynek (dm): środek, oś u wzdłuż pierzei NW i SE (na ENE), półwymiary do lica pierzei: 115 × 90 m
export const RYNEK = { c: [-12, 95], u: [0.75, -0.6615], half: [570, 455], tol: 45 };
const AXIS = 36, HOUSE = 6;                                                            // oś okienna 3,6 m, kamienica ok. 6 osi
// tynki ze zdjęć pierzei: krem, biel, ochra, brzoskwinia, brudny róż, pomarańcz, pistacja, róż, jasna żółć, szarobiały, mięta
const PALETTE = ['#f0e4c9', '#e7b865', '#f2efe7', '#efb993', '#c99a86', '#f0e4c9', '#eb9f5c', '#cfdcae', '#f2efe7', '#ecc0b8',
  '#f0dd9f', '#dfddd5', '#bfdcc0'];
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
  found.forEach((f, k) => { f.roof = new THREE.Color(TILES[(k * 5) % TILES.length]); plan.set(f.bi, f); });
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
  return { mats, glowM: rynekGlowM(), fronts: mats.map(() => newArr()), faces: [], houses: 0, dormers: [], dormerCol: [], dormerRoof: [] };
}

// kamienica przy Rynku: front z elewacją rynkową (odcinki po ok. 6 osi), reszta ścian jak w starówce, dach mansardowy
// x = { kit, walls, gable, tiles, roofs, flatCol, pushPoly, inConvex }; zwraca punkty kalenicy (kominy)
const color = k => new THREE.Color(PALETTE[(k * 5) % PALETTE.length]).multiplyScalar(1.12);
export function rynekHouse(f, ring, free, x) {
  const h = RYNEK_H, y0 = -2, H = h - y0, sg = ringArea2(ring) > 0 ? 1 : -1, kit = x.kit, col = color(kit.houses);
  for (let i = 0; i < ring.length; i += 2) {
    if (!f.front[i / 2]) continue;
    const j = (i + 2) % ring.length, x0 = ring[i], z0 = ring[i + 1], len = Math.hypot(ring[j] - x0, ring[j + 1] - z0);
    const tx = (ring[j] - x0) / len, tz = (ring[j + 1] - z0) / len, nx = sg * tz, nz = -sg * tx;
    const axes = Math.max(1, Math.round(len / AXIS)), m = Math.max(1, Math.round(axes / HOUSE)), aw = len / axes;
    for (let s = 0, done = 0; s < m; s++) {
      const n = Math.floor(axes * (s + 1) / m) - done, k = kit.houses++, variant = (k * 3) % RYNEK_VARIANTS, c = color(k), A = kit.fronts[variant];
      const sx = x0 + tx * done * aw, sz = z0 + tz * done * aw, ex = sx + tx * n * aw, ez = sz + tz * n * aw, u1 = n / 4;
      const a = [sx, y0, sz, 0, 0], b = [ex, y0, ez, u1, 0], cc = [ex, h, ez, u1, 1], d = [sx, h, sz, 0, 1];
      for (const v of sg > 0 ? [a, cc, b, a, d, cc] : [a, b, cc, a, cc, d]) { A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz); A.uv.push(v[3], v[4]); A.col.push(c.r, c.g, c.b); }
      kit.faces.push({ x0: sx, z0: sz, x1: ex, z1: ez, nx, nz, len: n * aw, axes: n, variant, col: c, k });
      done += n;
    }
  }
  pushWalls(x.walls, ring, false, y0, h, (u, v) => [u / 160, 1 - (H - v) / 132], col, f.front);
  const { faces, gables, top } = roofShape(ring, free, h, 3.5, 62, { d: 6, s2: 0.75 });
  for (const fc of faces) x.pushPoly(fc.n[1] > 0.999 ? x.roofs : x.tiles, fc.pts, fc.n, fc.uv, fc.n[1] > 0.999 ? x.flatCol : f.roof);
  for (const q of gables) {                                                            // ściana ogniowa nad dachem niższego sąsiada
    const nx = q[1][2] - q[0][2], nz = -(q[1][0] - q[0][0]), l = Math.hypot(nx, nz) || 1;
    for (const s of [1, -1]) x.pushPoly(x.gable, q, [s * nx / l, 0, s * nz / l], q.map(() => [0.01, 0.01]), FIREWALL);
  }
  // lukarny w dolnej, stromej połaci mansardy: po jednej na oś, w osi okien
  for (const fc of faces) {
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

// lukarny mansardowe (lokalnie: +x na zewnątrz, 0 = lico ściany na wysokości okapu), detale elewacji, ławki, ogródki,
// fortepian ze sceną i namioty The Jack
export function rynekMeshes(kit, add, solid) {
  kit.mats.forEach((m, v) => add(arrGeo(kit.fronts[v]), m));
  const std = o => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, ...o });
  const body = new THREE.BoxGeometry(12, 15, 13).translate(-8.5, 12.5, 0);
  const win = new THREE.PlaneGeometry(8, 10).rotateY(Math.PI / 2).translate(-2.45, 12, 0);
  const cap = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-8, 20), new THREE.Vector2(8, 20), new THREE.Vector2(0, 26)]), { depth: 18.5, bevelEnabled: false })
    .rotateY(Math.PI / 2).translate(-20, 0, 0);
  return [instanced(body, std(), kit.dormers, kit.dormerCol), instanced(win, std({ color: 0x34475a, roughness: 0.3 }), kit.dormers),
    instanced(cap, std({ roughness: 0.9 }), kit.dormers, kit.dormerRoof), ...rynekFacadeDetails(kit.faces, kit.glowM),
    ...rynekBenches(RYNEK, solid), ...rynekCafes(kit.faces, solid), ...rynekSquare(RYNEK, solid)];
}
