/* ---------- ulica Przechodnia: zabudowa po stronie północnej (numery parzyste), od Wrocławskiej w stronę Bernardyńskiej ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy,
// czyli od strony wschodniej (od Rynku).
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const nr = (x, y, t) => ({ x, w: 2.6, y: [y, y + 2.2], bg: '#1d2533', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [[t, 0.62, 0.56]] });

export const PRZECHODNIA = [
  {
    // kamienica z szczytem: parter w żółtym tynku z trzema łukami (lokal do wynajęcia, wejścia w złotych portalach), nad nim trzy piętra
    name: 'Przechodnia szczytowa', mid: [-2386, 171], seed: 91, wall: '#d9d6c9', base: '#e7dcb0', groundTop: 56, trim: '#ece8da', frame: '#b0832e', eave: 175,
    axes: [0.22, 0.5, 0.78],
    floors: [{ y: [66, 92], w: 9, hood: 'hood' }, { y: [104, 130], w: 9, hood: 'hood' }, { y: [142, 164], w: 8.5 }],
    bands: [[54, 58, 2.2], [98, 101, 1.4], [168, 172, 1.8], [172, 175, 3.6]],
    pediments: [[0.18, 0.82, 16, 175, 2, false]],
    ground: [
      { k: 'arch', x: [0.06, 0.2], y: [3, 46], rise: 6, door: true, frame: '#a77b2a', ring: '#f1ecd8' },
      { k: 'arch', x: [0.3, 0.64], y: [3, 46], rise: 10, frame: '#4a4d52', ring: '#f1ecd8' },
      { k: 'arch', x: [0.72, 0.92], y: [3, 46], rise: 7, door: true, frame: '#a77b2a', ring: '#f1ecd8' },
    ],
  },
  {
    // narożny gmach: ciemnoszary parter z czterema łukowymi oknami w białych opaskach, jasne piętra z lizenami narożnymi
    name: 'Przechodnia z łukami', mid: [-2508, 114], seed: 92, wall: '#c3c6c0', base: '#767a78', groundTop: 58, trim: '#ecebe5', frame: '#f3f2ec', eave: 190,
    axes: [0.12, 0.34, 0.57, 0.84],
    floors: [{ y: [68, 94], w: 9, hood: 'hood' }, { y: [106, 132], w: 9, hood: 'hood' }, { y: [144, 168], w: 8.5 }],
    bands: [[56, 60, 2.2], [100, 103, 1.2], [176, 181, 1.6], [181, 190, 4.4]],
    strips: [[0.9, 0.98]], stripY0: 60,
    ground: [
      { k: 'arch', x: [0.06, 0.2], y: [8, 52], rise: 7, wood: true, ring: '#f1f0ea' },
      { k: 'arch', x: [0.29, 0.43], y: [8, 52], rise: 7, ring: '#f1f0ea', frame: '#f3f2ec' },
      { k: 'arch', x: [0.5, 0.64], y: [8, 52], rise: 7, ring: '#f1f0ea', frame: '#f3f2ec' },
      { k: 'arch', x: [0.77, 0.91], y: [8, 52], rise: 7, ring: '#f1f0ea', frame: '#f3f2ec' },
    ],
    signs: [{ x: 0.11, w: 4, y: [56, 60], round: true, bg: '#c43a5a', fg: '#ffffff', font: '700 {}px Georgia, serif', lines: [['Kazimiera', 0.5, 0.55]] }],
  },
  {
    // wąski odcinek tego samego gmachu: ciemny parter z wielkim łukiem wejścia, jasne piętra z białą lizeną
    name: 'Przechodnia wejście', mid: [-2442, 146], seed: 93, wall: '#c9ccc6', base: '#7b7f7c', groundTop: 60, trim: '#ecebe5', frame: '#f3f2ec', eave: 190,
    axes: [0.5],
    floors: [{ y: [70, 96], w: 9, hood: 'hood' }, { y: [108, 134], w: 9, hood: 'hood' }, { y: [146, 170], w: 8.5 }],
    bands: [[58, 62, 2.2], [102, 105, 1.2], [178, 183, 1.6], [183, 190, 4.4]],
    ground: [{ k: 'arch', x: [0.1, 0.9], y: [2, 54], rise: 12, ring: '#f1f0ea', frame: '#8a8f8d' }],
  },
  {
    // długa kamienica nr 4: różowo-beżowy parter z granatową bramą w łuku, brudny oliwkowy tynk wyżej, okna z trójkątnymi naczółkami i kute balkony
    name: 'Przechodnia 4', mid: [-2267, 229], seed: 94, wall: '#7f7b69', base: '#d6baa8', groundTop: 60, trim: '#b8b4a2', frame: '#f1eee6', eave: 185,
    axes: ax(7),
    floors: [{ y: [70, 98], w: 10, hood: 'hood' }, { y: [110, 138], w: 10, hood: 'hood' }, { y: [150, 174], w: 9 }],
    bands: [[58, 62, 2], [104, 106, 1.2], [176, 180, 1.6], [180, 185, 3.8]],
    balconies: [[0, 0.1, 0.2, 9], [0, 0.78, 0.88, 9], [1, 0.1, 0.2, 9]],
    ground: [
      { k: 'shop', x: [0.06, 0.2], y: [10, 46], frame: '#f1eee6' },
      { k: 'arch', x: [0.28, 0.42], y: [2, 56], rise: 8, wood: true, frame: '#26364f', ring: '#e8e0d4' },
      { k: 'shop', x: [0.5, 0.6], y: [10, 46], frame: '#f1eee6' },
      { k: 'shop', x: [0.66, 0.76], y: [10, 46], frame: '#f1eee6' },
      { k: 'shop', x: [0.82, 0.92], y: [10, 46], frame: '#f1eee6' },
    ],
    signs: [nr(0.25, 48, '4')],
  },
  {
    // długi, brudnoszary blok z poddaszem i lukarnami: trzy rzędy okien w białych ramach nad wysokim cokołem
    name: 'Przechodnia blok', mid: [-2100, 322], seed: 95, wall: '#7c786d', base: '#8c8880', groundTop: 14, trim: '#a4a094', frame: '#efece4', eave: 142,
    axes: ax(8),
    floors: [{ y: [24, 50], w: 9.5 }, { y: [62, 88], w: 9.5 }, { y: [100, 124], w: 9 }],
    bands: [[52, 56, 1.6], [128, 132, 1.4], [132, 142, 3.2]],
    ground: [{ k: 'arch', x: [0.9, 0.96], y: [2, 38], rise: 4, wood: true, ring: '#a4a094' }],
  },
];
