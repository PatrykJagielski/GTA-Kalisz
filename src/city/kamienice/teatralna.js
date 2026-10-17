/* ---------- ulica Teatralna: tylna ściana gmachu i biurowiec ---------- */
// Według Street View (2025). Format jak w kanonicka.js.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const TEATRALNA = [
  {
    // szary parter bez otworów z zamurowanymi oknami łukowymi, nad nim beżowa ściana z lizenami i gzymsem
    name: 'Ściana gmachu', mid: [1859, 4776], seed: 111, wall: '#d8cfb3', base: '#8f979e', groundTop: 78, trim: '#b8b4a6', frame: '#c4c8c6', eave: 136,
    axes: [0.18, 0.5, 0.82],
    floors: [WIN([18, 62], 10, 'ear'), WIN([96, 124], 10, 'ear')],
    bands: [[76, 82, 2.8], [128, 136, 3.4]],
    strips: [[0, 0.05], [0.28, 0.33], [0.67, 0.72], [0.95, 1]], stripY0: 82,
    panels: [[0, 1, '#9aa1a8', -2, 76]],
    ground: [],
  },
  {
    // nowoczesny budynek biurowy: pas dużych okien z cokołem, niebieski balkon-pas nad nim
    name: 'Biurowiec', mid: [2160, 4752], seed: 112, wall: '#aeb4b8', base: '#8a8f92', groundTop: 30, trim: '#9aa0a4', frame: '#d6dadb', eave: 74,
    axes: [0.14, 0.3, 0.5, 0.7, 0.88],
    floors: [WIN([8, 28], 14, 'ear')],
    bands: [[28, 36, 3]],
    balconies: [[0, 0.02, 0.98, 4]],
    panels: [[0, 1, '#5d7fb0', 40, 74]],
    ground: [],
  },
];
