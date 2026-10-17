import { nr } from './zamkowa-kit.js';

/* ---------- ulica Piekarska: obie pierzeje od Rynku do skrętu na Wał Staromiejski ---------- */
// Według Street View (zdjęcia z 2022-2025), format jak w zamkowa-kit.js; poza tym jozefa.js: rustic, span.
// Ulica jest wąska (ok. 7 m), więc dane wzięte z widoków ukośnych z osi jezdni. Kolejność: pierzeja północno-wschodnia
// od Rynku (lewa, patrząc w głąb ulicy), potem południowo-zachodnia. Lewy koniec frontu = koniec od Rynku po stronie NE
// i koniec od Wału po stronie SW (kolejność obrysu OSM).
const GROUND = 50, PITCH = 36;
const ul = (x, y) => ({ x, w: 10, y: [y, y + 2.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. PIEKARSKA', 0.62, 0.55]] });
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
// n kondygnacji okien nad parterem, co PITCH dm; o(i) = dodatki do okna piętra i (hood: 'hood' | 'ear')
const rows = (n, w = 9.5, y0 = 62, o = () => ({})) => [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 24], w: w - (i === n - 1 ? 0.5 : 0), ...o(i) }));
const bands = (eave, d = 2.2, g = GROUND) => [[g - 4, g + 1, d], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 3.8]];
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });

export const PIEKARSKA = [
  // ---- pierzeja NE ----
  {
    // narożna z Rynkiem: kremowa, parter z wysokimi łukowymi witrynami w brązowych ramach i łukowym wejściem „2”
    name: 'Piekarska 2', mid: [422, 448], seed: 61, wall: '#e9e0c7', base: null, groundTop: GROUND, trim: '#f3ede0', frame: '#f4f2ec', eave: 168,
    axes: ax(5), floors: rows(3, 9.5), bands: bands(168),
    balconies: [[1, 0.66, 0.9, 9, true]],
    ground: [
      { k: 'arch', x: [0.03, 0.2], y: [3, 46], rise: 10, frame: '#7a3f2a' },
      { k: 'arch', x: [0.27, 0.4], y: [3, 44], rise: 8, door: true, frame: '#7a4a2a', ring: '#efe7d2' },
      { k: 'arch', x: [0.5, 0.67], y: [6, 44], rise: 9, frame: '#7a3f2a', ring: '#efe7d2' },
      { k: 'arch', x: [0.76, 0.95], y: [6, 44], rise: 9, frame: '#e8e4da', ring: '#efe7d2' },
    ],
    signs: [
      ul(0.44, 41),
      { x: [0.54, 0.64], y: [24, 33], bg: '#f4f1ea', fg: '#a62a2a', border: '#a62a2a', lines: [['THE FIRM', 0.2, 0.3], ['English School', 0.13, 0.68, '#2a2a2a']] },
    ],
    blades: [{ x: 0.46, y: 36, w: 4, h: 4, bg: '#2a2622', fg: '#f4ede0', font: '700 {}px Georgia, serif', lines: [['S', 0.7, 0.55]] }],
  },
  {
    // różowy tynk z jasnymi lizenami i opaskami okien, szary cokół, białe wejście z balkonem nad nim (2a)
    name: 'Piekarska 2a', mid: [570, 584], seed: 62, wall: '#dba596', base: '#9a9690', groundTop: 36, trim: '#e8d9b0', frame: '#f4f2ec', eave: 170,
    axes: [0.12, 0.38, 0.62, 0.86],
    floors: [{ y: [44, 66], w: 8, at: [0.62] }, ...rows(3, 9, 70)],
    bands: [[32, 37, 2], [160, 165, 1.4], [165, 170, 3.4]],
    strips: [[0.24, 0.27], [0.5, 0.53], [0.74, 0.77]], stripY0: 37,
    balconies: [[1, 0.28, 0.5, 11, true], [2, 0.56, 0.78, 11, true], [3, 0.28, 0.5, 11]],
    ground: [
      { k: 'door', x: [0.31, 0.45], y: [1, 33] },
      { k: 'shop', x: [0.56, 0.68], y: [8, 30], frame: '#f2efe6' },
    ],
    signs: [nr(0.22, 26, '2a'), ul(0.78, 30)],
  },
  {
    // szary, czterokondygnacyjny: ciemny parter z kratami piwnicznych okien, balkon z kwiatami, drzwi z brązowym skrzydłem
    name: 'Szara z kratami', mid: [724, 722], seed: 63, wall: '#9a9da2', base: '#6f7176', groundTop: 52, trim: '#b5b7b9', frame: '#f4f2ec', eave: 200,
    axes: [0.1, 0.27, 0.45, 0.63, 0.8, 0.94], stains: true,
    floors: rows(4, 9, 62),
    bands: [[48, 53, 2.4], [186, 190, 1.4], [190, 200, 3.6]],
    balconies: [[0, 0.04, 0.3, 12, true]],
    ground: [
      { k: 'shop', x: [0.07, 0.13], y: [16, 40], frame: '#2a2a2a' },
      { k: 'door', x: [0.34, 0.43], y: [3, 40] },
      { k: 'shop', x: [0.55, 0.6], y: [18, 36], frame: '#2a2a2a' },
      { k: 'shop', x: [0.73, 0.79], y: [18, 36], frame: '#2a2a2a' },
      { k: 'shop', x: [0.89, 0.94], y: [18, 36], frame: '#2a2a2a' },
    ],
  },
  {
    // długa kamienica za skrzyżowaniem: ciemny, niszczejący parter z wysokimi łukowymi wnękami, wyżej beżowy tynk z naczółkami
    name: 'Ciemny parter z wnękami', mid: [1056, 1010], seed: 64, wall: '#d9d0b8', base: '#6c6a66', groundTop: 60, trim: '#ece5d2', frame: '#f4f2ec', eave: 200,
    axes: ax(9), stains: true,
    floors: rows(3, 9, 70, () => ({ hood: 'hood' })),
    bands: [[56, 62, 2.6], [186, 190, 1.4], [190, 200, 3.8]],
    balconies: [[1, 0.2, 0.34, 9, true], [2, 0.58, 0.72, 9], [1, 0.82, 0.96, 9, true]],
    ground: [
      { k: 'arch', x: [0.025, 0.09], y: [4, 48], rise: 8, frame: '#f2efe6', ring: '#7d7a74' },
      { k: 'arch', x: [0.12, 0.19], y: [4, 46], rise: 8, ring: '#7d7a74' },
      { k: 'arch', x: [0.22, 0.28], y: [4, 46], rise: 7, door: true, frame: '#3a2a20', ring: '#7d7a74' },
      { k: 'arch', x: [0.33, 0.42], y: [4, 48], rise: 8, frame: '#f2efe6', ring: '#7d7a74' },
      { k: 'arch', x: [0.48, 0.6], y: [4, 48], rise: 9, ring: '#7d7a74' },
      { k: 'arch', x: [0.66, 0.75], y: [4, 48], rise: 8, frame: '#f2efe6', ring: '#7d7a74' },
      { k: 'arch', x: [0.8, 0.88], y: [4, 46], rise: 8, ring: '#7d7a74' },
      { k: 'arch', x: [0.92, 0.975], y: [4, 46], rise: 7, ring: '#7d7a74' },
    ],
  },
  {
    // jasna, kremowa, ze sztukateriami: okno łukowe w szarym parterze, kute balkony
    name: 'Kremowa z łukowymi oknami', mid: [1224, 1157], seed: 65, wall: '#e2d8bc', base: '#76736e', groundTop: 56, trim: '#f2ecda', frame: '#f4f2ec', eave: 190,
    axes: ax(4), stains: true,
    floors: rows(3, 9.5, 66, () => ({ hood: 'hood' })),
    bands: [[52, 58, 2.4], [176, 180, 1.4], [180, 190, 3.8]],
    balconies: [[1, 0.1, 0.5, 11, true], [2, 0.5, 0.9, 11, true]],
    ground: [
      { k: 'arch', x: [0.12, 0.38], y: [4, 46], rise: 10, frame: '#f4f2ec', ring: '#8a8780' },
      { k: 'arch', x: [0.58, 0.88], y: [4, 46], rise: 11, frame: '#f4f2ec', ring: '#8a8780' },
    ],
  },
  {
    // morelowa, z łukowym drewnianym wejściem „8” i dużym oknem w białej opasce; wyżej balkon z pnączami
    name: 'Morelowa z numerem 8', mid: [1357, 1269], seed: 66, wall: '#d9b79f', base: null, groundTop: GROUND, trim: '#efe3d2', frame: '#f4f2ec', eave: 175,
    axes: [0.14, 0.34, 0.56, 0.78, 0.92], stains: true,
    floors: rows(3, 10, 62, () => ({ hood: 'hood' })),
    bands: bands(175, 2.4),
    balconies: [[1, 0.46, 0.9, 11, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [8, 40], frame: '#f2efe6' },
      { k: 'arch', x: [0.27, 0.4], y: [3, 42], rise: 6, wood: true, ring: '#e9ddc9' },
      { k: 'shop', x: [0.5, 0.78], y: [8, 40], frame: '#f2efe6' },
      { k: 'shop', x: [0.84, 0.97], y: [8, 40], frame: '#f2efe6' },
    ],
    signs: [nr(0.42, 40, '8')],
  },
  {
    // secesja: oliwkowo-żółty tynk, białe łukowe opaski okien, daszek z dachówki nad łukowym wejściem z kratą, kute esownice
    name: 'Secesyjna z daszkiem', mid: [1462, 1356], seed: 67, wall: '#d6cf98', base: null, groundTop: GROUND, trim: '#f6f3e8', frame: '#f6f4ee', eave: 180,
    axes: [0.3, 0.74],
    floors: rows(3, 9.5, 62, () => ({ hood: 'ear' })),
    bands: bands(180, 2.2),
    balconies: [[1, 0.1, 0.58, 12, true]],
    ground: [
      { k: 'arch', x: [0.12, 0.44], y: [3, 42], rise: 8, gate: true, ring: '#f6f3e8' },
      { k: 'shop', x: [0.62, 0.88], y: [8, 40], frame: '#f4f2ec' },
    ],
    awnings: [[0.1, 0.46, 46, 9, '#c4694a']],
  },
  {
    // piaskowa, zaniedbana, trzy kondygnacje; lampa, wejście w głębi, przy końcu ślepy, oliwkowy szczyt sąsiada
    name: 'Piaskowa', mid: [1627, 1500], seed: 68, wall: '#d6c3a0', base: '#cdb88f', groundTop: GROUND, trim: '#e5d8bc', frame: '#f4f2ec', eave: 165,
    axes: ax(6, 0.02, 0.98), stains: true,
    floors: rows(3, 9, 62),
    bands: bands(165, 2),
    balconies: [[1, 0.78, 0.96, 9, true]],
    ground: [
      { k: 'shop', x: [0.06, 0.15], y: [10, 38], frame: '#5e3a28' },
      { k: 'door', x: [0.23, 0.33], y: [3, 40] },
      { k: 'shop', x: [0.42, 0.52], y: [10, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.6, 0.7], y: [10, 38], frame: '#5e3a28' },
      { k: 'shop', x: [0.78, 0.88], y: [10, 38], frame: '#5e3a28' },
    ],
  },
  // ---- pierzeja SW: od narożnika z tatuażystą do skrzyżowania z Wałem ----
  {
    // narożna szara kamienica: ciemne prążkowane cokół, studio tatuażu (czarna witryna)
    name: 'Black Art Studio', mid: [741, 827], seed: 69, wall: '#cfd0cc', base: '#7a7d80', groundTop: 52, trim: '#dcdddb', frame: '#f4f2ec', eave: 170,
    axes: [0.3, 0.7],
    floors: rows(3, 9, 62),
    bands: [[48, 53, 2], [160, 165, 1.4], [165, 170, 3.4]],
    rustic: [[0, 50]],
    ground: [shop([0.32, 0.88], '#161616', { sign: { bg: '#121212', fg: '#f4efe6', lines: [['BLACK ART STUDIO', 0.5, 0.35], ['TATTOO', 0.34, 0.72]] } })],
  },
  {
    name: 'Piekarska SW narożnik', mid: [708, 792], seed: 70, wall: '#cdc6bc', base: '#7a7d80', groundTop: 52, trim: '#dcd5ca', frame: '#f4f2ec', eave: 170,
    axes: [0.5],
    floors: rows(3, 8, 62),
    bands: [[48, 53, 2], [160, 165, 1.4], [165, 170, 3.4]],
    rustic: [[0, 50]],
    balconies: [[0, 0.3, 0.7, 6, true]],
    ground: [{ k: 'door', x: [0.35, 0.65], y: [3, 40] }],
  },
  {
    // jasnoszara modernistyczna kamienica (5A): małe okna w ramkach, ciemny prążkowany parter
    name: 'Piekarska 5a', mid: [621, 710], span: [[694, 778], [521, 612]], seed: 71, wall: '#d3d5d0', base: '#8a8d90', groundTop: 52, trim: '#e2e3df', frame: '#f4f2ec', eave: 180,
    axes: ax(8, 0.04, 0.96),
    floors: rows(4, 8.5, 62),
    bands: [[48, 53, 2.2], [166, 170, 1.4], [170, 180, 3.4]],
    rustic: [[0, 50]],
    balconies: [[1, 0.22, 0.34, 9, true], [2, 0.22, 0.34, 9, true], [3, 0.22, 0.34, 9], [1, 0.72, 0.84, 9, true]],
    ground: [
      { k: 'shop', x: [0.06, 0.2], y: [10, 40], frame: '#4a4f55' },
      { k: 'door', x: [0.3, 0.38], y: [3, 40] },
      { k: 'shop', x: [0.5, 0.66], y: [10, 40], frame: '#4a4f55' },
      { k: 'door', x: [0.78, 0.86], y: [3, 40] },
    ],
    signs: [nr(0.4, 42, '5A')],
  },
  {
    // pomarańczowo-ochrowa kamienica z dużymi oknami w białych ramach i gzymsami; kute balkony po prawej
    name: 'Pomarańczowa', mid: [456, 558], span: [[518, 615], [299, 406]], seed: 72, wall: '#dca072', base: '#c98a60', groundTop: 52, trim: '#e8cba8', frame: '#f4f2ec', eave: 168,
    axes: ax(9, 0.03, 0.97), stains: true,
    floors: rows(3, 10, 62, () => ({ hood: 'hood' })),
    bands: [[48, 54, 2.4], [130, 134, 1.4], [158, 162, 1.6], [162, 168, 4]],
    balconies: [[1, 0.64, 0.8, 10, true], [2, 0.84, 0.98, 9, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.14], y: [10, 40], frame: '#f2efe6' },
      { k: 'door', x: [0.22, 0.3], y: [3, 40] },
      { k: 'shop', x: [0.4, 0.5], y: [10, 40], frame: '#f2efe6' },
      { k: 'shop', x: [0.6, 0.7], y: [10, 40], frame: '#f2efe6' },
      { k: 'shop', x: [0.78, 0.88], y: [10, 40], frame: '#f2efe6' },
    ],
  },
  {
    // za skrzyżowaniem: kremowa ze sztukateriami wokół okien, łososiowy parter i brązowe drzwi (nr 7), balkony z kutą balustradą
    name: 'Piekarska 7', mid: [1119, 1162], seed: 73, wall: '#ebe3cd', base: '#d6a68e', groundTop: 60, trim: '#f5efdf', frame: '#f6f4ee', eave: 185,
    axes: [0.16, 0.5, 0.82],
    floors: rows(3, 10, 70, () => ({ hood: 'hood' })),
    bands: [[56, 62, 2.6], [166, 170, 1.4], [170, 185, 3.8]],
    balconies: [[1, 0.3, 0.7, 11, true], [2, 0.3, 0.7, 10]],
    ground: [
      { k: 'shop', x: [0.06, 0.28], y: [14, 44], frame: '#f2efe6' },
      { k: 'shop', x: [0.42, 0.6], y: [14, 44], frame: '#f2efe6' },
      { k: 'arch', x: [0.7, 0.92], y: [3, 46], rise: 6, door: true, frame: '#4a2418', ring: '#f1e6d4' },
    ],
    signs: [nr(0.96, 40, '7')],
  },
  {
    // jasnoszara, pięć okien w osi, mocny gzyms nad parterem; szklane drzwi na rogu, ciemne rury
    name: 'Jasnoszara z gzymsem', mid: [992, 1048], seed: 74, wall: '#bdb4b2', base: '#cbbfba', groundTop: 52, trim: '#d9d1cf', frame: '#f4f2ec', eave: 195,
    axes: [0.1, 0.3, 0.5, 0.7, 0.9],
    floors: rows(4, 9, 64, () => ({ hood: undefined })),
    bands: [[48, 54, 3], [180, 184, 1.4], [184, 195, 3.8]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [8, 42], frame: '#f2efe6', door: [0.04, 0.2] },
      { k: 'shop', x: [0.62, 0.78], y: [10, 40], frame: '#f2efe6' },
      { k: 'door', x: [0.88, 0.97], y: [3, 40] },
    ],
    signs: [ul(0.5, 44)],
  },
  {
    // miętowa z rustykowanym parterem: łukowe wejście z kratą, okna w bogatych białych opaskach, zielone kute balkony z kwiatami
    name: 'Miętowa', mid: [1225, 1252], seed: 75, wall: '#bcceb0', base: '#a9c09b', groundTop: 60, trim: '#f2f0e4', frame: '#f6f4ee', eave: 190,
    axes: [0.12, 0.38, 0.64, 0.88],
    floors: rows(3, 10, 70, () => ({ hood: 'hood' })),
    bands: [[56, 62, 2.6], [172, 176, 1.4], [176, 190, 3.8]],
    rustic: [[0, 58]],
    balconies: [[1, 0.28, 0.5, 10, true], [2, 0.28, 0.5, 10, true], [1, 0.76, 0.96, 10, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [8, 44], frame: '#f2efe6' },
      { k: 'arch', x: [0.3, 0.46], y: [3, 46], rise: 8, gate: true, ring: '#f2f0e4' },
      { k: 'shop', x: [0.58, 0.74], y: [8, 44], frame: '#f2efe6' },
      { k: 'shop', x: [0.8, 0.96], y: [8, 44], frame: '#f2efe6' },
    ],
  },
  {
    // szara, trzy kondygnacje, żółty gzyms nad parterem; drzwi z brązowym szkleniem w białej opasce i brama z czarnej kraty (nr 11)
    name: 'Szara z bramą (11)', mid: [1456, 1460], seed: 76, wall: '#a9aeb3', base: '#9ba0a5', groundTop: 52, trim: '#e8d9a0', frame: '#f4f2ec', eave: 165,
    axes: [0.15, 0.4, 0.62, 0.85],
    floors: rows(3, 9, 62),
    bands: [[48, 54, 2.8], [158, 162, 1.4], [162, 165, 2.6]],
    balconies: [[2, 0.1, 0.4, 9, true], [2, 0.6, 0.9, 9, true]],
    ground: [
      { k: 'shop', x: [0.1, 0.4], y: [3, 42], frame: '#7a2e24', door: [0.1, 0.4] },
      { k: 'arch', x: [0.5, 0.96], y: [2, 42], rise: 3, gate: true },
    ],
    signs: [nr(0.45, 40, '11')],
  },
  {
    // ochrowa, narożna z artdentem: parter w łososiowym tynku, łukowe witryny w czerwono-brązowych ramach; czarne balkony
    name: 'ArtDent', mid: [1362, 1367], seed: 77, wall: '#dcc9a0', base: '#d2a888', groundTop: 56, trim: '#efe6cf', frame: '#f6f4ee', eave: 185,
    axes: [0.1, 0.3, 0.54, 0.76, 0.92],
    floors: rows(3, 9.5, 66, () => ({ hood: 'hood' })),
    bands: [[52, 58, 2.6], [170, 174, 1.4], [174, 185, 3.8]],
    balconies: [[1, 0.6, 0.72, 9], [2, 0.6, 0.72, 9, true], [2, 0.8, 0.98, 9]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [10, 46], frame: '#8a3a26' },
      { k: 'arch', x: [0.3, 0.52], y: [8, 46], rise: 5, frame: '#8a3a26', door: true },
      { k: 'shop', x: [0.62, 0.84], y: [10, 46], frame: '#8a3a26' },
      { k: 'shop', x: [0.88, 0.97], y: [10, 46], frame: '#8a3a26' },
    ],
    signs: [{ x: [0.4, 0.62], y: [48, 53], bg: '#161616', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['ARTDENT', 0.6, 0.52]] }],
  },
  {
    // kremowa na rogu z portalem wejściowym pod daszkiem (nr 13), pięć kondygnacji, dolny pas jasnoszary
    name: 'Narożna z portalem (13)', mid: [1576, 1565], seed: 78, wall: '#e2d6b6', base: '#bdb09a', groundTop: 60, trim: '#efe6d0', frame: '#f6f4ee', eave: 185,
    axes: [0.1, 0.32, 0.54, 0.76],
    floors: rows(3, 9, 72),
    bands: [[56, 62, 2.6], [172, 176, 1.4], [176, 185, 3.8]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [10, 40], frame: '#f2efe6' },
      { k: 'shop', x: [0.3, 0.46], y: [10, 40], frame: '#f2efe6' },
      { k: 'door', x: [0.66, 0.9], y: [3, 44] },
    ],
    awnings: [[0.64, 0.92, 48, 7, '#d9cfb4']],
    signs: [nr(0.94, 40, '13')],
  },
  {
    // ślepa kremowa ściana z lampą przy skrzyżowaniu
    name: 'Ślepa ściana', mid: [1522, 1508], seed: 79, wall: '#e6dec6', base: '#e6dec6', groundTop: 0, trim: '#f2ecdc', frame: '#f6f4ee', eave: 150,
    axes: [], floors: [], bands: [[140, 145, 1.4], [145, 150, 3.2]], ground: [],
  },
];
