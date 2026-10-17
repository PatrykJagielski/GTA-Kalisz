/* ---------- ulica Piskorzewska: obie pierzeje od ulicy Wrocławskiej do placu św. Józefa ---------- */
// Według Street View (paź 2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy:
// po stronie północno-wschodniej (numery parzyste) to koniec od Rynku, po południowo-zachodniej koniec od Wrocławskiej.
// Fronty wg kolejności od Wrocławskiej do Rynku, najpierw strona NE (fronty skierowane na NE), potem SW.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const rows = (ys, w) => ys.map(y => ({ y, w }));
const nr = (x, y, t) => ({ x, w: 2.6, y: [y, y + 2.2], bg: '#1d2533', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [[t, 0.62, 0.56]] });

export const PISKORZEWSKA = [
  {
    // narożny gmach przy Wrocławskiej: kremowy tynk, klinowe nadokiennice, ślepe wnęki na I i II piętrze, okna parteru w niszach
    name: 'Piskorzewska róg Wrocławskiej', mid: [-1704, -1365], seed: 71, wall: '#ebe6d8', base: '#d3cec3', groundTop: 52, trim: '#f4f1e8', frame: '#f6f5ef', eave: 200,
    axes: ax(5),
    floors: [...rows([[64, 88]], 9.5), ...rows([[100, 124]], 9.5), ...rows([[136, 160]], 9.5), ...rows([[170, 190]], 9)],
    bands: [[50, 54, 2.2], [96, 98, 1.2], [132, 134, 1.2], [166, 168, 1.2], [192, 196, 1.6], [196, 200, 4.6]],
    strips: [[0, 0.025], [0.975, 1]], stripY0: 54,
    ground: ax(5).map(f => ({ k: 'arch', x: [f - 0.07, f + 0.07], y: [8, 36], rise: 6, frame: '#f4f2ec' })),
  },
  {
    // długa kamienica z balkonami na II i III osi: jasny tynk, ciemny cokół, brama w łuku, latarnia na wysięgniku
    name: 'Piskorzewska z balkonami', mid: [-1566, -1247], seed: 72, wall: '#e8e3d7', base: '#8f877d', groundTop: 48, trim: '#f3efe6', frame: '#f6f5ef', eave: 195,
    axes: ax(9),
    floors: [...rows([[62, 86]], 9.5), ...rows([[98, 122]], 9.5), ...rows([[134, 158]], 9.5), ...rows([[168, 188]], 9)],
    bands: [[50, 54, 2.2], [93, 96, 1.2], [128, 131, 1.2], [164, 167, 1.2], [189, 193, 1.6], [193, 197, 4.4]],
    balconies: [[1, 0.1, 0.18, 9], [2, 0.1, 0.18, 9], [1, 0.82, 0.9, 9], [2, 0.82, 0.9, 9]],
    ground: [
      { k: 'shop', x: [0.04, 0.12], y: [10, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.16, 0.24], y: [10, 36], frame: '#f2f0ea' },
      { k: 'arch', x: [0.3, 0.38], y: [2, 38], rise: 7, wood: true, ring: '#d6d0c4' },
      { k: 'shop', x: [0.44, 0.52], y: [10, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.58, 0.66], y: [10, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.72, 0.8], y: [10, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.86, 0.94], y: [10, 36], frame: '#f2f0ea' },
    ],
  },
  {
    // biała kamienica z bramą w łuku i balkonem nad nią pod czarnym daszkiem; ceglany mur szczytowy sąsiada
    name: 'Piskorzewska z łukiem', mid: [-1365, -1074], seed: 73, wall: '#ebe8de', base: '#a59d93', groundTop: 48, trim: '#f4f1e9', frame: '#f6f5ef', eave: 180,
    axes: [0.17, 0.3, 0.42, 0.58, 0.74],
    floors: [{ y: [60, 86], w: 10 }, { y: [98, 124], w: 10 }, { y: [136, 160], w: 9.5 }],
    bands: [[50, 54, 2.2], [92, 95, 1.2], [168, 172, 1.6], [172, 180, 4.2]],
    balconies: [[0, 0.34, 0.5, 9, false]],
    ground: [
      { k: 'shop', x: [0.1, 0.2], y: [10, 36], frame: '#f2f0ea' },
      { k: 'arch', x: [0.35, 0.49], y: [2, 38], rise: 7, wood: true, ring: '#d6d0c4' },
      { k: 'shop', x: [0.58, 0.66], y: [10, 36], frame: '#f2f0ea' },
    ],
    awnings: [[0.3, 0.55, 94, 10, '#2a2b2d']],
  },
  {
    // długi, biały front o czterech osiach: wejście z brązowymi drzwiami przy lewym końcu, latarnia
    name: 'Piskorzewska 4 osie', mid: [-1282, -1003], seed: 74, wall: '#ece9e1', base: '#9d968b', groundTop: 46, trim: '#f4f1ea', frame: '#f6f5ef', eave: 178,
    axes: [0.16, 0.36, 0.6, 0.84],
    floors: [{ y: [58, 84], w: 10 }, { y: [96, 122], w: 10 }, { y: [134, 158], w: 9.5 }],
    bands: [[48, 52, 2], [90, 93, 1.2], [166, 170, 1.6], [170, 178, 4]],
    ground: [
      { k: 'door', x: [0.04, 0.12], y: [2, 38] },
      { k: 'shop', x: [0.3, 0.42], y: [8, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.54, 0.66], y: [8, 36], frame: '#f2f0ea' },
      { k: 'shop', x: [0.78, 0.9], y: [8, 36], frame: '#f2f0ea' },
    ],
  },
  {
    // ochrowa kamienica z witrynami galerii i białym portalem wejścia („6”), okna z kutymi kratkami
    name: 'Piskorzewska 6', mid: [-1192, -928], seed: 75, wall: '#e0cd9e', base: '#4a4a4c', groundTop: 50, trim: '#f1ead7', frame: '#f4f1e6', eave: 190,
    axes: [0.14, 0.38, 0.62, 0.86],
    floors: [{ y: [62, 90], w: 10 }, { y: [102, 130], w: 10 }, { y: [142, 168], w: 9.5 }],
    bands: [[52, 56, 2.4], [96, 99, 1.4], [178, 182, 1.6], [182, 190, 4.4]],
    ground: [
      { k: 'shop', x: [0.04, 0.2], y: [8, 44], frame: '#2a2a2a' },
      { k: 'shop', x: [0.3, 0.46], y: [8, 44], frame: '#2a2a2a', door: [0.3, 0.38] },
      { k: 'shop', x: [0.5, 0.62], y: [8, 44], frame: '#2a2a2a' },
      { k: 'door', x: [0.72, 0.88], y: [2, 44], frame: '#4a2c1e', ring: '#f4f2ec' },
    ],
    signs: [nr(0.66, 40, '6')],
  },
  {
    // biała kamienica „ul. Piskorzewska 4”: sgraffito (pas ornamentu) pod oknami II piętra, okna w drewnianych ramach
    name: 'Piskorzewska 4', mid: [-1104, -854], seed: 76, wall: '#e5e3dc', base: '#c9c6bd', groundTop: 44, trim: '#efece3', frame: '#d8b56e', eave: 176,
    axes: [0.2, 0.5, 0.8],
    floors: [{ y: [58, 88], w: 11 }, { y: [112, 138], w: 11 }, { y: [146, 164], w: 9 }],
    bands: [[46, 50, 2], [94, 97, 1.2], [100, 108, 0.3, 0.04, 0.96, '#8d8576'], [168, 172, 1.6], [172, 176, 3.8]],
    ground: [
      { k: 'shop', x: [0.12, 0.28], y: [8, 34], frame: '#d8b56e' },
      { k: 'door', x: [0.42, 0.58], y: [2, 38] },
      { k: 'shop', x: [0.72, 0.88], y: [8, 34], frame: '#d8b56e' },
    ],
    signs: [nr(0.04, 36, '4')],
  },
  {
    // narożny gmach przy placu św. Józefa: ciemnoszary tynk, fryz krenelażowy pod okapem, okna w opaskach z zamkniętymi okiennicami
    name: 'Piskorzewska róg placu', mid: [-1041, -801], seed: 77, wall: '#8f8c86', base: '#74716b', groundTop: 52, trim: '#b9b5ab', frame: '#b9b5ab', eave: 205,
    axes: [0.28, 0.72],
    floors: [{ y: [62, 94], w: 8 }, { y: [106, 138], w: 8 }, { y: [150, 180], w: 8 }],
    bands: [[52, 56, 2.2], [98, 101, 1.4], [142, 145, 1.4], [186, 190, 2], [190, 195, 3.2], [195, 205, 5.2]],
    ground: [
      { k: 'door', x: [0.12, 0.32], y: [2, 42], frame: '#3a2a22' },
      { k: 'shop', x: [0.56, 0.86], y: [8, 40], frame: '#3a3a3c' },
    ],
  },
  /* ---------- strona południowo-zachodnia (numery nieparzyste) ---------- */
  {
    // wąski dwukondygnacyjny dom: tynk z odpadającą okładziną, nad nim odsłonięta ceglana ściana, zielone okno i brama
    name: 'Piskorzewska ceglany domek', mid: [-1591, -1375], seed: 78, wall: '#9b5c46', base: '#cfcabd', groundTop: 56, trim: '#cfc8b8', frame: '#e9e7e1', eave: 118,
    axes: [0.3, 0.72],
    floors: [{ y: [66, 92], w: 9 }],
    bands: [[54, 58, 1.8, 0, 1, '#cbc5b6'], [112, 118, 3, 0, 1, '#8c8478']],
    ground: [
      { k: 'shop', x: [0.1, 0.44], y: [8, 44], frame: '#2e6b3a' },
      { k: 'door', x: [0.56, 0.86], y: [2, 48], frame: '#2e6b3a' },
    ],
  },
  {
    // „Radość”: ochrowo-szare piętra z żółtymi pasami, ryzalit z ceglanym szczytem, parter z piaskowca ze sklepami
    name: 'Radość', mid: [-1480, -1279], seed: 79, wall: '#b4b2a6', base: '#cfaa7c', groundTop: 62, trim: '#c9a84c', frame: '#4a2c1e', eave: 215,
    axes: ax(7),
    floors: [{ y: [76, 100], w: 10 }, { y: [112, 136], w: 10 }, { y: [148, 172], w: 10 }, { y: [184, 204], w: 9 }],
    bands: [[62, 66, 1.8, 0, 1, '#c8a574'], [105, 108, 0.7, 0, 1, '#c8a84c'], [141, 144, 0.7, 0, 1, '#c8a84c'], [177, 180, 0.7, 0, 1, '#c8a84c'], [206, 210, 1.6], [210, 215, 4]],
    strips: [[0.37, 0.4], [0.6, 0.63]], stripY0: 66,
    pediments: [[0.4, 0.6, 16, 215, 2, true]],
    ground: [
      { k: 'shop', x: [0.08, 0.26], y: [12, 56], frame: '#6b3a24' },
      { k: 'door', x: [0.31, 0.4], y: [2, 54], frame: '#6b3a24' },
      { k: 'shop', x: [0.46, 0.62], y: [12, 56], frame: '#6b3a24' },
      { k: 'shop', x: [0.68, 0.9], y: [2, 56], frame: '#6b3a24', door: [0.82, 0.9] },
    ],
    signs: [{ x: 0.37, w: 8, y: [57, 61], round: true, bg: '#c8201e', fg: '#ffffff', font: '800 {}px Georgia, serif', lines: [['Radość', 0.5, 0.55]] }],
  },
  {
    // niski żółty budynek gospodarczy z attyką: boniowany tynk, dwa zamurowane otwory
    name: 'Piskorzewska żółty mur', mid: [-1307, -1133], seed: 80, wall: '#d3b43e', base: null, groundTop: 0, trim: '#b7b8b2', frame: '#d9d6cb', eave: 46,
    axes: [],
    floors: [],
    bands: [[36, 42, 1.4, 0, 1, '#b4b6b2'], [42, 46, 2.4, 0, 1, '#b4b6b2']],
    ground: [
      { k: 'door', x: [0.1, 0.24], y: [2, 32], frame: '#d9d6cb' },
      { k: 'door', x: [0.52, 0.68], y: [2, 32], frame: '#d9d6cb' },
    ],
  },
  {
    // siedziba Ochotniczej Straży Pożarnej (sklep Tkaniny): oliwkowoszary tynk, czerwony szyld nad oknami, wejście z prawej
    name: 'Straż Pożarna', mid: [-1248, -1080], seed: 81, wall: '#a7a58d', base: '#8e8c78', groundTop: 48, trim: '#bdbba5', frame: '#eeece5', eave: 168,
    axes: [0.22, 0.5, 0.82],
    floors: [{ y: [60, 98], w: 9 }, { y: [130, 154], w: 7.5 }],
    bands: [[48, 52, 1.4], [162, 168, 3.2]],
    ground: [
      { k: 'shop', x: [0.1, 0.34], y: [6, 40], frame: '#eeece5' },
      { k: 'shop', x: [0.44, 0.6], y: [6, 40], frame: '#eeece5' },
      { k: 'door', x: [0.74, 0.88], y: [2, 40], frame: '#4a2c1e' },
    ],
    signs: [{ x: [0.04, 0.8], y: [104, 124], bg: '#8c2a43', fg: '#f6f2ec', font: '800 {}px Arial, sans-serif', lines: [['Ochotnicza Straż Pożarna', 0.5, 0.4], ['rok zał. 1864', 0.2, 0.8]] }],
  },
  {
    // kamienica w rusztowaniach i siatce: brzoskwiniowy tynk, trzy piętra okien i facjata
    name: 'Piskorzewska pod rusztowaniem', mid: [-1004, -874], seed: 82, wall: '#d6a583', base: '#b98d6e', groundTop: 52, trim: '#e4c4a6', frame: '#f2eee6', eave: 185,
    axes: ax(5),
    floors: [{ y: [64, 90], w: 9.5 }, { y: [102, 128], w: 9.5 }, { y: [140, 164], w: 9 }],
    bands: [[52, 56, 2.2], [96, 99, 1.2], [172, 176, 1.6], [176, 185, 4]],
    ground: [
      { k: 'shop', x: [0.06, 0.2], y: [8, 40], frame: '#f2eee6' },
      { k: 'door', x: [0.28, 0.4], y: [2, 42] },
      { k: 'shop', x: [0.5, 0.64], y: [8, 40], frame: '#f2eee6' },
      { k: 'shop', x: [0.74, 0.9], y: [8, 40], frame: '#f2eee6' },
    ],
  },
];
