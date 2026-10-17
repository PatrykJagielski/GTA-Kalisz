/* ---------- ulica 3 Maja: kremowy gmach ze wspornikową wieżą-ryzalitem przy rondzie ---------- */
// Według Street View (wrz 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // wysoki ryzalit od strony ulicy: parter z narożną witryną ubezpieczalni, dwa piętra z parami okien
    name: '3 Maja, ryzalit z ubezpieczalnią', mid: [-50, -4584], seed: 260, wall: '#e6dcbc', base: '#d6caa6', groundTop: 52, trim: '#efe7cf', frame: '#f4f2ec', eave: 135,
    axes: [0.28, 0.72], floors: [{ y: [62, 90], w: 11 }, { y: [100, 124], w: 10 }], bands: [[50, 54, 2.2], [127, 131, 1.6], [131, 135, 3]],
    ground: [{ k: 'shop', x: [0.38, 0.92], y: [10, 46], frame: '#f4f4f0', door: [0.38, 0.55] }],
    signs: [{ x: [0.5, 0.9], y: [40, 44], bg: '#2f8fc2', fg: '#ffffff', font: '700 {}px Arial, sans-serif', lines: [['UBEZPIECZENIA', 0.7, 0.55]] }],
  },
  {
    // niższe skrzydło: parter z oknami i drzwiami, piętro z wysokimi oknami i kutym balkonem
    name: '3 Maja, skrzydło z balkonem', mid: [49, -4516], seed: 261, wall: '#e6dcbc', base: '#cfc3a0', groundTop: 52, trim: '#efe7cf', frame: '#f4f2ec', eave: 135,
    axes: ax(6), floors: [{ y: [20, 42], w: 9 }, { y: [64, 118], w: 13 }], bands: [[50, 54, 1.8], [127, 131, 1.6], [131, 135, 3]],
    balconies: [[1, 0.05, 0.62, 8, false]], ground: [],
  },
];

export const TRZECIEGO_MAJA = FRONTS.map(f => ({ ground: [], ...f }));
