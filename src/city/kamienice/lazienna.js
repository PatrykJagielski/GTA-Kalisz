/* ---------- ulica Łazienna: odcinek od Rynku do skrzyżowania z ulicą Sukienniczą ---------- */
// Według Street View (2024), format jak w zamkowa-kit.js. Pierzeja SW (prawa, patrząc w głąb ulicy od Rynku): lewy koniec
// frontu = koniec dalszy od Rynku; pierzeja NE (lewa): lewy koniec = koniec od Rynku (kolejność obrysu OSM).
const PITCH = 38;
const ul = (x, y) => ({ x, w: 10, y: [y, y + 2.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. ŁAZIENNA', 0.62, 0.55]] });
const rows = (n, w, y0, o = {}) => [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: w - (i === n - 1 ? 0.5 : 0), ...o }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const bands = (g, eave) => [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]];
const board = (x, text) => ({ x, y: [14, 42], bg: '#151515', fg: '#f4f4f4', border: '#555', lines: text });

export const LAZIENNA = [
  {
    // narożna zielonkawoszara: parter z trzema łukowymi witrynami (Kram, salon sukien), nad nim cztery piętra okien w naczółkach
    name: 'Kram', mid: [784, 112], seed: 81, wall: '#bcc3b0', base: '#c9c4b2', groundTop: 64, trim: '#e6e4d6', frame: '#f4f2ec', eave: 232,
    axes: [0.14, 0.4, 0.66], stains: true,
    floors: rows(4, 8.5, 76, { hood: 'hood' }),
    bands: bands(64, 232), strips: [[0.82, 0.97]], stripY0: 66,
    ground: [
      { k: 'arch', x: [0.03, 0.14], y: [6, 46], rise: 8, frame: '#f2efe6', ring: '#d8d4c4' },
      { k: 'arch', x: [0.2, 0.42], y: [6, 50], rise: 11, frame: '#f2efe6', ring: '#d8d4c4' },
      { k: 'arch', x: [0.5, 0.8], y: [6, 54], rise: 14, frame: '#f2efe6', ring: '#d8d4c4' },
    ],
    signs: [
      { x: [0.04, 0.13], y: [24, 31], bg: '#f4f2ec', fg: '#2a2a2a', lines: [['KRAM', 0.8, 0.5]] },
      board([0.84, 0.97], [['Prestige', 0.11, 0.17], ['Milena Panek', 0.05, 0.3], ['PERFECT', 0.06, 0.72], ['HAIR', 0.08, 0.84]]),
      ul(0.15, 58),
    ],
  },
  {
    // ciąg dalszy: łukowe wejście z kwiatami pod szyldem Prestige, wysoka witryna łukowa; okna w naczółkach z kutymi balustradkami
    name: 'Prestige', mid: [922, 246], seed: 82, wall: '#b9c0ac', base: '#c6c1af', groundTop: 64, trim: '#e4e2d2', frame: '#f4f2ec', eave: 232,
    axes: ax(8, 0.02, 0.98), stains: true,
    floors: rows(4, 8.5, 76, { hood: 'hood' }),
    bands: bands(64, 232), strips: [[0.0, 0.015], [0.985, 1]], stripY0: 66,
    balconies: [[3, 0.12, 0.26, 7]],
    ground: [
      { k: 'arch', x: [0.06, 0.1], y: [3, 40], rise: 3, wood: true, ring: '#d8d4c4' },
      { k: 'arch', x: [0.17, 0.27], y: [10, 46], rise: 8, frame: '#f2efe6', ring: '#d8d4c4' },
      { k: 'arch', x: [0.5, 0.64], y: [3, 48], rise: 8, door: true, frame: '#f2efe6', ring: '#d8d4c4' },
      { k: 'arch', x: [0.72, 0.97], y: [10, 54], rise: 13, frame: '#f2efe6', ring: '#d8d4c4' },
    ],
    signs: [
      { x: [0.5, 0.64], y: [56, 60], bg: '#2a2622', fg: '#efe7d8', font: '600 {}px Georgia, serif', lines: [['Prestige', 0.7, 0.5]] },
      { x: [0.74, 0.95], y: [34, 41], fg: '#f1efe8', font: '600 {}px Georgia, serif', z: 0.9, lines: [['Prestige', 0.55, 0.3], ['Milena Panek', 0.3, 0.75]] },
    ],
  },
  {
    // miętowa kamienica z szarym parterem i kutymi balkonami z kwiatami po lewej
    name: 'Miętowa', mid: [1070, 386], seed: 83, wall: '#bcd1b2', base: '#a2a39d', groundTop: 70, trim: '#e6eee0', frame: '#f4f2ec', eave: 220,
    axes: [0.1, 0.32, 0.54, 0.76, 0.93], stains: true,
    floors: rows(3, 8.5, 84),
    bands: bands(70, 220),
    balconies: [[1, 0.02, 0.22, 10, true], [2, 0.02, 0.22, 10, true]],
    ground: [
      { k: 'shop', x: [0.07, 0.17], y: [20, 44], frame: '#f2efe6' },
      { k: 'door', x: [0.38, 0.5], y: [3, 44] },
      { k: 'shop', x: [0.6, 0.76], y: [14, 46], frame: '#f2efe6' },
      { k: 'shop', x: [0.84, 0.96], y: [14, 46], frame: '#f2efe6' },
    ],
    signs: [{ x: 0.52, w: 3, y: [40, 43], bg: '#e8e4d8', fg: '#2a2a2a', lines: [['4', 0.8, 0.5]] }],
  },
  // ---- pierzeja NE (lewa) ----
  {
    // oliwkowoszara, z białym parterem i dwiema dużymi łukowymi witrynami w brązowych ramach; okna w naczółkach, kute balkony
    name: 'Biały parter', mid: [922, 112], seed: 84, wall: '#c9c2a6', base: '#dcdad2', groundTop: 58, trim: '#e6ddc4', frame: '#f4f2ec', eave: 215,
    axes: ax(7, 0.04, 0.96), stains: true,
    floors: rows(3, 9, 70, { hood: 'hood' }),
    bands: bands(58, 215),
    balconies: [[2, 0.82, 0.98, 10, true]],
    ground: [
      { k: 'arch', x: [0.06, 0.34], y: [6, 46], rise: 10, frame: '#8a4a26', ring: '#e6e3d6' },
      { k: 'arch', x: [0.44, 0.68], y: [6, 46], rise: 10, frame: '#8a4a26', ring: '#e6e3d6' },
    ],
  },
  {
    // żółta, trzy kondygnacje i dach z lukarnami; kamienny łuk wejściowy, łukowe okna w parterze, kute balkony z kwiatami
    name: 'Żółta z portalem', mid: [1114, 276], seed: 85, wall: '#dac98c', base: '#d6c386', groundTop: 56, trim: '#ede4c2', frame: '#f4f2ec', eave: 200,
    axes: ax(8, 0.04, 0.96), stains: true,
    floors: rows(4, 8.5, 66, { hood: 'hood' }),
    bands: bands(56, 200), rustic: [[0, 54]],
    balconies: [[1, 0.0, 0.16, 11, true], [2, 0.04, 0.16, 9], [3, 0.7, 0.8, 8], [1, 0.82, 0.92, 8]],
    ground: [
      { k: 'arch', x: [0.03, 0.11], y: [3, 46], rise: 8, wood: true, ring: '#e8e4d6' },
      { k: 'arch', x: [0.24, 0.32], y: [8, 40], rise: 6, frame: '#7a4a2a' },
      { k: 'arch', x: [0.38, 0.45], y: [8, 40], rise: 6, frame: '#7a4a2a' },
      { k: 'arch', x: [0.52, 0.57], y: [8, 40], rise: 5, frame: '#7a4a2a' },
      { k: 'arch', x: [0.66, 0.71], y: [3, 40], rise: 4, wood: true },
      { k: 'arch', x: [0.78, 0.83], y: [8, 40], rise: 5, frame: '#7a4a2a' },
    ],
  },
];
