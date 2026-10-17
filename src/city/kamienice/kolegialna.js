/* ---------- ulica Kolegialna: pierzeja NW (kamienice) i SE (dawne kolegium jezuickie) od Sukienniczej do kościoła garnizonowego ---------- */
// Według Street View (lip 2024), format jak w zamkowa-kit.js. Lewy koniec frontu liczony patrząc z ulicy:
// po stronie NW to koniec od Sukienniczej, po stronie SE koniec od kościoła garnizonowego.
// Kolegium (SE) ma front na całej długości obrysu (OSM tnie go na trzy krawędzie), więc opis ma span.
const rows = (n, w = 9.5, o = {}, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w: w - (i === n - 1 ? 0.5 : 0), ...o }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const portal = (f, w = 0.04) => ({ k: 'arch', x: [f - w, f + w], y: [3, 46], rise: 9, wood: true, ring: '#efe9d6' });
const COLL = ax(24).filter(a => ![0.086, 0.52, 0.898].some(p => Math.abs(a - p) < 0.04));

const FRONTS = [
  {
    // narożna z Sukienniczą: żółty tynk, rustykowany parter z łukowymi oknami, sklep szewski pod fioletowym łukiem, zielony balkon
    name: 'Kolegialna, narożna', mid: [1257, 326], seed: 111, wall: '#ddc98f', base: '#d3bf84', groundTop: 52, trim: '#ecdfb4', frame: '#f4f2ec', eave: 200,
    axes: [0.17, 0.47, 0.83],
    floors: rows(4, 10, { hood: 'hood' }), bands: [[50, 55, 2.6], [190, 194, 1.6], [194, 200, 4]], rustic: [[0, 52]],
    balconies: [[1, 0.36, 0.58, 9, true]],
    ground: [
      { k: 'arch', x: [0.06, 0.38], y: [3, 44], rise: 12, frame: '#7a3a8a', ring: '#ecdfb4' },
      { k: 'arch', x: [0.52, 0.8], y: [14, 44], rise: 10, frame: '#f4f2ec', ring: '#ecdfb4' },
    ],
    signs: [{ x: [0.08, 0.36], y: [28, 40], z: -2.2, bg: '#7a3a8a', fg: '#f4eaf6', font: '700 {}px Arial, sans-serif', lines: [['Usługi Szewskie', 0.3, 0.3], ['i Kaletnicze', 0.3, 0.68]] }],
  },
  {
    // kremowa kamienica z secesyjnymi opaskami okien: parter z dwoma oknami w łuku i wejściem, żelazne balkony na osi
    name: 'Kolegialna, kremowa', mid: [1315, 257], seed: 112, wall: '#ebe3cc', base: '#e1d9c0', groundTop: 52, trim: '#f6f1e0', frame: '#f4f2ec', eave: 205,
    axes: [0.18, 0.5, 0.82],
    floors: rows(4, 10, { hood: 'hood' }), bands: [[50, 55, 2.4], [195, 199, 1.6], [199, 205, 4]], rustic: [[0, 52]],
    balconies: [[0, 0.4, 0.6, 8], [1, 0.4, 0.6, 8], [3, 0.4, 0.6, 7]],
    ground: [
      { k: 'arch', x: [0.07, 0.27], y: [12, 44], rise: 7, frame: '#6a3b24', ring: '#f6f1e0' },
      { k: 'arch', x: [0.33, 0.66], y: [12, 46], rise: 12, frame: '#6a3b24', ring: '#f6f1e0' },
      { k: 'arch', x: [0.74, 0.9], y: [3, 46], rise: 8, wood: true, ring: '#f6f1e0' },
    ],
  },
  {
    // brunatna kamienica z zielonymi balkonami i wejściem do lokalu w łuku (Concierge)
    name: 'Kolegialna, brunatna', mid: [1368, 192], seed: 113, wall: '#8d5d4c', base: '#7f5243', groundTop: 52, trim: '#b9917f', frame: '#f0ebe0', eave: 200,
    axes: [0.17, 0.5, 0.83],
    floors: rows(4, 9.5), bands: [[50, 54, 2.2], [192, 195, 1.4], [195, 200, 3.4]],
    balconies: [[1, 0.58, 0.95, 8, true], [2, 0.58, 0.95, 8, true]],
    ground: [
      { k: 'arch', x: [0.06, 0.46], y: [3, 44], rise: 12, wood: true, frame: '#5a2e22', ring: '#b9917f' },
      { k: 'arch', x: [0.6, 0.8], y: [14, 40], rise: 7, frame: '#f0ebe0', ring: '#b9917f' },
    ],
    signs: [{ x: 0.52, w: 8, y: [38, 46], bg: '#2a2a2a', fg: '#f4f4f4', lines: [['concierge', 0.4, 0.5]] }],
  },
  {
    // biały modernistyczny blok z lat 30.: pasma okien, kuta brama na osi
    name: 'Kolegialna, biały blok', mid: [1446, 95], seed: 114, wall: '#f1efe9', base: '#e6e3dc', groundTop: 52, trim: '#e4e1da', frame: '#fbfaf6', eave: 238,
    axes: [0.125, 0.375, 0.625, 0.875],
    floors: [{ y: [14, 42], w: 15, at: [0.125, 0.875] }, ...rows(5, 14)], bands: [[50, 53, 1.6], [230, 233, 1.4], [233, 238, 2.6]],
    balconies: [[2, 0.07, 0.18, 4], [3, 0.57, 0.68, 4], [4, 0.82, 0.93, 4]],
    ground: [{ k: 'arch', x: [0.38, 0.62], y: [3, 50], rise: 2, gate: true, ring: '#e4e1da' }],
  },
  {
    // ciemna kamienica z lat 50. z kremowymi lizenami: kamienny łukowy portal z drewnianą bramą, salon fryzjerski, sklep medyczny
    name: 'Kolegialna, ciemna z portalem', mid: [1584, -76], seed: 115, wall: '#6f6a63', base: '#5f5a54', groundTop: 54, trim: '#8c867c', frame: '#f0ece2', eave: 215,
    axes: ax(10),
    floors: rows(4, 9.5), bands: [[52, 56, 2.6], [205, 209, 1.6], [209, 215, 4]],
    strips: [[0.2, 0.215], [0.3, 0.315], [0.42, 0.435], [0.5, 0.515]], stripY0: 56,
    balconies: [[0, 0.235, 0.3, 7, true], [1, 0.235, 0.3, 7], [2, 0.235, 0.3, 7], [1, 0.47, 0.54, 7], [2, 0.47, 0.54, 7, true]],
    ground: [
      { k: 'arch', x: [0.02, 0.18], y: [3, 44], rise: 9, frame: '#8a2a22', ring: '#8c867c' },
      { k: 'arch', x: [0.3, 0.4], y: [14, 44], rise: 6, frame: '#2a4a8a', ring: '#8c867c' },
      { k: 'arch', x: [0.46, 0.6], y: [3, 50], rise: 14, wood: true, ring: '#a49c8a' },
      { k: 'arch', x: [0.66, 0.74], y: [14, 44], rise: 6, frame: '#f0ece2', ring: '#8c867c' },
      { k: 'arch', x: [0.9, 0.98], y: [14, 44], rise: 6, frame: '#f0ece2', ring: '#8c867c' },
    ],
    signs: [
      { x: [0.03, 0.18], y: [56, 60.5], bg: '#2e4a8a', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['AKSON sklep medyczny', 0.8, 0.5]] },
      { x: [0.29, 0.41], y: [56, 60.5], bg: '#1f1f1f', fg: '#ece3cf', font: '700 {}px Georgia, serif', lines: [['SALON FRYZJERSKI', 0.88, 0.5]] },
    ],
  },
  {
    // dawne kolegium jezuickie: długi front z boniowanym parterem, trzema portalami (środkowy z kartuszem) i oknami w prostych opaskach
    name: 'Kolegium', mid: [1528, 266], span: [[1736, 20], [1309, 519]], seed: 116, wall: '#e7e0cc', base: '#d4ccb7', groundTop: 52, trim: '#f2eee0', frame: '#f4f2ec', eave: 135,
    axes: ax(24),
    floors: [{ y: [18, 48], w: 11, at: COLL }, { y: [64, 90], w: 10.5 }, { y: [100, 122], w: 9.5 }],
    bands: [[50, 54, 2.2], [128, 131, 1.4], [131, 135, 3.6], [58, 61, 3, 0.04, 0.12], [58, 61, 3, 0.48, 0.56], [58, 61, 3, 0.86, 0.94]], rustic: [[0, 52]],
    cartouche: [0.52, 80],
    ground: [portal(0.086), portal(0.52), portal(0.898)],
    signs: [{ x: 0.52, w: 9, y: [92, 99], bg: '#1c1c1c', fg: '#d8c58a', border: '#8a7a50', font: '600 {}px Georgia, serif', lines: [['TRIUMPHUS PALLADIS · MDCXCVII', 0.8, 0.5]] }],
  },
];

export const KOLEGIALNA = FRONTS.map(f => ({ ground: [], ...f }));
