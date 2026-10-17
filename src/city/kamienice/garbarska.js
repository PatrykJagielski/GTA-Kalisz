/* ---------- ulica Garbarska: cała ulica (126 m, od Złotej do Kanonickiej) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 500;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });
const door = (x, extra = {}) => ({ k: 'door', x, y: [3, 40], ...extra });

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const GARBARSKA = [
  house({
    // narożna kamienica ze złuszczonym tynkiem, szary parter i biały szyld „ENICO”
    name: 'Narożna z szyldem', mid: [-668, -1090], wall: '#b8b09a', base: '#9aa0a0', g: 62, n: 3, w: 8, trim: '#cfc7b0', axes: ax(8, 0.04, 0.96), len: 295, stains: true,
    ground: [shop([0.05, 0.12], '#4a4a4a'), shop([0.17, 0.24], '#4a4a4a'), shop([0.3, 0.37], '#4a4a4a'), shop([0.44, 0.5], '#4a4a4a')],
    signs: [{ x: [0.55, 0.85], y: [46, 58], bg: '#f1eee6', fg: '#1a1a1a', font: '700 {}px Arial, sans-serif', lines: [['ENICO', 0.3, 0.55]] }],
  }),
  house({
    // niebiesko-szara ze sztukateriami, łukowe portale w kremowych opaskach, brama z kratą
    name: 'Niebieska z portalami', mid: [-604, -989], wall: '#8fa3b5', base: '#6f8396', g: 62, n: 3, w: 8, hood: 'hood', trim: '#eadfc6', axes: ax(9, 0.03, 0.97), len: 313,
    ground: [arch([0.06, 0.14], 7, { frame: '#5a2a1a', ring: '#eadfc6' }), arch([0.24, 0.32], 7, { gate: true, ring: '#eadfc6' }), arch([0.5, 0.58], 7, { door: true, frame: '#5a2a1a', ring: '#eadfc6' }), arch([0.74, 0.84], 7, { frame: '#5a2a1a', ring: '#eadfc6' })],
  }),
  house({
    // żółtawa z narożnym wykuszem na piętrze i sklepem ABE-2
    name: 'ABE-2', mid: [-812, -958], wall: '#e8e4b0', base: '#f1ede0', g: 64, n: 3, w: 8, axes: [0.3, 0.8], len: 96,
    balconies: [[0, 0.52, 0.98, 8]],
    ground: [shop([0.04, 0.5], '#f4f2ec'), shop([0.56, 0.96], '#f4f2ec')],
    signs: [{ x: [0.6, 0.9], y: [46, 54], bg: '#1a1a1a', fg: '#f4efe6', font: '700 {}px Arial, sans-serif', lines: [['ABE-2', 0.3, 0.55]] }],
  }),
  house({
    // kamienica w remoncie: piaskowy tynk i zielona siatka rusztowania
    name: 'W remoncie', mid: [-896, -874], wall: '#d8bc9a', base: '#b09474', g: 62, n: 3, w: 8, trim: '#e6d2b6', axes: ax(5, 0.1, 0.9), len: 141, stains: true,
    ground: [shop([0.12, 0.3], '#3a2a1a'), shop([0.62, 0.84], '#3a2a1a')],
  }),
  house({
    // wąska niebiesko-szara z wielkim łukowym oknem w kremowej opasce (stylizacja paznokci)
    name: 'Niebieska wąska', mid: [-743, -859], wall: '#8ea0b3', base: '#6f8396', g: 62, n: 3, w: 8, hood: 'hood', trim: '#eadfc6', axes: [0.5], len: 68,
    ground: [arch([0.1, 0.9], 9, { frame: '#5a2a1a', ring: '#eadfc6' })],
  }),
  house({
    // różowa z białym parterem, czerwonobrązowymi ramami witryn, lukarnami i balkonem w górze
    name: 'Różowa', mid: [-814, -792], wall: '#d9a6ae', base: '#ece8e0', g: 66, n: 3, w: 8, trim: '#efe6e0', axes: ax(3, 0.25, 0.9), len: 127,
    balconies: [[2, 0.6, 0.92, 9, true]],
    ground: [shop([0.12, 0.5], '#7a2a1a'), door([0.58, 0.68], { frame: '#5a2a2a' }), shop([0.76, 0.9], '#3a3a3a')],
  }),
  house({
    // szarobeżowa z rustykalnym parterem, drewniane drzwi i dwie witryny
    name: 'Z rustyką', mid: [-1056, -724], wall: '#b5ada0', base: '#cfc9b8', g: 58, n: 3, w: 8, trim: '#cfc9b8', axes: ax(4, 0.12, 0.9), len: 110, rustic: [[0, 56]], stains: true,
    ground: [door([0.14, 0.28], { frame: '#5a3a22' }), shop([0.4, 0.56], '#6a3a22'), shop([0.62, 0.78], '#6a3a22')],
  }),
  house({
    // szarobeżowa z ochrowym parterem i sklepem z tkaninami
    name: 'Tkaniny', mid: [-930, -680], wall: '#b8b09a', base: '#c9a24a', g: 60, n: 3, w: 7.5, trim: '#cfc7b0', axes: ax(3, 0.2, 0.85), len: 93,
    ground: [shop([0.08, 0.5], '#f4f2ec'), door([0.56, 0.66], { frame: '#f4f2ec' }), shop([0.72, 0.92], '#f4f2ec')],
    signs: [{ x: [0.1, 0.48], y: [44, 54], bg: '#f4f2ec', fg: '#2f6a3a', font: '800 {}px Arial, sans-serif', lines: [['TKANINY', 0.3, 0.55]] }],
  }),
  house({
    // ze złuszczonym tynkiem, żółtawy parter z dużymi drewnianymi witrynami (Yazar)
    name: 'Yazar', mid: [-1128, -659], wall: '#c8bfa8', base: '#d9c880', g: 62, n: 3, w: 8, trim: '#e6dcc0', axes: ax(4, 0.15, 0.9), len: 84, stains: true,
    ground: [shop([0.04, 0.2], '#1a1a1a'), shop([0.28, 0.58], '#7a3a1a'), shop([0.64, 0.96], '#7a3a1a')],
  }),
  house({
    // ochrowa z rustykalnym parterem, kutym balkonem i dużą witryną w drewnianej ramie
    name: 'Ochrowa z balkonem', mid: [-1224, -572], wall: '#c8bfa8', base: '#d6c680', g: 66, n: 3, w: 8, hood: 'hood', trim: '#e6dcc0', axes: ax(7, 0.04, 0.96), len: 176, rustic: [[0, 64]], stains: true,
    balconies: [[0, 0.2, 0.34, 9, true]],
    ground: [door([0.04, 0.12]), shop([0.4, 0.5], '#6a3a22'), shop([0.62, 0.9], '#7a3a1a')],
  }),
  house({
    // odnowiona kremowa ze sztukateriami nad oknami i bramą z drewnianymi drzwiami
    name: 'Kremowa odnowiona', mid: [-1332, -475], wall: '#efe3bd', base: '#e8d9ae', g: 62, n: 3, w: 8, hood: 'hood', trim: '#f8f1d8', axes: ax(3, 0.18, 0.8), len: 113,
    ground: [shop([0.04, 0.22], '#f4f2ec'), shop([0.3, 0.5], '#f4f2ec'), door([0.6, 0.9], { frame: '#7a3a1a' })],
  }),
  house({
    // kolorowy blok z lat 60.: pomarańczowy parter, zielone ramy okien
    name: 'Pomarańczowy parter', mid: [-1154, -472], wall: '#e8b898', base: '#e88a3a', g: 62, n: 2, w: 8, frame: '#2f6a3a', trim: '#f1d8b8', axes: ax(5, 0.05, 0.95), len: 141,
    ground: [shop([0.06, 0.25], '#2f6a3a'), shop([0.32, 0.55], '#2f6a3a'), shop([0.62, 0.95], '#2f6a3a')],
  }),
  house({
    // beżowa z roletami w parterze, okna w pilastrach, po prawej ślepy szczyt
    name: 'Z roletami', mid: [-1250, -386], wall: '#dccfae', base: '#a8845e', g: 64, n: 3, w: 8, trim: '#e8dcc0', axes: [0.1, 0.26, 0.42], len: 118,
    ground: [shop([0.06, 0.45], '#d0cbbd')],
  }),
];
