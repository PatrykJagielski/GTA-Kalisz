import * as THREE from 'three';
import { cyl } from '../../../core/geometry.js';
import { rimM, roundelM } from './materials.js';

/* ---------- felga 18" z pięcioma wygiętymi ramionami (wzór „turbina” z serii 6) ---------- */
// czoło felgi: tarcza z pięcioma otworami w kształcie płatków skręconych wokół osi
function faceGeometry() {
  const R = 2.2, shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI * 2, false);
  const r0 = 0.78, r1 = 1.98, twist = 0.55, N = 12;
  for (let i = 0; i < 5; i++) {
    const base = i / 5 * Math.PI * 2;
    const ang = (r, side) => base + twist * (r - r0) / (r1 - r0) + side * (0.2 + 0.36 * ((r - r0) / (r1 - r0)) ** 0.8);
    const pts = [];
    for (let k = 0; k <= N; k++) { const r = r0 + (r1 - r0) * k / N; pts.push([r, ang(r, -1)]); }
    for (let k = 1; k < N; k++) { const a = ang(r1, -1) + (ang(r1, 1) - ang(r1, -1)) * k / N; pts.push([r1 + 0.04 * Math.sin(Math.PI * k / N), a]); }
    for (let k = N; k >= 0; k--) { const r = r0 + (r1 - r0) * k / N; pts.push([r, ang(r, 1)]); }
    const hole = new THREE.Path(pts.map(([r, a]) => new THREE.Vector2(r * Math.cos(a), r * Math.sin(a))));
    shape.holes.push(hole);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: 48 });
  g.translate(0, 0, -0.08);
  return g;
}
const FACE = faceGeometry();
export function bmwRimFace(w, s) {
  const face = new THREE.Mesh(FACE, rimM); face.position.z = s * 0.86; if (s < 0) face.rotation.y = Math.PI; w.add(face);
  const hub = new THREE.Mesh(cyl(0.72, 0.45, 'z', 36), rimM); hub.position.z = s * 0.72; w.add(hub);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), roundelM); cap.position.z = s * 1.03; if (s < 0) cap.rotation.y = Math.PI; w.add(cap);
}
