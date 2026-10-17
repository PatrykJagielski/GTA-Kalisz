/* ---------- ulica Jana Długosza: pierzeje przy jezdni na odcinku najbliżej Rynku ---------- */
// Według Street View (2025), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

export const DLUGOSZA = [
  {
    // czteropiętrowa kamienica z brudnoszarym tynkiem: fryzy ząbkowe nad oknami, rynny, ubytki tynku nad cokołem
    name: 'Długosza szara kamienica', mid: [-6173, -5629], seed: 341, wall: '#aaa28c', base: '#8c8676', groundTop: 44, trim: '#d4cdb8', frame: '#f0ece2', eave: 236,
    axes: ax(7),
    floors: [{ y: [54, 84], w: 10, hood: 'hood' }, { y: [100, 130], w: 10, hood: 'hood' }, { y: [146, 176], w: 10, hood: 'hood' }, { y: [192, 218], w: 9.5 }],
    bands: [[44, 48, 2], [92, 95, 1.6], [138, 141, 1.4], [184, 187, 1.4], [224, 236, 4]],
    ground: [{ k: 'door', x: [0.05, 0.13], y: [2, 52], frame: '#4a4238' }],
  },
  {
    // piętrowa kamienica w jasnozielonym tynku: łukowe okna piętra z naczółkami i płycinami, wysoka brama po prawej
    name: 'Długosza zielona', mid: [-6750, -5242], seed: 342, wall: '#cdd2a8', base: '#c2c79a', groundTop: 56, trim: '#e6e6d2', frame: '#f4f4ec', eave: 180,
    axes: ax(5),
    floors: [{ y: [66, 98], w: 10 }, { y: [122, 154], w: 10, hood: 'hood' }],
    bands: [[56, 60, 2], [108, 112, 2.2], [170, 174, 1.6], [174, 180, 4]],
    ground: [{ k: 'arch', x: [0.84, 0.98], y: [2, 56], rise: 3, frame: '#b0b484', ring: '#dedcc2' }],
  },
  {
    // długa ściana hali z szarego tynku z pilastrami, kilkoma oknami wysoko i pasem cokołu
    name: 'Długosza hala', mid: [-7446, -4776], seed: 343, wall: '#c3c6c2', base: '#9aa09a', groundTop: 24, trim: '#d6d8d4', frame: '#f4f4f0', eave: 190,
    axes: [0.06, 0.12, 0.32, 0.5, 0.7, 0.9],
    floors: [{ y: [96, 130], w: 8 }],
    bands: [[184, 188, 1.6, 0, 1, '#4a4e4c']],
    strips: [[0.18, 0.2], [0.4, 0.42], [0.6, 0.62], [0.8, 0.82]], stripY0: 24,
    ground: [],
  },
  {
    // piętrowa kamienica biało-kremowa z ceglanymi opaskami i fryzami ząbkowymi, ryzality z czerwonej cegły po prawej
    name: 'Długosza ceglane opaski', mid: [-8668, -4115], seed: 344, wall: '#ece4cc', base: '#e0dcb0', groundTop: 56, trim: '#b4604a', frame: '#7a4a32', eave: 176,
    axes: ax(6, 0.04, 0.98),
    floors: [{ y: [64, 100], w: 11, hood: 'hood' }, { y: [118, 152], w: 11, hood: 'hood' }],
    bands: [[56, 60, 2.2, 0, 1, '#b4604a'], [106, 110, 1.6, 0, 1, '#b4604a'], [160, 164, 1.6, 0, 1, '#b4604a'], [164, 176, 4]],
    strips: [[0.64, 0.68], [0.82, 0.86]], stripY0: 56,
    ground: [{ k: 'door', x: [0.72, 0.8], y: [2, 54], frame: '#4a3a2a' }],
  },
];
