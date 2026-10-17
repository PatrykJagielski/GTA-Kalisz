/* ---------- ulica Gliniana: ceglane budynki gospodarcze ---------- */
// Według Street View (2024). Format jak w kanonicka.js; okna rozmieszczone równomiernie.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const GLINIANA = [
  {
    // ceglana oficyna: dwa rzędy okien z kratami i ceglanymi opaskami, przy ziemi piwniczne okienko i czerwona brama
    name: 'Ceglana oficyna', mid: [5937, -5080], seed: 171, wall: '#8e4a38', base: '#7a3e30', groundTop: 30, trim: '#6a4a3e', frame: '#d8c9a0', eave: 120,
    axes: [0.12, 0.34, 0.56, 0.78],
    floors: [WIN([46, 76], 11, 'hood'), WIN([86, 116], 11, 'hood')],
    bands: [[30, 34, 1.4]],
    ground: [
      { k: 'door', x: [0.28, 0.4], y: [0, 26], frame: '#8a3a2a' },
    ],
  },
  {
    // ceglany szczyt na szarej, boniowanej podmurówce z dwiema zamurowanymi niszami okiennymi
    name: 'Szczyt z niszami', mid: [6808, -6251], seed: 172, wall: '#a4492f', base: '#b6b6ae', groundTop: 86, trim: '#8a3a28', frame: '#b6b6ae', eave: 120,
    axes: [],
    floors: [],
    bands: [[84, 88, 2.2], [114, 120, 3]],
    panels: [[0, 1, '#b8b8b0', -2, 86], [0.2, 0.34, '#a9a9a1', 16, 78], [0.68, 0.82, '#a9a9a1', 16, 78]],
    ground: [],
  },
];
