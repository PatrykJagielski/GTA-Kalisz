/* ---------- ulica Ciasna: odcinek najbliżej Rynku (obie pierzeje) ---------- */
// Według Street View (lata 2021–2025, na części ujęć zamazane twarze i numery), format jak w zamkowa-kit.js.
// Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const rows = (ys, h, w) => ys.map(y => ({ y: [y, y + h], w }));
// powojenny blok z balkonami: zatłuszczony tynk, pasy płyt między kondygnacjami, piwniczne okienka nad chodnikiem
const blok = (name, mid, seed, wall, n, balc, ground = []) => ({
  name, mid, seed, wall, base: '#8d8472', groundTop: 24, trim: '#d6cdb8', frame: '#f1eee6', eave: 215,
  axes: ax(n, 0.06, 0.94),
  floors: rows([40, 76, 112, 148, 184], 24, 9),
  bands: [[22, 26, 1.2], [210, 214, 1.4], [214, 215, 2.4]],
  balconies: balc.flatMap(([a, b]) => [1, 2, 3, 4].map(i => [i, a, b, 10])),
  ground,
});

export const CIASNA = [
  {
    // narożny blok z lat pięćdziesiątych: łososiowy tynk, ciemny ceglany cokół, kolumna balkonów przy rogu
    name: 'Ciasna narożny blok', mid: [-3506, -1844], seed: 131, wall: '#e8b9a5', base: '#4a3a36', groundTop: 36, trim: '#f0d8cc', frame: '#f2eee6', eave: 205,
    axes: [0.25, 0.6],
    floors: rows([48, 84, 120, 156], 24, 9),
    bands: [[34, 38, 1.4], [200, 205, 3.4]],
    balconies: [1, 2, 3].map(i => [i, 0.78, 0.98, 10]),
    ground: [],
  },
  {
    // niski dom: ochrowy tynk, pomarańczowy parter z drzwiami nr 8A, daszek kryty dachówką
    name: 'Ciasna 8A', mid: [-3222, -2093], seed: 132, wall: '#dcc08a', base: '#c8663a', groundTop: 46, trim: '#c8663a', frame: '#f0ead8', eave: 96,
    axes: [0.3],
    floors: [{ y: [58, 88], w: 5 }],
    bands: [],
    ground: [{ k: 'door', x: [0.18, 0.34], y: [2, 42], frame: '#6b3a28' }],
  },
  blok('Ciasna blok z pocztą', [-3313, -2143], 133, '#c8bba4', 5, [[0.62, 0.74]], [
    { k: 'shop', x: [0.04, 0.4], y: [8, 40], frame: '#d8d4cb' },
  ]),
  {
    // ciemna kamienica z oknami w opaskach z odcinkowymi naczółkami, brudny tynk, balkonowe drzwi na I piętrze
    name: 'Ciasna ciemna kamienica', mid: [-3144, -2220], seed: 134, wall: '#6e6556', base: '#5c5548', groundTop: 56, trim: '#a59c88', frame: '#f1eee6', eave: 178,
    axes: ax(6, 0.06, 0.94),
    floors: [{ y: [66, 94], w: 9.5 }, { y: [108, 134], w: 9.5, hood: 'hood' }, { y: [146, 168], w: 8.5, hood: 'hood' }],
    bands: [[54, 58, 1.6], [172, 176, 1.6], [176, 178, 3.4]],
    ground: ax(5, 0.1, 0.9).map(f => ({ k: 'shop', x: [f - 0.045, f + 0.045], y: [14, 44], frame: '#f1eee6' })),
  },
  blok('Ciasna blok z balkonami', [-3214, -2308], 135, '#c3b8a2', 6, [[0.2, 0.34], [0.6, 0.76]]),
  {
    // brązoworóżowa kamienica z kutym balkonem: obdrapany tynk, białe ramy okien, cokół z lastryko
    name: 'Ciasna z balkonem', mid: [-2998, -2462], seed: 136, wall: '#c28f7a', base: '#8a6a5a', groundTop: 46, trim: '#ece3d8', frame: '#f6f4ee', eave: 172,
    axes: ax(8, 0.05, 0.95),
    floors: [{ y: [58, 86], w: 10 }, { y: [98, 126], w: 10 }, { y: [138, 160], w: 9 }],
    bands: [[46, 50, 1.4], [92, 95, 1.2, 0, 1, '#ece3d8'], [164, 168, 1.6], [168, 172, 3.6]],
    balconies: [[0, 0.26, 0.36, 9]],
    ground: ax(7, 0.08, 0.92).map(f => ({ k: 'shop', x: [f - 0.035, f + 0.035], y: [10, 36], frame: '#f2efe8' })),
  },
  {
    // beżowa kamienica z przejazdem bramowym pośrodku, wyłażący tynk w partii parteru
    name: 'Ciasna z przejazdem', mid: [-3098, -2502], seed: 137, wall: '#cdbf9e', base: '#c6b690', groundTop: 62, trim: '#dcd0b0', frame: '#f4f0e6', eave: 190,
    axes: [0.14, 0.3, 0.66, 0.82],
    floors: [{ y: [70, 96], w: 9.5 }, { y: [108, 134], w: 9.5 }, { y: [146, 170], w: 9 }],
    bands: [[60, 64, 2], [176, 180, 1.6], [180, 190, 3.8]],
    ground: [
      { k: 'shop', x: [0.04, 0.16], y: [10, 46], frame: '#f4f0e6' },
      { k: 'arch', x: [0.42, 0.56], y: [2, 54], rise: 6, gate: true },
      { k: 'shop', x: [0.66, 0.76], y: [10, 46], frame: '#f4f0e6' },
      { k: 'shop', x: [0.82, 0.92], y: [10, 46], frame: '#f4f0e6' },
    ],
  },
  {
    // zdobiona kamienica: okna w opaskach z naczółkami, ciemny kamienny cokół, tynk w kolorze szarobeżowym
    name: 'Ciasna zdobiona', mid: [-2876, -2666], seed: 138, wall: '#bdb09a', base: '#2e2e30', groundTop: 56, trim: '#d8cdb6', frame: '#f4f0e6', eave: 186,
    axes: ax(4, 0.1, 0.9),
    floors: [{ y: [66, 96], w: 10, hood: 'hood' }, { y: [108, 136], w: 10, hood: 'hood' }, { y: [148, 170], w: 9 }],
    bands: [[56, 60, 2], [176, 180, 1.6], [180, 186, 3.8]],
    ground: ax(4, 0.1, 0.9).map(f => ({ k: 'shop', x: [f - 0.07, f + 0.07], y: [14, 44], frame: '#f4f0e6' })),
  },
  {
    // ciemna kamienica z balkonowymi drzwiami: brudny tynk, jasny cokół, okna z zamkniętymi okiennicami
    name: 'Ciasna z balkonami francuskimi', mid: [-2966, -2724], seed: 139, wall: '#8a8478', base: '#b4a9a2', groundTop: 52, trim: '#a6a090', frame: '#f1eee6', eave: 178,
    axes: ax(8, 0.05, 0.95),
    floors: [{ y: [60, 90], w: 9.5 }, { y: [102, 130], w: 9.5, hood: 'hood' }, { y: [142, 164], w: 8.5 }],
    bands: [[50, 54, 1.6], [168, 172, 1.4], [172, 178, 3.4]],
    balconies: [[0, 0.1, 0.2, 7]],
    ground: ax(7, 0.07, 0.93).map(f => ({ k: 'shop', x: [f - 0.035, f + 0.035], y: [10, 40], frame: '#f1eee6' })),
  },
  {
    // parter pomalowany na niebiesko (sklep z zabawkami i artykułami papierniczymi), szare kondygnacje nad nim
    name: 'Ciasna Zabawki', mid: [-2807, -2778], seed: 140, wall: '#b8b49c', base: '#3a6fb0', groundTop: 60, trim: '#d2cdb8', frame: '#f4f2ea', eave: 182,
    axes: [0.15, 0.4, 0.65, 0.88],
    floors: rows([70, 106, 142], 26, 9.5),
    bands: [[60, 64, 1.6], [172, 176, 1.6], [176, 182, 3.6]],
    ground: [
      { k: 'shop', x: [0.06, 0.38], y: [10, 52], frame: '#2a2a2a' },
      { k: 'shop', x: [0.46, 0.7], y: [10, 52], frame: '#f0efe8', door: [0.46, 0.52] },
    ],
    signs: [{ x: [0.08, 0.36], y: [54, 60], bg: '#f4efe0', fg: '#c8301e', font: '800 {}px Arial, sans-serif', lines: [['ZABAWKI', 0.5, 0.55]] }],
  },
  {
    // narożna kamienica Ciasna 2: balkon z zielonym kutym balustradą nad wejściem do szafiarni
    name: 'Ciasna 2', mid: [-2756, -2857], seed: 141, wall: '#b9b4a2', base: '#9c9486', groundTop: 56, trim: '#cfc8b4', frame: '#f4f2ea', eave: 182,
    axes: [0.7],
    floors: [{ y: [66, 96], w: 9, at: [0.7] }, { y: [108, 136], w: 9, at: [0.7] }, { y: [148, 170], w: 8, at: [0.7] }],
    bands: [[56, 60, 1.6], [176, 182, 3.4]],
    balconies: [[0, 0.1, 0.5, 11]],
    ground: [{ k: 'door', x: [0.1, 0.4], y: [2, 46], frame: '#2a2a2a' }, { k: 'shop', x: [0.5, 0.9], y: [12, 44], frame: '#d6d0c0' }],
  },
  {
    // długi, piętrowy dom z komisem odzieżowym: ciemnobeżowy tynk, gzyms nad parterem, małe okna poddasza w attyce
    name: 'Ciasna komis', mid: [-2836, -2940], seed: 142, wall: '#b8ab8e', base: '#9a8e74', groundTop: 52, trim: '#d4c9ae', frame: '#f4f2ea', eave: 132,
    axes: ax(6, 0.04, 0.8),
    floors: [{ y: [62, 90], w: 9.5 }, { y: [106, 118], w: 5.5 }],
    bands: [[52, 56, 1.8], [124, 128, 1.4], [128, 132, 2.4]],
    ground: [
      { k: 'shop', x: [0.04, 0.12], y: [10, 40], frame: '#f4f2ea' },
      { k: 'shop', x: [0.28, 0.34], y: [10, 40], frame: '#f4f2ea' },
      { k: 'shop', x: [0.8, 0.9], y: [10, 46], frame: '#f4f2ea' },
      { k: 'door', x: [0.92, 0.99], y: [2, 46], frame: '#f4f2ea' },
    ],
    signs: [{ x: [0.78, 0.9], y: [47, 52], bg: '#f4f2ea', fg: '#3a2a2a', font: '700 {}px Arial, sans-serif', lines: [['KOMIS', 0.5, 0.5]] }],
  },
  {
    // narożna kamienica Firany: ciemne piętra ze szczytem i oknami w opaskach, beżowy parter z wejściem i granatowym szyldem
    name: 'Ciasna Firany', mid: [-2738, -3096], seed: 143, wall: '#5a5650', base: '#7a5a3a', groundTop: 56, trim: '#8a8072', frame: '#f1eee6', eave: 182,
    axes: [0.2, 0.7],
    floors: [{ y: [68, 98], w: 8, hood: 'hood' }, { y: [110, 138], w: 8, hood: 'hood' }, { y: [150, 170], w: 7 }],
    bands: [[56, 60, 1.8], [174, 178, 1.6]],
    panels: [[0, 1, '#d8cfaa', 10, 56]],
    pediments: [[0.1, 0.9, 12, 182, 1.5, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.4], y: [14, 46], frame: '#2a4a8a' },
      { k: 'door', x: [0.46, 0.58], y: [2, 46], frame: '#2a2a2e' },
      { k: 'door', x: [0.74, 0.86], y: [2, 46], frame: '#b02a2a' },
    ],
    signs: [{ x: [0.06, 0.5], y: [48, 55], bg: '#1c3a8a', fg: '#f4d03a', font: '800 {}px Arial, sans-serif', lines: [['HURT DETAL FIRANY', 0.5, 0.55]] }],
  },
];
