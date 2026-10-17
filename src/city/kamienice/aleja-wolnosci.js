/* ---------- Aleja Wolności: pałac klasycystyczny, klub i bloki modernistyczne po jednej stronie, ok. 80 m aleji (reszta poza zakresem) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1100;
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

export const ALEJA_WOLNOSCI = [
  ...[[256, 2720, 56], [303, 2750, 43], [354, 2764, 51], [404, 2797, 59]].map(([x, z, len], i) => house({
    // Willa Calesia: kremowa elewacja, boniowany parter z łukowymi oknami w brązowych ramach, balustrady pod oknami piętra
    name: `Pałac ${i + 1}`, mid: [x, z], wall: '#e4dcc0', base: '#d8cba8', g: 66, n: 1, w: 7, trim: '#f2ecd6', axes: [0.3, 0.7], len, rustic: [[0, 64]],
    balconies: [[0, 0.1, 0.9, 6, true]],
    ground: [arch([0.12, 0.44], 8, { frame: '#7a4a22', ring: '#f2ecd6' }), arch([0.56, 0.88], 8, { frame: '#7a4a22', ring: '#f2ecd6' })],
  })),
  house({
    // biały modernistyczny budynek z szyldem KLUB i kamienną okładziną parteru
    name: 'Klub', mid: [658, 2884], wall: '#ece8e0', base: '#c8a878', g: 60, n: 2, w: 7.5, trim: '#d8d0c4', axes: ax(4, 0.1, 0.9), len: 108,
    ground: [shop([0.06, 0.2], '#5a3a4a'), shop([0.3, 0.44], '#5a3a4a'), shop([0.54, 0.7], '#5a3a4a'), shop([0.78, 0.94], '#5a3a4a')],
    signs: [{ x: [0.3, 0.7], y: [64, 74], bg: '#ece8e0', fg: '#3a3a3a', font: '800 {}px Arial, sans-serif', lines: [['KLUB', 0.3, 0.55]] }],
  }),
  house({
    // kremowo-żółty modernistyczny blok z balkonami i przejazdem bramowym, kamienny parter z witrynami
    name: 'Blok z przejazdem', mid: [754, 2958], wall: '#ecdfa8', base: '#c8a878', g: 60, n: 4, w: 7, trim: '#f6efd0', axes: ax(3, 0.1, 0.5), len: 128,
    balconies: [[1, 0.52, 0.9, 10, true], [2, 0.52, 0.9, 10, true], [3, 0.52, 0.9, 10, true]],
    ground: [shop([0.04, 0.14], '#5a3a4a'), shop([0.2, 0.3], '#5a3a4a'), shop([0.36, 0.46], '#5a3a4a'), arch([0.56, 0.9], 4, { gate: true })],
  }),
  house({
    // długi pistacjowy blok z białymi opaskami okien i terakotowym cokołem
    name: 'Pistacjowy blok', mid: [992, 3066], wall: '#b4c0a8', base: '#7a8a84', g: 60, n: 4, w: 7, trim: '#f4f4ee', axes: ax(12, 0.03, 0.97), len: 396,
    ground: [win([0.04, 0.09], '#f4f4ee'), win([0.12, 0.17], '#f4f4ee'), win([0.2, 0.25], '#f4f4ee'), win([0.28, 0.33], '#f4f4ee'), win([0.36, 0.41], '#f4f4ee'), win([0.44, 0.49], '#f4f4ee'), win([0.52, 0.57], '#f4f4ee'), win([0.6, 0.65], '#f4f4ee'), win([0.68, 0.73], '#f4f4ee'), win([0.76, 0.81], '#f4f4ee'), win([0.84, 0.89], '#f4f4ee')],
  }),
];
