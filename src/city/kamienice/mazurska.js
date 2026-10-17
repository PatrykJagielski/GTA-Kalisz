/* ---------- ulica Mazurska: powojenne bloki mieszkalne w pastelowych pasach (brzoskwinia, żółć, błękit) ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 40, step = 24) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 17 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const PAS = ['#e6b48f', '#e8dcae', '#c7ccd6', '#e6b48f'];

// pasy tynku różnych kolorów na całej wysokości ściany, szerokość każdego = ułamek frontu
const pasy = (od, n) => [...Array(n).keys()].map(i => [od + i * (1 - od) / n, od + (i + 1) * (1 - od) / n, PAS[i % PAS.length], 0, 105]);

const blok = (name, mid, seed, n) => ({
  name, mid, seed, wall: '#e6b48f', base: '#b9b2a5', groundTop: 36, trim: '#ebe2d2', frame: '#f4f2ec', eave: 105,
  axes: ax(n), floors: [{ y: [12, 30], w: 9 }, ...rows(3, 9)], bands: [[34, 37, 1.2], [101, 105, 2.4]],
  panels: pasy(0, 4), ground: [],
});

const FRONTS = [
  blok('Mazurska, blok północny', [-5251, -5123], 330, 14),
  blok('Mazurska, blok środkowy', [-5462, -5275], 331, 15),
  blok('Mazurska, blok zachodni', [-5674, -5426], 332, 14),
  { ...blok('Mazurska, długi blok od ulicy', [-5378, -5485], 333, 26), panels: pasy(0, 8) },
];

export const MAZURSKA = FRONTS.map(f => ({ ground: [], ...f }));
