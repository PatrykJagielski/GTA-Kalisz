/* ---------- ulica Niecała: pierzeje przy skwerze od placu Kilińskiego w stronę ulicy Kościuszki ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

export const NIECALA = [
  {
    // długa kamienica: różowy boniowany parter z łukową bramą i drewnianymi wrotami, kremowe piętra, okna z barokowymi opaskami
    name: 'Niecała z bramą', mid: [2714, -2490], seed: 121, wall: '#efe4d3', base: '#d9a88e', groundTop: 56, trim: '#f4ecdf', frame: '#f6f2ea', eave: 200,
    axes: ax(8),
    floors: [{ y: [66, 94], w: 10, hood: 'hood' }, { y: [106, 134], w: 10, hood: 'hood' }, { y: [146, 172], w: 9.5 }],
    bands: [[54, 58, 2.2], [100, 103, 1.4], [178, 182, 1.6], [182, 200, 4.4]],
    rustic: [[0, 54]], panels: [[0, 1, '#dcae94', 0, 100]],
    ground: [
      { k: 'arch', x: [0.1, 0.18], y: [2, 52], rise: 8, wood: true, frame: '#6b3a28', ring: '#efe3d0' },
      ...[0.3, 0.46, 0.62, 0.78, 0.92].map(f => ({ k: 'shop', x: [f - 0.05, f + 0.05], y: [16, 40], frame: '#f4ecdf' })),
    ],
  },
  {
    // niska stacja transformatorowa: kremowy tynk, zielone rynny i obrzeża, dach kryty łupkiem
    name: 'Niecała trafostacja', mid: [2887, -2272], seed: 122, wall: '#e9e2cc', base: '#cfc9b3', groundTop: 6, trim: '#b4c0a8', frame: '#4a6a48', eave: 42,
    axes: [], floors: [],
    bands: [[40, 42, 1.4, 0, 1, '#4a6a48']],
    strips: [[0, 0.04], [0.96, 1]], stripY0: 6,
    ground: [{ k: 'door', x: [0.15, 0.35], y: [2, 28], frame: '#d8d2b8' }],
  },
  {
    // różowa, zniszczona kamienica: boniowany parter z zamurowanymi otworami, trójkątne naczółki nad oknami II piętra
    name: 'Niecała różowa', mid: [2974, -2370], seed: 123, wall: '#e3c3a9', base: '#e8d6c0', groundTop: 56, trim: '#efdcc8', frame: '#f4f0e8', eave: 190,
    axes: ax(7),
    floors: [{ y: [68, 94], w: 9.5 }, { y: [108, 134], w: 9.5, hood: 'hood' }, { y: [148, 170], w: 9 }],
    bands: [[56, 60, 2], [100, 103, 1.2], [176, 180, 1.6], [180, 190, 4]],
    balconies: [[0, 0, 0.1, 9], [1, 0, 0.1, 9]],
    ground: [
      { k: 'arch', x: [0.02, 0.1], y: [2, 50], rise: 6, gate: true },
      ...[0.3, 0.5, 0.7, 0.9].map(f => ({ k: 'arch', x: [f - 0.06, f + 0.06], y: [8, 40], rise: 3, frame: '#8a4a38', ring: '#e8d6c0' })),
    ],
  },
  {
    // biały budynek z balkonem: naczółki nad oknami I piętra, boniowany parter, ryzalit z narożnym szczytem
    name: 'Niecała biała', mid: [3238, -2120], seed: 124, wall: '#e9e9e3', base: '#d9d8d0', groundTop: 54, trim: '#f3f3ee', frame: '#f6f6f2', eave: 178,
    axes: [0.12, 0.36, 0.62, 0.88],
    floors: [{ y: [64, 92], w: 10, hood: 'hood' }, { y: [106, 132], w: 10, hood: 'hood' }, { y: [144, 164], w: 9 }],
    bands: [[52, 56, 2.2], [98, 101, 1.4], [168, 172, 1.6], [172, 178, 4]],
    balconies: [[0, 0.5, 0.75, 8]],
    rustic: [[0, 52]],
    ground: [
      { k: 'shop', x: [0.08, 0.18], y: [12, 44], frame: '#f6f6f2' },
      { k: 'shop', x: [0.56, 0.68], y: [12, 44], frame: '#f6f6f2' },
      { k: 'shop', x: [0.82, 0.94], y: [12, 44], frame: '#f6f6f2' },
    ],
  },
  {
    // długi gmach z lat trzydziestych: kremowe piętra z białymi pasami lizen, bordowy cokół i różowy parter, wejście pod okrągłym daszkiem
    name: 'Niecała gmach', mid: [3274, -2227], seed: 125, wall: '#efe9d4', base: '#8a3a54', groundTop: 56, trim: '#fbf8ee', frame: '#9a5a2a', eave: 208,
    axes: ax(14),
    floors: [60, 96, 132, 168].map(y => ({ y: [y, y + 24], w: 8.5 })),
    bands: [[24, 28, 1.2, 0, 1, '#5a1f33'], [54, 58, 1.6], [196, 200, 1.6], [200, 208, 3.2]],
    strips: ax(14).map(f => [f - 0.04, f - 0.034]), stripY0: 58,
    panels: [[0, 1, '#a8526a', 28, 56]],
    ground: [
      { k: 'shop', x: [0.04, 0.16], y: [10, 46], frame: '#9a5a2a' },
      { k: 'shop', x: [0.2, 0.28], y: [10, 46], frame: '#9a5a2a' },
      { k: 'door', x: [0.32, 0.4], y: [2, 48], frame: '#9a5a2a' },
      { k: 'shop', x: [0.46, 0.56], y: [10, 46], frame: '#9a5a2a' },
      { k: 'shop', x: [0.62, 0.7], y: [10, 46], frame: '#9a5a2a' },
      { k: 'shop', x: [0.76, 0.86], y: [10, 46], frame: '#9a5a2a' },
    ],
    awnings: [[0.3, 0.42, 52, 8, '#26211f']],
  },
  {
    // parterowy pawilon: kremowy tynk na brązowym cokole z płytek, okrągły szyld lokalu, witryna
    name: 'Niecała pawilon', mid: [3460, -2040], seed: 126, wall: '#efecde', base: '#6b3a2c', groundTop: 18, trim: '#e4dfc8', frame: '#e8e2cc', eave: 52,
    axes: [], floors: [],
    bands: [[48, 52, 2.4]],
    strips: [[0, 0.05], [0.95, 1]], stripY0: 18,
    ground: [{ k: 'shop', x: [0.55, 0.85], y: [12, 44], frame: '#e8e2cc' }],
  },
  {
    // modernistyczna willa: kremowy tynk, różowa wieża klatki schodowej z pionowym oknem, czerwony portal wejścia i balkon z poręczą
    name: 'Niecała willa', mid: [3958, -1753], seed: 127, wall: '#eee4c5', base: '#d9806e', groundTop: 30, trim: '#d9806e', frame: '#5a3a24', eave: 120,
    axes: [0.2, 0.5],
    floors: [{ y: [66, 86], w: 6 }, { y: [66, 86], w: 6, at: [0.7] }],
    bands: [[116, 120, 3.4, 0, 1, '#ddd2b0']],
    panels: [[0.52, 0.76, '#d9806e', 30, 120]],
    balconies: [[0, 0.45, 0.85, 7]],
    ground: [{ k: 'door', x: [0.52, 0.76], y: [2, 48], frame: '#c9553d' }],
  },
];
