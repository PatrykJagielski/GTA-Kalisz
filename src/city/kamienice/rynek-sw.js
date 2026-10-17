import { archWins } from './rynek-kit.js';

/* ---------- Główny Rynek, pierzeja południowo-zachodnia: od narożnika z ulicą Garbarską... w stronę Złotej ---------- */
// Według Street View (sierpień 2025). Lewy koniec frontu = strona południowa (narożnik z Kolegialną), patrząc z płyty Rynku;
// kolejność w tablicy: od końca zachodniego (róg Złotej) do południowego.
const FL = (y, w, o = {}) => ({ y, w, ...o });

export const RYNEK_SW = [
  {
    // narożna kamienica o dwóch skrzydłach: biały tynk, balkony w prawej osi, mansarda
    name: 'Biała narożna', mid: [-648, 279], seed: 31, wall: '#ece8de', base: '#e0dbd0', groundTop: 54, trim: '#fbf9f3', frame: '#f4f2ec', eave: 175,
    axes: [0.12, 0.3, 0.5, 0.69, 0.88],
    floors: [FL([66, 92], 11, { hood: 'hood' }), FL([104, 130], 11), FL([140, 162], 10.5)],
    bands: [[50, 56, 2.4], [165, 169, 1.4], [169, 175, 3.8]],
    balconies: [[0, 0.78, 0.98, 7], [1, 0.78, 0.98, 7, true]],
    ground: [
      { k: 'arch', x: [0.04, 0.2], y: [3, 40], rise: 8, frame: '#2e2a26', ring: '#f4f0e6' },
      { k: 'arch', x: [0.3, 0.46], y: [3, 40], rise: 8, frame: '#2e2a26', ring: '#f4f0e6' },
      { k: 'arch', x: [0.58, 0.72], y: [3, 40], rise: 7, door: true, frame: '#2e2a26', ring: '#f4f0e6' },
    ],
    cafe: [0.03, 0.8],
  },
  {
    // pomarańczowa kamienica: sześć osi, dwa balkony w środku, białe opaski okien
    name: 'Pomarańczowa', mid: [-551, 366], seed: 32, wall: '#e8a468', base: '#d9a77a', groundTop: 54, trim: '#f6ead9', frame: '#f4f2ec', eave: 175,
    axes: [0.115, 0.26, 0.45, 0.58, 0.77, 0.91],
    floors: [FL([66, 92], 10.5, { hood: 'hood' }), FL([104, 130], 10.5, { hood: 'hood' }), FL([140, 162], 10, { hood: 'hood' })],
    bands: [[50, 56, 2.2], [165, 169, 1.4], [169, 175, 3.8]],
    balconies: [[0, 0.4, 0.62, 7], [1, 0.4, 0.62, 7]],
    ground: [
      { k: 'shop', x: [0.05, 0.24], y: [4, 42], frame: '#2a2a2a' },
      { k: 'shop', x: [0.3, 0.55], y: [4, 42], frame: '#2a2a2a', door: [0.31, 0.4] },
      { k: 'shop', x: [0.62, 0.95], y: [4, 42], frame: '#2a2a2a' },
    ],
    cafe: [0.02, 0.6],
  },
  {
    // brązowa kamienica z białymi opaskami okien i wolutami, trzy łuki w parterze, w mansardzie pięć lukarn
    name: 'Brązowa z wolutami', mid: [-456, 455], seed: 33, wall: '#b98a6d', base: '#c79b82', groundTop: 56, trim: '#f2e9de', frame: '#f6f2ec', eave: 175,
    axes: [0.1, 0.28, 0.5, 0.72, 0.9],
    floors: [FL([66, 94], 10.5, { hood: 'ear' }), FL([106, 132], 10.5, { hood: 'ear' }), FL([142, 164], 10, { hood: 'hood' })],
    bands: [[52, 58, 2.6], [166, 170, 1.4], [170, 175, 3.8]],
    balconies: [[0, 0.36, 0.64, 9], [1, 0.4, 0.6, 7]],
    ground: [
      { k: 'arch', x: [0.07, 0.31], y: [3, 44], rise: 9, frame: '#3a2c24', ring: '#f2e9de' },
      { k: 'arch', x: [0.36, 0.6], y: [3, 44], rise: 9, frame: '#3a2c24', ring: '#f2e9de' },
      { k: 'arch', x: [0.66, 0.9], y: [3, 44], rise: 9, frame: '#3a2c24', ring: '#f2e9de' },
    ],
  },
  {
    // oliwkowa kamienica z lat 30.: trzy osie, cztery piętra, na środkowej osi balkony piętro po piętrze
    name: 'Oliwkowa', mid: [-372, 536], seed: 34, wall: '#d7d6aa', base: '#d0cfa6', groundTop: 52, trim: '#efeee0', frame: '#5a6a8a', eave: 192,
    axes: [0.19, 0.52, 0.82],
    floors: [FL([62, 86], 11), FL([98, 122], 11), FL([134, 158], 11), FL([168, 188], 10)],
    bands: [[48, 54, 2.2], [190, 193, 1.2]],
    balconies: [[0, 0.4, 0.64, 7, true], [1, 0.4, 0.64, 7], [2, 0.4, 0.64, 7, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.22], y: [4, 40], frame: '#3a3a3a' },
      { k: 'arch', x: [0.38, 0.54], y: [3, 40], rise: 8, door: true, frame: '#2a2a2a', ring: '#efeee0' },
      { k: 'shop', x: [0.62, 0.95], y: [4, 40], frame: '#3a3a3a' },
    ],
  },
  {
    // żółtoochrowa kamienica z apteką: łukowe okna najwyższej kondygnacji, w prawym skrzydle balkony, trzy wejścia w parterze
    name: 'Apteka na Rynku', mid: [-282, 623], seed: 35, wall: '#d9b56a', base: '#e9e1d2', groundTop: 56, trim: '#f1e6c8', frame: '#f4f2ec', eave: 180,
    axes: [0.1, 0.28, 0.46, 0.72, 0.9],
    floors: [FL([64, 90], 11), FL([100, 126], 11), FL([136, 160], 10, { at: [] })],
    bands: [[52, 58, 2.6], [162, 166, 1.4], [166, 180, 3.6]],
    strips: [[0.58, 0.62], [0.995, 1], [0, 0.005]], stripY0: 58,
    balconies: [[0, 0.64, 0.98, 7], [1, 0.66, 0.96, 7, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.26], y: [4, 42], frame: '#f4f2ec', sign: { bg: '#f4f4f0', fg: '#2c8a4a', border: '#2c8a4a', lines: [['APTEKA', 0.8, 0.55]] } },
      { k: 'arch', x: [0.31, 0.43], y: [3, 44], rise: 7, wood: true, frame: '#3a2c24', ring: '#f4f0e6' },
      { k: 'arch', x: [0.47, 0.57], y: [3, 44], rise: 6, gate: true, ring: '#f4f0e6' },
      { k: 'shop', x: [0.66, 0.97], y: [4, 42], frame: '#2a2a2a' },
      ...archWins(149, [0.1, 0.28, 0.46, 0.72, 0.9], 136, 160, 10),
    ],
  },
  {
    // zielona kamienica z falistym szczytem i okulusem, narożne pilastry, balkon z donicami; w parterze zabite deskami witryny
    name: 'Zielona z szczytem', mid: [-193, 707], seed: 36, wall: '#c3d3a8', base: '#b9c9a0', groundTop: 48, trim: '#f1f1e6', frame: '#f3f3ec', eave: 152,
    axes: [0.2, 0.5, 0.8],
    floors: [FL([58, 84], 11), FL([94, 120], 11)],
    bands: [[44, 50, 2.4], [140, 146, 1.4], [146, 152, 3.2]],
    strips: [[0, 0.06], [0.94, 1]], stripY0: 50,
    balconies: [[0, 0.1, 0.9, 8, true]],
    pediments: [[0.05, 0.95, 26, 152, 3, true]],
    ground: [
      { k: 'shop', x: [0.04, 0.34], y: [4, 36], frame: '#6a4631' },
      { k: 'door', x: [0.4, 0.5], y: [3, 36] },
      { k: 'shop', x: [0.58, 0.95], y: [4, 36], frame: '#6a4631' },
    ],
  },
];
