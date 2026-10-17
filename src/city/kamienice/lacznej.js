/* ---------- ulica Łączna: blade czynszówki z pasami gzymsów i balkonikami na parapetach ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 46, step = 28) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 20 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const kam = (name, mid, seed, n, wall) => ({
  name, mid, seed, wall, base: '#c9b8aa', groundTop: 40, trim: '#efe7da', frame: '#f4f2ec', eave: 135,
  axes: ax(n), floors: [{ y: [3, 14], w: 7 }, ...rows(3, 9)], bands: [[38, 42, 2], [94, 97, 1.4], [131, 135, 3]],
});

const FRONTS = [
  kam('Łączna, kamienica wschodnia', [-3308, 7386], 360, 6, '#e2d3c3'),
  kam('Łączna, kamienica zachodnia', [-3436, 7397], 361, 6, '#e6d9c8'),
];

export const LACZNEJ = FRONTS.map(f => ({ ground: [], ...f }));
