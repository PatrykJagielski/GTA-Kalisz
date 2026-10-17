/* ---------- ulica Szkolna: cała ulica, 8 frontów (blok, kamienice, hala szkolna i mury) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2100;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);
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

export const SZKOLNA = [
  house({
    // blok ochrowy z niebieskimi pasami i balkonami, ciemny cokół
    name: 'Blok z niebieskimi pasami', mid: [-6730, 468], wall: '#d4c490', base: '#8a6a50', g: 56, n: 5, w: 9, trim: '#8a9ac0', axes: ax(3, 0.1, 0.9), len: 208,
    balconies: [[1, 0.0, 0.2, 6, false], [3, 0.0, 0.2, 6, false]],
  }),
  house({
    // jasnoszara kamienica z boniowanym parterem, balkony z zielonymi balustradami
    name: 'Szara z boniowaniem', mid: [-6646, 558], wall: '#c8c8c0', base: '#b0b0a8', g: 66, n: 4, w: 8.5, trim: '#dcdcd4', axes: ax(5, 0.1, 0.9), len: 350, stains: true, rustic: [[0, 64]],
    balconies: [[2, 0.78, 1, 10, true]],
  }),
  house({
    // szaro-beżowa kamienica ze zniszczonym parterem, kratami w oknach i balkonami
    name: 'Szarobeżowa z kratami', mid: [-6638, 252], wall: '#b4aa98', base: '#a8a498', g: 66, n: 4, w: 8.5, trim: '#c8c0b0', axes: ax(5, 0.08, 0.92), len: 260, stains: true,
    balconies: [[1, 0.5, 0.75, 10, true], [2, 0.5, 0.75, 10, true]],
    ground: [arch([0.05, 0.25], 8, { gate: true, frame: '#7a6a4a', ring: '#a8a498' })],
  }),
  house({
    // beżowa kamienica z niebieskimi drzwiami, kratami i balkonem z zieloną balustradą
    name: 'Beżowa z niebieskimi drzwiami', mid: [-6556, 63], wall: '#d8c8a0', base: '#d0c8a0', g: 66, n: 3, w: 8.5, trim: '#e8dcb8', axes: ax(3, 0.1, 0.9), len: 152, stains: true,
    balconies: [[1, 0.35, 0.75, 10, true]],
    ground: [win([0.1, 0.25]), win([0.4, 0.55]), door([0.7, 0.85], { frame: '#1a2a9a' })],
  }),
  house({
    // długa żółtobeżowa hala szkolna z dużymi oknami w kamiennych obramieniach
    name: 'Hala szkolna', mid: [-6502, 218], wall: '#d8cc98', base: '#c8b888', g: 56, n: 2, w: 9, trim: '#e8dca8', axes: ax(5, 0.08, 0.92), len: 388,
  }),
  house({
    // szary mur z uskokiem i resztkami cegły
    name: 'Mur z cegłą', mid: [-6492, -87], wall: '#a8a498', base: '#98948a', g: 40, n: 1, w: 5, trim: '#b0aca0', axes: [0.5], len: 35, stains: true,
  }),
  house({
    // ochrowy mur z graffiti
    name: 'Mur ochrowy', mid: [-6474, -132], wall: '#c8bc90', base: '#b8ac80', g: 30, n: 1, w: 5, trim: '#d0c4a0', axes: [0.5], len: 62, stains: true,
  }),
  house({
    // żółtawy budynek szkoły z wykuszem i owalnym okienkiem
    name: 'Szkoła z owalnym oknem', mid: [-6386, -66], wall: '#d4cca0', base: '#c4bc90', g: 56, n: 3, w: 8.5, trim: '#e4dcb0', axes: ax(3, 0.1, 0.9), len: 147,
    ground: [arch([0.05, 0.25], 6, { frame: '#f4f2ec', ring: '#c4bc90' })],
  }),
];
