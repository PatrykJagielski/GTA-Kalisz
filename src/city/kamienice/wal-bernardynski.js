/* ---------- Wał Bernardyński: narożna kamienica z boniowanym parterem ---------- */
// Według Street View (2025). Format jak w kanonicka.js.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const WAL_BERNARDYNSKI = [
  {
    // oker z płycinami pod oknami, wysoki cokół, gzyms nad parterem, pracownia ceramiczna w narożu
    name: 'Glinofrajda', mid: [4125, -4764], seed: 101, wall: '#d4b184', base: '#b89c74', groundTop: 52, trim: '#e8dfc9', frame: '#f4f1e8', eave: 120,
    axes: [0.12, 0.31, 0.5, 0.69, 0.88],
    floors: [WIN([12, 38], 12, 'ear'), WIN([64, 88], 12), WIN([96, 114], 11)],
    bands: [[50, 56, 2.6], [112, 120, 3.4]],
    ground: [],
    signs: [{ x: [0.02, 0.2], y: [30, 40], bg: '#f7f7f5', fg: '#222', lines: [['Glinofrajda', 0.55, 0.5, '#c2282d']] }],
  },
];
