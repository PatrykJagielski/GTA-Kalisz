/* ---------- ulica Rzemieślnicza: dawna fabryka z czerwoną cegłą i białym tynkiem oraz biała willa z ciemnym dachem ---------- */
// Według Street View (wrz 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 58, step = 26) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 18 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const fabryka = (name, mid, seed, n) => ({
  name, mid, seed, wall: '#efece4', base: '#e8e4da', groundTop: 48, trim: '#a2402e', frame: '#6a2a20', eave: 130,
  axes: ax(n), floors: [{ y: [8, 40], w: 9 }, ...rows(3, 9)], bands: [[46, 50, 1.6], [96, 99, 1.4], [122, 126, 1.6], [126, 130, 2]],
  strips: ax(n + 1, 0, 1).map(f => [f - 0.012, f + 0.012]), stripY0: 50,
});

const FRONTS = [
  fabryka('Rzemieślnicza, fabryka od narożnika', [-2821, 8196], 370, 4),
  fabryka('Rzemieślnicza, fabryka część środkowa', [-2960, 8270], 371, 6),
];

export const RZEMIESLNICZA = FRONTS.map(f => ({ ground: [], ...f }));
