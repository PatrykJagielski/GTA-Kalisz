/* ---------- ulica Stawiszyńska: początek ulicy za rondem, okolice kościoła ---------- */
// Według Street View (2021–2025), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const rows = (ys, h, w, o = {}) => ys.map(y => ({ y: [y, y + h], w, ...o }));

export const STAWISZYNSKA = [
  {
    // narożna kamienica: łososiowy parter z boniowaniem i piwniczkami, brzoskwiniowe piętra, kuty balkon na wysięgnikach, zęby pod gzymsem
    name: 'Stawiszyńska narożna', mid: [3267, -3972], seed: 151, wall: '#f0c9a0', base: '#d9a58a', groundTop: 50, trim: '#f6e9d8', frame: '#f6f2ea', eave: 182,
    axes: ax(5, 0.08, 0.92),
    floors: [{ y: [62, 90], w: 10 }, { y: [102, 130], w: 10, hood: 'hood' }, { y: [142, 164], w: 9 }],
    bands: [[50, 54, 2.2], [96, 99, 1.4], [170, 175, 1.8], [175, 182, 4.2]],
    balconies: [[0, 0.1, 0.46, 12]],
    rustic: [[0, 50]],
    ground: ax(4, 0.12, 0.88).map(f => ({ k: 'shop', x: [f - 0.07, f + 0.07], y: [14, 44], frame: '#f6f2ea' })),
  },
  {
    // fasada kościelnej bramy: kremowy tynk, drewniane wrota w łuku, szczyt z wolutami i kulami
    name: 'Stawiszyńska brama kościelna', mid: [3113, -4013], seed: 152, wall: '#ece5cf', base: '#d8d0b8', groundTop: 14, trim: '#f6f0e0', frame: '#6b3a1e', eave: 74,
    axes: [], floors: [],
    bands: [[60, 64, 2.4], [64, 74, 3.4]],
    strips: [[0.04, 0.1], [0.9, 0.96]], stripY0: 14,
    pediments: [[0.2, 0.8, 10, 74, 1.5, false]],
    ground: [{ k: 'arch', x: [0.3, 0.6], y: [2, 46], rise: 8, wood: true, frame: '#8a5a2a', ring: '#f6f0e0' }],
  },
  {
    // ochrowa kamienica: zielone kratowane balkony, sklep z szarą witryną i brama garażowa na parterze, gzymsy nad oknami
    name: 'Stawiszyńska z balkonami', mid: [3574, -4332], seed: 153, wall: '#d6bf96', base: '#e4c9a6', groundTop: 56, trim: '#e8d8b8', frame: '#f4f0e6', eave: 172,
    axes: [0.2, 0.65, 0.85],
    floors: [{ y: [64, 94], w: 10, hood: 'hood' }, { y: [108, 138], w: 10, hood: 'hood' }, { y: [148, 164], w: 8 }],
    bands: [[54, 58, 2], [100, 103, 1.4], [166, 172, 3.8]],
    balconies: [[0, 0.1, 0.6, 12, false], [1, 0.1, 0.6, 12, false]],
    ground: [
      { k: 'door', x: [0.04, 0.12], y: [2, 44] },
      { k: 'shop', x: [0.2, 0.52], y: [8, 46], frame: '#f4f0e6', door: [0.2, 0.28] },
      { k: 'arch', x: [0.6, 0.94], y: [2, 48], rise: 0, gate: true, frame: '#6b6a62' },
    ],
  },
  {
    // boczna kaplica: kremowy zniszczony tynk, pilastry, okno z żaluzjami w łuku, falisty szczyt
    name: 'Stawiszyńska kaplica', mid: [3418, -4372], seed: 154, wall: '#e0d4b0', base: '#cdbf9c', groundTop: 14, trim: '#f2ead2', frame: '#7a4a2a', eave: 96,
    axes: [], floors: [],
    bands: [[84, 88, 2.4], [88, 96, 3.4]],
    strips: [[0.04, 0.16], [0.84, 0.96]], stripY0: 14,
    pediments: [[0.1, 0.9, 12, 96, 1.5, false]],
    ground: [{ k: 'arch', x: [0.3, 0.7], y: [34, 78], rise: 12, frame: '#4a3a30', ring: '#f2ead2' }],
  },
  {
    // bogato zdobiona kamienica: ochrowy tynk z płycinami, białe opaski okien, boniowany cokół, lukarny w mansardzie
    name: 'Stawiszyńska zdobiona', mid: [4115, -4862], seed: 155, wall: '#d9a85c', base: '#cbb89a', groundTop: 44, trim: '#f2e6cf', frame: '#f6f2ea', eave: 192,
    axes: [0.16, 0.4, 0.64, 0.86],
    floors: [{ y: [56, 90], w: 11, hood: 'hood' }, { y: [104, 136], w: 10, hood: 'hood' }, { y: [150, 176], w: 9 }],
    bands: [[44, 48, 2.2], [96, 99, 1.4], [142, 145, 1.2], [182, 186, 1.8], [186, 192, 4.2]],
    rustic: [[0, 44]],
    ground: [],
  },
  {
    // długa, jasna kamienica z attyką z małymi okienkami: wejście ze środka w żółtych drewnianych drzwiach, kute i zielone balkony
    name: 'Stawiszyńska jasna', mid: [4246, -4986], seed: 156, wall: '#ebe8dc', base: '#d4d0c2', groundTop: 36, trim: '#f4f2ea', frame: '#f6f4ee', eave: 160,
    axes: ax(8, 0.05, 0.95),
    floors: rows([46, 82, 118], 24, 9),
    bands: [[36, 40, 1.8], [150, 154, 1.4], [154, 160, 2.6]],
    strips: [0.18, 0.4, 0.6, 0.82].map(f => [f - 0.012, f + 0.012]), stripY0: 40,
    balconies: [[1, 0.14, 0.24, 8], [1, 0.52, 0.64, 8], [2, 0.66, 0.78, 8]],
    ground: [{ k: 'door', x: [0.44, 0.52], y: [2, 32], frame: '#e6d27a' }],
  },
  {
    // zaniedbany dom ze szczytem: obdrapany tynk, stalowe zastrzały na elewacji, zamurowane okna i otwory parteru
    name: 'Stawiszyńska ze szczytem', mid: [4712, -5410], seed: 157, wall: '#c8b890', base: '#d6cdb2', groundTop: 52, trim: '#b8a880', frame: '#e8e4d6', eave: 150,
    axes: [0.2, 0.45],
    floors: [{ y: [62, 90], w: 7 }, { y: [104, 130], w: 7 }],
    bands: [[52, 56, 1.4]],
    strips: [0.32, 0.55, 0.76].map(f => [f - 0.01, f + 0.01]), stripY0: 20,
    pediments: [[0, 1, 22, 150, 1, false]],
    ground: [
      { k: 'door', x: [0.1, 0.2], y: [2, 44], frame: '#8a3a22' },
      { k: 'shop', x: [0.32, 0.5], y: [14, 44], frame: '#8a3a22' },
    ],
  },
];
