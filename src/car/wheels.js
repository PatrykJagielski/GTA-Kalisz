import * as THREE from 'three';
import { cyl, lathe, rbox, torus } from '../core/geometry.js';
import { CAR } from './dimensions.js';
import { bodyMat, rimM, tireM, trimM } from './materials.js';

export function buildWheels(car) {
  // koła 205/55 R16, felgi 5 podwójnych ramion, tarcze i zaciski
  const wheelGroups = [];                 // { w: skręt, spin: obrót koła, front }
  for (const x of [CAR.axF, CAR.axR]) for (const s of [-1, 1]) {
    const w = new THREE.Group(); w.position.set(x, CAR.wr, s * CAR.trackZ);
    const t = lathe([[2.03, -1.0], [2.85, -1.03], [3.1, -0.85], [3.16, -0.4], [3.16, 0.4], [3.1, 0.85], [2.85, 1.03], [2.03, 1.0]], 56); t.rotateX(Math.PI / 2);
    w.add(new THREE.Mesh(t, tireM));
    const barrel = new THREE.Mesh(cyl(2.03, 1.9, 'z', 56, 2.03, true), rimM); w.add(barrel);
    const lip = new THREE.Mesh(torus(2.0, 0.07, 'z', 56), rimM); lip.position.z = s * 0.92; w.add(lip);
    const well = new THREE.Mesh(cyl(1.95, 0.05, 'z', 48), trimM); well.position.z = s * 0.35; w.add(well);
    for (let i = 0; i < 5; i++) for (const d of [-0.13, 0.13]) {
      const a = i / 5 * Math.PI * 2 + d;
      const sp = new THREE.Mesh(rbox(0.26, 1.55, 0.18, 0.08), rimM);
      sp.position.set(Math.sin(a) * 1.08, Math.cos(a) * 1.08, s * 0.78); sp.rotation.z = -a; w.add(sp);
    }
    const hub = new THREE.Mesh(cyl(0.48, 0.25, 'z', 32), rimM); hub.position.z = s * 0.82; w.add(hub);
    const cap = new THREE.Mesh(cyl(0.3, 0.06, 'z', 24), trimM); cap.position.z = s * 0.96; w.add(cap);
    const disc = new THREE.Mesh(cyl(1.6, 0.28, 'z', 44), bodyMat({ color: 0x80868c, metalness: 0.9, roughness: 0.45 })); disc.position.z = s * 0.05; w.add(disc);
    const spin = new THREE.Group(); [...w.children].forEach(c => spin.add(c)); w.add(spin);   // zacisk nie obraca się z kołem
    const cal = new THREE.Mesh(rbox(0.7, 1.1, 0.55, 0.12), trimM); cal.position.set(x > 0 ? -1.3 : 1.3, 0.3, s * 0.12); w.add(cal);
    car.add(w); wheelGroups.push({ w, spin, front: x > 0 });
  }
  return wheelGroups;
}
