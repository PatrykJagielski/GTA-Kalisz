import * as THREE from 'three';
import { cyl } from '../../../core/geometry.js';
import { circle, rect, strip } from '../../decals.js';
import { amberM, chromeM, lampM, redM, trimM } from '../../materials.js';
import { rounded } from './front.js';
import { plateRearM, roundelM } from './materials.js';

/* ---------- tył E63: szerokie lampy, tablica w klapie, logo, dyfuzor i dwie końcówki wydechu ---------- */
export function buildRear(car, P, { faceDecal }) {
  // lampy: wąskie na klapie, wysokie na błotnikach i zawinięte na bok
  const tailL = rounded([[3.2, 9.85], [6.3, 10.05], [8.3, 9.98], [9.05, 9.6], [9.15, 8.8], [8.9, 8.1], [8.1, 7.95], [7.2, 8.5], [5.0, 8.85], [3.2, 9.1]], 0.25, 3);
  faceDecal(tailL, false, 0.04, redM);
  faceDecal(rounded([[3.5, 9.25], [6.0, 9.08], [6.0, 9.36], [3.5, 9.52]], 0.1, 2), false, 0.07, lampM);     // światło cofania
  faceDecal(rounded([[7.3, 8.85], [8.6, 8.5], [8.75, 8.88], [7.45, 9.15]], 0.1, 2), false, 0.07, amberM);   // kierunkowskaz
  faceDecal(strip([[3.4, 9.76], [6.3, 9.92], [8.2, 9.85], [8.85, 9.52]], 0.07), false, 0.08, chromeM);  // listwa w górnej części lampy
  // klapa bagażnika: szczelina, wnęka tablicy z oświetleniem, logo
  faceDecal(strip([[-3.9, 6.65], [3.9, 6.65]], 0.05), false, 0.02, trimM, false);
  faceDecal(rect(-2.6, 7.0, 2.6, 8.14), false, 0.05, plateRearM, false, [-2.6, 7.0, 2.6, 8.14]);
  faceDecal(rect(-2.9, 8.26, 2.9, 8.36), false, 0.05, chromeM, false);
  faceDecal(circle(0, 9.2, 0.38, 36), false, 0.05, roundelM, false, [-0.38, 8.82, 0.38, 9.58]);
  faceDecal(strip([[-9.0, 6.1], [9.0, 6.1]], 0.05), false, 0.02, trimM, false);             // krawędź zderzaka
  // zderzak: odblaski, czarny dyfuzor
  faceDecal(rect(7.0, 4.5, 8.3, 4.72), false, 0.03, redM);
  faceDecal(rect(-7.4, 3.05, 7.4, 3.75), false, 0.03, trimM, false);
  for (const s of [-1, 1]) {                                                       // końcówki wydechu V8 po obu stronach
    const x = P.surfX(s * 5.6, 3.1, false) + 0.25;
    const tip = new THREE.Mesh(cyl(0.4, 1.0, 'x', 28, 0.4, true), chromeM); tip.position.set(x, 3.05, s * 5.6); car.add(tip);
    const hole = new THREE.Mesh(cyl(0.32, 0.1, 'x', 24), trimM); hole.position.set(x - 0.3, 3.05, s * 5.6); car.add(hole);
  }
}
