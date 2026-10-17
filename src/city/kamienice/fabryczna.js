/* ---------- ulica Fabryczna: blok, kamienica z bramą, zaniedbana hala i sklep Żabka ---------- */
// Według Street View (2025). Format jak w kanonicka.js; okna rozmieszczone równomiernie.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const FABRYCZNA = [
  {
    // powojenny blok w kolorze kremowym z ochrowym cokołem z piwnicznymi okienkami i balkonami z trzciną
    name: 'Blok kremowy', mid: [-1704, 5114], seed: 131, wall: '#e6d9a0', base: '#c7b072', groundTop: 14, trim: '#e8e6dc', frame: '#f1f0ea', eave: 104,
    axes: [0.062, 0.188, 0.312, 0.438, 0.562, 0.688, 0.812, 0.938],
    floors: [WIN([24, 46], 14, 'ear'), WIN([58, 80], 14, 'ear'), WIN([90, 100], 12, 'ear')],
    balconies: [[1, 0.0, 0.1, 8], [1, 0.4, 0.5, 8], [1, 0.8, 0.9, 8]],
    ground: [],
  },
  {
    // zniszczona beżowa kamienica: brama z kutą kratą w łuku, balkon z zielonymi balustradami, okna z opaskami
    name: 'Kamienica z bramą', mid: [-763, 6224], seed: 132, wall: '#c8c0a2', base: '#a89e82', groundTop: 44, trim: '#bdb59a', frame: '#e4e0d0', eave: 90,
    axes: [0.5, 0.78],
    floors: [WIN([10, 34], 11, 'ear'), WIN([58, 82], 11, 'ear')],
    bands: [[42, 47, 2.4], [84, 90, 3]],
    balconies: [[1, 0.02, 0.22, 8]],
    ground: [
      { k: 'arch', x: [0.04, 0.22], y: [2, 40], rise: 8, gate: true, frame: '#7a6a7a', ring: '#d9d2b4' },
    ],
  },
  {
    // zaniedbana hala z cegły i różowego tynku: zamurowane okna z kratami w niszach między pilastrami
    name: 'Hala z cegły', mid: [-1173, 5738], seed: 133, wall: '#c99aa0', base: '#9c5a46', groundTop: 36, trim: '#b8aea6', frame: '#8a7a74', eave: 118,
    axes: [0.12, 0.33, 0.55, 0.77],
    floors: [WIN([46, 100], 12, 'ear')],
    bands: [[36, 40, 1.4]],
    strips: [[0.2, 0.24], [0.43, 0.47], [0.65, 0.69], [0.88, 0.92]], stripY0: 40,
    ground: [],
  },
  {
    // łososiowa kamienica ze sklepem Żabka w parterze, białe opaski okien
    name: 'Żabka', mid: [-3150, 3752], seed: 134, wall: '#d9857a', base: '#c9786c', groundTop: 58, trim: '#f1eee4', frame: '#f4f2ea', eave: 118,
    axes: [0.2, 0.55, 0.85],
    floors: [WIN([72, 100], 12, 'hood')],
    bands: [[56, 62, 2.4], [112, 118, 3.2]],
    ground: [
      { k: 'shop', x: [0.1, 0.4], y: [8, 52], frame: '#2a2a2a', ring: '#f1eee4' },
      { k: 'shop', x: [0.62, 0.95], y: [8, 52], frame: '#2a2a2a', ring: '#f1eee4' },
    ],
    signs: [{ x: [0.12, 0.38], y: [40, 50], bg: '#2e3a30', fg: '#43b02a', lines: [['żabka', 0.7, 0.5]] }],
  },
];
