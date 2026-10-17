/* ---------- Wał Staromiejski: pałac przy moście (#302) i kamienice na rogu ze Śródmiejską (#326) ---------- */
// Według Street View (wrz 2024, sie 2025), format jak w kolegialna.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const arch = (a, b, o = {}) => ({ k: 'arch', x: [a, b], y: [6, 46], rise: 12, frame: '#3a4a46', ring: '#c9c5ac', ...o });
const upper = n => [{ y: [14, 44], w: 9.5 }, ...rows(n, 9.5, 62, 36).map(f => ({ ...f, hood: 'hood' }))];

const FRONTS = [
  {
    // dawny pałac przy moście: beżowy kamień, boniowany parter z oknami w łuku, balkony z balustradami na piętrze, attyka z balustradą
    name: 'Wał, pałac przy moście', mid: [-2618, 2350], seed: 241, wall: '#cfbd96', base: '#bba783', groundTop: 56, trim: '#e6d9b8', frame: '#f4f2ec', eave: 150,
    axes: ax(15), floors: [{ y: [14, 50], w: 9.5 }, { y: [68, 104], w: 10 }, { y: [114, 136], w: 8.5 }], bands: [[54, 59, 3], [108, 112, 2], [140, 144, 1.6], [144, 150, 3.4]],
    rustic: [[0, 56]], balconies: [[1, 0.2, 0.26, 8], [1, 0.46, 0.52, 8], [1, 0.72, 0.78, 8]], ground: [arch(0.02, 0.06, { rise: 6 })],
  },
  {
    // narożna część pałacu z wieżyczką i portalem
    name: 'Wał, pałac, narożnik', mid: [-2472, 2451], seed: 242, wall: '#cfbd96', base: '#bba783', groundTop: 56, trim: '#e6d9b8', frame: '#f4f2ec', eave: 162,
    axes: ax(2), floors: [{ y: [14, 50], w: 9.5 }, { y: [68, 104], w: 10 }, { y: [114, 136], w: 8.5 }], bands: [[54, 59, 3], [108, 112, 2], [140, 144, 1.6], [144, 162, 3.4]],
    rustic: [[0, 56]], ground: [arch(0.38, 0.62, { wood: true, rise: 12, frame: undefined, ring: '#e6d9b8' })],
  },
  {
    // narożna kamienica ze Śródmiejską: kremowy tynk, sklep z butami z czerwonym szyldem i czerwonym cokołem
    name: 'Wał, narożna z butami', mid: [-2705, 2692], seed: 243, wall: '#e3dcb2', base: '#d8cea0', groundTop: 52, trim: '#efe9cc', frame: '#f4f2ec', eave: 185,
    axes: ax(6), floors: upper(3), bands: [[50, 55, 2.4], [177, 181, 1.6], [181, 185, 3.6]], balconies: [[1, 0.8, 0.9, 8, true]],
    ground: [{ k: 'shop', x: [0.05, 0.3], y: [4, 44], frame: '#8a2a22' }, { k: 'shop', x: [0.7, 0.95], y: [4, 44], frame: '#8a2a22' }],
    signs: [{ x: [0.05, 0.3], y: [46, 51], bg: '#c8232c', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['BUTY BUCIKI', 0.8, 0.5]] }],
  },
  {
    name: 'Wał, kamienica przy Śródmiejskiej', mid: [-2730, 2840], seed: 244, wall: '#e3dcb2', base: '#d8cea0', groundTop: 52, trim: '#efe9cc', frame: '#f4f2ec', eave: 185,
    axes: ax(12), floors: upper(3), bands: [[50, 55, 2.4], [177, 181, 1.6], [181, 185, 3.6]], balconies: [[1, 0.3, 0.36, 8, true], [2, 0.3, 0.36, 8, true]],
    ground: [{ k: 'shop', x: [0.06, 0.2], y: [4, 44], frame: '#8a2a22' }, { k: 'shop', x: [0.5, 0.65], y: [4, 44], frame: '#8a2a22' }, { k: 'door', x: [0.78, 0.84], y: [3, 40] }],
  },
  {
    // długa kamienica nad kanałem: jasnożółty tynk, szary parter z łukowymi oknami i dużym portalem z kolorowym wejściem
    name: 'Wał, żółta kamienica nad kanałem', mid: [-2898, 2574], seed: 245, wall: '#dedaa4', base: '#b7b39d', groundTop: 56, trim: '#ebe8c0', frame: '#f4f2ec', eave: 175,
    axes: ax(14), floors: [{ y: [14, 50], w: 9.5 }, ...rows(3, 9.5, 66, 36).map(f => ({ ...f, hood: 'hood' }))], bands: [[54, 59, 2.4], [167, 171, 1.6], [171, 175, 3.6]],
    rustic: [[0, 56]], balconies: [[2, 0.03, 0.1, 9, true], [1, 0.03, 0.1, 9, true]],
    ground: [arch(0.1, 0.18, { rise: 12 }), arch(0.4, 0.6, { rise: 16, ring: '#3a4a46' }), arch(0.7, 0.78, { rise: 12 })],
  },
];

export const WAL = FRONTS.map(f => ({ ground: [], ...f }));
