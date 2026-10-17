/* ---------- ulica Zacisze: 4 fronty z pokryciem Street View (reszta ulicy bez frontów) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2300;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const ZACISZE = [
  house({
    // zrujnowana ciemnobrązowa narożna kamienica z odpadającym tynkiem, zabitymi oknami, zaokrąglonym balkonem z zieloną balustradą
    name: 'Zrujnowana narożna', mid: [-616, 6852], wall: '#7a6e5a', base: '#6a5e4a', g: 66, n: 3, w: 8, trim: '#9a9082', axes: ax(3, 0.15, 0.85), len: 79, stains: true,
    balconies: [[1, 0.65, 0.98, 10, true]],
  }),
  house({
    name: 'Zrujnowana okno zabite', mid: [-578, 6900], wall: '#7a6e5a', base: '#6a5e4a', g: 66, n: 3, w: 8, trim: '#9a9082', axes: [0.5], len: 42, stains: true,
  }),
  house({
    // beżowa boniowana kamienica z dużymi oknami w białych obramieniach
    name: 'Beżowa boniowana', mid: [212, 7655], wall: '#e0d0a0', base: '#d0c090', g: 66, n: 3, w: 8.5, trim: '#f4ecd0', axes: ax(3, 0.12, 0.88), len: 116, rustic: [[0, 64]],
  }),
  house({
    // blok w beżu i zieleni z balkonami z kratą
    name: 'Blok beżowo-zielony', mid: [438, 7835], wall: '#d8e0c0', base: '#d8bc90', g: 56, n: 4, w: 9, trim: '#e8ecd8', axes: ax(2, 0.2, 0.9), len: 74,
    balconies: [[1, 0.2, 0.8, 8, false], [2, 0.2, 0.8, 8, false]],
  }),
];
