/* ---------- ulica Piskorzewie: długa dawna fabryka z odrapanym tynkiem i okratowanym parterem ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 46, step = 20) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 16 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // czterokondygnacyjna fabryka: szary tynk z różowymi plamami, wysoka część z szerokimi oknami i wejściem do siłowni
    name: 'Piskorzewie, dawna fabryka', mid: [-5262, -1698], seed: 300, wall: '#cbc3bd', base: '#9b9a9a', groundTop: 38, trim: '#bdb5af', frame: '#5d6a6e', eave: 128,
    axes: ax(20), floors: [{ y: [8, 32], w: 11 }, ...rows(4, 11)], bands: [[36, 39, 1.2], [124, 128, 1.6]],
    ground: [{ k: 'door', x: [0.93, 0.965], y: [2, 38], frame: '#2a2a2a' }],
  },
];

export const PISKORZEWIE = FRONTS.map(f => ({ ground: [], ...f }));
