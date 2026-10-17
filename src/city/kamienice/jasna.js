/* ---------- ulica Jasna: fronty przy ulicy (kamienice secesyjne i zdobione, bez nazw ulic z listy) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1300;
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

export const JASNA = [
  house({
    // kremowa narożna ściana z oknem w drewnianej ramie, obok zaokrąglony narożnik
    name: 'Kremowa narożna', mid: [1460, 3231], wall: '#e8dcc8', base: '#e0d4be', g: 52, n: 3, w: 8, trim: '#f2e8d6', axes: [0.5], len: 31,
  }),
  house({
    // kremowa secesyjna z półokrągłymi balkonami i łukowymi oknami w drewnianych ramach
    name: 'Secesyjna z balkonami', mid: [1521, 3114], wall: '#e8e0d0', base: '#e0d6c4', g: 58, n: 3, w: 8, frame: '#7a4a2a', trim: '#f4eee0', axes: ax(4, 0.1, 0.9), len: 230,
    balconies: [[1, 0.0, 0.18, 8], [1, 0.82, 1.0, 8]],
    ground: [win([0.04, 0.1], '#5a3a2a'), win([0.3, 0.38], '#5a3a2a'), win([0.62, 0.7], '#5a3a2a'), win([0.9, 0.96], '#5a3a2a')],
  }),
  house({
    // bogato zdobiona narożna kamienica: beżowy boniowany parter z łukowymi oknami, wykusz i kute balkony
    name: 'Zdobiona narożna 1', mid: [1584, 3254], wall: '#bfa282', base: '#d4b898', g: 62, n: 3, w: 8, hood: 'hood', trim: '#e0cdb0', axes: ax(3, 0.1, 0.9), len: 127, rustic: [[0, 60]],
    balconies: [[1, 0.3, 0.6, 9, true], [2, 0.6, 0.95, 8, true]],
    ground: [arch([0.04, 0.2], 7, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.3, 0.46], 7, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.6, 0.76], 7, { frame: '#f4f2ec', ring: '#f4f2ec' })],
  }),
  house({
    // bogato zdobiona kamienica z wykuszem na narożniku, boniowany parter, łukowa brama
    name: 'Zdobiona narożna 2', mid: [1642, 3139], wall: '#bfa282', base: '#d4b898', g: 62, n: 3, w: 8, hood: 'hood', trim: '#e0cdb0', axes: ax(3, 0.1, 0.9), len: 131, rustic: [[0, 60]],
    balconies: [[1, 0.3, 0.6, 9, true], [2, 0.65, 0.98, 8, true]],
    ground: [arch([0.04, 0.2], 7, { gate: true, ring: '#f4f2ec' }), arch([0.3, 0.46], 7, { frame: '#f4f2ec', ring: '#f4f2ec' }), arch([0.6, 0.76], 7, { frame: '#f4f2ec', ring: '#f4f2ec' })],
  }),
  house({
    // szarobeżowa ściana z brązowymi oknami i gzymsem
    name: 'Szarobeżowa', mid: [1588, 2976], wall: '#d8cdb8', base: '#d0c4ae', g: 58, n: 3, w: 8, frame: '#7a4a2a', trim: '#e8dfc8', axes: ax(2, 0.2, 0.8), len: 77,
  }),
  house({
    // żółtoochrowa z poziomym boniowaniem, kratowane okna parteru, okna z prostymi naczółkami
    name: 'Ochrowa z kratami', mid: [1726, 2974], wall: '#d8c888', base: '#d0c07c', g: 70, n: 3, w: 8, trim: '#ece2b8', axes: ax(5, 0.08, 0.92), len: 208, rustic: [[0, 68]],
    ground: [win([0.06, 0.14], '#3a3a3a'), win([0.26, 0.34], '#3a3a3a'), win([0.5, 0.58], '#3a3a3a'), win([0.7, 0.78], '#3a3a3a'), win([0.88, 0.96], '#3a3a3a')],
  }),
];
