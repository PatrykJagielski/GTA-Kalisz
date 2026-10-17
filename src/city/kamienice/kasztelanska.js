/* ---------- ulica Kasztelańska: trzy fronty przy jezdni na odcinku najbliżej Rynku ---------- */
// Według Street View (2023-2026), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
export const KASZTELANSKA = [
  {
    // długa ślepa ściana z szarych płyt, bez okien, z pasem pod okapem
    name: 'Kasztelańska ślepa ściana', mid: [7322, -3393], seed: 331, wall: '#8c8f88', base: '#74786f', groundTop: 14, trim: '#c8c8c2', frame: '#d8d8d2', eave: 130,
    axes: [], floors: [],
    bands: [[84, 87, 1.2, 0, 1, '#d6d6d0']],
    ground: [],
  },
  {
    // bok kremowej kamienicy: czerwony gzyms, dwa małe okna na piętrze
    name: 'Kasztelańska bok kamienicy', mid: [7784, -3560], seed: 332, wall: '#e6dfcc', base: '#d8d0bc', groundTop: 20, trim: '#b25a46', frame: '#f6f2ea', eave: 170,
    axes: [0.68], floors: [{ y: [118, 146], w: 7.5 }],
    bands: [[100, 104, 2.4, 0, 1, '#b25a46']],
    ground: [],
  },
  {
    // biały dom jednorodzinny: balkon z kutą balustradą nad garażem, okna z roletami
    name: 'Kasztelańska biały dom', mid: [7812, -3772], seed: 333, wall: '#f1eee6', base: '#c98a78', groundTop: 24, trim: '#8a5a46', frame: '#7a5a42', eave: 150,
    axes: [0.28, 0.76], floors: [{ y: [50, 94], w: 11 }, { y: [106, 138], w: 9 }],
    bands: [[150, 154, 1.8, 0, 1, '#b84a3a']],
    balconies: [[0, 0.14, 0.52, 9]],
    ground: [{ k: 'door', x: [0.1, 0.5], y: [2, 22], frame: '#6a5a4c' }],
  },
];
