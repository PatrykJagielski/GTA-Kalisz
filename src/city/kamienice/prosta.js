/* ---------- ulica Prosta: niskie kamienice i oficyny ---------- */
// Według Street View (2024). Format jak w kanonicka.js; okna rozmieszczone równomiernie.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const PROSTA = [
  {
    // żółty dom z szerokimi oknami piętra i gzymsem między kondygnacjami
    name: 'Żółty dom', mid: [4157, -6988], seed: 161, wall: '#e0c277', base: '#d3b568', groundTop: 36, trim: '#d3b568', frame: '#f7f5ee', eave: 88,
    axes: [0.1, 0.3, 0.5, 0.7, 0.9],
    floors: [WIN([8, 28], 11, 'ear'), WIN([52, 76], 11, 'ear')],
    bands: [[38, 41, 1.6]],
    ground: [],
  },
  {
    // parterowy domek z szarego tynku z jednym dużym oknem po lewej
    name: 'Szary domek', mid: [3616, -6734], seed: 162, wall: '#aeab9c', base: '#8f8c7e', groundTop: 18, trim: '#8f8c7e', frame: '#e9e6dc', eave: 75,
    axes: [0.15, 0.5],
    floors: [WIN([20, 52], 14, 'ear')],
    bands: [],
    ground: [],
  },
  {
    // brudnoszara kamienica z drewnianą bramą, balkonem i oknami w białych ramach
    name: 'Kamienica z bramą', mid: [3786, -6772], seed: 163, wall: '#a8a393', base: '#8e8a7a', groundTop: 40, trim: '#e6e3d8', frame: '#f5f3ec', eave: 88,
    axes: [0.5, 0.78],
    floors: [WIN([8, 40], 12, 'ear'), WIN([58, 80], 11, 'ear')],
    bands: [[44, 47, 1.8]],
    balconies: [[1, 0.8, 0.98, 8]],
    ground: [
      { k: 'door', x: [0.06, 0.32], y: [2, 42], frame: '#6a4026', ring: '#cfcabb' },
    ],
  },
  {
    // różowobeżowy dom z niską oficyną i dwoma małymi okienkami z kratami
    name: 'Dom z oficyną', mid: [3912, -6845], seed: 164, wall: '#c9b8a8', base: '#a8988a', groundTop: 36, trim: '#a8988a', frame: '#b89b7a', eave: 120,
    axes: [0.55, 0.88],
    floors: [WIN([30, 50], 10, 'ear'), WIN([76, 100], 10, 'ear')],
    bands: [],
    ground: [],
  },
];
