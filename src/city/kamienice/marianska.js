/* ---------- ulica Mariańska: obie pierzeje od skrzyżowania z Kanonicką do skrzyżowania z Piekarską ---------- */
// Według Street View (paź 2024). Format jak w zamkowa-kit.js i spec.js; poza tym:
//   pieces   jedna krawędź obrysu OSM obejmuje po kilka kamienic (ząbków nie ma, obrys to jedna ściana), więc opis krawędzi
//            to lista [szerokość w dm, opis kamienicy] od początku krawędzi w kolejności obrysu; ostatnia bierze resztę
// Ułamki frontu liczone od lewego końca patrząc z ulicy: pierzeja NW zaczyna się przy Kanonickiej (róg z herbem w bruku),
// pierzeja SE przy skrzyżowaniu z Piekarską (od NE do SW).
const fl = (w = 9, o = {}) => [{ y: [58, 79], w, ...o }, { y: [88, 108], w, ...o }, { y: [117, 136], w: w - 0.5, ...o }];
const bd = (eave, d = 2.2) => [[48, 52, d], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4.2]];
const ring = '#efe9dc';

export const MARIANSKA = [
  {
    // pierzeja NW, krawędź 1: narożna ochrowa kamienica z czterema łukowymi witrynami i dwiema kondygnacjami balkonów, obok kamienica kremowa z bramą i salonem Tontor
    name: 'Mariańska NW 1', mid: [832, -109],
    pieces: [[147, {
      name: 'Narożna ochrowa', seed: 61, wall: '#dccaa0', base: '#c9ac75', groundTop: 50, trim: '#ebe0c3', frame: '#f2eee4', eave: 148,
      axes: [0.245, 0.367, 0.503, 0.626, 0.762, 0.884],
      floors: fl(9.5), bands: bd(148, 2.4), panels: [[0, 1, '#b39a8e', -2, 8]],
      balconies: [[0, 0.435, 0.707, 11, true], [1, 0.415, 0.646, 11, true]],
      ground: [
        { k: 'arch', x: [0.259, 0.408], y: [3, 43], rise: 9, frame: '#5a3d26' },
        { k: 'arch', x: [0.524, 0.667], y: [3, 43], rise: 9, frame: '#5a3d26' },
        { k: 'arch', x: [0.782, 0.939], y: [3, 43], rise: 9, frame: '#5a3d26' },
      ],
      signs: [{ x: 0.08, w: 10, y: [52.5, 55.1], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. MARIAŃSKA', 0.6, 0.55]] }],
    }], [218, {
      name: 'Kamienica z Tontorem', seed: 62, wall: '#dbd2b5', base: '#d3c58f', groundTop: 50, trim: '#ebe5cf', frame: '#f2efe6', eave: 150,
      axes: [0.06, 0.147, 0.234, 0.321, 0.408, 0.495, 0.582, 0.669, 0.756, 0.843, 0.93],
      floors: fl(9, { hood: 'hood' }), bands: bd(150, 2.4),
      balconies: [[1, 0.62, 0.757, 11, true]],
      ground: [
        { k: 'arch', x: [0.06, 0.161], y: [3, 43], rise: 9, frame: '#5a3d26' },
        { k: 'arch', x: [0.257, 0.358], y: [3, 43], rise: 9, frame: '#5a3d26' },
        { k: 'arch', x: [0.413, 0.518], y: [3, 43], rise: 9, door: true, frame: '#5a3d26' },
        { k: 'arch', x: [0.56, 0.642], y: [3, 43], rise: 8, frame: '#5a3d26' },
        { k: 'arch', x: [0.688, 0.775], y: [3, 44], rise: 9, wood: true, ring },
        { k: 'arch', x: [0.812, 0.904], y: [3, 43], rise: 9, door: true, frame: '#7a5a2a' },
        { k: 'door', x: [0.93, 0.98], y: [3, 40] },
      ],
      cartouche: [0.955, 47],
      signs: [
        { x: [0.82, 0.896], y: [35, 40], bg: '#2f7d4a', fg: '#e8f1e4', font: '700 {}px Arial, sans-serif', z: 0.9, lines: [['TONTOR', 0.62, 0.52]] },
        { x: 0.66, w: 2.6, y: [41, 43.2], bg: '#1d2533', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['10', 0.62, 0.56]] },
      ],
    }]],
  },
  {
    // krawędź 2: różowoszara kamienica z czarną bramą w białym łuku, okrągłymi balkonami i pracownią Architekt
    name: 'Mariańska NW 2', mid: [1038, -254],
    pieces: [[138, {
      name: 'Kamienica Architekt', seed: 63, wall: '#c9b9ae', base: '#ddd4b8', groundTop: 50, trim: '#e2d8cc', frame: '#f4f1ea', eave: 150,
      axes: [0.116, 0.29, 0.478, 0.659, 0.848],
      floors: fl(9.5, { hood: 'hood' }), bands: bd(150, 2.4),
      balconies: [[0, 0.336, 0.6, 12, true], [1, 0.45, 0.7, 11, true]],
      ground: [
        { k: 'arch', x: [0.203, 0.326], y: [2, 44], rise: 9, gate: true, ring },
        { k: 'arch', x: [0.5, 0.63], y: [3, 43], rise: 9, ring },
        { k: 'arch', x: [0.645, 0.848], y: [3, 44], rise: 12, door: true, frame: '#6a3b24', ring },
      ],
      signs: [{ x: [0.66, 0.84], y: [27, 32], fg: '#f2f2f2', font: '700 {}px Arial, sans-serif', z: 0.9, lines: [['ARCHITEKT', 0.9, 0.5]] }],
    }]],
  },
  {
    // krawędź 3: trzy kamienice: z łukową witryną z archiwalną fotografią, z pilastrami i bramą pod nr 4, narożna z banerem „Sprzedam kamienicę”
    name: 'Mariańska NW 3', mid: [1214, -392],
    pieces: [[82, {
      name: 'Dom Fibigera', seed: 64, wall: '#bda8a2', base: '#a89c92', groundTop: 50, trim: '#cdbab3', frame: '#f1ede6', eave: 148,
      axes: [0.244, 0.537, 0.83],
      floors: fl(9, { hood: 'hood' }), bands: bd(148, 2.4),
      ground: [
        { k: 'door', x: [0.11, 0.28], y: [3, 40] },
        { k: 'arch', x: [0.415, 0.78], y: [3, 43], rise: 10, frame: '#7a6a50' },
      ],
      signs: [{ x: [0.43, 0.77], y: [31, 36.5], bg: '#d7c9a5', fg: '#5a4630', font: '700 {}px Georgia, serif', z: 0.9, lines: [['ARNOLD FIBIGER w KALISZU', 0.46, 0.5]] }],
    }], [165, {
      name: 'Kamienica z pilastrami', seed: 65, wall: '#b6a19b', base: '#a39890', groundTop: 50, trim: '#c8b6b0', frame: '#f1ede6', eave: 152,
      axes: [0.09, 0.236, 0.38, 0.527, 0.67, 0.82],
      floors: fl(9, { hood: 'hood' }), bands: bd(152, 2.6),
      strips: [[0, 0.04], [0.27, 0.31], [0.575, 0.615], [0.88, 0.92]], stripY0: 86,
      balconies: [[0, 0.21, 0.36, 11, true], [1, 0.26, 0.38, 10], [0, 0.57, 0.76, 11, true], [1, 0.58, 0.72, 10], [2, 0.58, 0.7, 9]],
      ground: [
        { k: 'arch', x: [0.079, 0.224], y: [3, 44], rise: 9, door: true, frame: '#6a2a24', ring },
        { k: 'arch', x: [0.358, 0.467], y: [2, 46], rise: 8, gate: true, ring },
        { k: 'shop', x: [0.527, 0.673], y: [4, 42], frame: '#7a4a2e' },
        { k: 'shop', x: [0.709, 0.842], y: [4, 42], frame: '#7a4a2e' },
      ],
      signs: [
        { x: 0.333, w: 7, y: [48, 51], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['Mariańska 4', 0.62, 0.55]] },
        { x: [0.54, 0.66], y: [36, 41], bg: '#f4f2ea', fg: '#6a2a24', font: '700 {}px Arial, sans-serif', z: 0.9, lines: [['YOSH', 0.7, 0.5]] },
      ],
    }], [63, {
      name: 'Narożna ze sprzedażą', seed: 66, wall: '#b09f9a', base: '#a39890', groundTop: 50, trim: '#c4b2ac', frame: '#f1ede6', eave: 150,
      axes: [0.11, 0.43, 0.75],
      floors: fl(9, { hood: 'hood' }), bands: bd(150, 2.4),
      ground: [
        { k: 'arch', x: [0.127, 0.35], y: [3, 42], rise: 7, wood: true, frame: '#6a3b24' },
        { k: 'shop', x: [0.46, 0.78], y: [4, 42], frame: '#6a3b24' },
      ],
      signs: [
        { x: [0.45, 0.92], y: [50, 56.5], bg: '#ecd94a', fg: '#222222', font: '800 {}px Arial, sans-serif', z: 3, lines: [['SPRZEDAM KAMIENICĘ', 0.7, 0.52]] },
        { x: [0.48, 0.76], y: [34, 39], bg: '#f4f2ea', fg: '#6a2a24', font: '700 {}px Arial, sans-serif', z: 0.9, lines: [['YOSH · L\'ORÉAL', 0.6, 0.5]] },
      ],
    }]],
  },
  {
    // pierzeja SE, krawędź 1 (od strony Piekarskiej): narożna szara kamienica z łukowymi witrynami
    name: 'Mariańska SE 1', mid: [1379, -410],
    pieces: [[65, {
      name: 'Szara narożna', seed: 71, wall: '#85817c', base: '#8d8a85', groundTop: 50, trim: '#bdbab3', frame: '#dcdad4', eave: 158,
      axes: [0.15, 0.5],
      floors: fl(9, { hood: 'hood' }), bands: bd(158, 2.4),
      strips: [[0.85, 1]], stripY0: 50,
      ground: [{ k: 'arch', x: [0, 0.615], y: [3, 43], rise: 12, frame: '#222222' }],
    }]],
  },
  {
    // krawędź 2: szara kamienica z białymi pilastrami, balkonami i sklepem Eko Kącik, dalej wąska kamienica z łukową witryną
    name: 'Mariańska SE 2', mid: [1283, -328],
    pieces: [[145, {
      name: 'Eko Kącik', seed: 72, wall: '#85817c', base: '#8d8a85', groundTop: 50, trim: '#bdbab3', frame: '#dcdad4', eave: 158,
      axes: [0.17, 0.345, 0.52, 0.69, 0.86],
      floors: fl(9, { hood: 'hood' }), bands: bd(158, 2.4),
      strips: [[0.54, 0.63]], stripY0: 50,
      balconies: [[0, 0.055, 0.29, 10, true], [1, 0.055, 0.29, 10], [0, 0.59, 0.76, 9]],
      ground: [
        { k: 'arch', x: [0.028, 0.269], y: [3, 43], rise: 12, frame: '#222222' },
        { k: 'arch', x: [0.462, 0.703], y: [3, 44], rise: 12, frame: '#6a3b24', ring },
      ],
      signs: [{ x: 0.6, w: 10, y: [18, 28], round: true, bg: '#f0d98a', fg: '#2d6a3a', font: '800 {}px Georgia, serif', z: 0.9, lines: [['eko', 0.22, 0.3], ['kącik', 0.26, 0.62]] }],
    }], [42, {
      name: 'Wąska z witryną', seed: 73, wall: '#cfcdc0', base: '#9a9892', groundTop: 50, trim: '#e3e1d6', frame: '#f2f0ea', eave: 152,
      axes: [0.33, 0.8],
      floors: fl(9, { hood: 'hood' }), bands: bd(152, 2.2),
      ground: [{ k: 'arch', x: [0.1, 0.71], y: [3, 43], rise: 9, frame: '#2a2622' }],
    }]],
  },
  {
    // krawędź 3: wąski dom z salonem Gringo Piercing i kremowa kamienica z dwoma balkonami (Biuro Poselskie)
    name: 'Mariańska SE 3', mid: [1146, -217],
    pieces: [[26, {
      name: 'Gringo Piercing', seed: 74, wall: '#d5d4c6', base: '#d0cfc0', groundTop: 50, trim: '#e6e5da', frame: '#f4f2ec', eave: 148,
      axes: [0.5],
      floors: fl(9), bands: bd(148, 2),
      ground: [{ k: 'shop', x: [0.115, 0.885], y: [4, 44], frame: '#6a3a24' }],
      signs: [{ x: [0.12, 0.88], y: [40.5, 45.5], bg: '#14110f', fg: '#eeeeee', font: '700 {}px Georgia, serif', z: 0.9, lines: [['GRINGO PIERCING', 0.5, 0.5]] }],
    }], [140, {
      name: 'Biuro Poselskie', seed: 75, wall: '#e0ddcb', base: '#d9d6c4', groundTop: 50, trim: '#f1efe6', frame: '#f4f2ec', eave: 154,
      axes: [0.071, 0.236, 0.4, 0.564, 0.729, 0.893],
      floors: fl(10, { hood: 'hood' }), bands: bd(154, 2.4),
      balconies: [[0, 0.49, 0.93, 12, true], [2, 0.49, 0.93, 9, true]],
      ground: [
        { k: 'door', x: [0.25, 0.336], y: [3, 40] },
        { k: 'shop', x: [0.42, 0.55], y: [4, 42], frame: '#6a3b24' },
        { k: 'door', x: [0.643, 0.729], y: [3, 42] },
        { k: 'shop', x: [0.82, 0.943], y: [4, 42], frame: '#6a3b24' },
      ],
      signs: [{ x: 0.686, w: 6.5, y: [40, 47], bg: '#f4f2ea', fg: '#2b3a4f', border: '#8a8a8a', font: '700 {}px Arial, sans-serif', lines: [['BIURO POSELSKIE', 0.14, 0.2], ['Barbary Oliwieckiej', 0.12, 0.6]] }],
    }]],
  },
  {
    // krawędź 4: ochrowy parter z łukowymi oknami i bramą, ciemnobrązowe piętra z balkonem
    name: 'Mariańska SE 4', mid: [1049, -142],
    pieces: [[80, {
      name: 'Brązowa z bramą', seed: 76, wall: '#8e8279', base: '#e2d9a8', groundTop: 50, trim: '#b8aea2', frame: '#e6e0d4', eave: 156,
      axes: [0.28, 0.64],
      floors: fl(9.5, { hood: 'hood' }), bands: bd(156, 2.4),
      balconies: [[0, 0.1, 0.44, 9, true]],
      ground: [
        { k: 'arch', x: [0.125, 0.363], y: [3, 43], rise: 9, frame: '#7a4a2a' },
        { k: 'arch', x: [0.588, 0.75], y: [2, 46], rise: 9, wood: true, ring },
      ],
    }]],
  },
  {
    // krawędź 5: jasna kamienica z napisem 1926 przy wejściu, trzema łukami na parterze i attyką z oknami arkadowymi
    name: 'Mariańska SE 5', mid: [983, -90],
    pieces: [[88, {
      name: 'Kamienica 1926', seed: 77, wall: '#d6d9d6', base: '#d0d4d1', groundTop: 50, trim: '#e8ebe8', frame: '#f6f6f2', eave: 186,
      axes: [0.13, 0.68],
      floors: [{ y: [60, 82], w: 10 }, { y: [89, 109], w: 10 }, { y: [116, 138], w: 10 }, { y: [160, 178], w: 9 }],
      bands: [[48, 52, 2.4], [145, 148, 1.6], [177, 181, 1.6], [181, 186, 4.2]],
      balconies: [[1, 0.31, 0.53, 8, true]],
      ground: [
        { k: 'arch', x: [0.01, 0.216], y: [2, 44], rise: 8, wood: true, frame: '#7a3a2a', ring },
        { k: 'arch', x: [0.239, 0.42], y: [3, 43], rise: 8, frame: '#7a3a2a', ring },
        { k: 'arch', x: [0.455, 0.705], y: [3, 43], rise: 9, door: true, frame: '#7a3a2a', ring },
      ],
      signs: [{ x: 0.108, w: 8, y: [36, 41], bg: '#c9ccc7', fg: '#3a3a3a', font: '700 {}px Georgia, serif', z: 0.9, lines: [['1926', 0.8, 0.5]] }],
    }]],
  },
  {
    // krawędź 6: beżowa kamienica z kutymi balkonami i dwie ostatnie przy skrzyżowaniu, w tym ta z kawiarnią Mario Coffee
    name: 'Mariańska SE 6', mid: [893, -18],
    pieces: [[82, {
      name: 'Beżowa z balkonami', seed: 78, wall: '#cbc2ae', base: '#cfc6b3', groundTop: 50, trim: '#ddd5c3', frame: '#f2efe6', eave: 150,
      axes: [0.1, 0.38, 0.66, 0.93],
      floors: fl(9.5, { hood: 'hood' }), bands: bd(150, 2.4),
      balconies: [[0, 0.54, 0.9, 10, true], [1, 0.05, 0.5, 10]],
      ground: [
        { k: 'arch', x: [0.05, 0.378], y: [3, 43], rise: 8, frame: '#7a4a2a' },
        { k: 'arch', x: [0.537, 0.98], y: [3, 44], rise: 10, door: true, frame: '#7a4a2a' },
      ],
    }], [59, {
      name: 'Mario Coffee', seed: 79, wall: '#cdbfa6', base: '#cabc9f', groundTop: 50, trim: '#ddd1ba', frame: '#f2efe6', eave: 150,
      axes: [0.15, 0.54, 0.9],
      floors: fl(9, { hood: 'hood' }), bands: bd(150, 2.4),
      ground: [{ k: 'arch', x: [0.1, 0.42], y: [3, 43], rise: 9, frame: '#7a4a2a' }],
      signs: [{ x: [0.14, 0.38], y: [33, 40], bg: '#1f6b3a', fg: '#f0d98a', font: 'italic 700 {}px Georgia, serif', z: 0.9, lines: [['Mario', 0.34, 0.3], ['Coffee', 0.34, 0.7]] }],
    }]],
  },
];
