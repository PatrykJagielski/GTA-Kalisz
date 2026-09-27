import * as THREE from 'three';
import { rbox, rodBetween } from '../../../core/geometry.js';
import { decalsOn, strip } from '../../decals.js';
import { loft } from '../../loft.js';
import { amberM, glassM, reflM, trimM } from '../../materials.js';
import { buildFront } from './front.js';
import { paint, roofGlassM } from './materials.js';
import { buildRear } from './rear.js';

/* ---------- nadwozie E63 coupé: bryła, szyby bez ramek, szyberdach, boki, lusterka, wycieraczki ---------- */
export function buildBody(car, P) {
  const { C, roofFront: RF, glassHalf, lowerHalf, sideZ } = P;
  const decals = decalsOn(car, P), { sideDecal } = decals;
  // kabina otwarta od góry między szybami, żeby przez okna było widać wnętrze
  const hiddenM = new THREE.MeshBasicMaterial({ visible: false });
  const inCabin = x => x > -16.9 && x < 7.2;
  loft(car, C.rear, C.front, 360, lowerHalf, (x, tag) => (tag === 'bot' ? 1 : tag === 'lid' && inCabin(x) ? 2 : 0), [paint, trimM, hiddenM]);
  // szyby: długa szyba drzwi bez ramki, trójkątna szyba za nią zakończona załamaniem słupka C
  const cEdge = t => -13.3 + t * 6.9;                // tylna krawędź szyb: od dołu ukośnie do dachu
  loft(car, -17.4, 7.4, 220, glassHalf, (x, tag, t) => {
    if (tag === 'gbin') return 4;
    if (tag === 'gb' || tag === 'cap') return 2;
    if (tag === 'top') {
      if (t < 0.12) return 1;                                                  // słupki A/C
      if (x <= RF && x >= -9.4) return t > 0.3 && x < 0.2 && x > -6.9 ? 3 : 1;   // dach z szyberdachem
      return 0;                                                                // szyba przednia / tylna
    }
    if (t > 0.86) return 1;                                                    // rynienka dachu
    if (t < 0.1 || x > 6.6 || (x > -6.05 && x < -5.8)) return 2;               // uszczelka, trójkąt lusterka, styk szyb
    return x < cEdge(t) ? 1 : 0;                                               // słupek C
  }, [glassM, paint, trimM, roofGlassM, hiddenM]);

  buildFront(car, P, decals);
  buildRear(car, P, decals);

  // boki: długie drzwi coupé, klamka, kierunkowskaz w błotniku, listwa progowa, wlew paliwa
  sideDecal(strip([[7.95, 2.6], [7.95, 8.2], [7.35, 9.3]], 0.05), 0.02, trimM);
  sideDecal(strip([[-5.75, 2.6], [-5.75, 8.8], [-5.95, 9.95]], 0.05), 0.02, trimM);
  sideDecal(strip([[-10.8, 3.25], [11.0, 3.25]], 0.04), 0.02, trimM);
  sideDecal([[10.3, 7.25], [12.5, 7.32], [12.5, 7.58], [10.3, 7.52]], 0.02, trimM);
  sideDecal([[11.6, 7.33], [12.35, 7.35], [12.35, 7.53], [11.6, 7.51]], 0.04, amberM);
  sideDecal(strip([[-16.0, 8.35], [-14.5, 8.35], [-14.5, 9.25], [-16.0, 9.25], [-16.0, 8.35]], 0.04), 0.025, trimM, [1]);   // klapka wlewu tylko po prawej
  for (const s of [1, -1]) {
    const x = -3.9, h = new THREE.Mesh(rbox(1.3, 0.3, 0.22, 0.1), paint); h.position.set(x, 8.8, s * (sideZ(x, 8.8) + 0.07)); car.add(h);
  }
  // lusterka na drzwiach, w kolorze nadwozia
  for (const s of [1, -1]) {
    const g = new THREE.Group(); g.position.set(6.55, 9.95, s * (C.W - 0.45)); car.add(g);
    const arm = new THREE.Mesh(rbox(1.0, 0.32, 0.8, 0.12), trimM); arm.position.set(0, -0.12, s * 0.3); g.add(arm);
    const shell = new THREE.Mesh(rbox(1.15, 0.86, 1.6, 0.36), paint); shell.position.set(-0.05, 0.12, s * 1.1); shell.rotation.y = s * 0.14; g.add(shell);
    const glass = new THREE.Mesh(rbox(0.06, 0.7, 1.38, 0.03), reflM); glass.position.set(-0.63, 0.12, s * 1.1); glass.rotation.y = s * 0.14; g.add(glass);
  }
  // wycieraczki
  for (const z of [-4.1, 1.1]) car.add(new THREE.Mesh(rodBetween([7.1, 9.5, z - 2.7], [6.1, 10.1, z + 2.7], 0.06, 8), trimM));
}
