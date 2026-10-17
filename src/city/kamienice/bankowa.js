/* ---------- ulica Bankowa: parterowa oficyna z kratami i modernistyczny blok z zaokrąglonymi balkonami ---------- */
// Według Street View (lip i wrz 2024), format jak w kolegialna.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // parterowa oficyna z oknami w stalowych kratach, jasnym tynkiem i ceglanym cokołem
    name: 'Bankowa, oficyna z kratami', mid: [1378, 4397], seed: 252, wall: '#dcd6bd', base: '#7a4a3a', groundTop: 20, trim: '#cfc9b0', frame: '#6a6a66', eave: 62,
    axes: ax(8), floors: [{ y: [22, 48], w: 9.5 }], bands: [[58, 62, 1.6]], ground: [],
  },
  {
    // modernistyczny blok z lat 30.: biały tynk, zaokrąglone balkony z kwietnikami
    name: 'Bankowa, modernistyczny blok', mid: [1444, 4180], seed: 253, wall: '#f0ede5', base: '#e4e0d2', groundTop: 52, trim: '#f6f3ec', frame: '#f4f2ec', eave: 170,
    axes: ax(6), floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 10, 62, 36)], bands: [[50, 54, 1.4], [166, 170, 2.4]],
    balconies: [[1, 0.1, 0.3, 12, true], [2, 0.1, 0.3, 12, true], [3, 0.1, 0.3, 12, true]], ground: [],
  },
];

export const BANKOWA = FRONTS.map(f => ({ ground: [], ...f }));
