/* ---------- ulica Mostowa: fronty po obu stronach ulicy (bez przęsła mostu) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1200;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const MOSTOWA = [
  house({
    // szary chropowaty tynk nad białym parterem, okna z kratami
    name: 'Szara z kratami', mid: [-2752, 2135], wall: '#9a968c', base: '#eceae4', g: 52, n: 1, w: 7, trim: '#b4b0a6', axes: [0.2, 0.45, 0.75], len: 163, stains: true,
  }),
  house({
    // bank: granitowy cokół z kratowanymi oknami, żółty piaskowiec ze sztukateriami i łukowymi oknami piętra
    name: 'Bank 1', mid: [-2696, 2172], wall: '#dcc888', base: '#8a8680', g: 62, n: 2, w: 8, hood: 'hood', trim: '#eadcaa', axes: ax(2, 0.2, 0.8), len: 140, rustic: [[0, 60]],
    ground: [win([0.1, 0.3], '#3a3a3a'), win([0.7, 0.9], '#3a3a3a')],
  }),
  house({
    // bank (cz. 2): granit w parterze, bankomat, łukowe okna piętra w kamiennych opaskach
    name: 'Bank 2', mid: [-2618, 2350], wall: '#d8c488', base: '#8a8680', g: 62, n: 2, w: 8, hood: 'hood', trim: '#eadcaa', axes: ax(5, 0.08, 0.92), len: 304, rustic: [[0, 60]],
    ground: [win([0.1, 0.18], '#3a3a3a'), win([0.3, 0.4], '#3a3a3a'), win([0.52, 0.6], '#3a3a3a'), win([0.74, 0.84], '#3a3a3a')],
  }),
  house({
    // szary tynk, czerwony cokół, okna w brązowych ramach
    name: 'Czerwony cokół', mid: [-2656, 2054], wall: '#a8a49a', base: '#b84a40', g: 52, n: 2, w: 7.5, frame: '#7a4a2a', trim: '#c0bcb0', axes: [0.3, 0.75], len: 84, stains: true,
  }),
  house({
    // terakotowa z pasami boniowania, brązowe okna (restauracja Mostowa)
    name: 'Terakotowa Mostowa', mid: [-2515, 1872], wall: '#d88e6e', base: '#c87050', g: 56, n: 2, w: 7.5, frame: '#7a4a2a', trim: '#e6a888', axes: ax(5, 0.08, 0.92), len: 376, rustic: [[0, 54]],
    signs: [{ x: [0.05, 0.25], y: [46, 54], bg: '#3a1a1a', fg: '#f4efe6', font: '800 {}px Georgia, serif', lines: [['MOSTOWA', 0.1, 0.55]] }],
  }),
  house({
    // terakotowa narożna: okno w jasnej opasce, wiata klimatyzatorów w parterze
    name: 'Terakotowa narożna', mid: [-2433, 1698], wall: '#d88e6e', base: '#c87050', g: 56, n: 2, w: 7, frame: '#7a4a2a', trim: '#e6a888', axes: [0.5], len: 81,
  }),
  house({
    // żółtoochrowa z naczółkami i ceglastym cokołem z kratami piwnic
    name: 'Ochrowa z naczółkami', mid: [-2188, 1822], wall: '#d8c882', base: '#7a4a40', g: 56, n: 3, w: 8, hood: 'hood', trim: '#e8dca8', axes: ax(3, 0.2, 0.9), len: 194, rustic: [[0, 54]],
  }),
];
