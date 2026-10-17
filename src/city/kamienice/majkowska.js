/* ---------- ulica Majkowska: pięciokondygnacyjny blok z lat 50. z jasnozielonym tynkiem nad cokołem z płytek ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 18 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const blok = (name, mid, seed, n, ground) => ({
  name, mid, seed, wall: '#cfd8a8', base: '#d8c9a2', groundTop: 50, trim: '#e6dcbc', frame: '#f2f0ea', eave: 160,
  axes: ax(n), floors: [{ y: [14, 38], w: 11 }, ...rows(4, 9, 58, 24)], bands: [[46, 50, 1.6], [156, 160, 3]], ground,
});

const FRONTS = [
  blok('Majkowska, blok od północy', [-2650, -4271], 270, 10, [{ k: 'door', x: [0.88, 0.93], y: [2, 36], frame: '#6a3b24' }]),
  blok('Majkowska, blok od zachodu', [-2783, -4272], 271, 6, [{ k: 'door', x: [0.4, 0.46], y: [2, 36], frame: '#6a3b24' }]),
];

export const MAJKOWSKA = FRONTS.map(f => ({ ground: [], ...f }));
