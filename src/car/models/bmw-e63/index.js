import { buildInterior } from '../../interior.js';
import { buildBody } from './body.js';
import { PLATE, interiorM, rimM } from './materials.js';
import { bmwRimFace } from './wheels.js';

/* ================= BMW serii 6 E63 coupé (2004), 645Ci V8, ciemnoczerwony metalik ================= */
// jednostka = 1 dm; x wzdłuż auta (przód +), y w górę, z w bok (prawa +); środek auta w połowie długości
const L = 24.1, W = 9.275;
export const BMW_E63 = {
  id: 'bmw',
  name: 'BMW 645Ci', engine: 'E63 4.4 V8', plate: PLATE,
  // wymiary E63: dł. 4820 mm, szer. 1855 mm, wys. 1373 mm, rozstaw osi 2780 mm, rozstaw kół 1558/1582 mm, opony 245/45 R18
  dims: { front: L, rear: -L, W, axF: 15.3, axR: -12.5, wr: 3.39, archR: 3.8, trackZ: 7.85 },
  shape: {
    // długa maska, szyba nisko nad kabiną, krótka wypukła klapa bagażnika („bustle back”)
    top: [[-24.1, 7.0], [-24.05, 8.6], [-23.9, 9.6], [-23.5, 10.2], [-22.8, 10.45], [-21, 10.55], [-18.5, 10.45], [-17, 10.3], [-12, 9.9],
      [-6, 9.55], [0, 9.3], [6, 9.1], [7.4, 9.05], [10, 8.9], [13, 8.65], [16, 8.3], [19, 7.9], [21.5, 7.55], [23.0, 7.28], [23.6, 6.95], [23.95, 6.2], [24.1, 5.2]],
    shoulder: [[-24.1, 8.7], [-19, 9.2], [-8, 9.0], [5, 8.7], [15, 8.3], [24.1, 7.5]],
    base: [[-24.1, 3.6], [-23, 2.9], [-20.5, 2.3], [20, 2.25], [23.2, 2.6], [24.1, 3.2]],
    roof: [[-17.4, 10.27], [-15.8, 11.0], [-13.8, 11.9], [-11.5, 12.7], [-9, 13.25], [-6, 13.6], [-3.5, 13.73], [-1, 13.62], [0.8, 13.3],
      [2.5, 12.55], [4.4, 11.45], [6.0, 10.2], [7.4, 9.02]],
    roofFront: 0.9,
    nose: [18.0, 6.1, 3.0], tail: [17.6, 6.5, 2.6],
    glass: { inset: 1.05, tumble: 1.6, tumbleK: 0.38, crown: 0.5, crownK: 0.2 },
  },
  // 0–50 km/h 2,5 s, 0–100 km/h 5,6 s, 0–200 km/h ok. 22 s, elektroniczny ogranicznik 250 km/h
  perf: { grip: 61.5, power: 11100, roll: 6, air: 1.37e-5, vmax: 250 },
  // 6 biegów; zmiana w górę przy 6000 obr/min: 51, 89, 133, 180, 221 km/h
  gears: { ratios: [8.5, 14.8, 22.2, 30, 36.9, 43.4], up: 6000, down: 2000, idle: 700, max: 6500, launch: 1800, reverse: 8 },
  // dźwięk V8 z wałem krzyżowym: 8 zapłonów na cykl na przemian z dwóch rzędów, niski pomruk, bez turbo i klekotu
  sound: { fires: 8, bank: [1, 0.78, 1, 0.78, 0.78, 1, 0.78, 1], seed: 645, jitter: 0.02, decay: 20, tail: 2.2,
    tones: [[46, 1, 0], [92, 0.5, 0.9], [184, 0.22, 0.3], [368, 0.08, 1.2]], knock: 0.05, knockDecay: 700, clatter: 0.03, turbo: 0, lp: [320, 2600, 0.45] },
  eye: [[-1.8, 10.75, -3.7], [38, 9.2, -3.4]],
  hit: {
    cp: [[24.05, 8.8], [24.05, -8.8], [-24.05, 8.8], [-24.05, -8.8], [12, 9.2], [12, -9.2], [0, 9.2], [0, -9.2], [-12, 9.2], [-12, -9.2], [24.15, 0], [-24.15, 0]],
    box: [24.2, 9.3],
  },
  shadow: [1.05, 1.05],
  wheels: {
    tire: [[2.29, -1.15], [3.0, -1.22], [3.32, -1.05], [3.39, -0.5], [3.39, 0.5], [3.32, 1.05], [3.0, 1.22], [2.29, 1.15]],
    rimR: 2.29, width: 2.2, lipZ: 1.08, wellZ: 0.4, discR: 1.85, caliper: [0.8, 1.3, 0.62, 1.5, 0.35], rimM, face: bmwRimFace,
  },
  build(car, P) {
    buildBody(car, P);
    buildInterior(car, P, {
      m: interiorM, dx: -2.0, dy: -0.45, dashW: 14.8, screen: [6.1, 10.35, 0],
      dials: [[8, 0.5, 1, '1/min ×1000', 6.5], [260, 10, 40, 'km/h', 0]],
      rear: 'pair', rearX: -9.2,
      doors: [[0.9, 12.8], [-9.0, 6.0]], doorZ: 8.2,
      head: [-9.4, P.roofFront - 0.1], shelf: [-15.0, 10.1], floor: [-3.2, 19],
    });
  },
};
