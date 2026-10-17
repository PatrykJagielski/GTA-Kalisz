/* ---------- ulica Podgórze: cała ulica, 23 fronty (zniszczone ceglane i tynkowane kamienice, kilka bloków i pawilon) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2400;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const win = (x, frame = '#f4f2ec') => ({ k: 'shop', x, y: [4, 42], frame });
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });
const door = (x, extra = {}) => ({ k: 'door', x, y: [3, 40], ...extra });

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const PODGORZE = [
  house({
    // beżowa z cegłą w parterze i czerwonymi parapetami
    name: 'Beżowa z odpadającym tynkiem', mid: [-8145, 3067], wall: '#d8c8a0', base: '#a89880', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 165, stains: true,
  }),
  house({
    // szara kamienica z drzwiami i balkonem z balustradą
    name: 'Szara z balkonem', mid: [-8092, 3174], wall: '#b8b0a0', base: '#9a9284', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 189, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true]],
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // zrujnowana, zabite okna, odpadający tynk
    name: 'Zrujnowana z zabitymi oknami', mid: [-8014, 3107], wall: '#b0a898', base: '#8a8274', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 109, stains: true,
  }),
  house({
    // ceglana ruina z drewnianą bramą
    name: 'Ceglana ruina', mid: [-7926, 3224], wall: '#a86a50', base: '#8a5a48', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 156, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#3a2a1a', ring: '#8a5a48' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // szara z drewnianą bramą
    name: 'Szara z bramą drewnianą', mid: [-7912, 3140], wall: '#c0b8a8', base: '#a8a090', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 105, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#3a2a1a', ring: '#a8a090' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // czerwona cegła z balkonami
    name: 'Ceglana z balkonami', mid: [-7777, 3180], wall: '#a8604a', base: '#8a4a3a', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 177, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true]],
  }),
  house({
    // dwukondygnacyjna ciemna z drewnianymi drzwiami
    name: 'Parterowa-piętrowa ciemna 1', mid: [-7741, 3318], wall: '#9a8a78', base: '#8a7a68', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 136, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // dwukondygnacyjna z drzwiami
    name: 'Dwukondygnacyjna ciemna 2', mid: [-7621, 3360], wall: '#a89a88', base: '#8a7a68', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 118, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // beżowa z bramą i kratą
    name: 'Beżowa z bramą', mid: [-7608, 3234], wall: '#d0c4a0', base: '#b8ac88', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 177, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#3a2a1a', ring: '#b8ac88' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // zniszczona z drzwiami w przejściu
    name: 'Zniszczona z przejściem', mid: [-7484, 3405], wall: '#a09080', base: '#807060', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 171, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // ceglana z zabitymi oknami i drzwiami
    name: 'Ceglana z zabitymi oknami', mid: [-7438, 3289], wall: '#a8604a', base: '#8a4a3a', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 182, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // z brązowymi drzwiami
    name: 'Zniszczona z brązowymi drzwiami', mid: [-7358, 3446], wall: '#a09484', base: '#7a7064', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 92, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // ceglana z drzwiami i balkonem
    name: 'Ceglana z drzwiami', mid: [-7255, 3480], wall: '#a8604a', base: '#8a5a4a', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 126, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true]],
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // beżowa z cegłą i drzwiami
    name: 'Beżowa z cegłą', mid: [-7179, 3386], wall: '#c8bca0', base: '#a89c84', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 145, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // szara, dwie kondygnacje, zabite okna
    name: 'Szara dwukondygnacyjna', mid: [-7026, 3438], wall: '#cfc8a8', base: '#b8b090', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 178, stains: true,
  }),
  house({
    // czerwony pawilon spożywczy
    name: 'Pawilon spożywczy', mid: [-6988, 3598], wall: '#b04a2a', base: '#903a1a', g: 40, n: 1, w: 5.5, trim: '#e4dcc8', axes: ax(1, 0.1, 0.9), len: 65, stains: true,
  }),
  house({
    // z trójkątnymi naczółkami okien i bramą
    name: 'Z trójkątnymi szczytami okien', mid: [-6866, 3488], wall: '#d0bca0', base: '#c0ac90', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 100, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#3a2a1a', ring: '#c0ac90' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // ceglana, parter z graffiti
    name: 'Ceglana ze zniszczonym parterem', mid: [-6655, 3556], wall: '#b0604a', base: '#b8a890', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 113, stains: true,
  }),
  house({
    // długa zniszczona z drewnianymi drzwiami
    name: 'Zniszczona z drewnianymi drzwiami', mid: [-6642, 3690], wall: '#b0a090', base: '#908070', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(4, 0.1, 0.9), len: 246, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a3a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // biała z łukami nad oknami i balkonem
    name: 'Biała z łukowymi oknami', mid: [-6461, 3750], wall: '#ecebe4', base: '#d8d4c8', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 135, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true]],
  }),
  house({
    // beżowa z bramą w łuku i boniowaniem
    name: 'Beżowa z bramą w łuku', mid: [-6396, 3644], wall: '#cfc0a0', base: '#bcae90', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 161, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#3a2a1a', ring: '#bcae90' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // blok beżowo-pomarańczowy z daszkiem nad wejściem
    name: 'Blok beżowo-pomarańczowy', mid: [-6089, 3882], wall: '#d4cab4', base: '#d09860', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(8, 0.1, 0.9), len: 451, stains: true,
    ground: [win([0.1, 0.22]), win([0.4, 0.52]), win([0.72, 0.84])],
  }),
  house({
    // beżowa ściana z oknami
    name: 'Beżowa ściana z klimatyzatorami', mid: [-5926, 3817], wall: '#cfc4a8', base: '#bcb094', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 163, stains: true,
  }),
];
