/* ---------- ulica Wronia: wąska brukowana uliczka z zaniedbanymi czynszówkami i ceglanym blokiem ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 56, step = 28) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 20 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const czynszowka = (name, mid, seed, n, wall, base, balc = []) => ({
  name, mid, seed, wall, base, groundTop: 44, trim: '#b9ad99', frame: '#f1efe8', eave: 130,
  axes: ax(n), floors: [{ y: [14, 38], w: 9 }, ...rows(3, 9)], bands: [[44, 47, 2], [122, 126, 1.6], [126, 130, 3]], balconies: balc,
});

const FRONTS = [
  czynszowka('Wronia, kamienica z różowym parterem', [-7362, 3964], 350, 8, '#a99c88', '#b08a96', [[1, 0.1, 0.22, 8, false], [2, 0.1, 0.22, 8, false]]),
  czynszowka('Wronia, kamienica zachodnia środkowa', [-7295, 3798], 351, 5, '#9e9280', '#7a746a'),
  czynszowka('Wronia, kamienica wschodnia', [-7226, 3632], 352, 8, '#a89a85', '#6f6a62', [[2, 0.3, 0.4, 8, false]]),
  czynszowka('Wronia, kamienica południowa', [-7292, 4106], 353, 8, '#a29684', '#6f6a62'),
  {
    // czteropiętrowy blok z ciemnej cegły, wejście do klatki z kratą
    name: 'Wronia, ceglany blok', mid: [-7220, 3913], seed: 354, wall: '#8c4b3a', base: '#7a6a60', groundTop: 36, trim: '#a06a58', frame: '#eeece6', eave: 135,
    axes: ax(5), floors: [{ y: [10, 28], w: 8 }, ...rows(4, 9, 48, 24)], bands: [[131, 135, 1.6]], ground: [{ k: 'door', x: [0.3, 0.42], y: [2, 40], frame: '#3a3430' }],
  },
];

export const WRONIA = FRONTS.map(f => ({ ground: [], ...f }));
