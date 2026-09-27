import * as THREE from 'three';
import { cyl, rbox } from '../../../core/geometry.js';
import { trimM } from '../../materials.js';
import { buildInterior } from '../../interior.js';
import { buildBody } from './body.js';
import { PLATE, interiorM, rimM } from './materials.js';

/* ================= Audi A4 B7 sedan (2005), 1.9 TDI, srebrny metalik ================= */
// jednostka = 1 dm; x wzdłuż auta (przód +), y w górę, z w bok (prawa +); środek auta w połowie długości
export const AUDI_A4 = {
  id: 'audi',
  name: 'Audi A4 B7', engine: '1.9 TDI', plate: PLATE,
  // wymiary B7 sedan: dł. 4586 mm, szer. 1772 mm, wys. 1427 mm, rozstaw osi 2648 mm, rozstaw kół 1522 mm
  dims: { front: 22.9, rear: -22.96, W: 8.86, axF: 13.6, axR: -12.88, wr: 3.16, archR: 3.72, trackZ: 7.61 },
  shape: {
    top: [[-22.96, 6.3], [-22.85, 7.6], [-22.6, 8.9], [-22.2, 9.75], [-21.6, 10.1], [-20, 10.22], [-16.6, 10.25], [-8, 10.02], [0, 9.82],
      [8.6, 9.56], [9.4, 9.5], [12, 9.28], [16, 8.86], [19.5, 8.3], [21.3, 7.85], [22.3, 7.3], [22.7, 6.6], [22.9, 5.8]],
    shoulder: [[-22.96, 8.4], [-18, 9.25], [0, 9.0], [15, 8.6], [22.9, 8.05]],
    base: [[-22.96, 3.0], [-21.5, 2.4], [-19.5, 2.1], [19.5, 2.1], [21.8, 2.3], [22.9, 2.75]],
    roof: [[-16.7, 10.12], [-14.8, 11.45], [-12.5, 12.95], [-10.4, 13.8], [-7, 14.15], [-3, 14.27], [0.5, 14.22], [2.4, 14.0], [4.8, 12.62], [7.4, 10.72], [9.4, 9.42]],
    roofFront: 2.6,                            // górna krawędź szyby przedniej / przód dachu
    nose: [15.5, 7.8, 2.6], tail: [16.5, 6.96, 2.7],     // zaokrąglenie narożników w rzucie z góry: początek, długość, wykładnik
    glass: { inset: 0.95, tumble: 1.25, tumbleK: 0.3, crown: 0.42, crownK: 0.22 },
  },
  // napęd (dm/s²): 0–50 km/h 3 s, 0–100 km/h 10 s, prędkość maksymalna ok. 212 km/h
  perf: { grip: 55.5, power: 5550, roll: 6, air: 9.55e-6 },
  // 5 biegów, km/h na 1000 obr/min; zmiana w górę przy 37, 68, 109, 152 km/h
  gears: { ratios: [9.5, 17.5, 28, 39, 50], up: 3900, down: 1500, idle: 850, max: 4700, launch: 1400, reverse: 9 },
  // dźwięk 1.9 TDI: 4 zapłony na cykl, klekot wtrysku pompowtryskiwaczy, świst turbo
  sound: { fires: 4, bank: [1], seed: 1896, jitter: 0.04, decay: 34, tail: 1.7, tones: [[64, 1, 0], [131, 0.4, 0.6], [262, 0.15, 0]],
    knock: 0.45, knockDecay: 380, clatter: 0.22, turbo: 0.03, lp: [420, 2200, 0.35] },
  eye: [[0.2, 11.2, -3.7], [40, 9.6, -3.4]],       // kamera kierowcy: oko i punkt, w który patrzy (układ auta)
  // obrys do kolizji z budynkami (punkty) i słupkami (prostokąt)
  hit: { cp: [[22.9, 8.4], [22.9, -8.4], [-22.9, 8.4], [-22.9, -8.4], [11, 8.8], [11, -8.8], [0, 8.8], [0, -8.8], [-11, 8.8], [-11, -8.8], [23, 0], [-23, 0]], box: [23, 8.9] },
  shadow: [1, 1],
  // koła 205/55 R16, felgi 5 podwójnych ramion
  wheels: {
    tire: [[2.03, -1.0], [2.85, -1.03], [3.1, -0.85], [3.16, -0.4], [3.16, 0.4], [3.1, 0.85], [2.85, 1.03], [2.03, 1.0]],
    rimR: 2.03, width: 1.9, lipZ: 0.92, wellZ: 0.35, discR: 1.6, caliper: [0.7, 1.1, 0.55, 1.3, 0.3], rimM,
    face(w, s) {
      for (let i = 0; i < 5; i++) for (const d of [-0.13, 0.13]) {
        const a = i / 5 * Math.PI * 2 + d;
        const sp = new THREE.Mesh(rbox(0.26, 1.55, 0.18, 0.08), rimM);
        sp.position.set(Math.sin(a) * 1.08, Math.cos(a) * 1.08, s * 0.78); sp.rotation.z = -a; w.add(sp);
      }
      const hub = new THREE.Mesh(cyl(0.48, 0.25, 'z', 32), rimM); hub.position.z = s * 0.82; w.add(hub);
      const cap = new THREE.Mesh(cyl(0.3, 0.06, 'z', 24), trimM); cap.position.z = s * 0.96; w.add(cap);
    },
  },
  build(car, P) {
    buildBody(car, P);
    buildInterior(car, P, {
      m: interiorM, dx: 0, dy: 0, dashW: 14.0,
      dials: [[6, 0.5, 1, '1/min ×1000', 4.5], [260, 10, 40, 'km/h', 0]],
      rear: 'bench', rearX: -8.6,
      doors: [[1.3, 8.2], [-7.4, 8.6]], doorZ: 7.95,
      head: [-10.2, P.roofFront - 0.1], shelf: [-14.0, 10.0], floor: [-1.75, 20.5],
    });
  },
};
