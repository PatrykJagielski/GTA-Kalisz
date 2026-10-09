import { bands3, floors3, nr, street } from './zamkowa-kit.js';

/* ---------- ulica Zamkowa, pierzeja południowo-wschodnia (numery nieparzyste) od placu św. Józefa do Rynku ---------- */
// Według Street View (paź 2024). Lewy koniec frontu = strona placu św. Józefa, prawy = Rynku. Kamienica na rogu placu
// (z drogerią) ma osobny model w landmarks/narozna.js.
const BROWN = '#6e3f2c', GREEN = '#b2c09d', arches = (cs, w, o) => cs.map(c => ({ k: 'arch', x: [c - w / 2, c + w / 2], y: [5, 44], rise: 9, ...o }));
const ax12 = i => (i + 0.5) / 12;

export const ZAMKOWA_SE = [
  {
    // narożna z Rynkiem (front od Rynku zwykły, ten od Zamkowej ze zdjęć): żółta z brązowymi opaskami, dwa zielone
    // ryzality z balkonami; w parterze łukowe witryny, brama z ceglanym łukiem, sklep mięsny, na rogu Cukiernia
    name: 'Cukiernia', mid: [338, -640], seed: 31, wall: '#e6d6a3', base: '#efe7cb', groundTop: 54, trim: '#7b4a35', frame: '#f4f2ec', eave: 175,
    axes: [...Array(12).keys()].map(ax12),
    floors: [{ y: [64, 89], w: 9.5 }, { y: [101, 126], w: 9.5 }, { y: [138, 160], w: 9 }],
    bands: [[52, 56, 2.6, 0, 1, BROWN], [166, 170, 1.6, 0, 1, BROWN], [170, 175, 4.4, 0, 1, BROWN]],
    panels: [[1 / 6, 2 / 6, GREEN, 56], [4 / 6, 5 / 6, GREEN, 56], [0, 1 / 6, '#d8c9aa', -2, 52], [0, 1, '#5e3a2a', -2, 4]],
    balconies: [[0, 0.172, 0.328, 9, true], [1, 0.252, 0.328, 9], [2, 0.172, 0.248, 9, true],
      [0, 0.672, 0.828, 9, true], [1, 0.672, 0.748, 9], [2, 0.752, 0.828, 9, true]],
    medallions: [0.375, 0.458, 0.542, 0.625], medY: 131, medColor: '#a87a5e',
    ground: [
      { k: 'arch', x: [0.025, 0.15], y: [3, 46], rise: 11, door: true, frame: '#6b3a22', ring: '#9a5a3e' },
      ...arches([ax12(2), ax12(3), ax12(4)], 0.064, { frame: '#5a3a2a' }),
      { k: 'arch', x: [ax12(5) - 0.04, ax12(5) + 0.04], y: [3, 46], rise: 8, gate: true, ring: '#9a5a3e' },
      { k: 'arch', x: [ax12(6) - 0.034, ax12(6) + 0.034], y: [3, 44], rise: 8, door: true, frame: '#5a3a2a' },
      ...arches([ax12(7), ax12(8), ax12(9), ax12(10), ax12(11)], 0.064, { frame: '#5a3a2a' }),
    ],
    signs: [
      { x: [0.045, 0.13], y: [37, 42], bg: '#5a3d2c', fg: '#f4ead8', border: '#e8dcc4', lines: [['SKLEP MIĘSNY', 0.6, 0.55]] },
      { x: [0.385, 0.415], y: [28, 35], bg: '#d4532a', fg: '#ffffff', lines: [['PODRĘCZNIKI', 0.3, 0.33], ['SKUP·SPRZEDAŻ', 0.22, 0.72]] },
      { x: [0.43, 0.48], y: [47, 50], bg: '#7a2d22', fg: '#f3e7d2', lines: [['ANTYKWARIAT', 0.62, 0.55]] },
      { x: [0.86, 0.99], y: [45.5, 51], bg: '#1c2a4a', fg: '#e2c46a', border: '#e2c46a', font: '700 {}px Georgia, serif', lines: [['CUKIERNIA', 0.7, 0.55]] },
      street(0.25, 47),
    ],
  },
  {
    name: 'Luxinn', mid: [528, -785], seed: 32, wall: '#bfb7a5', base: '#9c8b7a', groundTop: 44, trim: '#cfc8b8', frame: '#f4f2ec', eave: 172,
    axes: [0.3, 0.72],
    floors: floors3(10), bands: bands3(2.2),
    balconies: [[0, 0.12, 0.48, 10, true], [1, 0.12, 0.48, 10]],
    ground: [
      { k: 'arch', x: [0.15, 0.55], y: [8, 40], rise: 6, frame: '#3c3a38' },
      { k: 'arch', x: [0.62, 0.78], y: [3, 40], rise: 4, wood: true, frame: '#8a5a3a', ring: '#c8735a' },
    ],
    signs: [{ x: [0.13, 0.57], y: [44, 50], bg: '#d8c58a', fg: '#4a4030', font: '500 {}px Georgia, serif', lines: [['LUXINN', 0.55, 0.4], ['Premium Collection', 0.2, 0.82]] },
      nr(0.86, 41, '3')],
  },
  {
    // pistacjowy parter z białymi opaskami łuków; nr 7: odzież i drzwi, nr 5: drzwi i fryzjer „U Kamila”, notariusz na balkonie
    name: 'Zamkowa 7', mid: [634, -861], seed: 33, wall: '#ecebd8', base: '#c9d49b', groundTop: 54, trim: '#f7f6ee', frame: '#f6f6f2', eave: 172,
    axes: [0.3, 0.75],
    floors: floors3(10), bands: bands3(2.4),
    balconies: [[0, 0.1, 0.62, 10, true]],
    ground: [
      { k: 'arch', x: [0.08, 0.56], y: [3, 46], rise: 10, door: true, frame: '#6a3b24', ring: '#f6f4ec' },
      { k: 'arch', x: [0.68, 0.92], y: [3, 44], rise: 6, wood: true, ring: '#f6f4ec' },
    ],
    signs: [nr(0.62, 40, '7')],
  },
  {
    name: 'Zamkowa 5', mid: [585, -826], seed: 34, wall: '#ecebd8', base: '#c9d49b', groundTop: 54, trim: '#f7f6ee', frame: '#f6f6f2', eave: 172,
    axes: [0.3, 0.72],
    floors: floors3(10), bands: bands3(2.4),
    balconies: [[0, 0.1, 0.5, 9]],
    ground: [
      { k: 'arch', x: [0.08, 0.34], y: [3, 44], rise: 6, wood: true, ring: '#f6f4ec' },
      { k: 'arch', x: [0.48, 0.9], y: [3, 46], rise: 9, door: true, frame: '#3a3532', ring: '#f6f4ec' },
    ],
    signs: [
      { x: [0.14, 0.44], y: [58, 62], bg: '#f4f4f2', fg: '#1d1d1d', border: '#1d1d1d', z: 9.3, lines: [['NOTARIUSZ', 0.7, 0.55]] },
      { x: [0.52, 0.86], y: [33, 39], bg: '#2a2624', fg: '#f2efe8', lines: [['FRYZJER  MĘSKI', 0.34, 0.3], ['CHŁOPIĘCY „U KAMILA”', 0.3, 0.72]] },
      nr(0.42, 40, '5'),
    ],
  },
  {
    // oliwkowa z lizenami, łukowe witryny w brązowych ramach, brama w kamiennym portalu
    name: 'Zamkowa 9', mid: [744, -928], seed: 35, wall: '#cfc8a3', base: null, groundTop: 52, trim: '#e3ddc2', frame: '#6a3b2a', eave: 175,
    axes: [0.08, 0.25, 0.42, 0.58, 0.75, 0.92],
    floors: [{ y: [64, 89], w: 9.5, hood: 'hood' }, { y: [101, 126], w: 9.5 }, { y: [138, 160], w: 9 }],
    bands: bands3(2.4, 175), strips: [[0.16, 0.19], [0.5, 0.53], [0.83, 0.86]],
    balconies: [[0, 0.01, 0.17, 9, true], [1, 0.01, 0.17, 9]],
    ground: [
      { k: 'arch', x: [0.08, 0.2], y: [3, 42], rise: 6, door: true, frame: '#6a3b2a' },
      { k: 'arch', x: [0.25, 0.41], y: [8, 42], rise: 8, frame: '#6a3b2a' },
      { k: 'arch', x: [0.5, 0.62], y: [3, 44], rise: 6, wood: true, ring: '#ece9de' },
      { k: 'arch', x: [0.76, 0.96], y: [3, 44], rise: 9, door: true, frame: '#6a3b2a' },
    ],
    signs: [{ x: [0.78, 0.83], y: [12, 26], bg: '#e2312a', fg: '#f6d33c', lines: [['ODZIEŻ', 0.16, 0.5]] }, nr(0.655, 38, '9')],
  },
  {
    // za Chodyńskiego, na rogu: łukowe witryny, wędliny z tradycją
    name: 'Zamkowa 11', mid: [950, -1042], seed: 36, wall: '#e5dcc5', base: null, groundTop: 52, trim: '#efe9d8', frame: '#f6f5f0', eave: 172,
    axes: [0.12, 0.32, 0.55, 0.78, 0.95],
    floors: floors3(9.5, { hood: 'hood' }), bands: bands3(2.4),
    balconies: [[0, 0.17, 0.48, 11], [1, 0.17, 0.48, 11], [1, 0.88, 1, 8]],
    ground: [
      { k: 'arch', x: [0.05, 0.16], y: [3, 42], rise: 5, door: true, frame: '#6a3b2a' },
      { k: 'arch', x: [0.24, 0.43], y: [6, 42], rise: 7, frame: '#6a3b2a' },
      { k: 'arch', x: [0.56, 0.8], y: [6, 44], rise: 9, frame: '#6a3b2a', ring: '#f2eee2' },
    ],
    signs: [{ x: [0.58, 0.78], y: [34, 40], bg: '#f4ead2', fg: '#b2232a', border: '#b2232a', font: '700 {}px Georgia, serif',
      lines: [['POLSKIE WĘDLINY', 0.36, 0.3], ['z TRADYCJĄ', 0.4, 0.72]] }, street(0.9, 50)],
  },
  {
    name: 'XL Moda', mid: [1070, -1108], seed: 37, wall: '#e4e6e6', base: '#eceeee', groundTop: 52, trim: '#f4f5f5', frame: '#f6f6f4', eave: 168,
    axes: [0.1, 0.35, 0.6, 0.86],
    floors: floors3(11), bands: bands3(2, 168),
    balconies: [[0, 0.0, 0.2, 9], [0, 0.76, 0.96, 9]],
    ground: [
      { k: 'arch', x: [0.0, 0.14], y: [0, 42], rise: 2, gate: true },
      { k: 'shop', x: [0.26, 0.42], y: [4, 42], frame: '#6b3a24' },
      { k: 'shop', x: [0.43, 0.52], y: [3, 42], frame: '#6b3a24', door: [0.43, 0.52] },
      { k: 'shop', x: [0.54, 0.7], y: [4, 42], frame: '#6b3a24' },
      { k: 'shop', x: [0.79, 1.0], y: [4, 42], frame: '#6b3a24' },
    ],
    signs: [{ x: [0.435, 0.515], y: [33, 40], bg: '#2c2a26', fg: '#d9b46a', font: '700 {}px Georgia, serif', z: 0.9, lines: [['XL', 0.5, 0.36], ['MODA', 0.24, 0.78]] }],
  },
  {
    // boniowana kremowa z ceglanym cokołem: lombard „Loombard” i drewniana brama w jodełkę
    name: 'Loombard', mid: [1190, -1174], seed: 38, wall: '#ded3b2', base: '#d5c9a5', groundTop: 52, trim: '#ebe3cb', frame: '#f6f5f0', eave: 172,
    axes: [0.15, 0.38, 0.62, 0.85],
    floors: floors3(10, { hood: 'hood' }), bands: bands3(2.6),
    panels: [[0, 1, '#a8452f', -2, 8]],
    balconies: [[0, 0.52, 0.98, 10]],
    ground: [
      { k: 'shop', x: [0.06, 0.28], y: [8, 40], frame: '#3a3a3a' },
      { k: 'shop', x: [0.3, 0.4], y: [3, 40], frame: '#3a3a3a', door: [0.3, 0.4] },
      { k: 'door', x: [0.55, 0.82], y: [3, 44] },
    ],
    signs: [
      { x: [0.04, 0.42], y: [42, 50], bg: '#3c8a3e', fg: '#ffffff', border: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['LOOMBARD', 0.36, 0.3], ['ZŁOTO · SREBRO', 0.36, 0.74]] },
      { x: [0.42, 0.53], y: [42, 50], bg: '#d0242a', fg: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['7 dni', 0.36, 0.3], ['24h', 0.42, 0.74]] },
      { x: [0.01, 0.05], y: [8, 36], bg: '#3c8a3e', fg: '#ffffff', lines: [['LOMBARD', 0.06, 0.12], ['złoto', 0.06, 0.32], ['RTV', 0.06, 0.5], ['biżuteria', 0.05, 0.68], ['telefony', 0.05, 0.86]] },
    ],
  },
  {
    name: 'Fryzjer', mid: [1302, -1228], seed: 39, wall: '#cdc5b2', base: '#c3baa5', groundTop: 52, trim: '#ddd6c6', frame: '#f6f5f0', eave: 172,
    axes: [0.18, 0.5, 0.82],
    floors: floors3(10, { hood: 'hood' }), bands: bands3(2.4),
    balconies: [[0, 0.68, 0.98, 9]],
    ground: [
      { k: 'arch', x: [0.08, 0.38], y: [3, 42], rise: 8, door: true, frame: '#6a2a24' },
      { k: 'arch', x: [0.44, 0.62], y: [3, 44], rise: 8, wood: true, ring: '#b6ad98' },
      { k: 'arch', x: [0.68, 0.96], y: [6, 42], rise: 8, frame: '#3a3a3a' },
    ],
    signs: [{ x: [0.7, 0.94], y: [24, 31], fg: '#d0508a', font: 'italic 700 {}px Georgia, serif', z: 1, lines: [['Fryzjer', 0.8, 0.5]] }],
  },
  {
    // nr 17, modernistyczna: gładki szary tynk z falującymi pasami wykuszy, sklep mięsny Łyszczak
    name: 'Modernistyczna', mid: [1424, -1284], seed: 40, wall: '#c9cccd', base: '#d6d8d8', groundTop: 52, trim: '#dfe1e1', frame: '#f4f4f2', eave: 190,
    axes: [0.12, 0.35, 0.6, 0.85],
    floors: [{ y: [62, 84], w: 11 }, { y: [96, 118], w: 11 }, { y: [130, 152], w: 11 }, { y: [164, 184], w: 10 }],
    bands: [[48, 53, 3], [88, 92, 4], [122, 126, 4], [156, 160, 4], [186, 190, 3]],
    ground: [
      { k: 'shop', x: [0.04, 0.3], y: [4, 42], frame: '#5a2a22', door: [0.2, 0.28] },
      { k: 'door', x: [0.38, 0.46], y: [3, 40] },
      { k: 'shop', x: [0.52, 0.72], y: [4, 42], frame: '#3a3a3a' },
      { k: 'shop', x: [0.76, 0.97], y: [4, 42], frame: '#3a3a3a' },
    ],
    panels: [[0.04, 0.3, '#7a3a2c', -2, 10]],
    signs: [{ x: [0.05, 0.3], y: [44, 49], bg: '#3a2a22', fg: '#e9dcc2', lines: [['wędliny z tradycyjnych wyrobów', 0.5, 0.55]] },
      { x: [0.08, 0.2], y: [26, 31], bg: '#d8232a', fg: '#ffffff', font: 'italic 800 {}px Georgia, serif', z: 0.9, lines: [['Łyszczak', 0.75, 0.52]] }, nr(0.335, 41, '17')],
  },
  {
    name: 'Koniczynka', mid: [1540, -1340], seed: 41, wall: '#bab5a7', base: '#eeede8', groundTop: 52, trim: '#d2cdc0', frame: '#f6f5f0', eave: 172,
    axes: [0.12, 0.38, 0.62, 0.86],
    floors: floors3(9.5, { hood: 'hood' }), bands: bands3(2.6),
    flowers: [[2, 3]],
    balconies: [[2, 0.02, 0.24, 9]],
    ground: [
      { k: 'shop', x: [0.06, 0.34], y: [4, 40], frame: '#2c2c2c' },
      { k: 'shop', x: [0.4, 0.5], y: [3, 40], frame: '#2c2c2c', door: [0.4, 0.5] },
      { k: 'door', x: [0.53, 0.63], y: [3, 40] },
      { k: 'shop', x: [0.7, 0.96], y: [6, 40], frame: '#2c2c2c' },
    ],
    signs: [
      { x: [0.05, 0.35], y: [42, 49], bg: '#2a2a2a', fg: '#ffffff', border: '#8a1d24', font: '800 {}px Arial, sans-serif', lines: [['SKLEP  JOKER', 0.6, 0.55, '#f3f3f3']] },
      { x: [0.355, 0.4], y: [42, 49], bg: '#0a2a8a', fg: '#f6d33c', font: '800 {}px Arial, sans-serif', lines: [['GLS', 0.5, 0.55]] },
      { x: [0.4, 0.64], y: [42, 49], bg: '#f4f6f0', fg: '#2f8f3a', border: '#2f8f3a', font: '700 {}px Georgia, serif', lines: [['☘ Koniczynka', 0.6, 0.55]] },
      { x: [0.72, 0.94], y: [16, 34], bg: '#1d1d1d', fg: '#ffffff', z: 0.9, font: '800 {}px Arial, sans-serif', lines: [['OUTLET', 0.24, 0.2, '#e8434a'],
        ['meblowy', 0.22, 0.45], ['ZAMKOWA', 0.22, 0.7, '#e8434a']] },
    ],
  },
  {
    // ceglastoróżowa wąska kamienica ze szczytem: Euro Kebab
    name: 'Euro Kebab', mid: [1632, -1404], seed: 42, wall: '#c27a68', base: '#d08672', groundTop: 52, trim: '#ddb0a2', frame: '#f6f5f0', eave: 172,
    axes: [0.2, 0.5, 0.8],
    floors: floors3(9), bands: bands3(2.4), strips: [[0, 0.04], [0.96, 1]],
    balconies: [[0, 0.36, 0.64, 9, true], [1, 0.36, 0.64, 9]],
    ground: [
      { k: 'shop', x: [0.08, 0.6], y: [4, 42], frame: '#f4f4f2', door: [0.3, 0.4] },
      { k: 'arch', x: [0.72, 0.9], y: [3, 42], rise: 6, wood: true, ring: '#ead2c8' },
    ],
    signs: [{ x: [0.08, 0.6], y: [43.5, 49.5], bg: '#d8232a', fg: '#ffffff', border: '#ffffff', font: 'italic 800 {}px Arial, sans-serif', lines: [['EURO KEBAB', 0.66, 0.55]] }, nr(0.66, 40, '21')],
  },
];
