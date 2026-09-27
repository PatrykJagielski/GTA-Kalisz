import * as THREE from 'three';
import { ringArea2 } from './spatial.js';

/* ---------- siatki z wielokątów OSM: powierzchnie płaskie, ściany, dachy ---------- */
// płaskie powierzchnie (jezdnia, chodniki, trawniki, woda) z triangulacji wielokątów z dziurami
export function flatGeo(list, y, uvScale) {
  const pos = [], uv = [];
  for (const p of list) {
    const rings = p.map(r => { const a = []; for (let i = 0; i < r.length; i += 2) a.push(new THREE.Vector2(r[i], r[i + 1])); return a; });
    const tris = THREE.ShapeUtils.triangulateShape(rings[0], rings.slice(1)), all = rings.flat();
    for (const [a, b, c] of tris) {
      const A = all[a], B = all[b], C = all[c];
      const up = (B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y) > 0;
      for (const P of up ? [A, B, C] : [A, C, B]) { pos.push(P.x, y, P.y); uv.push(P.x * uvScale, P.y * uvScale); }
    }
  }
  const g = new THREE.BufferGeometry(), n = new Float32Array(pos.length);
  for (let i = 1; i < n.length; i += 3) n[i] = 1;
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  return g;
}
// ściany wzdłuż pierścienia, skierowane na zewnątrz wielokąta (w dziurach: do środka dziury); skip[k] pomija krawędź k
export function pushWalls(A, ring, hole, y0, y1, uvFn, col, skip = null) {
  const f = (ringArea2(ring) > 0 ? 1 : -1) * (hole ? -1 : 1);
  let u = 0;
  for (let i = 0; i < ring.length; i += 2) {
    const x0 = ring[i], z0 = ring[i + 1], j = (i + 2) % ring.length, x1 = ring[j], z1 = ring[j + 1];
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
    if (len < 0.01) continue;
    const nx = f * dz / len, nz = -f * dx / len, u1 = u + len;
    if (skip && skip[i / 2]) { u = u1; continue; }
    const a = [x0, y0, z0, u, 0], b = [x1, y0, z1, u1, 0], c = [x1, y1, z1, u1, y1 - y0], d = [x0, y1, z0, u, y1 - y0];
    for (const v of f > 0 ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) {
      A.pos.push(v[0], v[1], v[2]); A.nor.push(nx, 0, nz);
      const t = uvFn(v[3], v[4]); A.uv.push(t[0], t[1]);
      if (A.col) A.col.push(col.r, col.g, col.b);
    }
    u = u1;
  }
}
export function pushRoof(A, ring, y, col) {
  const pts = []; for (let i = 0; i < ring.length; i += 2) pts.push(new THREE.Vector2(ring[i], ring[i + 1]));
  for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(pts, [])) {
    const P = pts[a], B = pts[b], C = pts[c], up = (B.y - P.y) * (C.x - P.x) - (B.x - P.x) * (C.y - P.y) > 0;
    for (const Q of up ? [P, B, C] : [P, C, B]) { A.pos.push(Q.x, y, Q.y); A.nor.push(0, 1, 0); A.uv.push(0.01, 0.01); A.col.push(col.r, col.g, col.b); }
  }
}
export function arrGeo(A) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(A.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(A.nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(A.uv, 2));
  if (A.col) g.setAttribute('color', new THREE.Float32BufferAttribute(A.col, 3));
  return g;
}
export const newArr = (col = true) => ({ pos: [], nor: [], uv: [], col: col ? [] : null });
