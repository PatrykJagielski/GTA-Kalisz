/* ---------- Wał Staromiejski: cztery fronty przy bloku mieszkalnym (ok. 70 m fasad; reszta wału poza zakresem) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1400;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const WAL_STAROMIEJSKI = [
  house({
    // jasnozielonkawy narożnik: okno sklepu Buty Buciki w ciemnej ramie, kuty balkon na piętrze
    name: 'Buty Buciki', mid: [-2705, 2692], wall: '#d8dcb0', base: '#d0d4a8', g: 62, n: 3, w: 8, trim: '#e8ecc8', axes: ax(3, 0.1, 0.9), len: 138, stains: true,
    balconies: [[0, 0.7, 0.98, 9, true]],
    ground: [shop([0.04, 0.4], '#3a2a2a'), shop([0.7, 0.96], '#3a2a2a')],
    signs: [{ x: [0.08, 0.36], y: [20, 32], fg: '#f4efe6', font: '800 {}px Arial, sans-serif', lines: [['BUTY BUCIKI', 0.3, 0.5]] }],
  }),
  house({
    // długa kamienica z łukowymi witrynami w czarnych ramach i łukowym wejściem, zielone balkony
    name: 'Z łukowym wejściem', mid: [-2898, 2574], wall: '#dcdcb4', base: '#cfd0a8', g: 66, n: 3, w: 8, hood: 'hood', trim: '#ecedcc', axes: ax(9, 0.03, 0.97), len: 312, stains: true,
    balconies: [[0, 0.1, 0.3, 9, true], [1, 0.45, 0.65, 9, true]],
    ground: [arch([0.04, 0.14], 8, { frame: '#2a2a2a', ring: '#cfd0a8' }), arch([0.3, 0.42], 8, { door: true, frame: '#2a2a2a', ring: '#2a2a2a' }), arch([0.62, 0.72], 8, { frame: '#2a2a2a', ring: '#cfd0a8' }), arch([0.88, 0.97], 8, { frame: '#2a2a2a', ring: '#cfd0a8' })],
  }),
  house({
    // zielonkawa z dużym balkonem na piętrze i oknami z zielonymi parapetami
    name: 'Z zielonymi parapetami', mid: [-3090, 2424], wall: '#d6dcb2', base: '#cdd2a8', g: 58, n: 3, w: 8, hood: 'hood', trim: '#e6ecc8', axes: ax(4, 0.1, 0.9), len: 175,
    balconies: [[0, 0.25, 0.65, 10, true]],
    ground: [win([0.08, 0.16], '#2f6a3a'), win([0.3, 0.4], '#2f6a3a'), win([0.52, 0.62], '#2f6a3a'), win([0.76, 0.88], '#2f6a3a')],
  }),
  house({
    // niski biały mur z małymi okienkami
    name: 'Niski biały', mid: [-3247, 2294], wall: '#e4e0d6', base: '#d8d4c8', g: 56, n: 1, w: 4, trim: '#c8c4b8', axes: [0.4, 0.75], len: 62,
  }),
];
