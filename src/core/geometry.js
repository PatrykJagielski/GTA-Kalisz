import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ---------- pomocnicze bryły ---------- */
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function cyl(r, h, axis = 'y', seg = 32, r2 = r, open = false, t0 = 0, tl = Math.PI * 2) {
  const g = new THREE.CylinderGeometry(r, r2, h, seg, 1, open, t0, tl);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  return g;
}
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const rbox = (w, h, d, r = 0.05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
export function lathe(pts, seg = 40) { return new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); }
export function torus(R, r, axis = 'x', seg = 40) {
  const g = new THREE.TorusGeometry(R, r, 12, seg);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  if (axis === 'y') g.rotateX(Math.PI / 2);
  return g;
}
// orientacja walca wzdłuż odcinka a->b
export function rodBetween(a, b, r, seg = 16) {
  const A = V(...a), B = V(...b), d = B.clone().sub(A);
  const g = new THREE.CylinderGeometry(r, r, d.length(), seg);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
  g.applyQuaternion(q); const c = A.add(B).multiplyScalar(0.5); g.translate(c.x, c.y, c.z);
  return g;
}
// macierz instancji: pozycja, obrót wokół osi Y, skala
export const M4 = (x, y, z, ry = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), ry), V(sx, sy, sz));
export function instanced(geom, mat, list, colors) {
  const m = new THREE.InstancedMesh(geom, mat, Math.max(1, list.length));
  list.forEach((mx, i) => m.setMatrixAt(i, mx));
  if (colors) colors.forEach((c, i) => m.setColorAt(i, c));
  m.count = list.length; m.instanceMatrix.needsUpdate = true;
  return m;
}
