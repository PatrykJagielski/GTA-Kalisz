/* ---------- ulica Jabłkowskiego: zwarta pierzeja czynszowych kamienic z ciemnym boniowanym parterem i ceglano-kamiennymi piętrami ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 58, step = 26) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 20 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const kamienica = (name, mid, seed, n, wall, balc) => ({
  name, mid, seed, wall, base: '#4f4a45', groundTop: 48, trim: '#cbbfa6', frame: '#f1efe8', eave: 135,
  axes: ax(n), floors: [{ y: [18, 40], w: 10 }, ...rows(3, 10)], bands: [[48, 52, 2], [128, 131, 1.6], [131, 135, 3.2]],
  rustic: [[0, 48]], balconies: balc,
});

const FRONTS = [
  kamienica('Jabłkowskiego, kamienica nr 13', [-7324, 2328], 320, 8, '#94735f', []),
  kamienica('Jabłkowskiego, kamienica zachodnia', [-7542, 2252], 321, 8, '#a08570', [[1, 0.7, 0.8, 8, false], [2, 0.7, 0.8, 8, false]]),
  kamienica('Jabłkowskiego, kamienica wschodnia', [-7124, 2396], 322, 7, '#8a6c5c', [[1, 0.35, 0.47, 8, false]]),
];

export const JABLKOWSKIEGO = FRONTS.map(f => ({ ground: [], ...f }));
