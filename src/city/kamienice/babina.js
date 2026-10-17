/* ---------- ulica Babina: pierzeja północna między ulicą Kazimierzowską a Targową (odcinek najbliżej Rynku) ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy
// (front zwrócony na południe, więc lewy koniec = zachodni).
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const nr = (x, y, t) => ({ x, w: 2.6, y: [y, y + 2.2], bg: '#1d2533', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [[t, 0.62, 0.56]] });
// powojenny blok z balkonami: tynk, ceglany cokół, lokale na parterze; k = kolor, kolumny balkonów b = [od, do]
const blok = (name, mid, seed, wall, axes, ground, balc, extra = {}) => ({
  name, mid, seed, wall, base: '#a9483a', groundTop: 10, trim: '#d9d3c7', frame: '#f4f2ee', eave: 192,
  axes, floors: [60, 94, 128, 162].map(y => ({ y: [y, y + 24], w: 9 })),
  bands: [[8, 12, 1.4], [184, 188, 1.4], [188, 192, 3.2]],
  balconies: balc.flatMap(([a, b]) => [0, 1, 2, 3].map(i => [i, a, b, 11])),
  ground, ...extra,
});

export const BABINA = [
  {
    // kamienica z bramą: kremowy tynk, kamienne balustrady pod oknami I piętra, łukowe okna parteru, brama z kratą pośrodku
    name: 'Babina z bramą', mid: [-1000, -2708], seed: 101, wall: '#e8e2cf', base: '#d3c7a8', groundTop: 56, trim: '#efe9d8', frame: '#f6f4ee', eave: 180,
    axes: [0.1, 0.27, 0.52, 0.7, 0.82, 0.93],
    floors: [{ y: [66, 92], w: 9.5, hood: 'hood' }, { y: [104, 130], w: 9.5, hood: 'hood' }, { y: [142, 164], w: 9 }],
    bands: [[54, 58, 2.2], [98, 101, 1.4], [170, 175, 1.8], [175, 180, 4.2]],
    balconies: [[0, 0.06, 0.15, 5], [0, 0.22, 0.32, 5], [0, 0.65, 0.75, 5], [0, 0.78, 0.87, 5]],
    ground: [
      { k: 'arch', x: [0.04, 0.2], y: [8, 48], rise: 8, ring: '#f1ecdc', frame: '#f6f4ee' },
      { k: 'arch', x: [0.22, 0.36], y: [8, 48], rise: 8, ring: '#f1ecdc', frame: '#f6f4ee' },
      { k: 'arch', x: [0.44, 0.6], y: [2, 52], rise: 9, gate: true, ring: '#d9cdb0' },
      { k: 'arch', x: [0.64, 0.74], y: [8, 48], rise: 5, door: true, ring: '#f1ecdc', frame: '#f6f4ee' },
      { k: 'arch', x: [0.8, 0.92], y: [8, 48], rise: 6, ring: '#f1ecdc', frame: '#f6f4ee' },
    ],
  },
  {
    // brudnobeżowa kamienica: ciemna drewniana brama pośrodku, lokale ze schodkami, gzymsy między piętrami
    name: 'Babina z drewnianą bramą', mid: [-800, -2770], seed: 102, wall: '#cdb99c', base: '#b4a58b', groundTop: 50, trim: '#d8c9ad', frame: '#f2efe8', eave: 172,
    axes: ax(8, 0.04, 0.96),
    floors: [{ y: [62, 88], w: 9.5 }, { y: [100, 126], w: 9.5 }, { y: [138, 160], w: 9 }],
    bands: [[50, 53, 1.6], [94, 96, 1.2], [164, 168, 1.6], [168, 172, 3.6]],
    ground: [
      { k: 'shop', x: [0.04, 0.14], y: [12, 44], frame: '#f2efe8', door: [0.04, 0.09] },
      { k: 'shop', x: [0.26, 0.36], y: [14, 40], frame: '#f2efe8' },
      { k: 'arch', x: [0.46, 0.62], y: [2, 48], rise: 0, wood: true, frame: '#3b2a1e' },
      { k: 'shop', x: [0.68, 0.8], y: [4, 44], frame: '#f2efe8', door: [0.68, 0.72] },
      { k: 'shop', x: [0.86, 0.92], y: [14, 40], frame: '#f2efe8' },
    ],
  },
  {
    // biała kamienica z sztukateriami: boniowany parter z piaskowca, naczółki nad oknami I piętra, gzyms z konsolami
    name: 'Babina z naczółkami', mid: [-636, -2820], seed: 103, wall: '#ece8dc', base: '#cdbd98', groundTop: 56, trim: '#f4f1e8', frame: '#f6f4ee', eave: 176,
    axes: [0.17, 0.42, 0.65, 0.89],
    floors: [{ y: [66, 92], w: 10, hood: 'hood' }, { y: [104, 128], w: 10 }, { y: [140, 158], w: 9 }],
    bands: [[54, 58, 2.2], [98, 101, 1.2], [166, 170, 1.6], [170, 176, 4.2]],
    rustic: [[0, 54]],
    ground: [
      { k: 'shop', x: [0.1, 0.24], y: [10, 46], frame: '#f2f0e8' },
      { k: 'shop', x: [0.34, 0.48], y: [10, 46], frame: '#f2f0e8' },
      { k: 'shop', x: [0.6, 0.74], y: [10, 46], frame: '#f2f0e8' },
      { k: 'shop', x: [0.82, 0.98], y: [4, 46], frame: '#2a2a2a', door: [0.88, 0.96] },
    ],
  },
  {
    // długi blok mieszkalny: różowy i kremowy tynk, pasaż bramowy o wysokości 2,6 m, witryny Starej Zielarni i innych lokali, kolumny balkonów
    name: 'Babina blok', mid: [-332, -2920], seed: 104, wall: '#e0b3a0', base: '#b9b2a6', groundTop: 8, trim: '#efeae0', frame: '#f4f2ee', eave: 196,
    axes: ax(14, 0.02, 0.98),
    floors: [60, 94, 128, 162].map(y => ({ y: [y, y + 24], w: 9 })),
    bands: [[6, 10, 1.4], [52, 58, 1.2], [188, 192, 1.4], [192, 196, 3.2]],
    panels: [[0, 0.3, '#e6d9bb'], [0.7, 1, '#e0a79a']],
    balconies: [0, 1, 2, 3].flatMap(i => [[i, 0.3, 0.42, 12], [i, 0.58, 0.7, 12]]),
    ground: [
      { k: 'shop', x: [0.04, 0.17], y: [14, 46], frame: '#f2efe8' },
      { k: 'shop', x: [0.19, 0.27], y: [4, 46], frame: '#f2efe8', door: [0.19, 0.23] },
      { k: 'arch', x: [0.33, 0.41], y: [2, 30], rise: 2, frame: '#4a3a24' },
      { k: 'shop', x: [0.47, 0.58], y: [14, 46], frame: '#3b4a3d' },
      { k: 'shop', x: [0.6, 0.78], y: [14, 46], frame: '#3b4a3d' },
      { k: 'shop', x: [0.8, 0.97], y: [4, 46], frame: '#f2efe8', door: [0.82, 0.88] },
    ],
    signs: [
      { x: [0.76, 0.98], y: [48, 56], bg: '#f4f2ee', fg: '#2e8b3e', font: '800 {}px Arial, sans-serif', lines: [['STARA ZIELARNIA', 0.5, 0.55]] },
      { x: [0.1, 0.34], y: [48, 56], bg: '#2a3a2e', fg: '#f4f2ee', font: '700 {}px Arial, sans-serif', lines: [['pościel · kołdry · koce', 0.5, 0.55]] },
    ],
  },
  {
    // kamienica ze stropowym balkonem na wysięgnikach: kremowy tynk z gzymsami, brama z żelazną kratą, sklepy po bokach
    name: 'Babina z balkonem', mid: [18, -3020], seed: 105, wall: '#e4dfcf', base: '#bdb7a8', groundTop: 62, trim: '#f0ece0', frame: '#f6f4ee', eave: 190,
    axes: ax(6, 0.05, 0.95),
    floors: [{ y: [76, 102], w: 9.5, hood: 'hood' }, { y: [114, 138], w: 9.5, hood: 'hood' }, { y: [150, 170], w: 9 }],
    bands: [[62, 66, 2.4], [108, 111, 1.4], [176, 181, 1.8], [181, 190, 4.4]],
    balconies: [[0, 0.22, 0.78, 14, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [12, 52], frame: '#f2f0e8' },
      { k: 'arch', x: [0.38, 0.6], y: [2, 56], rise: 0, gate: true },
      { k: 'shop', x: [0.66, 0.9], y: [4, 52], frame: '#f2f0e8', door: [0.8, 0.88] },
    ],
  },
  blok('Babina blok: Diva', [146, -3078], 106, '#ece7df', [0.3, 0.72], [{ k: 'shop', x: [0.06, 0.9], y: [12, 46], frame: '#3b4a3d' }], [[0.15, 0.5]]),
  blok('Babina blok: Fotograf', [246, -3110], 107, '#ece7df', [0.18, 0.5, 0.82], [
    { k: 'shop', x: [0.04, 0.4], y: [14, 46], frame: '#2a2a2a' },
    { k: 'shop', x: [0.5, 0.96], y: [14, 46], frame: '#d9d3c7' },
  ], [[0.34, 0.58]], { signs: [{ x: [0.06, 0.36], y: [48, 54], bg: '#222222', fg: '#f6f6f2', font: '800 {}px Arial, sans-serif', lines: [['FOTOGRAF', 0.5, 0.55]] }] }),
  blok('Babina blok: Apteka', [367, -3147], 108, '#ebe6dc', [0.18, 0.5, 0.82], [
    { k: 'door', x: [0.04, 0.12], y: [2, 44] },
    { k: 'shop', x: [0.2, 0.46], y: [14, 44], frame: '#d9d3c7' },
    { k: 'shop', x: [0.56, 0.94], y: [14, 44], frame: '#d9d3c7' },
  ], [[0.34, 0.66]], { signs: [{ x: [0.16, 0.5], y: [47, 53], bg: '#f6f6f2', fg: '#2e8b3e', font: '800 {}px Arial, sans-serif', lines: [['APTEKA WODNIK', 0.5, 0.55]] }] }),
  blok('Babina 4', [463, -3178], 109, '#ddd2c8', [0.3, 0.7], [
    { k: 'shop', x: [0.04, 0.4], y: [14, 44], frame: '#d9d3c7' },
    { k: 'door', x: [0.5, 0.64], y: [2, 44], frame: '#d9694a' },
  ], [[0.5, 0.95]], { signs: [nr(0.44, 36, '4')] }),
  {
    // willa w stylu klasycystycznym: biały tynk, pas cokołowy z wywietrznikami, wysokie okna z opaskami, attyka
    name: 'Babina willa', mid: [720, -3166], seed: 110, wall: '#e9e8e4', base: '#d6d4cf', groundTop: 20, trim: '#f2f1ed', frame: '#f6f5f1', eave: 112,
    axes: [0.3, 0.72],
    floors: [{ y: [36, 78], w: 9, hood: 'hood' }, { y: [88, 106], w: 8 }],
    bands: [[18, 22, 1.5], [80, 84, 1.6], [108, 112, 3.5]],
    ground: [],
  },
  {
    // wysunięty ryzalit willi: pilastry po bokach, trójkątny fronton, okna parteru w opaskach
    name: 'Babina willa: ryzalit', mid: [768, -3156], seed: 111, wall: '#e9e8e4', base: '#d6d4cf', groundTop: 20, trim: '#f2f1ed', frame: '#f6f5f1', eave: 112,
    axes: [0.5],
    floors: [{ y: [36, 78], w: 9, hood: 'hood' }, { y: [88, 106], w: 8 }],
    bands: [[18, 22, 1.5], [80, 84, 1.6], [108, 112, 3.5]],
    strips: [[0, 0.1], [0.9, 1]], stripY0: 22,
    pediments: [[0, 1, 9, 112, 2, false]],
    ground: [],
  },
];
