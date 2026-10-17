/* ---------- ulica Kadecka: cała ulica (57 m) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1000;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const KADECKA = [
  house({
    // kremowa ściana szczytowa z tablicą pamiątkową
    name: 'Kremowa z tablicą', mid: [1603, 1630], wall: '#efe8c8', base: '#e8e0bc', g: 60, n: 3, w: 8, trim: '#f6f0d8', axes: [0.5], len: 38,
    ground: [win([0.2, 0.8])],
  }),
  house({
    // piaskowa kamienica ze złuszczonym tynkiem, okna w białych ramach, bordowe parapety
    name: 'Piaskowa 1', mid: [1774, 1498], wall: '#d2b890', base: '#c8a880', g: 60, n: 3, w: 8, trim: '#e6d6b8', axes: ax(5, 0.08, 0.92), len: 198, stains: true,
    ground: [win([0.1, 0.2]), win([0.34, 0.44]), win([0.6, 0.7]), win([0.84, 0.94])],
  }),
  house({
    // piaskowa z boniowanym parterem i łukowymi oknami z wachlarzowymi nadprożami
    name: 'Z łukowymi oknami 1', mid: [1838, 1514], wall: '#d6b890', base: '#cfae88', g: 64, n: 3, w: 8, trim: '#eadcc0', axes: ax(5, 0.08, 0.92), len: 256, stains: true, rustic: [[0, 62]],
    ground: [arch([0.06, 0.18], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.3, 0.42], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.56, 0.68], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.82, 0.94], 8, { frame: '#f4f2ec', ring: '#f4f2ec' })],
  }),
  house({
    // piaskowa ze zniszczonym tynkiem, w parterze okna w białych ramach
    name: 'Piaskowa 2', mid: [1952, 1334], wall: '#d2bc98', base: '#c8aa84', g: 60, n: 3, w: 8, trim: '#e6d8bc', axes: ax(5, 0.08, 0.92), len: 287, stains: true,
    ground: [win([0.1, 0.2]), win([0.34, 0.44]), win([0.6, 0.7]), win([0.84, 0.94])],
  }),
  house({
    // piaskowa z boniowanym parterem i łukowymi oknami (jak naprzeciw)
    name: 'Z łukowymi oknami 2', mid: [2020, 1353], wall: '#d6b890', base: '#cfae88', g: 64, n: 3, w: 8, trim: '#eadcc0', axes: ax(5, 0.08, 0.92), len: 230, stains: true, rustic: [[0, 62]],
    ground: [arch([0.06, 0.18], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.3, 0.42], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.56, 0.68], 8, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.82, 0.94], 8, { frame: '#f4f2ec', ring: '#f4f2ec' })],
  }),
];
