/* ---------- ulica Szklarska: cała ulica (88 m) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 800;
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

export const SZKLARSKA = [
  house({
    // narożna niebieskoszara z kutym balkonem i naczółkami
    name: 'Narożna niebieskoszara', mid: [39, -2324], wall: '#a8b0b8', base: '#8a929c', g: 60, n: 3, w: 8, hood: 'hood', trim: '#d8dde2', axes: ax(3, 0.15, 0.85), len: 141, stains: true,
    balconies: [[1, 0.5, 0.82, 9, true]],
    ground: [win([0.1, 0.22]), win([0.5, 0.64])],
  }),
  house({
    // żółta z balkonami i szerokimi oknami w białych opaskach
    name: 'Żółta z balkonami', mid: [75, -2123], wall: '#e8d27a', base: '#e0ca72', g: 56, n: 3, w: 8.5, trim: '#f6f0d8', axes: ax(5, 0.08, 0.92), len: 269,
    balconies: [[1, 0.5, 0.64, 9], [1, 0.76, 0.9, 9]],
    ground: [win([0.1, 0.2]), win([0.34, 0.46]), win([0.6, 0.72]), win([0.82, 0.92])],
  }),
  house({
    // beżowa z szarym tynkiem, daszek balkonu i dwa duże okna w białych ramach
    name: 'Beżowa z daszkiem', mid: [140, -1844], wall: '#d6c8a4', base: '#c8baa0', g: 60, n: 3, w: 8, trim: '#ece2c4', axes: ax(6, 0.06, 0.94), len: 304, stains: true,
    ground: [win([0.06, 0.14]), win([0.3, 0.4]), win([0.56, 0.66]), win([0.8, 0.9])],
  }),
  house({
    // niska beżowa z kutymi wspornikami daszku i oknem w jasnej opasce
    name: 'Beżowa niska', mid: [192, -1896], wall: '#d6c8a4', base: '#c8baa0', g: 60, n: 2, w: 8, trim: '#ece2c4', axes: [0.5], len: 64, stains: true,
    ground: [win([0.3, 0.7])],
  }),
];
