import * as THREE from 'three';
import { cyl, lathe, rbox, torus } from '../core/geometry.js';
import { bodyMat, tireM, trimM } from './materials.js';

/* ---------- koła: opona, felga, tarcza i zacisk ---------- */
// w = koła modelu: tire (profil opony [promień, szerokość]), rimR i width (bęben felgi), lipZ, wellZ, discR, caliper,
// rimM (materiał felgi), face(group, strona) dodaje czoło felgi: ramiona, piastę, dekielek
export function buildWheels(car, C, w) {
  const wheelGroups = [];                 // { w: skręt, spin: obrót koła, front }
  for (const x of [C.axF, C.axR]) for (const s of [-1, 1]) {
    const g = new THREE.Group(); g.position.set(x, C.wr, s * C.trackZ);
    const t = lathe(w.tire, 56); t.rotateX(Math.PI / 2);
    g.add(new THREE.Mesh(t, tireM));
    const barrel = new THREE.Mesh(cyl(w.rimR, w.width, 'z', 56, w.rimR, true), w.rimM); g.add(barrel);
    const lip = new THREE.Mesh(torus(w.rimR - 0.03, 0.07, 'z', 56), w.rimM); lip.position.z = s * w.lipZ; g.add(lip);
    const well = new THREE.Mesh(cyl(w.rimR - 0.08, 0.05, 'z', 48), trimM); well.position.z = s * w.wellZ; g.add(well);
    w.face(g, s);
    const disc = new THREE.Mesh(cyl(w.discR, 0.28, 'z', 44), bodyMat({ color: 0x80868c, metalness: 0.9, roughness: 0.45 })); disc.position.z = s * 0.05; g.add(disc);
    const spin = new THREE.Group(); [...g.children].forEach(c => spin.add(c)); g.add(spin);   // zacisk nie obraca się z kołem
    const [cw, ch, cd, cx, cy] = w.caliper;
    const cal = new THREE.Mesh(rbox(cw, ch, cd, 0.12), w.caliperM || trimM); cal.position.set(x > 0 ? -cx : cx, cy, s * 0.12); g.add(cal);
    car.add(g); wheelGroups.push({ w: g, spin, front: x > 0 });
  }
  return wheelGroups;
}
