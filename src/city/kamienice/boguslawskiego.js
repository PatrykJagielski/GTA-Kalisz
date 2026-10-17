/* ---------- plac Bogusławskiego: różowy dom z wieżyczką przy Alei Wolności i budynek Uniwersytetu Kaliskiego ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Lewy koniec frontu, patrząc z placu, to początek krawędzi obrysu.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // różowa kamienica z białymi pilastrami, oknami w łuku na piętrze, balkonami z balustradą, czerwonym portalem i wieżyczką
    name: 'Bogusławskiego, różowa kamienica', mid: [2336, 3700], seed: 261, wall: '#d7aeaa', base: '#cfa49f', groundTop: 52, trim: '#f2ece2', frame: '#f4f2ec', eave: 150,
    axes: ax(19), floors: [{ y: [14, 44], w: 9.5 }, { y: [62, 96], w: 9.5, hood: 'hood' }, { y: [108, 132], w: 9 }], bands: [[50, 55, 2.6], [142, 146, 1.6], [146, 150, 3.6]],
    panels: [[0.62, 1, '#e9e1d4', -2]], strips: [[0.2, 0.22], [0.32, 0.34], [0.44, 0.46], [0.56, 0.58]], stripY0: 56,
    balconies: [[1, 0.1, 0.2, 9, true], [1, 0.55, 0.66, 9, true]],
    ground: [{ k: 'arch', x: [0.28, 0.36], y: [3, 46], rise: 10, wood: true, frame: '#a8212a', ring: '#f2ece2' }],
  },
  {
    // Uniwersytet Kaliski: jasny gmach z pilastrami, dach z dachówki
    name: 'Bogusławskiego, Uniwersytet', mid: [2624, 4262], seed: 262, wall: '#e6dcc2', base: '#d8ceb2', groundTop: 52, trim: '#f2ebd8', frame: '#f4f2ec', eave: 120,
    axes: ax(4), floors: [{ y: [12, 44], w: 10 }, { y: [60, 96], w: 10 }], bands: [[50, 55, 2.4], [114, 117, 1.6], [117, 120, 3]],
    strips: [[0.0, 0.03], [0.48, 0.51], [0.97, 1.0]], stripY0: 56, ground: [],
  },
  {
    name: 'Bogusławskiego, Uniwersytet 2', mid: [2446, 4344], seed: 263, wall: '#e6dcc2', base: '#d8ceb2', groundTop: 52, trim: '#f2ebd8', frame: '#f4f2ec', eave: 120,
    axes: ax(4), floors: [{ y: [12, 44], w: 10 }, { y: [60, 96], w: 10 }], bands: [[50, 55, 2.4], [114, 117, 1.6], [117, 120, 3]],
    strips: [[0.0, 0.03], [0.48, 0.51], [0.97, 1.0]], stripY0: 56, ground: [],
  },
];

export const BOGUSLAWSKIEGO = FRONTS.map(f => ({ ground: [], ...f }));
