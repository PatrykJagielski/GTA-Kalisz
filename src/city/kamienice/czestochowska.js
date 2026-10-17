/* ---------- ulica Częstochowska: zniszczona kamienica z ozdobnym szczytem, różowa kamienica z balkonami i biały blok ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 56, step = 32) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // opuszczona kamienica z zabitymi oknami, brudnym tynkiem i szczytem z wolutami od strony narożnika
    name: 'Częstochowska, kamienica zniszczona', mid: [2373, 5307], seed: 280, wall: '#cdbca0', base: '#b9a98c', groundTop: 44, trim: '#bfae92', frame: '#7a6a58', eave: 150,
    axes: ax(6), floors: [{ y: [14, 38], w: 9 }, ...rows(3, 9)], bands: [[44, 47, 2], [144, 147, 1.6], [147, 150, 3.2]],
    balconies: [[1, 0.1, 0.24, 8, false], [2, 0.1, 0.24, 8, false], [1, 0.4, 0.55, 8, false], [2, 0.4, 0.55, 8, false]],
  },
  {
    // różowa kamienica z balkonami na osi i wejściem z przystankiem przed frontem, obok biały blok z oknami na rogu
    name: 'Częstochowska, różowa kamienica', mid: [2349, 5137], seed: 281, wall: '#cfb09c', base: '#bfa08c', groundTop: 44, trim: '#e4cfc0', frame: '#f3f0ea', eave: 150,
    axes: ax(7, 0, 0.74), floors: [{ y: [14, 38], w: 9 }, ...rows(3, 9)], bands: [[44, 47, 2], [144, 147, 1.6], [147, 150, 3.2]],
    balconies: [[1, 0.18, 0.28, 8, false], [2, 0.18, 0.28, 8, true], [3, 0.18, 0.28, 8, false], [1, 0.44, 0.54, 8, false], [2, 0.44, 0.54, 8, true]],
    panels: [[0.76, 1, '#d9dce4', 0, 150]],
    ground: [{ k: 'door', x: [0.55, 0.61], y: [2, 36], frame: '#6a3b24' }],
  },
];

export const CZESTOCHOWSKA = FRONTS.map(f => ({ ground: [], ...f }));
