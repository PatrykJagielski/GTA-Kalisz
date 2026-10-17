/* ---------- ulica Krótka: cała ulica, 7 frontów (kamienice, mur i garaż od strony podwórek) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1700;
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

export const KROTKA = [
  house({
    // prawie ślepa ściana szczytowa w jasnożółtym i szarym tynku, kilka okien w ciągu klatki schodowej
    name: 'Szczyt jasnożółty', mid: [-3798, 2861], wall: '#d8d2b0', base: '#aeb0aa', g: 66, n: 4, w: 8.5, trim: '#bcbcb4', axes: [0.25], len: 267, stains: true,
  }),
  house({
    // niski ciemny murek z okapem
    name: 'Niski murek', mid: [-3646, 2712], wall: '#6a665e', base: '#5a564e', g: 40, n: 1, w: 6, trim: '#7a766e', axes: [0.5], len: 45, stains: true,
  }),
  house({
    // kremowa boniowana kamienica z bramą w łuku, balkonem z kutą balustradą i łukowymi oknami
    name: 'Kremowa z bramą', mid: [-3565, 2786], wall: '#d4cdbd', base: '#b8b0a0', g: 66, n: 4, w: 8.5, trim: '#e8e2d2', axes: ax(5, 0.08, 0.92), len: 173, rustic: [[0, 64]],
    balconies: [[1, 0.2, 0.5, 10, true]],
    ground: [arch([0.2, 0.5], 9, { gate: true, frame: '#3a3228', ring: '#e8e2d2' }), win([0.62, 0.72]), win([0.84, 0.94])],
  }),
  house({
    // niski biały garaż z szarą roletą
    name: 'Biały garaż', mid: [-3477, 2858], wall: '#d8d6d0', base: '#605c58', g: 40, n: 1, w: 6, trim: '#e6e4de', axes: [0.5], len: 55,
    ground: [shop([0.25, 0.75], '#4a4038')],
  }),
  house({
    // długa ciemnoszara okopcona kamienica z białymi oknami w ciągu
    name: 'Ciemnoszara okopcona', mid: [-3398, 3012], wall: '#78706a', base: '#605a54', g: 66, n: 4, w: 8.5, trim: '#8a847c', axes: ax(18, 0.04, 0.96), len: 782, stains: true,
  }),
  house({
    // szarobrązowy tynk z bruzdami, drewniane drzwi
    name: 'Szarobrązowa z drzwiami', mid: [-3240, 3052], wall: '#9a9186', base: '#8a5a3a', g: 56, n: 2, w: 7.5, trim: '#aaa296', axes: ax(5, 0.2, 0.95), len: 267, stains: true,
    ground: [door([0.04, 0.12], { frame: '#4a2a1a' })],
  }),
  house({
    // różowa narożna kamienica z apteką w zaokrąglonym narożniku
    name: 'Różowa z apteką', mid: [-3086, 3174], wall: '#dcb8a8', base: '#c8a090', g: 66, n: 3, w: 8, trim: '#ecd0c0', axes: ax(3, 0.15, 0.85), len: 127,
    ground: [shop([0.5, 0.95], '#7a3a1a')],
  }),
];
