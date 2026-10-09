import { nr } from './zamkowa-kit.js';

/* ---------- Plac św. Józefa: pierzeja zachodnia i oba narożne gmachy przy południowym wylocie placu ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js; poza tym:
//   rustic     boniowanie tynku [y0, y1, od, do]; pediments trójkątne frontony [od, do, wysokość, y, głębokość, lunetka]
//   colBase    kolumny wielkiego porządku od tej wysokości, bez podestu (colR = promień)
//   span       front na całej długości elewacji (OSM rozbija ją na ząbki pilastrów i płytkie ryzality)
// Kolegiata (landmarks/kolegiata.js) i kamienica na rogu z placem Jana Pawła II (landmarks/narozna.js) mają osobne modele.
const plac = (x, y) => ({ x, w: 11, y: [y, y + 2.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['PLAC ŚW. JÓZEFA', 0.6, 0.55]] });
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

export const JOZEFA = [
  {
    // powojenny blok: brzoskwiniowy tynk z jasnymi lizenami, parter ze sklepami na brązowym cokole z płytek
    name: 'Skala', mid: [1512, -682], seed: 51, wall: '#e3c3a6', base: '#d9dadb', groundTop: 46, trim: '#efe2d3', frame: '#f6f5f0', eave: 185,
    axes: ax(12),
    floors: [{ y: [56, 76], w: 10 }, { y: [88, 108], w: 10 }, { y: [120, 140], w: 10 }, { y: [152, 172], w: 10 }],
    bands: [[44, 48, 2.6], [178, 181, 1.4], [181, 185, 3.6]],
    strips: [1, 2, 3, 4, 5].map(k => [k / 6 - 0.01, k / 6 + 0.01]), stripY0: 48,
    panels: [[0, 1, '#7b4a36', -2, 13]],
    balconies: [[1, 0.18, 0.24, 8, true], [2, 0.18, 0.24, 8, true], [3, 0.18, 0.24, 8, true], [1, 0.76, 0.82, 8, true], [2, 0.76, 0.82, 8], [3, 0.76, 0.82, 8, true]],
    ground: [
      { k: 'shop', x: [0.03, 0.11], y: [13, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.13, 0.2], y: [13, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.22, 0.26], y: [3, 38], frame: '#5e3a28', door: [0.22, 0.26] },
      { k: 'shop', x: [0.29, 0.37], y: [13, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.4, 0.47], y: [13, 38], frame: '#5e3a28' },
      { k: 'door', x: [0.5, 0.54], y: [3, 38] },
      { k: 'shop', x: [0.57, 0.66], y: [13, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.69, 0.79], y: [3, 38], frame: '#e8e8e4', door: [0.69, 0.73] },
      { k: 'shop', x: [0.81, 0.88], y: [13, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.9, 0.98], y: [3, 38], frame: '#2c2c2c', door: [0.9, 0.93] },
    ],
    signs: [
      { x: [0.69, 0.78], y: [39, 43.5], bg: '#f3f1ea', fg: '#2b2b2b', border: '#9a9a9a', font: '800 {}px Arial, sans-serif', lines: [['SKALA', 0.52, 0.36], ['sklep papierniczy', 0.28, 0.78]] },
      { x: [0.9, 0.98], y: [39, 43.5], bg: '#1d1d1d', fg: '#f2f2f2', font: '700 {}px Georgia, serif', lines: [['FRYZJER', 0.5, 0.36], ['damski · męski', 0.3, 0.78]] },
    ],
  },
  {
    // kamienica z wysokim parterem: boniowany dół, wejścia do lokali w suterenie pod daszkami (pizzeria, kwiaciarnia)
    name: 'Cook Pizza', mid: [1712, -906], seed: 52, wall: '#d6cbb4', base: '#cfc6b4', groundTop: 52, trim: '#e2dacb', frame: '#7a4a2e', eave: 190,
    axes: [0.1, 0.3, 0.5, 0.7, 0.9],
    floors: [{ y: [26, 45], w: 10 }, { y: [60, 82], w: 10 }, { y: [94, 116], w: 10 }, { y: [128, 150], w: 10 }, { y: [162, 182], w: 9.5 }],
    bands: [[50, 54, 1.8, 0, 1, '#6b4a36'], [184, 186, 1.4], [186, 190, 3.6]],
    rustic: [[0, 50]], strips: [[0.39, 0.42], [0.58, 0.61], [0.78, 0.81]], stripY0: 54,
    ground: [
      { k: 'shop', x: [0.04, 0.16], y: [3, 15], frame: '#2a2a2a' },
      { k: 'door', x: [0.36, 0.45], y: [2, 22] },
      { k: 'door', x: [0.6, 0.66], y: [2, 38] },
      { k: 'door', x: [0.73, 0.8], y: [2, 22] },
    ],
    awnings: [[0.33, 0.48, 27, 7, '#4a3a30'], [0.71, 0.83, 27, 7, '#9a4a2a']],
    signs: [
      { x: 0.2, w: 10, y: [29, 39], round: true, bg: '#f2b632', fg: '#ffffff', font: 'italic 800 {}px Georgia, serif', lines: [['Cook', 0.2, 0.25], ['Pizza', 0.34, 0.52], ['bis', 0.2, 0.78]] },
      { x: [0.04, 0.16], y: [4, 14], bg: '#1d1d1d', fg: '#f2f2f2', z: 0.9, lines: [['PIZZA', 0.4, 0.5]] },
      { x: [0.82, 0.96], y: [24, 29], bg: '#f4f2ea', fg: '#3a7a3a', border: '#3a7a3a', font: '700 {}px Georgia, serif', lines: [['Kwiaciarnia', 0.34, 0.32], ['BONSAI', 0.4, 0.74]] },
    ],
  },
  {
    // szara kamienica z boniowanym dołem, brama na osi; w suterenie outlet odzieżowy BRENDy, salon ślubny
    name: 'Brendy', mid: [1815, -1064], seed: 53, wall: '#c8c0b0', base: '#c2b9a8', groundTop: 52, trim: '#d8d1c4', frame: '#f4f2ec', eave: 175,
    axes: [0.1, 0.28, 0.5, 0.72, 0.9],
    floors: [{ y: [26, 46], w: 11 }, { y: [62, 85], w: 11 }, { y: [97, 120], w: 11 }, { y: [132, 154], w: 10.5 }],
    bands: [[50, 55, 2.4], [90, 93, 1.4], [165, 170, 1.8], [170, 175, 4.2]],
    rustic: [[0, 50]],
    balconies: [[1, 0.4, 0.6, 9, true], [2, 0.4, 0.6, 9], [1, 0.8, 0.99, 8], [2, 0.8, 0.99, 8, true]],
    ground: [
      { k: 'shop', x: [0.02, 0.17], y: [3, 15], frame: '#2a2a2a' },
      { k: 'shop', x: [0.3, 0.44], y: [3, 15], frame: '#2a2a2a' },
      { k: 'arch', x: [0.44, 0.56], y: [2, 46], rise: 6, wood: true, ring: '#b3ab9b' },
      { k: 'shop', x: [0.62, 0.74], y: [3, 15], frame: '#2a2a2a' },
    ],
    signs: [
      { x: [0.15, 0.29], y: [20, 24.5], bg: '#151515', fg: '#f4f4f4', font: '800 {}px Georgia, serif', lines: [['BRENDy', 0.62, 0.42], ['FASHION', 0.18, 0.84]] },
      { x: [0.31, 0.43], y: [4, 14], bg: '#1d1d1d', fg: '#f4f4f4', z: 0.9, lines: [['EKSKLUZYWNE MARKI', 0.16, 0.22], ['OUTLET ODZIEŻOWY', 0.18, 0.5], ['NOWE · UŻYWANE', 0.16, 0.8]] },
      { x: [0.8, 0.96], y: [20, 25], fg: '#f6f6f6', font: 'italic 700 {}px Georgia, serif', lines: [['Ślubne', 0.85, 0.5]] },
    ],
  },
  {
    // narożny gmach z apteką: szary tynk, kolumny wielkiego porządku od tarasu I piętra, fronton z lunetką
    name: 'Apteka', mid: [1536, -307], span: [[1668, -182], [1403, -432]], seed: 54, wall: '#8a867e', base: '#77736c', groundTop: 48, trim: '#d8d3c7',
    frame: '#f4f2ec', eave: 192,
    axes: [0.06, 0.22, 0.36, 0.45, 0.55, 0.64, 0.78, 0.94],
    floors: [{ y: [58, 80], w: 9.5 }, { y: [92, 114], w: 9.5 }, { y: [126, 148], w: 9.5 }, { y: [160, 180], w: 9 }],
    bands: [[46, 52, 3.4], [184, 187, 1.6], [187, 192, 4.6]],
    columns: [0.15, 0.29, 0.71, 0.85], colBase: 52, colTop: 182, colR: 2.6,
    balconies: [[0, 0.12, 0.88, 7], [1, 0.18, 0.26, 7, true], [2, 0.18, 0.26, 7], [1, 0.74, 0.82, 7], [2, 0.74, 0.82, 7, true]],
    pediments: [[0.13, 0.62, 28, 192, 3, true]],
    ground: [
      { k: 'arch', x: [0.02, 0.1], y: [3, 40], rise: 5, wood: true, ring: '#c9c4b8' },
      { k: 'arch', x: [0.17, 0.27], y: [3, 40], rise: 5, door: true, frame: '#3a3a3a', ring: '#c9c4b8' },
      { k: 'arch', x: [0.33, 0.39], y: [3, 40], rise: 4, wood: true, ring: '#c9c4b8' },
      { k: 'arch', x: [0.42, 0.48], y: [3, 40], rise: 4, wood: true, ring: '#c9c4b8' },
      { k: 'arch', x: [0.52, 0.58], y: [3, 40], rise: 4, wood: true, ring: '#c9c4b8' },
      { k: 'arch', x: [0.61, 0.67], y: [3, 40], rise: 4, wood: true, ring: '#c9c4b8' },
      { k: 'arch', x: [0.75, 0.84], y: [3, 40], rise: 5, frame: '#3a3a3a', ring: '#c9c4b8' },
      { k: 'arch', x: [0.89, 0.97], y: [3, 40], rise: 5, wood: true, ring: '#c9c4b8' },
    ],
    signs: [{ x: [0.16, 0.28], y: [42.5, 46], fg: '#d0282a', font: '800 {}px Arial, sans-serif', lines: [['APTEKA', 0.9, 0.55]] }],
  },
  {
    // klasycystyczny pałac z pilastrami korynckimi: Galeria Sztuki im. Jana Tarasina
    name: 'Galeria Tarasina', mid: [2027, -353], span: [[2165, -542], [1888, -163]], seed: 55, wall: '#ebe5d4', base: '#e3dccb', groundTop: 50,
    trim: '#f5f1e6', frame: '#f4f2ec', eave: 165,
    axes: [0.06, 0.13, 0.215, 0.33, 0.42, 0.49, 0.525, 0.56, 0.632, 0.72, 0.81, 0.89, 0.96],
    floors: [{ y: [14, 38], w: 8, at: [0.06, 0.13, 0.215, 0.33, 0.42, 0.49, 0.56, 0.72, 0.81, 0.89, 0.96] }, { y: [62, 92], w: 10, hood: 'hood' }, { y: [110, 132], w: 9 }],
    bands: [[48, 54, 3.2], [140, 144, 1.6], [157, 160, 2], [160, 165, 5]],
    strips: [[0.183, 0.2], [0.27, 0.29], [0.36, 0.38], [0.445, 0.46], [0.595, 0.61], [0.67, 0.69], [0.755, 0.775], [0.835, 0.85]], stripY0: 54,
    dentils: [151, 154],
    balconies: [[1, 0.465, 0.585, 9]],
    pediments: [[0.465, 0.585, 10, 98, 2.4]],
    ground: [
      { k: 'door', x: [0.505, 0.545], y: [3, 38] },
      { k: 'door', x: [0.61, 0.655], y: [3, 40] },
    ],
    signs: [
      { x: [0.6, 0.67], y: [41, 46.5], bg: '#f4f4f2', fg: '#3a4a5a', border: '#8a96a2', font: '600 {}px Arial, sans-serif', lines: [['Galeria Sztuki', 0.3, 0.32],
        ['im. Jana Tarasina', 0.26, 0.72]] },
      { x: 0.66, w: 5, y: [16, 31], bg: '#e9c64a', border: '#3a6ab0', lines: [] },                      // plakat wystawy
      plac(0.86, 47), nr(0.5, 39.5, '5'),
    ],
  },
];
