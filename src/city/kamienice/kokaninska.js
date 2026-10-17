/* ---------- ulica Kokanińska: dwa fronty przy jezdni na odcinku najbliżej Rynku ---------- */
// Według Street View (2024), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
export const KOKANINSKA = [
  {
    // szczyt kamienicy: różowy parter z zamurowanymi oknami, beżowe piętra ze skromnymi opaskami i zabitymi oknami
    name: 'Kokanińska szczyt', mid: [2773, -9372], seed: 321, wall: '#d6c7a8', base: '#d9b4b2', groundTop: 70, trim: '#b9a98a', frame: '#e8e2d2', eave: 190,
    axes: [0.25, 0.5, 0.75],
    floors: [{ y: [86, 112], w: 8, hood: 'hood' }, { y: [128, 156], w: 8, hood: 'hood' }],
    bands: [[70, 74, 2], [120, 123, 1.4], [170, 174, 1.6], [174, 190, 4]],
    ground: [{ k: 'shop', x: [0.2, 0.34], y: [14, 56], frame: '#c8a5a2' }, { k: 'shop', x: [0.46, 0.62], y: [14, 56], frame: '#c8a5a2' }],
  },
  {
    // niski dom z szarego tynku z pilastrem i małymi okienkami, w parterze białe okna z roletami
    name: 'Kokanińska dom', mid: [2296, -8535], seed: 322, wall: '#b4aea0', base: '#a39f92', groundTop: 8, trim: '#c4beb0', frame: '#f3f1ea', eave: 100,
    axes: [0.26, 0.5],
    floors: [{ y: [28, 62], w: 9 }],
    bands: [[94, 98, 1.6]],
    strips: [[0, 0.04], [0.8, 0.86]], stripY0: 8,
    ground: [{ k: 'door', x: [0.06, 0.14], y: [2, 36], frame: '#9a9488' }],
  },
];
