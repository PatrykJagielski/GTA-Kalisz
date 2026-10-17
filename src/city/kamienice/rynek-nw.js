/* ---------- Główny Rynek, pierzeja północno-zachodnia za Piskorzewską: w stronę Piekarskiej ---------- */
// Według Street View (sierpień 2025), ciąg dalszy pierzei z spec.js (Salon Firan, Pod Filarami, Żak, Bank Millennium).
// Lewy koniec frontu = strona Piskorzewskiej, patrząc z płyty Rynku.
const FL = (y, w, o = {}) => ({ y, w, ...o });

export const RYNEK_NW = [
  {
    // szarobeżowa kamienica za Piskorzewską: trzy osie, trzy piętra, parter z łukowymi witrynami
    name: 'Szarobeżowa', mid: [-293, -257], seed: 51, wall: '#d6cdbd', base: '#cfc4b2', groundTop: 52, trim: '#efe9dc', frame: '#f4f2ec', eave: 176,
    axes: [0.2, 0.5, 0.8],
    floors: [FL([64, 92], 11, { hood: 'hood' }), FL([104, 132], 11), FL([144, 168], 10.5)],
    bands: [[49, 55, 2.4], [168, 172, 1.4], [172, 176, 3.8]],
    ground: [
      { k: 'arch', x: [0.06, 0.34], y: [3, 42], rise: 8, frame: '#3a3a3a', ring: '#efe9dc' },
      { k: 'arch', x: [0.42, 0.6], y: [3, 42], rise: 8, door: true, frame: '#5a3a26', ring: '#efe9dc' },
      { k: 'arch', x: [0.68, 0.94], y: [3, 42], rise: 8, frame: '#3a3a3a', ring: '#efe9dc' },
    ],
  },
  {
    // wąska zielona kamienica Veroni: trzy osie, kutego balkon na całej szerokości, kartusze z okulusami przy parterze
    name: 'Zielona Veroni', mid: [-230, -313], seed: 52, wall: '#b5c9aa', base: '#a9bf9e', groundTop: 56, trim: '#e9efe0', frame: '#f4f4ee', eave: 178,
    axes: [0.17, 0.5, 0.83],
    floors: [FL([68, 96], 10.5, { hood: 'hood' }), FL([108, 136], 10.5, { hood: 'hood' }), FL([148, 170], 10)],
    bands: [[52, 58, 2.6], [170, 174, 1.4], [174, 178, 3.8]],
    balconies: [[0, 0.02, 0.98, 8]],
    ground: [
      { k: 'door', x: [0.05, 0.22], y: [3, 40] },
      { k: 'arch', x: [0.3, 0.68], y: [3, 44], rise: 11, frame: '#3a2c24', ring: '#e9efe0' },
    ],
    medallions: [0.18, 0.84], medY: 50, medColor: '#e9efe0',
    signs: [{ x: [0.34, 0.64], y: [46, 51], fg: '#2a2a2a', font: '700 {}px Georgia, serif', lines: [['VERONI', 0.8, 0.55]] }],
  },
  {
    // ochrowa kamienica z falistym szczytem: balkon na pierwszym piętrze, w parterze szare drzwi z numerem 5 i sushi bar
    name: 'Ochrowa z szczytem', mid: [-172, -364], seed: 53, wall: '#e6d9a8', base: '#efe6cf', groundTop: 54, trim: '#f7f1de', frame: '#f4f2ec', eave: 176,
    axes: [0.18, 0.5, 0.82],
    floors: [FL([66, 94], 11, { hood: 'hood' }), FL([106, 134], 11), FL([146, 170], 10.5)],
    bands: [[50, 56, 2.4], [170, 174, 1.4], [174, 176, 3.8]],
    balconies: [[0, 0.3, 0.9, 8]],
    pediments: [[0.12, 0.88, 14, 176, 3, true]],
    ground: [
      { k: 'door', x: [0.06, 0.26], y: [3, 40], },
      { k: 'shop', x: [0.35, 0.92], y: [4, 42], frame: '#2a2a2a' },
    ],
    signs: [{ x: 0.16, w: 2.6, y: [44, 46.4], bg: '#1d2533', fg: '#f4f4f4', lines: [['5', 0.62, 0.56]] }],
  },
  {
    // beżoworóżowa kamienica z bramą i butikiem Lilou: trzy osie nad parterem, po prawej zielona kamienica z pilastrami
    name: 'Lilou i zielona', mid: [-82, -445], seed: 54, wall: '#e3cdb5', base: '#e4d6c3', groundTop: 54, trim: '#f3ebdf', frame: '#f4f2ec', eave: 178,
    axes: [0.1, 0.22, 0.34, 0.74, 0.9],
    floors: [FL([66, 92], 10.5, { at: [0.1, 0.22, 0.34, 0.74, 0.9], hood: 'hood' }), FL([104, 130], 10.5, { hood: 'hood' }), FL([142, 166], 10, { hood: 'hood' })],
    panels: [[0.54, 1, '#b3d8b0']],
    bands: [[50, 56, 2.4], [168, 172, 1.4], [172, 178, 3.8]],
    strips: [[0.52, 0.56], [0.97, 1]], stripY0: 56,
    balconies: [[0, 0.06, 0.4, 7, true], [0, 0.66, 0.84, 7, true], [1, 0.66, 0.84, 7]],
    ground: [
      { k: 'arch', x: [0.04, 0.2], y: [3, 44], rise: 8, wood: true, frame: '#6a4631', ring: '#f3ebdf' },
      { k: 'arch', x: [0.26, 0.46], y: [3, 44], rise: 9, door: true, frame: '#5a3a26', ring: '#f3ebdf' },
      { k: 'arch', x: [0.64, 0.9], y: [3, 46], rise: 10, frame: '#3a2c24', ring: '#f4f6ee' },
    ],
    awnings: [[0.24, 0.48, 50, 8, '#233a6a']],
    signs: [{ x: [0.28, 0.44], y: [52, 56], fg: '#f4f4f4', font: 'italic 700 {}px Georgia, serif', lines: [['Lilou', 0.8, 0.55]] }],
  },
  {
    // zielona kamienica z pilastrami i kwiatowymi balkonami, w parterze łukowa witryna
    name: 'Zielona z pilastrami', mid: [3, -526], seed: 55, wall: '#b3d8b0', base: '#a6cfa6', groundTop: 54, trim: '#f4f6ee', frame: '#f6f8f2', eave: 178,
    axes: [0.27, 0.77],
    floors: [FL([66, 92], 14, { hood: 'hood' }), FL([104, 130], 14, { hood: 'hood' }), FL([142, 166], 13)],
    bands: [[50, 56, 2.4], [168, 172, 1.4], [172, 178, 3.8]],
    strips: [[0, 0.06], [0.46, 0.54], [0.94, 1]], stripY0: 56,
    balconies: [[0, 0.1, 0.44, 8, true], [0, 0.58, 0.96, 8, true], [1, 0.1, 0.44, 8, true], [1, 0.58, 0.96, 8, true]],
    ground: [
      { k: 'arch', x: [0.12, 0.42], y: [3, 44], rise: 10, frame: '#3a2c24', ring: '#f4f6ee' },
      { k: 'arch', x: [0.58, 0.9], y: [3, 44], rise: 10, frame: '#3a2c24', ring: '#f4f6ee' },
    ],
  },
];
