import * as THREE from 'three';
import { fullLoop } from './profile.js';

/* ---------- bryła z przekrojów poprzecznych (nadwozie, szyby, podsufitka) ---------- */
// bryła z przekrojów: groupOf(x, znacznik, t) -> indeks materiału
export function loft(car, x0, x1, n, halfFn, groupOf, mats) {
  const pos = [], idx = mats.map(() => []);
  let len = 0;
  const loops = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, L = fullLoop(halfFn(x)); len = L.length; loops.push([x, L]);
    for (const [z, y] of L) pos.push(x, y, z);
  }
  for (let i = 0; i < n; i++) {
    const xm = (loops[i][0] + loops[i + 1][0]) / 2, L = loops[i][1];
    for (let j = 0; j < len; j++) {
      const a = i * len + j, b = i * len + (j + 1) % len, c = a + len, d = b + len;
      idx[groupOf(xm, L[j][2], L[j][3])].push(a, c, d, a, d, b);
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx.flat()); let s = 0;
  idx.forEach((a, k) => { g.addGroup(s, a.length, k); s += a.length; });
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, mats); car.add(mesh);
  // osobne zaślepki końców (bez uśredniania normalnych z bokami)
  for (const [x, L] of [loops[0], loops[n]]) {
    const cp = [], cy = L.reduce((s, p) => s + p[1], 0) / L.length;
    for (let j = 0; j < L.length; j++) { const p = L[j], q = L[(j + 1) % L.length]; cp.push(x, cy, 0, x, p[1], p[0], x, q[1], q[0]); }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.computeVertexNormals();
    car.add(new THREE.Mesh(cg, mats[groupOf(x, 'cap', 0)]));
  }
  return mesh;
}
