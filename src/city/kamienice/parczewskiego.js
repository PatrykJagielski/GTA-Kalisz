/* ---------- ulica Alfonsa Parczewskiego: zabudowa wschodnia przy parku, od Narutowicza do Przechodniej ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Budynki stoją po stronie E i patrzą na zachód, park;
// lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu (koniec N).
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const arch = (a, b, o = {}) => ({ k: 'arch', x: [a, b], y: [8, 46], rise: 8, frame: '#f4f2ec', ring: '#e6efe0', ...o });

const FRONTS = [
  {
    // narożny dom z lat 50.: szary, wyblakły tynk, boniowany parter, zębaty gzyms, okna w prostych opaskach
    name: 'Parczewskiego, szary narożnik', mid: [-2688, 422], seed: 201, wall: '#a39d8e', base: '#8e887a', groundTop: 52, trim: '#bdb7a8', frame: '#f0ece2', eave: 140,
    axes: ax(8), floors: [{ y: [22, 42], w: 8.5 }, ...rows(2, 9.5)], bands: [[50, 55, 2.4], [132, 136, 1.6], [136, 140, 3.6]], rustic: [[0, 52]], ground: [],
  },
  {
    // jasnozielona kamienica z kolumną balkonów z roślinami, łukowymi witrynami lokali i drewnianymi drzwiami
    name: 'Parczewskiego, zielona kamienica', mid: [-2604, 218], seed: 202, wall: '#c3d6b8', base: '#a9c19c', groundTop: 52, trim: '#eef3e6', frame: '#f4f2ec', eave: 172,
    axes: ax(8), floors: [{ y: [14, 44], w: 9 }, ...rows(3, 9.5).map(r => ({ ...r, hood: 'hood' }))], bands: [[50, 55, 2.4], [164, 168, 1.6], [168, 172, 3.8]],
    balconies: [[1, 0.35, 0.45, 8, true], [2, 0.35, 0.45, 8, true], [1, 0.8, 0.9, 8, true]],
    ground: [arch(0.04, 0.2), arch(0.26, 0.36, { wood: true, rise: 6 }), arch(0.72, 0.9)],
  },
  {
    name: 'Parczewskiego, zielona kamienica N', mid: [-2564, 110], seed: 203, wall: '#c3d6b8', base: '#a9c19c', groundTop: 52, trim: '#eef3e6', frame: '#f4f2ec', eave: 172,
    axes: ax(2), floors: [{ y: [14, 44], w: 9 }, ...rows(3, 9.5)], bands: [[50, 55, 2.4], [164, 168, 1.6], [168, 172, 3.8]], ground: [],
  },
  {
    name: 'Parczewskiego, zielona kamienica S', mid: [-2650, 326], seed: 204, wall: '#c3d6b8', base: '#a9c19c', groundTop: 52, trim: '#eef3e6', frame: '#f4f2ec', eave: 172,
    axes: ax(2), floors: [{ y: [14, 44], w: 9 }, ...rows(3, 9.5)], bands: [[50, 55, 2.4], [164, 168, 1.6], [168, 172, 3.8]], ground: [],
  },
];

export const PARCZEWSKIEGO = FRONTS.map(f => ({ ground: [], ...f }));
