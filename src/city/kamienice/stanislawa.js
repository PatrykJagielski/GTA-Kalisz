/* ---------- ulica Świętego Stanisława: kamienice od Kanonickiej do zakrętu ---------- */
// Według Street View (paź 2024). Format jak w kanonicka.js; ułamki frontu liczone od lewego końca patrząc z ulicy.
// Większość domów to zwietrzałe tynki bez ozdób, więc okna rozmieszczone równomiernie, a parter z pomiarów (wejścia, bramy, witryny).
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const STANISLAWA = [
  {
    // różowa kamienica z szarymi lizenami: dwa piętra, okna z kutymi balustradami, gzyms nad parterem
    name: 'Św. Stanisława różowa', mid: [-1152, 1522], seed: 81, wall: '#c9998a', base: '#a77a70', groundTop: 22, trim: '#c9c6bc', frame: '#f1eee4', eave: 96,
    axes: [0.31, 0.68],
    floors: [WIN([12, 32], 12, 'ear'), WIN([46, 66], 12, 'ear')],
    bands: [[38, 41, 2.4], [90, 96, 3.2]],
    strips: [[0, 0.08], [0.9, 1]], stripY0: 4,
    ground: [],
  },
  {
    // zielona kamienica z cegłą w parterze: szeroka brama z kratą i tablice kancelarii
    name: 'Brama z cegłą', mid: [-1308, 1475], seed: 82, wall: '#9fae9a', base: '#8c4a38', groundTop: 44, trim: '#d9d6cb', frame: '#f1eee4', eave: 110,
    axes: [0.26, 0.5, 0.72],
    floors: [WIN([58, 80], 13), WIN([86, 106], 13)],
    bands: [[44, 49, 2.4], [104, 110, 3.2]],
    ground: [
      { k: 'arch', x: [0.16, 0.5], y: [4, 40], rise: 4, gate: true, frame: '#2a2a2a', ring: '#7a3a2a' },
      { k: 'door', x: [0.58, 0.68], y: [4, 32], frame: '#7a4a2a' },
    ],
  },
  {
    // beżowa kamienica ze sklepem z antykami i balkonem na piętrze
    name: 'Antyki', mid: [-1506, 1414], seed: 83, wall: '#d8c3a2', base: '#b89b74', groundTop: 42, trim: '#f1eee4', frame: '#f1eee4', eave: 112,
    axes: [0.16, 0.45, 0.73, 0.9],
    floors: [WIN([60, 84], 12), WIN([90, 108], 10)],
    bands: [[42, 47, 2.4], [105, 112, 3.2]],
    balconies: [[0, 0.62, 0.84, 9]],
    ground: [
      { k: 'shop', x: [0.07, 0.3], y: [6, 38], frame: '#3a2a22', ring: '#f1eee4' },
      { k: 'door', x: [0.7, 0.82], y: [4, 34], frame: '#5a3a2a' },
    ],
  },
  {
    // zwietrzała kamienica ze sklepami SS i CUK
    name: 'Sklepy SS', mid: [-1340, 1380], seed: 84, wall: '#8a8478', base: '#6a665c', groundTop: 44, trim: '#bcb8ac', frame: '#e9e6dc', eave: 112,
    axes: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85],
    floors: [WIN([58, 80], 12, 'ear'), WIN([88, 106], 12, 'ear')],
    bands: [[44, 49, 2.4], [105, 112, 3.2]],
    ground: [
      { k: 'shop', x: [0.06, 0.42], y: [4, 38], frame: '#2a2a2a', ring: '#cfcbbf' },
      { k: 'shop', x: [0.52, 0.94], y: [4, 38], frame: '#2a2a2a', ring: '#cfcbbf' },
    ],
    signs: [{ x: [0.12, 0.34], y: [38, 43], bg: '#2c2c2c', fg: '#ffffff', lines: [['SS', 0.7, 0.5]] }],
  },
  {
    // beżowa kamienica z balkonem, półpiwnicą i dwiema kratami
    name: 'Balkon', mid: [-809, 1308], seed: 85, wall: '#d2b48c', base: '#c19a60', groundTop: 36, trim: '#f1eee4', frame: '#f1eee4', eave: 108,
    axes: [0.2, 0.62],
    floors: [WIN([52, 76], 12), WIN([88, 106], 10)],
    bands: [[36, 41, 2.4], [102, 108, 3.2]],
    balconies: [[1, 0.35, 0.8, 9]],
    ground: [
      { k: 'door', x: [0.1, 0.22], y: [-2, 30], frame: '#8a4a3a', ring: '#e1d8c6' },
      { k: 'door', x: [0.55, 0.7], y: [4, 30], frame: '#7a3a4a' },
    ],
  },
  {
    // trzy kamienice tynkowane przy zakręcie: równe rzędy okien
    name: 'Dom 292', mid: [-284, 857], seed: 86, wall: '#c5b9a5', base: '#9a8f7e', groundTop: 36, trim: '#e5dccf', frame: '#f1eee4', eave: 108,
    axes: [0.15, 0.4, 0.65, 0.88],
    floors: [WIN([48, 70], 11), WIN([82, 102], 11)],
    bands: [[36, 41, 2.4], [102, 108, 3.2]],
    ground: [{ k: 'door', x: [0.45, 0.58], y: [4, 34], frame: '#5a3a2a' }],
  },
  {
    name: 'Dom 293', mid: [-542, 1080], seed: 87, wall: '#b6c0b0', base: '#8f9a8a', groundTop: 36, trim: '#e5dccf', frame: '#f1eee4', eave: 108,
    axes: [0.15, 0.4, 0.65, 0.88],
    floors: [WIN([48, 70], 11), WIN([82, 102], 11)],
    bands: [[36, 41, 2.4], [102, 108, 3.2]],
    ground: [{ k: 'door', x: [0.45, 0.58], y: [4, 34], frame: '#5a3a2a' }],
  },
  {
    name: 'Dom 294', mid: [-662, 1182], seed: 88, wall: '#d9cdb4', base: '#a89c82', groundTop: 36, trim: '#e5dccf', frame: '#f1eee4', eave: 108,
    axes: [0.15, 0.4, 0.65, 0.88],
    floors: [WIN([48, 70], 11), WIN([82, 102], 11)],
    bands: [[36, 41, 2.4], [102, 108, 3.2]],
    ground: [{ k: 'door', x: [0.45, 0.58], y: [4, 34], frame: '#5a3a2a' }],
  },
];
