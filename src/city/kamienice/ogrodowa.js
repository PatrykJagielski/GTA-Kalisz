/* ---------- ulica Ogrodowa: kamienice robotnicze z cegły i tynku ---------- */
// Według Street View (2025). Format jak w kanonicka.js. Ułamki frontu liczone z pikseli zdjęcia prostopadłego do ściany.
const WIN = (y, w, hood = 'hood', at) => (at ? { y, w, hood, at } : { y, w, hood });

export const OGRODOWA = [
  {
    // zniszczona dwukondygnacyjna kamienica z cegły i resztek tynku: sześć okien na piętrze, drewniana brama, zabite okna parteru
    name: 'Ogrodowa zniszczona', mid: [-8884, 1570], seed: 191, wall: '#c0a287', base: '#b49478', groundTop: 50, trim: '#c8bba6', frame: '#d9ccb0', eave: 104,
    axes: [0.11, 0.25, 0.41, 0.57, 0.72, 0.87],
    floors: [WIN([6, 36], 9.5, 'hood', [0.11, 0.25, 0.58, 0.73, 0.88]), WIN([64, 92], 9.5, 'hood')],
    bands: [[48, 52, 1.8], [98, 105, 2.6]],
    ground: [
      { k: 'door', x: [0.375, 0.445], y: [0, 36], frame: '#8a5a2a', ring: '#c8bba6' },
    ],
  },
  {
    // szarobeżowy tynk z podokiennikami i gzymsami: bramka z lewej, dwa okna parteru, trzy okna piętra
    name: 'Ogrodowa z gzymsami', mid: [-9002, 1489], seed: 192, wall: '#b9b29d', base: '#a8a18c', groundTop: 56, trim: '#9f9884', frame: '#ece8dc', eave: 120,
    axes: [0.2, 0.5, 0.75],
    floors: [WIN([6, 36], 11, 'hood', [0.5, 0.75]), WIN([70, 100], 11, 'hood')],
    bands: [[52, 58, 2.4], [112, 120, 3]],
    ground: [
      { k: 'door', x: [0.06, 0.2], y: [0, 40], frame: '#6a7a72' },
    ],
  },
  {
    // ceglana kamienica z różowym tynkowanym cokołem i brązowymi drzwiami, białe obramienia okien
    name: 'Ogrodowa ceglana', mid: [-9132, 1407], seed: 193, wall: '#9a5a44', base: '#bd7a6a', groundTop: 34, trim: '#7a4a3a', frame: '#f4f1ea', eave: 90,
    axes: [0.03, 0.2, 0.43, 0.68, 0.92],
    floors: [WIN([6, 34], 11, 'hood', [0.03, 0.17, 0.43, 0.94]), WIN([56, 84], 11, 'hood')],
    bands: [[44, 48, 1.8], [84, 90, 2.4]],
    ground: [
      { k: 'door', x: [0.64, 0.74], y: [0, 36], frame: '#6a3a22' },
    ],
  },
  {
    // ciemnoszara kamienica z kafelkowym cokołem, dwa okna na parterze i dwa na piętrze w ciemnych opaskach
    name: 'Ogrodowa ciemnoszara', mid: [-9684, 1214], seed: 194, wall: '#6d6c6a', base: '#5a6168', groundTop: 36, trim: '#5a3a38', frame: '#e8e6e0', eave: 120,
    axes: [0.2, 0.47, 0.75],
    floors: [WIN([8, 36], 11, 'hood'), WIN([70, 100], 11, 'hood')],
    bands: [[52, 58, 2.4]],
    ground: [],
  },
  {
    // ciemnoceglana kamienica z jasnym wejściem w obramowaniu i brązową bramą
    name: 'Ogrodowa z wejściem', mid: [-9806, 1152], seed: 195, wall: '#7a4a40', base: '#8a8a86', groundTop: 36, trim: '#5f3e36', frame: '#f1eee4', eave: 105,
    axes: [0.11, 0.35, 0.61, 0.86],
    floors: [WIN([8, 40], 10, 'hood', [0.09, 0.62, 0.87]), WIN([66, 98], 10, 'hood')],
    bands: [[52, 58, 2.2], [98, 105, 2.4]],
    ground: [
      { k: 'door', x: [0.22, 0.42], y: [0, 46], frame: '#7a3a2a', ring: '#e9e3d0' },
    ],
  },
  {
    // parterowy dom z ceglanej ściany z blachodachówką: brama po lewej, białe okna z ząbkami cegieł
    name: 'Ogrodowa parterowa', mid: [-10049, 1032], seed: 196, wall: '#7e3d30', base: '#6a3328', groundTop: 8, trim: '#d9cdb8', frame: '#f4f1ea', eave: 75,
    axes: [0.68, 0.95],
    floors: [WIN([14, 52], 12, 'hood')],
    bands: [[68, 75, 2.6]],
    ground: [
      { k: 'door', x: [0.18, 0.34], y: [0, 52], frame: '#2e2a26', ring: '#a8a8a0' },
    ],
  },
];
