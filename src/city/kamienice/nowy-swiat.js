/* ---------- ulica Nowy Świat: pierzeje przy jezdni na odcinku najbliżej Rynku ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

// długi front z beżowymi piętrami i szaro-zielonym cokołem: trzy kondygnacje, lukarny w dachu
const dluga = (name, mid, seed, n) => ({
  name, mid, seed, wall: '#d8c3a4', base: '#a9aa98', groundTop: 52, trim: '#eee3d0', frame: '#f2ece0', eave: 190,
  axes: ax(n),
  floors: [{ y: [62, 88], w: 9.5, hood: 'hood' }, { y: [102, 128], w: 9.5, hood: 'hood' }, { y: [142, 166], w: 9 }],
  bands: [[50, 54, 2], [96, 99, 1.2], [172, 176, 1.6], [176, 190, 4]],
  ground: ax(n).map(f => ({ k: 'door', x: [f - 0.025, f + 0.025], y: [10, 30], frame: '#4a4a40' })),
});

export const NOWY_SWIAT = [
  {
    // jasnoróżowa kamienica z brązowym cokołem: okna z opaskami i płycinami, trzy lukarny, po prawej brama z kutą kratą
    name: 'Nowy Świat różowa', mid: [-3406, 6176], seed: 301, wall: '#e6d4cf', base: '#6a4a40', groundTop: 40, trim: '#c89a8a', frame: '#f4ece4', eave: 188,
    axes: [0.07, 0.2, 0.34, 0.48, 0.62, 0.74],
    floors: [{ y: [52, 82], w: 10, hood: 'hood' }, { y: [104, 134], w: 10, hood: 'hood' }, { y: [146, 168], w: 9 }],
    bands: [[40, 44, 2], [92, 95, 1.6], [138, 141, 1.2], [172, 176, 1.6], [176, 188, 4]],
    ground: [{ k: 'arch', x: [0.84, 0.97], y: [2, 52], rise: 6, gate: true }],
  },
  {
    // zaniedbana kamienica z szarym boniowanym parterem i okienkami piwnic, naczółek nad prawą osią
    name: 'Nowy Świat szara', mid: [-2824, 6874], seed: 302, wall: '#8d8a74', base: '#8f8d80', groundTop: 36, trim: '#a8a690', frame: '#ece8de', eave: 160,
    axes: [0.14, 0.38, 0.6, 0.84],
    floors: [{ y: [50, 84], w: 11, hood: 'hood' }, { y: [108, 140], w: 11, hood: 'hood' }],
    bands: [[40, 44, 2.2], [98, 102, 1.6], [146, 150, 1.6], [150, 160, 4]],
    rustic: [[0, 40]],
    ground: [{ k: 'door', x: [0.4, 0.6], y: [2, 30], frame: '#4a4a40' }],
  },
  {
    // zniszczona kamienica z zabitymi deskami oknami parteru, drewnianymi drzwiami i kutym balkonem nad nimi
    name: 'Nowy Świat do remontu', mid: [-2688, 7262], seed: 303, wall: '#c2a883', base: '#b09a78', groundTop: 56, trim: '#cdb792', frame: '#efe6d6', eave: 176,
    axes: [0.1, 0.3, 0.5, 0.72, 0.9],
    floors: [{ y: [70, 100], w: 10, hood: 'hood' }, { y: [118, 146], w: 9.5 }],
    bands: [[56, 60, 2], [108, 111, 1.4], [150, 154, 1.6], [154, 176, 4]],
    balconies: [[0, 0.4, 0.6, 9]],
    ground: [
      { k: 'door', x: [0.43, 0.57], y: [2, 44], frame: '#7a4a2c' },
      ...[0.12, 0.3, 0.7, 0.88].map(f => ({ k: 'shop', x: [f - 0.06, f + 0.06], y: [12, 44], frame: '#6a5a46' })),
    ],
  },
  {
    // biała kamienica z balkonami na kutych wspornikach, dwie bramy na parterze, wysokie piętra
    name: 'Nowy Świat biała', mid: [-2933, 6552], seed: 304, wall: '#ebe9e2', base: '#8e8982', groundTop: 56, trim: '#f6f4ef', frame: '#f8f6f2', eave: 230,
    axes: [0.1, 0.28, 0.5, 0.74, 0.9],
    floors: [{ y: [70, 98], w: 9.5 }, { y: [112, 140], w: 9.5, hood: 'hood' }, { y: [154, 182], w: 9.5 }],
    bands: [[56, 60, 2.2], [104, 107, 1.4], [188, 192, 1.6], [192, 230, 4]],
    balconies: [[0, 0.62, 0.95, 9], [1, 0.62, 0.95, 9]],
    ground: [
      { k: 'arch', x: [0.4, 0.5], y: [2, 52], rise: 5, wood: true, frame: '#2a2420' },
      { k: 'door', x: [0.62, 0.7], y: [2, 48], frame: '#3a3028' },
    ],
  },
  dluga('Nowy Świat beżowa A', [-3058, 6319], 305, 10),
  dluga('Nowy Świat beżowa B', [-3347, 6058], 306, 10),
  dluga('Nowy Świat beżowa C', [-3574, 5858], 307, 10),
  {
    // jasnozielona kamienica z ciemnozielonym cokołem, łukowa płycina po lewej i trzy balkony nad sobą
    name: 'Nowy Świat zielona', mid: [-2924, 7039], seed: 308, wall: '#cfd6a6', base: '#6a7254', groundTop: 52, trim: '#b9c97a', frame: '#f2f2e6', eave: 210,
    axes: [0.14, 0.4, 0.66, 0.9],
    floors: [{ y: [62, 88], w: 9.5 }, { y: [102, 130], w: 9.5 }, { y: [144, 172], w: 9.5 }],
    bands: [[50, 54, 2.2], [96, 99, 1.4], [180, 184, 1.6], [184, 210, 4]],
    balconies: [[0, 0.52, 0.68, 8], [1, 0.52, 0.68, 8]],
    ground: [{ k: 'door', x: [0.08, 0.2], y: [2, 44], frame: '#3a3a30' }, { k: 'door', x: [0.4, 0.6], y: [2, 30], frame: '#4a4a40' }],
  },
  {
    // piętrowy dom z czerwonej cegły: białe pasy wokół okien z cegłą nad nimi, falisty szczyt nad dachem
    name: 'Nowy Świat ceglana', mid: [-2358, 8274], seed: 309, wall: '#b4543e', base: '#8a3e2e', groundTop: 36, trim: '#efe9e0', frame: '#f6f2ea', eave: 160,
    axes: ax(7, 0.04, 0.98),
    floors: [{ y: [46, 82], w: 11, hood: 'hood' }, { y: [96, 132], w: 11, hood: 'hood' }],
    bands: [[36, 40, 1.8], [88, 91, 1.4], [140, 144, 1.6], [144, 160, 4]],
    strips: [[0, 0.03], [0.97, 1]], stripY0: 40,
    ground: [{ k: 'door', x: [0.9, 0.98], y: [2, 32], frame: '#4a3a30' }],
  },
];
