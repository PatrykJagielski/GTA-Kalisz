/* ---------- plac Jana Kilińskiego: pierzeja W (ozdobne kamienice) i pierzeja E (domy z dachami z dachówki) ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const gate = (f, w = 0.025) => ({ k: 'arch', x: [f - w, f + w], y: [3, 50], rise: 12, wood: true, ring: '#cfc6b0' });
const four = (o = {}) => ({ floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 9.5, 62, 36).map(f => ({ ...f, ...o }))], bands: [[50, 55, 2.4], [168, 172, 1.6], [172, 177, 4]], eave: 177 });

const FRONTS = [
  {
    // narożna ozdobna kamienica: biały boniowany parter ze sklepami, wyżej brudnobeżowy tynk z nadokiennikami i kutym balkonem
    name: 'Kilińskiego, ozdobna kamienica', mid: [2626, -3332], seed: 231, wall: '#cdc3ac', base: '#ece8dc', groundTop: 52, trim: '#dcd3be', frame: '#f4f2ec', ...four({ hood: 'hood' }),
    axes: ax(5), rustic: [[0, 52]], balconies: [[1, 0.25, 0.7, 9, true]], ground: [gate(0.1), { k: 'shop', x: [0.35, 0.6], y: [6, 44], frame: '#2a2420' }, gate(0.8)],
  },
  {
    name: 'Kilińskiego, kamienica 2', mid: [2738, -3550], seed: 232, wall: '#cdc3ac', base: '#ece8dc', groundTop: 52, trim: '#dcd3be', frame: '#f4f2ec', ...four({ hood: 'hood' }),
    axes: ax(5), rustic: [[0, 52]], ground: [gate(0.2), { k: 'shop', x: [0.4, 0.8], y: [6, 44], frame: '#2a2420' }],
  },
  {
    // długi, wyblakły gmach z boniowanym parterem, łukową bramą i zielonym balkonem nad nią
    name: 'Kilińskiego, długi gmach W', mid: [2498, -3076], seed: 233, wall: '#b8af98', base: '#a79e88', groundTop: 52, trim: '#cbc2ac', frame: '#f0ece2', ...four({ hood: 'hood' }),
    axes: ax(16), rustic: [[0, 52]], balconies: [[1, 0.46, 0.56, 10, true]], ground: [gate(0.5, 0.03)],
  },
  {
    name: 'Kilińskiego, gmach W 2', mid: [2380, -2839], seed: 234, wall: '#b8af98', base: '#a79e88', groundTop: 52, trim: '#cbc2ac', frame: '#f0ece2', ...four(),
    axes: ax(8), rustic: [[0, 52]], ground: [gate(0.7, 0.04)],
  },
  {
    // brunatno-różowy dom z dachem z dachówki, bramą w łuku i kutymi balkonami
    name: 'Kilińskiego, brunatny dom E', mid: [2852, -3127], seed: 235, wall: '#a8908a', base: '#8d7a73', groundTop: 52, trim: '#bba8a0', frame: '#f0ece2', eave: 150,
    axes: ax(16), floors: [{ y: [14, 44], w: 9 }, ...rows(2, 9.5)], bands: [[50, 54, 2.2], [146, 150, 3.2]], balconies: [[1, 0.5, 0.58, 9, true]], ground: [gate(0.34, 0.03), gate(0.86, 0.03)],
  },
  {
    // żółta kamienica z oknami w łuku na pierwszym piętrze i balkonami
    name: 'Kilińskiego, żółta kamienica E', mid: [2702, -2808], seed: 236, wall: '#e0d49a', base: '#cfc386', groundTop: 52, trim: '#efe6bc', frame: '#f4f2ec', eave: 150,
    axes: ax(14), floors: [{ y: [14, 44], w: 9 }, ...rows(2, 9.5)], bands: [[50, 54, 2.2], [146, 150, 3.2]], balconies: [[1, 0.2, 0.28, 8, true], [1, 0.6, 0.68, 8, true]], ground: [gate(0.8, 0.03)],
  },
];

export const KILINSKIEGO = FRONTS.map(f => ({ ground: [], ...f }));
