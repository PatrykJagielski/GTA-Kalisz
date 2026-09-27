import * as THREE from 'three';
import { rbox, rodBetween } from '../../../core/geometry.js';
import { circle, decalsOn, rect, strip } from '../../decals.js';
import { loft } from '../../loft.js';
import { amberM, chromeM, glassM, lampM, redM, reflM, trimM } from '../../materials.js';
import { paint, plateFrontM, plateRearM } from './materials.js';

/* ---------- nadwozie Audi: bryła z szybami, grill, lampy, pierścienie, lusterka, wycieraczki ---------- */
export function buildBody(car, P) {
  const { C: CAR, roofFront: ROOF_FRONT, glassHalf, lowerHalf, sideZ, surfX } = P;
  const { faceDecal, sideDecal } = decalsOn(car, P);
  // kabina otwarta od góry między szybami, żeby przez okna było widać wnętrze
  const hiddenM = new THREE.MeshBasicMaterial({ visible: false });
  const inCabin = x => x > -16.2 && x < 9.2;
  loft(car, CAR.rear, CAR.front, 340, lowerHalf, (x, tag) => (tag === 'bot' ? 1 : tag === 'lid' && inCabin(x) ? 2 : 0), [paint, trimM, hiddenM]);
  loft(car, -16.7, 9.4, 200, glassHalf, (x, tag, t) => {
    if (tag === 'gbin') return 3;
    if (tag === 'gb' || tag === 'cap') return 2;
    if (tag === 'top') return t < 0.12 || (x <= ROOF_FRONT && x >= -10.3) ? 1 : 0;   // słupki A/C i dach w kolorze nadwozia
    if (t > 0.86) return 1;                                                  // rynienka dachu
    if (t < 0.1 || x > 8.0 || (x > -3.45 && x < -2.45)) return 2;            // uszczelka, trójkąt lusterka, słupek B
    if (x < -12.4) return 1;                                                 // szeroki słupek C
    return 0;
  }, [glassM, paint, trimM, hiddenM]);
  function rings(x, y, facing) {           // cztery pierścienie
    for (let i = 0; i < 4; i++) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, 10, 36), chromeM);
      t.position.set(x, y, (i - 1.5) * 0.52); t.rotation.y = Math.PI / 2; t.rotation.x = 0; if (facing) t.rotation.z = facing;
      car.add(t);
    }
  }

  // grill single-frame (węższy u góry, ścięte narożniki), chromowana ramka, poziome listwy
  const grillHalf = [[0, 7.38], [2.95, 7.38], [3.35, 7.05], [3.8, 3.55], [3.5, 3.05], [0, 3.05]];
  const grillOut = grillHalf.concat(grillHalf.slice(1, -1).reverse().map(([z, y]) => [-z, y]));
  const shrink = (pts, k) => { const cz = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; return pts.map(([z, y]) => [cz + (z - cz) * k, cy + (y - cy) * k]); };
  const grow = (pts, d) => pts.map(([z, y]) => [z + Math.sign(z) * d, y + (y > 5 ? d : -d)]);
  faceDecal(grow(grillOut, 0.16), true, 0.05, chromeM, false);
  faceDecal(grillOut, true, 0.09, trimM, false);
  for (let y = 3.5; y < 7.1; y += 0.42) {
    if (y > 3.6 && y < 5.0) continue;                   // miejsce na tablicę
    const k = (y - 3.05) / 4.33, hw = 3.7 - k * 0.55;
    faceDecal(rect(-hw, y, hw, y + 0.08), true, 0.13, chromeM, false);
  }
  faceDecal(rect(-2.6, 3.72, 2.6, 4.86), true, 0.17, plateFrontM, false, [-2.6, 3.72, 2.6, 4.86]);
  rings(surfX(0, 6.5, true) + 0.28, 6.55);
  // reflektory B7: kanciaste, zawinięte na bok
  const headL = [[3.7, 7.36], [6.4, 7.5], [7.9, 7.36], [8.6, 6.98], [8.45, 6.55], [7.2, 6.3], [5.2, 6.0], [3.8, 5.72]];
  faceDecal(headL, true, 0.03, trimM);
  faceDecal(shrink(headL, 0.88), true, 0.05, reflM);
  for (const [cz, cy, r] of [[4.7, 6.62, 0.44], [6.4, 6.8, 0.4]]) { faceDecal(circle(cz, cy, r), true, 0.07, chromeM); faceDecal(circle(cz, cy, r * 0.45), true, 0.09, trimM); }
  faceDecal([[7.25, 6.62], [8.2, 6.78], [8.2, 6.98], [7.25, 6.86]], true, 0.07, amberM);
  faceDecal(headL, true, 0.12, lampM);
  // wloty i halogeny w zderzaku
  const intake = [[4.6, 2.95], [7.2, 3.05], [7.6, 4.05], [4.85, 4.15]];
  faceDecal(intake, true, 0.04, trimM);
  faceDecal(circle(6.25, 3.6, 0.36), true, 0.07, reflM);
  faceDecal(circle(6.25, 3.6, 0.36), true, 0.1, lampM);
  faceDecal(rect(-3.3, 2.78, 3.3, 2.95), true, 0.04, trimM, false);

  // tył: lampy dzielone między klapę a błotnik, tablica na klapie, pierścienie
  const tailL = [[3.1, 9.95], [7.4, 9.98], [8.5, 9.7], [8.75, 9.2], [8.2, 8.75], [3.1, 8.95]];
  faceDecal(tailL, false, 0.04, redM);
  faceDecal([[3.3, 9.08], [5.2, 9.05], [5.2, 9.32], [3.3, 9.35]], false, 0.07, lampM);
  faceDecal([[5.25, 9.08], [6.4, 9.05], [6.4, 9.3], [5.25, 9.33]], false, 0.07, amberM);
  faceDecal(rect(5.58, 8.9, 5.66, 10.02), false, 0.09, trimM);
  faceDecal(rect(-2.6, 7.2, 2.6, 8.34), false, 0.05, plateRearM, false, [-2.6, 7.2, 2.6, 8.34]);
  faceDecal(rect(-3.0, 8.45, 3.0, 8.56), false, 0.05, chromeM, false);
  rings(surfX(0, 9.25, false) - 0.22, 9.25);
  faceDecal(rect(-6.8, 3.1, 6.8, 3.5), false, 0.03, trimM, false);
  faceDecal(rect(-7.0, 6.3, 7.0, 6.38), false, 0.03, trimM, false);

  // boki: szczeliny drzwi, klamki, listwa progowa
  sideDecal(strip([[9.35, 2.45], [9.35, 8.0], [9.2, 9.42]], 0.05), 0.02, trimM);
  sideDecal(strip([[-2.95, 2.45], [-2.95, 9.6]], 0.05), 0.02, trimM);
  sideDecal(strip([[-9.05, 2.45], [-9.05, 4.6], [-9.7, 6.0], [-10.9, 7.0], [-12.1, 8.0], [-12.35, 9.9]], 0.05), 0.02, trimM);
  sideDecal(strip([[-16.8, 8.3], [-15.4, 8.3], [-15.4, 9.15], [-16.8, 9.15], [-16.8, 8.3]], 0.04), 0.025, trimM, [1]);  // klapka wlewu tylko po prawej
  for (const x of [1.9, -8.3]) for (const s of [1, -1]) {
    const h = new THREE.Mesh(rbox(1.15, 0.3, 0.22, 0.1), paint); h.position.set(x, 9.05, s * (sideZ(x, 9.05) + 0.07)); car.add(h);
  }
  // lusterka z kierunkowskazem
  for (const s of [1, -1]) {
    const g = new THREE.Group(); g.position.set(8.35, 10.2, s * (CAR.W - 0.3)); car.add(g);
    const arm = new THREE.Mesh(rbox(0.9, 0.35, 0.8, 0.12), trimM); arm.position.set(0, -0.15, s * 0.3); g.add(arm);
    const shell = new THREE.Mesh(rbox(1.0, 0.82, 1.45, 0.3), paint); shell.position.set(-0.05, 0.1, s * 1.05); shell.rotation.y = s * 0.12; g.add(shell);
    const glass = new THREE.Mesh(rbox(0.06, 0.66, 1.25, 0.03), reflM); glass.position.set(-0.56, 0.1, s * 1.05); glass.rotation.y = s * 0.12; g.add(glass);
    const ind = new THREE.Mesh(rbox(0.5, 0.08, 0.9, 0.03), amberM); ind.position.set(0.15, -0.3, s * 1.2); g.add(ind);
  }
  // wycieraczki
  for (const z of [-3.9, 1.2]) car.add(new THREE.Mesh(rodBetween([9.0, 9.62, z - 2.6], [8.1, 10.25, z + 2.6], 0.06, 8), trimM));
}
