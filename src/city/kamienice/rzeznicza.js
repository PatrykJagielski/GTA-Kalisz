/* ---------- ulica Rzeźnicza: pierzeja SE (kamienica od Głównego Rynku 15) i pierzeja NW (niski budynek z arkadowymi niszami) ---------- */
// Według Street View (2024), format jak w zamkowa-kit.js i jozefa.js (span). Opis od lewej do prawej patrząc z jezdni.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const rows = (n, w, y0, pitch = 37, o = {}) => [...Array(n).keys()].map(i => ({ y: [y0 + pitch * i, y0 + pitch * i + 25], w: w - (i === n - 1 ? 0.5 : 0), ...o }));
const niches = (n, a = 0.0, b = 1.0, y1 = 44) => {
  const w = (b - a) / n;
  return ax(n, a, b).map(c => ({ k: 'arch', x: [c - w * 0.3, c + w * 0.3], y: [8, y1], rise: 6, frame: '#7a4a2a', ring: '#f1e8d2' }));
};
const lizeny = (n, a = 0, b = 1) => [...Array(n + 1).keys()].map(i => [a + (b - a) * i / n - 0.006, a + (b - a) * i / n + 0.006]);

export const RZEZNICZA = [
  {
    // narożna brzoskwiniowa: zabita deskami nisza z naczółkiem w parterze, okna w cienkich opaskach, balkony z drewnianą balustradą
    name: 'Rzeźnicza róg', mid: [-6, 780], seed: 301, wall: '#e6bba0', base: '#e0b496', groundTop: 50, trim: '#f2e4d0', frame: '#f4f2ec', eave: 196,
    axes: ax(5, 0.05, 0.95), stains: true,
    floors: rows(4, 8.5, 62),
    bands: [[46, 51, 2.2], [186, 190, 1.4], [190, 196, 3.8]],
    balconies: [[2, 0.5, 0.76, 9, true], [3, 0.1, 0.3, 8, true]],
    ground: [{ k: 'shop', x: [0.1, 0.34], y: [10, 40], frame: '#f2e4d0' }, { k: 'shop', x: [0.44, 0.62], y: [10, 42], frame: '#f4f2ec' }, { k: 'door', x: [0.76, 0.86], y: [3, 40] }],
  },
  {
    // długa brzoskwiniowa kamienica (Główny Rynek 15): kuchnia tajska King Kong, brama z kratą, Sublime pod brązową markizą
    name: 'King Kong', mid: [206, 1000], seed: 302, wall: '#e6bba0', base: '#f1e9dc', groundTop: 52, trim: '#f4e8d6', frame: '#f4f2ec', eave: 200,
    axes: ax(14, 0.02, 0.98), stains: true,
    floors: rows(4, 8.5, 64),
    bands: [[48, 53, 2.4], [190, 194, 1.4], [194, 200, 3.8]],
    balconies: [[1, 0.26, 0.38, 9, true], [3, 0.26, 0.38, 9], [2, 0.58, 0.72, 9, true], [1, 0.8, 0.9, 9, true]],
    ground: [
      { k: 'shop', x: [0.02, 0.12], y: [6, 44], frame: '#7a4a2a' },
      { k: 'shop', x: [0.17, 0.3], y: [4, 46], frame: '#7a4a2a', door: [0.17, 0.3] },
      { k: 'shop', x: [0.34, 0.38], y: [8, 40], frame: '#7a4a2a' },
      { k: 'shop', x: [0.4, 0.44], y: [8, 40], frame: '#7a4a2a' },
      { k: 'arch', x: [0.52, 0.6], y: [3, 44], rise: 3, gate: true },
      { k: 'shop', x: [0.64, 0.78], y: [6, 42], frame: '#2a2a2a' },
      { k: 'shop', x: [0.82, 0.9], y: [6, 42], frame: '#f4f2ec' },
      { k: 'door', x: [0.94, 0.98], y: [3, 42] },
    ],
    awnings: [[0.63, 0.79, 46, 8, '#4a3a30']],
    signs: [
      { x: [0.18, 0.28], y: [48, 56], bg: '#f4f0e6', fg: '#6a4a2a', font: '800 {}px Georgia, serif', lines: [['King', 0.3, 0.3], ['Kong', 0.3, 0.7]] },
      { x: [0.03, 0.11], y: [18, 28], fg: '#2f6a3a', font: '800 {}px Arial, sans-serif', z: 0.9, lines: [['KUCHNIA TAJSKA', 0.2, 0.5]] },
      { x: [0.51, 0.61], y: [30, 38], bg: '#2f8a4a', fg: '#ffffff', lines: [['Główny Rynek 15', 0.14, 0.5]] },
    ],
  },
  {
    // niski budynek z arkadowymi niszami: biało-kremowe pilastry z brązowymi głowicami, w niszach okna w brązowych ramach
    name: 'Nisze', mid: [-2, 940], span: [[263, 1201], [-11, 932]], seed: 303, wall: '#efe2c4', base: '#efe2c4', groundTop: 0, trim: '#f6efdf', frame: '#f4f2ec', eave: 96,
    axes: ax(12), floors: [{ y: [76, 90], w: 6, at: ax(12) }],
    bands: [[52, 60, 7, 0, 1, '#f6efdf'], [60, 64, 2.4, 0, 1, '#a0613a'], [90, 96, 3]],
    strips: lizeny(12), stripY0: -2,
    ground: niches(12, 0, 1, 46),
  },
  {
    // ciąg dalszy niskiego budynku przy zakręcie ulicy: trzy nisze
    name: 'Nisze 2', mid: [324, 1260], span: [[358, 1290], [296, 1233]], seed: 304, wall: '#efe2c4', base: '#efe2c4', groundTop: 0, trim: '#f6efdf', frame: '#f4f2ec', eave: 96,
    axes: ax(3), floors: [{ y: [76, 90], w: 6, at: ax(3) }],
    bands: [[52, 60, 7, 0, 1, '#f6efdf'], [60, 64, 2.4, 0, 1, '#a0613a'], [90, 96, 3]],
    strips: lizeny(3), stripY0: -2,
    ground: niches(3, 0, 1, 46),
  },
  {
    // biała narożna ściana z szarym prążkowanym cokołem, okna z witrażami
    name: 'Biała z cokołem', mid: [379, 1174], seed: 305, wall: '#e8e8e2', base: '#8a8680', groundTop: 56, trim: '#f4f4f0', frame: '#f4f2ec', eave: 130,
    axes: [0.3, 0.7], floors: rows(2, 8, 70),
    bands: [[52, 57, 2], [120, 125, 1.4], [125, 130, 3]], rustic: [[0, 54]],
    ground: [{ k: 'shop', x: [0.1, 0.4], y: [14, 44], frame: '#3a3a3a' }, { k: 'shop', x: [0.55, 0.85], y: [14, 44], frame: '#3a3a3a' }],
  },
  {
    name: 'Biała z cokołem 2', mid: [416, 1204], seed: 306, wall: '#e8e8e2', base: '#8a8680', groundTop: 56, trim: '#f4f4f0', frame: '#f4f2ec', eave: 130,
    axes: ax(3, 0.1, 0.9), floors: rows(2, 8, 70),
    bands: [[52, 57, 2], [120, 125, 1.4], [125, 130, 3]], rustic: [[0, 54]],
    ground: [{ k: 'shop', x: [0.08, 0.3], y: [14, 44], frame: '#3a3a3a' }, { k: 'door', x: [0.45, 0.55], y: [3, 42] }, { k: 'shop', x: [0.66, 0.92], y: [14, 44], frame: '#3a3a3a' }],
  },
];
