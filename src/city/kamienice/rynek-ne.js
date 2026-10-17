import { archWins, ax } from './rynek-kit.js';

/* ---------- Główny Rynek, pierzeja północno-wschodnia: od narożnika z ulicą Piekarską w stronę ulicy Garbarskiej ---------- */
// Według Street View (sierpień 2025). Lewy koniec frontu = strona Piekarskiej, patrząc z płyty Rynku.
const FL = (y, w, o = {}) => ({ y, w, ...o });
const A6 = [0.07, 0.24, 0.4, 0.56, 0.73, 0.91];

export const RYNEK_NE = [
  {
    // narożna kamienica z piekarnią: żółty tynk, bordowe opaski okien i gzyms, mansarda z falistym szczytem
    name: 'Piekarnia', mid: [251, -442], seed: 21, wall: '#efd9a3', base: '#f2e4b8', groundTop: 56, trim: '#f6edd3', frame: '#8e3d38', eave: 178,
    axes: [0.255, 0.48, 0.585, 0.685, 0.785, 0.92],
    floors: [FL([68, 94], 11.5), FL([104, 130], 11.5, { at: [0.275, 0.48, 0.585, 0.685, 0.785, 0.91] }), FL([140, 161], 10.5, { at: [0.48, 0.585, 0.685, 0.785, 0.91] })],
    bands: [[54, 60, 2, 0, 1, '#8e3d38'], [164, 168, 1.2], [168, 178, 4.6, 0, 1, '#8e3d38']],
    balconies: [[0, 0.215, 0.295, 6], [1, 0.225, 0.32, 10], [0, 0.885, 0.955, 6], [1, 0.875, 0.945, 8]],
    ground: [
      { k: 'arch', x: [0.04, 0.17], y: [3, 42], rise: 7, frame: '#6a4631' },
      { k: 'arch', x: [0.21, 0.34], y: [3, 42], rise: 7, wood: true, frame: '#6a4631' },
      { k: 'arch', x: [0.38, 0.5], y: [3, 42], rise: 6, frame: '#6a4631' },
      { k: 'arch', x: [0.68, 0.82], y: [3, 42], rise: 7, door: true, frame: '#6a4631' },
      { k: 'arch', x: [0.875, 0.985], y: [3, 42], rise: 6, wood: true, frame: '#6a4631' },
    ],
    awnings: [[0.86, 1, 45, 9, '#e8e2d2']],
    signs: [{ x: [0.03, 0.3], y: [46, 52.5], bg: '#f0c33a', fg: '#1a1a1a', font: '800 {}px Arial, sans-serif', lines: [['PIEKARNIA', 0.8, 0.55]] }],
  },
  {
    // długa klasycystyczna kamienica: pilastry, okna łukowe na dwóch piętrach, balkony, brama z kratą i optyk w parterze
    name: 'Kamienica z bramą', mid: [405, -284], seed: 22, wall: '#ece3d3', base: '#e4ded3', groundTop: 56, trim: '#f8f4ea', frame: '#f5f3ee', eave: 190,
    axes: A6,
    floors: [FL([68, 96], 9, { at: [] }), FL([106, 134], 9, { at: [] }), FL([144, 166], 10.5, { hood: 'hood' }), FL([172, 185], 9)],
    bands: [[52, 58, 2.6], [95, 98, 1.6], [137, 140, 1.6], [186, 190, 1.8], [190, 194, 4.2]],
    strips: [0.155, 0.32, 0.48, 0.645, 0.82].map(f => [f - 0.008, f + 0.008]), stripY0: 58,
    balconies: [[0, 0.1, 0.3, 9], [0, 0.66, 0.8, 7, true], [1, 0.62, 0.8, 7, true]],
    ground: [
      { k: 'arch', x: [0.01, 0.07], y: [3, 42], rise: 3, frame: '#6a4631' },
      { k: 'arch', x: [0.09, 0.15], y: [3, 42], rise: 3, door: true, frame: '#2c2c2c' },
      { k: 'arch', x: [0.19, 0.29], y: [3, 44], rise: 5, frame: '#6a4631' },
      { k: 'arch', x: [0.33, 0.44], y: [3, 44], rise: 5, frame: '#6a4631' },
      { k: 'arch', x: [0.5, 0.61], y: [3, 46], rise: 9, gate: true, ring: '#f1ece0' },
      { k: 'arch', x: [0.66, 0.76], y: [3, 44], rise: 5, frame: '#5a3a26' },
      { k: 'arch', x: [0.8, 0.9], y: [3, 44], rise: 5, frame: '#5a3a26' },
      ...archWins(239, A6, 68, 96, 9), ...archWins(239, A6, 106, 134, 9),
    ],
    signs: [{ x: [0.455, 0.495], y: [30, 36], bg: '#1d1d1d', fg: '#d8d8d8', lines: [['optyk', 0.7, 0.5]] }],
    cafe: [0.62, 1],
  },
  {
    // szara kamienica z flagą: pięć osi, długie kute balkony na dwóch piętrach, drewniana brama w łuku, ogródek kawiarni
    name: 'Szara z flagą', mid: [539, -150], seed: 23, wall: '#d7d4cb', base: '#e7e2d6', groundTop: 52, trim: '#f3f1ec', frame: '#efece6', eave: 168,
    axes: ax(5, 0.02, 0.98),
    floors: [FL([64, 92], 11, { at: [0.3, 0.5, 0.71] }), FL([100, 126], 11), FL([136, 158], 11, { hood: 'hood' })],
    bands: [[49, 54, 2.4], [160, 164, 1.2], [164, 168, 3.4]],
    balconies: [[0, 0.17, 0.83, 9], [1, 0.17, 0.83, 9, true]],
    ground: [
      { k: 'shop', x: [0.06, 0.3], y: [4, 42], frame: '#2a2a2a' },
      { k: 'shop', x: [0.35, 0.66], y: [4, 42], frame: '#2a2a2a' },
      { k: 'arch', x: [0.82, 0.96], y: [3, 44], rise: 7, wood: true, frame: '#5a3a26', ring: '#f1eee8' },
      ...archWins(141, [0.09, 0.91], 64, 92, 9),
    ],
    cafe: [0.04, 0.72],
  },
  {
    // kremowa kamienica z brzoskwiniowym parterem: pary okien pod wspólnymi naczółkami, małe balkony, dach czterospadowy
    name: 'Kremowa z łukami', mid: [635, -51], seed: 24, wall: '#efe7d5', base: '#e9b98a', groundTop: 52, trim: '#faf7ef', frame: '#f5f3ee', eave: 172,
    axes: [0.14, 0.34, 0.5, 0.7, 0.88],
    floors: [FL([64, 90], 10.5, { hood: 'hood' }), FL([100, 126], 10.5, { hood: 'hood' }), FL([136, 158], 10.5)],
    bands: [[49, 54, 2.2], [162, 166, 1.2], [166, 172, 3.6]],
    balconies: [[1, 0.04, 0.24, 7], [2, 0.04, 0.24, 7], [0, 0.78, 0.98, 7], [1, 0.78, 0.98, 7]],
    ground: [
      { k: 'door', x: [0.05, 0.13], y: [3, 36] },
      { k: 'arch', x: [0.3, 0.5], y: [3, 40], rise: 8, frame: '#2e2a26', ring: '#f6efe0' },
      { k: 'arch', x: [0.7, 0.9], y: [3, 40], rise: 8, frame: '#2e2a26', ring: '#f6efe0' },
    ],
    cafe: [0.25, 1],
  },
];
