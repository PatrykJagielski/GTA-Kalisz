/* ---------- ulica Kazimierza Pułaskiego: pierwsze ok. 220 m od zachodniego końca (reszta ulicy poza zakresem) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1600;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);
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

export const PULASKIEGO = [
  house({
    // szarobrązowa ozdobna kamienica z balkonami, bramą w łuku i witrynami w parterze
    name: 'Szarobrązowa z balkonami', mid: [-2476, 3334], wall: '#a89c8c', base: '#8a7e70', g: 66, n: 4, w: 8.5, trim: '#e4dccc', axes: ax(7, 0.07, 0.93), len: 239, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.22, 0.34, 10, true], [1, 0.66, 0.78, 10, true]],
    ground: [arch([0.44, 0.56], 8, { gate: true, frame: '#3a2a1a', ring: '#e4dccc' }), shop([0.08, 0.3], '#f4f2ec'), shop([0.62, 0.92], '#f4f2ec')],
  }),
  house({
    // brzoskwiniowo-kremowa secesyjna kamienica z balkonami, łukowymi oknami i drewnianym portalem
    name: 'Brzoskwiniowa secesyjna', mid: [-2282, 3478], wall: '#e4c8a8', base: '#c8a888', g: 66, n: 4, w: 8.5, trim: '#f4ecdc', axes: ax(7, 0.07, 0.93), len: 243,
    balconies: [[1, 0.2, 0.36, 10, true], [1, 0.64, 0.8, 10, true]],
    ground: [door([0.44, 0.56], { frame: '#5a3a1a' }), arch([0.08, 0.3], 7, { frame: '#f4f2ec', ring: '#e4c8a8' }), arch([0.68, 0.92], 7, { frame: '#f4f2ec', ring: '#e4c8a8' })],
  }),
  house({
    // różowo-łososiowy boniowany parter, kremowe obramienia okien, balkon
    name: 'Różowa z balkonem 1', mid: [-2154, 3578], wall: '#e4c8a0', base: '#d98a8a', g: 66, n: 3, w: 8, trim: '#f4ecdc', axes: ax(2, 0.2, 0.8), len: 82, rustic: [[0, 64]],
    balconies: [[1, 0.2, 0.8, 10, false]],
  }),
  house({
    name: 'Różowa 2', mid: [-2110, 3624], wall: '#e4c8a0', base: '#d98a8a', g: 66, n: 3, w: 8, trim: '#f4ecdc', axes: ax(1, 0.2, 0.8), len: 44, rustic: [[0, 64]],
  }),
  house({
    name: 'Różowa 3', mid: [-2066, 3664], wall: '#e4c8a0', base: '#d98a8a', g: 66, n: 3, w: 8, trim: '#f4ecdc', axes: ax(2, 0.2, 0.8), len: 75, rustic: [[0, 64]],
    balconies: [[1, 0.2, 0.8, 10, false]],
  }),
  house({
    name: 'Różowa 4', mid: [-2024, 3710], wall: '#e4c8a0', base: '#d98a8a', g: 66, n: 3, w: 8, trim: '#f4ecdc', axes: ax(1, 0.2, 0.8), len: 51, rustic: [[0, 64]],
  }),
  house({
    // ciemne, łuszczące się piętra, żółtawy parter z łukowymi oknami, bramą i drzwiami, balkon z zieloną balustradą
    name: 'Łuszcząca z zielonym balkonem', mid: [-2495, 3476], wall: '#8a7e6c', base: '#d8c890', g: 66, n: 4, w: 8.5, trim: '#c8bca8', axes: ax(7, 0.07, 0.93), len: 251, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.4, 0.6, 10, true]],
    ground: [arch([0.08, 0.2], 7, { frame: '#f4f2ec', ring: '#d8c890' }), arch([0.3, 0.42], 8, { gate: true, frame: '#3a2a1a', ring: '#d8c890' }), door([0.5, 0.58], { frame: '#5a3a1a' }), arch([0.68, 0.9], 7, { frame: '#f4f2ec', ring: '#d8c890' })],
  }),
  house({
    // żółty parter z dużą łukową witryną i balkonem nad nią
    name: 'Żółta z witryną', mid: [-2372, 3567], wall: '#e4d49a', base: '#d8c070', g: 66, n: 3, w: 8, trim: '#f4ecdc', axes: ax(2, 0.2, 0.8), len: 56,
    balconies: [[1, 0.2, 0.8, 10, false]],
    ground: [arch([0.15, 0.85], 8, { frame: '#f4f2ec', ring: '#d8c070' })],
  }),
  house({
    // brunatnoczerwona cegła, boniowany parter z bramą, czerwono oprawiony sklep, balkony
    name: 'Ceglana z bramą', mid: [-2302, 3622], wall: '#b0705a', base: '#8a4a3a', g: 66, n: 4, w: 8.5, trim: '#e8dcc8', axes: ax(4, 0.1, 0.9), len: 119, rustic: [[0, 64]],
    balconies: [[1, 0.35, 0.65, 10, true]],
    ground: [arch([0.08, 0.26], 8, { gate: true, frame: '#3a2a1a', ring: '#e8dcc8' }), shop([0.58, 0.92], '#a02a1a')],
  }),
  house({
    name: 'Ceglana z balkonem', mid: [-2223, 3687], wall: '#b0705a', base: '#8a4a3a', g: 66, n: 4, w: 8.5, trim: '#e8dcc8', axes: ax(3, 0.1, 0.9), len: 85, rustic: [[0, 64]],
    balconies: [[1, 0.3, 0.7, 10, true]],
  }),
  house({
    // kremowo-żółta z czarnym żelaznym balkonem, bramą, boniowanym parterem i granitowym cokołem
    name: 'Kremowa z czarnym balkonem', mid: [-2126, 3788], wall: '#ecdca0', base: '#7a766e', g: 66, n: 4, w: 8.5, trim: '#f8f0d8', axes: ax(6, 0.07, 0.93), len: 196, rustic: [[0, 64]],
    balconies: [[1, 0.42, 0.58, 10, true]],
    ground: [arch([0.12, 0.26], 8, { gate: true, frame: '#2a2a2a', ring: '#f8f0d8' }), win([0.4, 0.5]), win([0.62, 0.72]), win([0.8, 0.9])],
  }),
  house({
    // zrujnowana: odpadający tynk i cegła, drewniane okna
    name: 'Zrujnowana 1', mid: [-2044, 3882], wall: '#b4825e', base: '#9a6a4a', g: 56, n: 2, w: 7, trim: '#c8a888', axes: ax(1, 0.2, 0.8), len: 52, stains: true,
    ground: [door([0.6, 0.8], { frame: '#5a3a1a' })],
  }),
  house({
    name: 'Zrujnowana 2', mid: [-2006, 3921], wall: '#b4825e', base: '#9a6a4a', g: 56, n: 2, w: 7, trim: '#c8a888', axes: ax(1, 0.2, 0.8), len: 55, stains: true,
  }),
  house({
    name: 'Zrujnowana 3', mid: [-1980, 3955], wall: '#b4825e', base: '#9a6a4a', g: 56, n: 2, w: 7, trim: '#c8a888', axes: ax(1, 0.3, 0.7), len: 31, stains: true,
  }),
  house({
    // duży szary blok z czasów PRL, 5 kondygnacji, małe białe okna
    name: 'Szary blok', mid: [-1918, 3830], wall: '#a8a8a2', base: '#8a8a84', g: 56, n: 5, w: 9, trim: '#bcbcb4', axes: ax(8, 0.05, 0.95), len: 269, stains: true,
  }),
];
