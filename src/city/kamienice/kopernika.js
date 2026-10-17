/* ---------- ulica Kopernika: białe kamienice narożne z balkonami, parterem sklepowym i wieżyczką ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 62, step = 34) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // kamienica z oknami w opaskach i dwoma kutymi balkonami nad sklepami (księgarnia, sklep)
    name: 'Kopernika, biała kamienica ze sklepami', mid: [-5514, 1369], seed: 310, wall: '#eeeae0', base: '#e2ddd0', groundTop: 50, trim: '#f6f3ec', frame: '#f4f2ec', eave: 170,
    axes: ax(7), floors: [{ y: [14, 42], w: 10 }, ...rows(3, 9)], bands: [[46, 50, 2], [162, 166, 1.6], [166, 170, 3.2]],
    balconies: [[1, 0.2, 0.3, 8, false], [1, 0.52, 0.62, 8, false]],
    ground: [{ k: 'shop', x: [0.05, 0.2], y: [12, 44], frame: '#2a2a2a' }, { k: 'shop', x: [0.3, 0.45], y: [12, 44], frame: '#5a3a28' }, { k: 'door', x: [0.52, 0.58], y: [2, 38] }, { k: 'shop', x: [0.64, 0.82], y: [12, 44], frame: '#2a2a2a' }],
  },
  {
    // narożna kamienica ze sztukateriami i czerwonymi pilastrami, od ulicy wykusz z wieżyczką
    name: 'Kopernika, narożna kamienica z wieżyczką', mid: [-5332, 1516], seed: 311, wall: '#eeeae0', base: '#dcd4c4', groundTop: 50, trim: '#b8786a', frame: '#f4f2ec', eave: 170,
    axes: ax(9), floors: [{ y: [14, 42], w: 10 }, ...rows(3, 9)], bands: [[46, 50, 2], [162, 166, 1.6], [166, 170, 3.2]],
    balconies: [[1, 0.64, 0.78, 12, false], [2, 0.64, 0.78, 12, false], [3, 0.64, 0.78, 12, false]], strips: [[0.28, 0.31], [0.55, 0.58]], stripY0: 50,
  },
];

export const KOPERNIKA = FRONTS.map(f => ({ ground: [], ...f }));
