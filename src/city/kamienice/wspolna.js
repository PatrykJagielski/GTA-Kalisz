/* ---------- ulica Wspólna: powojenne czterokondygnacyjne bloki ---------- */
// Według Street View (2024). Format jak w kanonicka.js; zdjęcia tylko skośne, okna rozmieszczone równomiernie.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const WSPOLNA = [
  {
    name: 'Blok szary', mid: [1799, 6063], seed: 141, wall: '#bcbcb6', base: '#8f8f8a', groundTop: 14, trim: '#d8d4c8', frame: '#e9e6dc', eave: 134,
    axes: [0.125, 0.375, 0.625, 0.875],
    floors: [WIN([22, 46], 9, 'ear'),WIN([56, 80], 9, 'ear'),WIN([90, 114], 9, 'ear')],
    bands: [[129, 134, 2.4]],
    ground: [],
  },
  {
    name: 'Blok ceglasty północny', mid: [1882, 5670], seed: 142, wall: '#b57a66', base: '#8a5a4a', groundTop: 14, trim: '#d8d4c8', frame: '#e9e6dc', eave: 165,
    axes: [0.036, 0.107, 0.179, 0.25, 0.321, 0.393, 0.464, 0.536, 0.607, 0.679, 0.75, 0.821, 0.893, 0.964],
    floors: [WIN([22, 46], 9, 'ear'),WIN([56, 80], 9, 'ear'),WIN([90, 114], 9, 'ear'),WIN([124, 148], 9, 'ear')],
    bands: [[160, 165, 2.4]],
    ground: [],
  },
  {
    name: 'Blok ceglasty południowy', mid: [1850, 5390], seed: 143, wall: '#b57a66', base: '#8a5a4a', groundTop: 14, trim: '#d8d4c8', frame: '#e9e6dc', eave: 165,
    axes: [0.062, 0.188, 0.312, 0.438, 0.562, 0.688, 0.812, 0.938],
    floors: [WIN([22, 46], 9, 'ear'),WIN([56, 80], 9, 'ear'),WIN([90, 114], 9, 'ear'),WIN([124, 148], 9, 'ear')],
    bands: [[160, 165, 2.4]],
    ground: [],
  },
];
