/* ---------- plac Jana Pawła II: Dom Pielgrzyma (pierzeja W) i żółta kamienica z lokalami (NE) ---------- */
// Według Street View (lip 2024), format jak w kolegialna.js. Budynki stoją po stronie E placu i patrzą na zachód;
// lewy koniec frontu, patrząc z placu, to początek krawędzi obrysu (koniec N).
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (a, b, o = {}) => ({ k: 'shop', x: [a, b], y: [6, 44], frame: '#6b4a2e', ...o });

const FRONTS = [
  {
    // Dom Pielgrzyma: długi klasycystyczny front w szarobeżowym tynku, boniowany parter, pilastry, attyka z naczółkiem, portal z czerwonymi drzwiami
    name: 'Dom Pielgrzyma', mid: [2268, -1738], seed: 211, wall: '#d9d5c7', base: '#cac5b6', groundTop: 52, trim: '#e9e6da', frame: '#f4f2ec', eave: 150,
    axes: ax(11), floors: [{ y: [14, 44], w: 9.5 }, ...rows(2, 9.5)], bands: [[50, 55, 2.4], [142, 146, 1.4], [146, 150, 3.4]], rustic: [[0, 52]],
    strips: [[0.09, 0.105], [0.27, 0.285], [0.45, 0.465], [0.64, 0.655], [0.91, 0.925]], stripY0: 56, cartouche: [0.78, 140],
    ground: [{ k: 'arch', x: [0.755, 0.805], y: [3, 40], rise: 7, wood: true, ring: '#efece2' }],
    signs: [{ x: 0.78, w: 9, y: [92, 100], bg: '#d9d5c7', fg: '#2a2a2a', font: '700 {}px Georgia, serif', lines: [['DOM PIELGRZYMA', 0.6, 0.5]] }],
  },
  {
    // żółta kamienica z białymi łatami tynku: parter z lokalami (kebab, cukiernia) i brązową bramą, balkony
    name: 'Plac JP II, żółta kamienica', mid: [2297, -1904], seed: 212, wall: '#d6c97c', base: '#e2d9b0', groundTop: 52, trim: '#efe7c4', frame: '#f4f2ec', eave: 150,
    axes: ax(5), floors: [{ y: [14, 44], w: 9 }, ...rows(2, 9.5)], bands: [[50, 54, 2.2], [142, 146, 1.4], [146, 150, 3.4]],
    panels: [[0.4, 0.62, '#ebe6d6', 50, 150]], balconies: [[1, 0.42, 0.58, 8, true]],
    ground: [shop(0.05, 0.3), { k: 'door', x: [0.4, 0.5], y: [3, 40] }, shop(0.66, 0.95)],
  },
  {
    name: 'Plac JP II, żółta kamienica 2', mid: [2318, -1802], seed: 213, wall: '#d6c97c', base: '#e2d9b0', groundTop: 52, trim: '#efe7c4', frame: '#f4f2ec', eave: 150,
    axes: ax(7), floors: [{ y: [14, 44], w: 9 }, ...rows(2, 9.5)], bands: [[50, 54, 2.2], [142, 146, 1.4], [146, 150, 3.4]],
    balconies: [[1, 0.1, 0.2, 8, true]], ground: [shop(0.08, 0.28), shop(0.4, 0.55), shop(0.7, 0.88)],
  },
];

export const JP2 = FRONTS.map(f => ({ ground: [], ...f }));
