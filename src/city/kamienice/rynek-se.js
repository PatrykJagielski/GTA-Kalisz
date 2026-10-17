/* ---------- Główny Rynek, pierzeja południowo-wschodnia: od narożnika z ulicą Garbarską... do Kolegialnej ---------- */
// Według Street View (sierpień 2025). Lewy koniec frontu = strona północno-wschodnia (róg Garbarskiej), patrząc z płyty Rynku.
const FL = (y, w, o = {}) => ({ y, w, ...o });

export const RYNEK_SE = [
  {
    // jasnozielona kamienica z balkonami, w parterze łukowa witryna i wejście z numerem 11
    name: 'Jasnozielona', mid: [694, 90], seed: 41, wall: '#d3dcbd', base: '#dfe0d0', groundTop: 52, trim: '#f2f1e8', frame: '#f6f5ee', eave: 176,
    axes: [0.3, 0.72],
    floors: [FL([66, 92], 11, { hood: 'hood' }), FL([104, 130], 11, { hood: 'hood' }), FL([142, 164], 10.5)],
    bands: [[49, 55, 2.4], [166, 170, 1.4], [170, 176, 3.8]],
    balconies: [[0, 0.05, 0.55, 8], [1, 0.05, 0.5, 6]],
    ground: [
      { k: 'arch', x: [0.05, 0.4], y: [3, 42], rise: 9, frame: '#7a4a3a', ring: '#f4f1e8' },
      { k: 'arch', x: [0.5, 0.68], y: [3, 42], rise: 8, wood: true, frame: '#5a3a26', ring: '#f4f1e8' },
    ],
  },
  {
    // biała kamienica o trzech osiach z brązowymi oknami, naczółki odcinkowe i żelazny balkon
    name: 'Biała z balkonem', mid: [625, 142], seed: 42, wall: '#ebe6dd', base: '#e2dccf', groundTop: 52, trim: '#faf8f1', frame: '#6a3b2a', eave: 178,
    axes: [0.17, 0.5, 0.84],
    floors: [FL([66, 94], 11.5, { hood: 'hood' }), FL([106, 134], 11.5, { hood: 'hood' }), FL([146, 170], 11)],
    bands: [[49, 55, 2.4], [172, 176, 1.4], [176, 180, 3.8]],
    balconies: [[1, 0.34, 0.66, 8]],
    ground: [
      { k: 'door', x: [0.08, 0.26], y: [3, 40] },
      { k: 'shop', x: [0.38, 0.92], y: [4, 42], frame: '#3a3a3a', sign: { bg: '#2f7d3a', fg: '#f4f4f0', lines: [['KSIĘGARNIA', 0.8, 0.55]] } },
    ],
  },
  {
    // szaroróżowa kamienica: trzy osie, pilastry na krawędziach, w parterze kawiarnia pod parasolami
    name: 'Szaroróżowa', mid: [565, 188], seed: 43, wall: '#e0d6cc', base: '#d9d2c8', groundTop: 52, trim: '#f3eee8', frame: '#f4f2ec', eave: 178,
    axes: [0.2, 0.5, 0.8],
    floors: [FL([66, 92], 11, { hood: 'hood' }), FL([104, 130], 11, { hood: 'hood' }), FL([142, 166], 10.5)],
    bands: [[49, 55, 2.4], [170, 174, 1.4], [174, 178, 3.8]],
    strips: [[0, 0.05], [0.95, 1]], stripY0: 55,
    ground: [
      { k: 'shop', x: [0.08, 0.5], y: [4, 42], frame: '#3a3a3a' },
      { k: 'door', x: [0.6, 0.78], y: [3, 40] },
    ],
    cafe: [0.02, 0.9],
  },
  {
    // żółta kamienica Stary Młyn: balkon w środku pierwszego piętra, w parterze łukowe witryny z kwiatami
    name: 'Stary Młyn', mid: [504, 238], seed: 44, wall: '#ecdca8', base: '#e4d5a6', groundTop: 52, trim: '#f8f1d8', frame: '#f6f3ea', eave: 178,
    axes: [0.17, 0.5, 0.83],
    floors: [FL([66, 92], 11, { hood: 'hood' }), FL([104, 130], 11, { hood: 'hood' }), FL([142, 166], 10.5)],
    bands: [[49, 55, 2.4], [170, 174, 1.4], [174, 178, 3.8]],
    balconies: [[0, 0.36, 0.64, 7, true]],
    ground: [
      { k: 'arch', x: [0.05, 0.45], y: [3, 42], rise: 8, frame: '#3a2c24', ring: '#f6f0dc' },
      { k: 'arch', x: [0.55, 0.95], y: [3, 42], rise: 8, frame: '#3a2c24', ring: '#f6f0dc' },
    ],
    signs: [{ x: [0.05, 0.45], y: [46, 51], fg: '#6b4c33', font: '700 {}px Georgia, serif', lines: [['STARY MŁYN', 0.85, 0.55]] }],
  },
  {
    // kamienica z wielkimi pilastrami i kartuszem w szczycie: balkony z kwiatami, w parterze optyk w łukowej witrynie
    name: 'Z pilastrami i kwiatami', mid: [406, 319], seed: 45, wall: '#e6d7a6', base: '#ece4d0', groundTop: 52, trim: '#f6f0dc', frame: '#f6f3ea', eave: 180,
    axes: [0.1, 0.22, 0.36, 0.64, 0.77, 0.9],
    floors: [FL([66, 92], 10.5, { hood: 'hood' }), FL([104, 130], 10.5, { hood: 'hood' }), FL([142, 166], 10)],
    bands: [[49, 55, 2.4], [170, 174, 1.4], [174, 180, 3.8]],
    strips: [[0.455, 0.545], [0, 0.03], [0.97, 1]], stripY0: 55,
    balconies: [[0, 0.04, 0.44, 8, true], [1, 0.58, 0.96, 8, true]],
    pediments: [[0.36, 0.64, 18, 180, 3, true]],
    ground: [
      { k: 'arch', x: [0.06, 0.3], y: [3, 44], rise: 8, frame: '#3a3a3a', ring: '#f6f0dc' },
      { k: 'arch', x: [0.34, 0.5], y: [3, 44], rise: 7, door: true, frame: '#5a3a26', ring: '#f6f0dc' },
      { k: 'arch', x: [0.56, 0.9], y: [3, 44], rise: 9, frame: '#3a3a3a', ring: '#f6f0dc' },
    ],
    signs: [{ x: [0.6, 0.78], y: [47, 51], fg: '#3a3a3a', font: '700 {}px Arial, sans-serif', lines: [['OPTYK', 0.8, 0.55]] }],
  },
  {
    // narożny pałacyk: brzoskwiniowa kamienica z kwiatowymi balkonami i zielonym balkonem, w parterze szare tynki
    name: 'Brzoskwiniowa', mid: [249, 451], seed: 46, wall: '#e4c19f', base: '#ddd5c8', groundTop: 54, trim: '#f0e3d0', frame: '#f4f2ec', eave: 176,
    axes: [0.15, 0.4, 0.65, 0.88],
    floors: [FL([66, 92], 10.5), FL([104, 130], 10.5), FL([142, 164], 10)],
    bands: [[50, 56, 2.2], [166, 170, 1.4], [170, 176, 3.6]],
    balconies: [[0, 0.3, 0.52, 8, true], [1, 0.3, 0.52, 8, true], [2, 0.08, 0.24, 7]],
    ground: [
      { k: 'shop', x: [0.06, 0.36], y: [4, 42], frame: '#3a3a3a' },
      { k: 'shop', x: [0.45, 0.9], y: [4, 42], frame: '#3a3a3a' },
    ],
    cafe: [0.04, 0.95],
  },
  {
    // długi narożny gmach z lat 30.: łososiowy tynk, pilastry, grupy okien z balkonami, falisty szczyt z okulusem, duże witryny
    name: 'Gmach narożny', mid: [69, 608], seed: 47, wall: '#e4c19f', base: '#ddd2c0', groundTop: 56, trim: '#ece0cc', frame: '#f4f2ec', eave: 180,
    axes: [0.05, 0.1, 0.17, 0.27, 0.315, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    floors: [FL([68, 94], 10.5), FL([106, 132], 10.5), FL([144, 168], 10.5)],
    bands: [[52, 58, 2], [172, 176, 1.2], [176, 180, 3.2]],
    strips: [[0.195, 0.215], [0.355, 0.375], [0.455, 0.475], [0.62, 0.64]], stripY0: 58,
    balconies: [[0, 0.02, 0.13, 7, true], [1, 0.02, 0.13, 7], [0, 0.25, 0.34, 8], [1, 0.25, 0.34, 8], [2, 0.25, 0.34, 8], [0, 0.67, 0.75, 6], [1, 0.67, 0.75, 6], [2, 0.67, 0.75, 6]],
    pediments: [[0.03, 0.5, 18, 180, 3, true]],
    ground: [
      { k: 'shop', x: [0.03, 0.12], y: [4, 42], frame: '#3a3a3a' },
      { k: 'shop', x: [0.14, 0.22], y: [4, 42], frame: '#3a3a3a' },
      { k: 'door', x: [0.28, 0.33], y: [3, 40] },
      { k: 'shop', x: [0.37, 0.47], y: [8, 44], frame: '#3a3a3a' },
      { k: 'shop', x: [0.5, 0.6], y: [8, 44], frame: '#3a3a3a' },
      { k: 'door', x: [0.78, 0.83], y: [3, 40] },
      { k: 'shop', x: [0.64, 0.76], y: [8, 44], frame: '#3a3a3a' },
      { k: 'shop', x: [0.87, 0.97], y: [4, 42], frame: '#3a3a3a' },
    ],
    signs: [{ x: 0.305, w: 8, y: [46, 50], bg: '#f2e2d0', fg: '#8a3a3a', lines: [['11', 0.8, 0.55]] }],
  },
];
