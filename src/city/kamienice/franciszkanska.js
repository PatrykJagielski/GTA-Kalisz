/* ---------- ulica Franciszkańska: cała ulica (157 m) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 700;
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

const win = (x, frame = '#f4f2ec') => shop(x, frame);

export const FRANCISZKANSKA = [
  house({
    // różowo-szara ze złuszczonym tynkiem, kuty balkon, w parterze zwykłe okna
    name: 'Różowa ze zniszczonym tynkiem', mid: [-1760, 366], wall: '#b8b0b0', base: '#c7a0a0', g: 60, n: 3, w: 8, trim: '#d8d0c8', axes: ax(5, 0.08, 0.92), len: 176, stains: true,
    balconies: [[0, 0.04, 0.2, 9, true]],
    ground: [win([0.06, 0.16]), win([0.26, 0.36]), win([0.46, 0.56]), win([0.66, 0.76]), win([0.84, 0.94])],
  }),
  house({
    // ciemnobrązowa kamienica z białymi opaskami okien, w parterze okna z kratami i baner
    name: 'Ciemna z białymi opaskami', mid: [-1752, 461], wall: '#4a423c', base: '#4a423c', g: 60, n: 3, w: 8, trim: '#6a625a', axes: ax(10, 0.04, 0.96), len: 312, stains: true,
    ground: [win([0.04, 0.1]), win([0.2, 0.26]), win([0.36, 0.42]), win([0.52, 0.58]), win([0.7, 0.8], '#8a5a2a'), win([0.88, 0.94])],
  }),
  house({
    // pomarańczowy parter z kantorem, szare piętra z naczółkami na konsolach
    name: 'Kantor', mid: [-1534, 539], wall: '#cdbba8', base: '#e89a60', g: 62, n: 3, w: 8, hood: 'hood', trim: '#e6dccc', axes: ax(12, 0.03, 0.97), len: 392,
    ground: [shop([0.02, 0.1], '#7a3a1a'), shop([0.16, 0.26], '#5a2a1a'), shop([0.34, 0.5], '#5a2a1a'), door([0.58, 0.64], { frame: '#5a2a1a' }), shop([0.72, 0.9], '#5a2a1a')],
    signs: [{ x: [0.16, 0.26], y: [46, 54], bg: '#8a6a4a', fg: '#f4efe6', font: '700 {}px Arial, sans-serif', lines: [['Kantor', 0.2, 0.55]] }],
  }),
  house({
    // trzy wąskie kamienice: terakotowa, biała z wejściem kancelarii i ceglastoczerwona
    name: 'Trzy wąskie', mid: [-1525, 624], wall: '#c9a898', base: '#d8b858', g: 62, n: 3, w: 7.5, trim: '#eadccf', axes: ax(7, 0.05, 0.95), len: 246,
    ground: [win([0.04, 0.14], '#5a3a22'), win([0.2, 0.3], '#5a3a22'), door([0.45, 0.53], { frame: '#5a3a22' }), win([0.62, 0.72], '#5a3a22'), win([0.8, 0.9], '#5a3a22')],
  }),
  house({
    // ciemne złuszczone piętra nad beżowym parterem z wielkimi drewnianymi oknami
    name: 'Ciemne piętra', mid: [-1189, 872], wall: '#8a7e74', base: '#c8bfa8', g: 62, n: 3, w: 8, trim: '#a89c90', axes: ax(9, 0.04, 0.96), len: 267, stains: true,
    ground: [win([0.05, 0.14], '#6a3a22'), win([0.25, 0.34], '#6a3a22'), win([0.5, 0.6], '#6a3a22'), win([0.72, 0.82], '#6a3a22'), win([0.9, 0.97], '#6a3a22')],
  }),
  house({
    // oliwkowo-ochrowa z łukowym wejściem i bramą z kutą kratą, brązowe piętra z naczółkami
    name: 'Z bramą z kratą', mid: [-1120, 826], wall: '#a89a70', base: '#c9b878', g: 64, n: 3, w: 8, hood: 'hood', trim: '#e0d6b4', axes: ax(9, 0.04, 0.96), len: 316,
    ground: [arch([0.26, 0.38], 7, { door: true, frame: '#7a3a1a', ring: '#e0d6b4' }), arch([0.62, 0.74], 8, { gate: true, ring: '#e0d6b4' }), arch([0.9, 0.98], 6, { frame: '#f4f2ec', ring: '#e0d6b4' })],
  }),
  house({
    // ciemne piętra z okrągłym okienkiem nad beżowym parterem
    name: 'Z oknem owalnym', mid: [-1020, 1024], wall: '#5a524a', base: '#d6c4a0', g: 62, n: 2, w: 8, trim: '#7a726a', axes: ax(5, 0.06, 0.94), len: 189, stains: true,
    ground: [win([0.04, 0.16], '#6a3a22'), win([0.26, 0.38], '#6a3a22'), win([0.5, 0.56], '#6a3a22'), win([0.68, 0.8], '#6a3a22')],
  }),
  house({
    // oliwkowa z jasnymi opaskami, w parterze łukowe okna z kratami na ciemnoczerwonym cokole
    name: 'Oliwkowa z łukowymi oknami', mid: [-932, 1000], wall: '#b8c080', base: '#9aa860', g: 60, n: 3, w: 8, trim: '#dfe4c8', axes: ax(5, 0.08, 0.92), len: 197,
    ground: [arch([0.04, 0.2], 6, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.28, 0.44], 6, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.56, 0.7], 6, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.8, 0.95], 6, { frame: '#f4f2ec', ring: '#f4f2ec' })],
  }),
  house({
    // kremowa z bordowym parterem, łukowym oknem i portalem z białymi pilastrami
    name: 'Bordowy parter', mid: [-848, 1196], wall: '#e2d6bc', base: '#7a4a50', g: 62, n: 3, w: 8, trim: '#f6f0e0', axes: ax(5, 0.08, 0.92), len: 220,
    balconies: [[1, 0.7, 0.8, 8, true]],
    ground: [arch([0.04, 0.12], 6, { frame: '#f4f2ec' }), arch([0.2, 0.4], 7, { frame: '#3a2a1a', ring: '#f4f2ec' }), door([0.56, 0.66], { frame: '#5a3a22' })],
  }),
  house({
    // żółta z dużą witryną studia tatuażu i drewnianą bramą
    name: 'Żółta z drewnianą bramą', mid: [-820, 1114], wall: '#e0cc8a', base: '#e4d6a0', g: 62, n: 3, w: 8, trim: '#f0e6c0', axes: ax(3, 0.1, 0.9), len: 125,
    ground: [shop([0.06, 0.5], '#6a2a1a'), door([0.6, 0.9], { frame: '#8a5a2a' })],
  }),
  house({
    // narożna żółta: okno z kratą i zakład zegarmistrza
    name: 'Zegarmistrz', mid: [-745, 1192], wall: '#e0cc8a', base: '#d9c47a', g: 62, n: 3, w: 8, trim: '#f0e6c0', axes: ax(3, 0.1, 0.9), len: 93,
    ground: [win([0.08, 0.4]), shop([0.5, 0.9], '#f4f2ec')],
    signs: [{ x: [0.52, 0.88], y: [44, 52], bg: '#7a3a3a', fg: '#f4efe6', font: '700 {}px Georgia, serif', lines: [['Zegarmistrz', 0.12, 0.55]] }],
  }),
];
