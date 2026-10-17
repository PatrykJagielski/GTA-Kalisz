/* ---------- ulica Górnośląska: powojenny blok z długimi galeriami balkonowymi, odsunięty od jezdni ---------- */
// Według Street View (wrz 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 42, step = 22) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 14 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // czterokondygnacyjny blok: jasny tynk, nad parterem sklepów balkony-loggie ciągnące się przez całą długość
    name: 'Górnośląska, blok z galeriami', mid: [-5072, 6899], seed: 340, wall: '#e8e4d8', base: '#d6d2c6', groundTop: 36, trim: '#f1eee6', frame: '#f4f2ec', eave: 112,
    axes: ax(14), floors: [{ y: [10, 30], w: 9 }, ...rows(3, 9)], bands: [[34, 37, 4], [56, 59, 5], [78, 81, 5], [100, 103, 5], [108, 112, 2.4]],
    strips: ax(15, 0, 1).map(f => [f - 0.004, f + 0.004]), stripY0: 37,
    balconies: [[1, 0.02, 0.98, 8, false], [2, 0.02, 0.98, 8, false], [3, 0.02, 0.98, 8, false]],
    ground: [{ k: 'shop', x: [0.06, 0.22], y: [8, 32], frame: '#2a2a2a' }, { k: 'shop', x: [0.34, 0.5], y: [8, 32], frame: '#5a5a58' }, { k: 'shop', x: [0.62, 0.78], y: [8, 32], frame: '#2a2a2a' }],
  },
];

export const GORNOSLASKA = FRONTS.map(f => ({ ground: [], ...f }));
