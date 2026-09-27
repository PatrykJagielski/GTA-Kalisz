import * as THREE from 'three';
import { M4, instanced } from '../core/geometry.js';
import { rng } from '../core/random.js';
import { PAL, facade, oldFacade, tileTex } from './facades.js';
import { NAR } from './landmarks/narozna.js';
import { arrGeo, newArr, pushRoof, pushWalls } from './mesh.js';
import { roofShape } from './roofs.js';
import { rynekHouse, rynekKit, rynekMeshes, rynekPlan } from './rynek.js';
import { cellOf, gridPut, indexPolys, polyHas, ringArea2, ringBox } from './spatial.js';

/* ---------- zwykłe budynki: ściany z oknami, dachy spadziste albo płaskie, lukarny i kominy ---------- */
const OLD_TOWN = 6000;                          // dm od Głównego Rynku: kamienice starówki i śródmieścia

// które krawędzie obrysu są wolne (od ulicy, podwórka), a które przylegają do sąsiedniego budynku (ściana wspólna);
// off = jak daleko za ścianą szukać sąsiada (dm), przy Rynku dalej, bo obrysy sąsiednich kamienic nie zawsze się stykają
function freeEdges(ring, self, index, off = 4) {
  const s = ringArea2(ring) > 0 ? 1 : -1, free = [];
  for (let i = 0; i < ring.length; i += 2) {
    const j = (i + 2) % ring.length, dx = ring[j] - ring[i], dz = ring[j + 1] - ring[i + 1], len = Math.hypot(dx, dz) || 1;
    const ox = s * dz / len * off, oz = -s * dx / len * off;
    let hits = 0;
    for (const t of [0.2, 0.5, 0.8]) {
      const x = ring[i] + dx * t + ox, z = ring[i + 1] + dz * t + oz;
      for (const { p, b } of cellOf(index, x, z)) if (p[0] !== self && x > b[0] && x < b[2] && z > b[1] && z < b[3] && polyHas(p, x, z)) { hits++; break; }
    }
    free.push(hits < 2);
  }
  return free;
}
// wielokąt wypukły (x, z) zawiera punkt
const inConvex = (pts, x, z) => {
  let sgn = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], c = (b[0] - a[0]) * (z - a[2]) - (b[2] - a[2]) * (x - a[0]);
    if (Math.abs(c) < 1e-6) continue;
    if (sgn && Math.sign(c) !== sgn) return false; sgn = Math.sign(c);
  }
  return true;
};
function pushPoly(A, pts, n, uv, col) {                                                  // wielokąt wypukły jako wachlarz trójkątów
  for (let i = 1; i + 1 < pts.length; i++) {
    let tri = [0, i, i + 1];
    const [a, b, c] = tri.map(k => pts[k]);
    const cx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), cy = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), cz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cx * n[0] + cy * n[1] + cz * n[2] < 0) tri = [0, i + 1, i];
    for (const k of tri) { A.pos.push(...pts[k]); A.nor.push(...n); A.uv.push(...uv[k]); A.col.push(col.r, col.g, col.b); }
  }
}

export function buildBuildings(D, R, add) {
  const RR = rng(1257);                                                                    // osobne losowanie: reszta miasta bez zmian
  const rings = D.buildings.map(b => b.slice(3)), index = indexPolys(rings.map(r => [r]));
  const solid = new Map(), bArr = [newArr(), newArr(), newArr(), newArr()], roofs = newArr(), tiles = newArr();
  const winUV = (u, v) => [u / 160, v / 132], blankUV = () => [0.01, 0.01];
  const dormers = [], dormerCol = [], dormerRoof = [], chimneys = [], chimneyCol = [];
  const flatCol = new THREE.Color('#5d6266'), brick = [new THREE.Color('#8b4c3b'), new THREE.Color('#9a5a45'), new THREE.Color('#c9c0b0')];
  const chimneysOn = top => {                                                              // kominy na kalenicy
    for (let k = top.length ? 1 + Math.floor(RR() * 2) : 0; k > 0; k--) {
      const p = top[Math.floor(RR() * top.length)];
      chimneys.push(M4(p[0], p[1] - 6, p[2], RR() * 3)); chimneyCol.push(brick[Math.floor(RR() * brick.length)]);
    }
  };
  const rynek = rynekPlan(rings), kit = rynekKit();
  const RX = { kit, walls: bArr[3], gable: bArr[2], tiles, roofs, flatCol, pushPoly, inConvex };
  let narRing = null;
  D.buildings.forEach((b, bi) => {
    const h = b[0], minh = b[1], kind = b[2], ring = rings[bi];
    if (ring[0] === NAR.first[0] && ring[1] === NAR.first[1]) { narRing = ring; return; }   // kamienica na rogu: model osobny
    const [bx0, bz0, bx1, bz1] = ringBox(ring), area = Math.abs(ringArea2(ring)) / 2;
    const pitched = minh === 0 && (kind === 1 || (kind === 0 && h <= 170 && area <= 150000));
    const old = pitched && kind === 0 && Math.hypot((bx0 + bx1) / 2, (bz0 + bz1) / 2) < OLD_TOWN;
    const r1 = R(), r2 = R(), walls = old ? PAL.old : PAL.wall[kind], roofPal = pitched ? PAL.tiles : PAL.roof[kind];
    const col = new THREE.Color(walls[Math.floor(r1 * walls.length)]), roof = new THREE.Color(roofPal[Math.floor(r2 * roofPal.length)]);
    if (rynek.has(bi)) {                                                                   // pierzeje Głównego Rynku: model osobny
      gridPut(solid, bx0, bz0, bx1, bz1, { p: [ring], b: [bx0, bz0, bx1, bz1] });
      chimneysOn(rynekHouse(rynek.get(bi), ring, freeEdges(ring, ring, index, 12), RX)); return;
    }
    const y0 = minh > 0 ? minh : -2, arr = old ? bArr[3] : kind === 3 ? bArr[1] : kind === 2 ? bArr[2] : bArr[0];
    const H = h - y0, topUV = (u, v) => [u / 160, 1 - (H - v) / 132];                    // kamienica: okna liczone od okapu
    pushWalls(arr, ring, false, y0, h, old ? topUV : kind === 2 ? blankUV : winUV, col);
    if (minh < 25) gridPut(solid, bx0, bz0, bx1, bz1, { p: [ring], b: [bx0, bz0, bx1, bz1] });
    if (!pitched) { pushRoof(roofs, ring, h, roof); return; }

    const slope = kind === 1 ? 0.9 : 0.72 + RR() * 0.22, rise = kind === 1 ? 50 : 55 + RR() * 30;
    const { faces, gables, top } = roofShape(ring, freeEdges(ring, ring, index), h, slope, rise);
    for (const f of faces) pushPoly(f.n[1] > 0.999 ? roofs : tiles, f.pts, f.n, f.uv, f.n[1] > 0.999 ? flatCol : roof);
    for (const q of gables) {
      const nx = (q[1][2] - q[0][2]), nz = -(q[1][0] - q[0][0]), l = Math.hypot(nx, nz) || 1;
      pushPoly(bArr[2], q, [nx / l, 0, nz / l], q.map(() => [0.01, 0.01]), col);          // szczyt: gładki tynk, strona dobrana w pushPoly
      pushPoly(bArr[2], q, [-nx / l, 0, -nz / l], q.map(() => [0.01, 0.01]), col);
    }
    // lukarny w długich połaciach kamienic, rozstawione co ok. 3,5 m
    if (old && RR() < 0.65) for (const f of faces) {
      const e = f.edge; if (!e || e.len < 50) continue;
      const cnt = Math.floor((e.len - 14) / 34), step = (e.len - 14) / Math.max(cnt, 1);
      for (let k = 0; k < cnt; k++) {
        const t = 7 + step * (k + 0.5), px = e.a[0] + e.tx * t + e.nx * 7, pz = e.a[1] + e.tz * t + e.nz * 7;
        if (!inConvex(f.pts, px, pz) || !inConvex(f.pts, px + e.nx * 20, pz + e.nz * 20)) continue;
        dormers.push(M4(px, h + slope * 7, pz, Math.atan2(e.nz, -e.nx))); dormerCol.push(col); dormerRoof.push(roof);
      }
    }
    chimneysOn(top);
  });
  const facM = new THREE.MeshStandardMaterial({ map: facade(false), vertexColors: true, roughness: 0.85, emissive: 0xffffff, emissiveMap: facade(false, true), emissiveIntensity: 0 });
  const glassM = new THREE.MeshStandardMaterial({ map: facade(true), vertexColors: true, roughness: 0.35, metalness: 0.3, emissive: 0xffffff, emissiveMap: facade(true, true), emissiveIntensity: 0 });
  const oldM = new THREE.MeshStandardMaterial({ map: oldFacade(false), vertexColors: true, roughness: 0.9, emissive: 0xffffff, emissiveMap: oldFacade(true), emissiveIntensity: 0 });
  add(arrGeo(bArr[0]), facM); add(arrGeo(bArr[1]), glassM); add(arrGeo(bArr[2]), facM); add(arrGeo(bArr[3]), oldM);
  add(arrGeo(roofs), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  add(arrGeo(tiles), new THREE.MeshStandardMaterial({ map: tileTex(), vertexColors: true, roughness: 0.92 }));
  // lukarna: korpus w kolorze elewacji, okno, daszek dwuspadowy w kolorze dachu (przód w +x, tył chowa się w połaci)
  const body = new THREE.BoxGeometry(24, 12, 11).translate(-12, 5, 0);
  const win = new THREE.PlaneGeometry(6.5, 7).rotateY(Math.PI / 2).translate(0.05, 5, 0);
  const cap = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-7, 11), new THREE.Vector2(7, 11), new THREE.Vector2(0, 16)]), { depth: 25, bevelEnabled: false })
    .rotateY(Math.PI / 2).translate(-24, 0, 0);
  const white = () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const group = [instanced(body, white(), dormers, dormerCol), instanced(win, new THREE.MeshStandardMaterial({ color: 0x34475a, roughness: 0.3 }), dormers),
    instanced(cap, white(), dormers, dormerRoof), instanced(new THREE.BoxGeometry(5, 16, 6).translate(0, 8, 0), white(), chimneys, chimneyCol), ...rynekMeshes(kit, add, solid)];
  return { facM, glassM, oldM, rynekM: [...kit.mats, kit.glowM], narRing, solid, meshes: group };
}
