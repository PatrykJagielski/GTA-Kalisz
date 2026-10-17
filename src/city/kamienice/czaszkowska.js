/* ---------- ulica Czaszkowska: cała ulica, 8 frontów (bloki z lat 50., kamienice i nowszy dom z loggiami) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2200;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
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

export const CZASZKOWSKA = [
  house({
    // blok z zielonymi i szarymi akcentami, balkony i obramienia okien w oliwkowej zieleni
    name: 'Blok z zielonymi akcentami', mid: [-1872, 7318], wall: '#e4e4d8', base: '#9a9ca0', g: 56, n: 5, w: 9, trim: '#a8b460', axes: ax(5, 0.08, 0.92), len: 170,
    balconies: [[1, 0.5, 0.65, 6, false], [2, 0.5, 0.65, 6, false], [3, 0.5, 0.65, 6, false]],
  }),
  house({
    // blok w beżu i różu, brudny tynk, wejście z daszkiem
    name: 'Blok beżowo-różowy 1', mid: [-1561, 7176], wall: '#cfc89c', base: '#d8b8a0', g: 56, n: 5, w: 9, trim: '#dcd4ac', axes: ax(5, 0.06, 0.94), len: 188, stains: true,
  }),
  house({
    // blok z przejazdem, zakładem fotograficznym i schodami
    name: 'Blok z przejazdem', mid: [-1265, 7036], wall: '#cfc89c', base: '#d8b8a0', g: 56, n: 5, w: 9, trim: '#dcd4ac', axes: ax(6, 0.25, 0.95), len: 197, stains: true,
    ground: [arch([0.0, 0.18], 8, { gate: true, frame: '#d0b090', ring: '#d8b8a0' }), shop([0.5, 0.95], '#a8603a')],
  }),
  house({
    // zielonoszara kamienica z balkonami z kutymi balustradami i drewnianymi drzwiami w łuku
    name: 'Zielonoszara kamienica', mid: [-1118, 6970], wall: '#b8bca0', base: '#a8aca0', g: 66, n: 3, w: 8, trim: '#d0d4bc', axes: ax(3, 0.15, 0.85), len: 127, stains: true,
    balconies: [[1, 0.5, 0.7, 10, true], [2, 0.5, 0.7, 10, true]],
    ground: [door([0.78, 0.9], { frame: '#6a3a1a' })],
  }),
  house({
    // ciemnobrązowy parter, jasna kamienica z kutym balkonem i zielonymi donicami
    name: 'Kamienica z ciemnym parterem', mid: [-967, 6900], wall: '#aaa690', base: '#6a5a50', g: 66, n: 3, w: 8, trim: '#c0baa4', axes: ax(5, 0.08, 0.92), len: 205, stains: true,
    balconies: [[2, 0.4, 0.55, 10, true]],
  }),
  house({
    // nowszy dom: ceglasty pas i kremowe piętra z loggiami, parter z łukowymi oknami
    name: 'Dom z loggiami', mid: [-198, 6598], wall: '#e4d8b0', base: '#d8c880', g: 66, n: 4, w: 9, trim: '#f0e8cc', axes: ax(8, 0.04, 0.96), len: 348,
    balconies: [[2, 0.1, 0.95, 18, true], [3, 0.1, 0.95, 18, true]],
    ground: [arch([0.04, 0.2], 7, { frame: '#6a3a1a', ring: '#e4e0b8' }), arch([0.42, 0.58], 7, { frame: '#6a3a1a', ring: '#e4e0b8' }), arch([0.62, 0.8], 7, { frame: '#6a3a1a', ring: '#e4e0b8' })],
  }),
  house({
    // beżowa kamienica z secesyjnym szczytem, zielony balkon, witryny w parterze
    name: 'Beżowa z szczytem', mid: [69, 6561], wall: '#e0d0a8', base: '#d0c098', g: 66, n: 3, w: 8.5, trim: '#f0e8d0', axes: ax(6, 0.08, 0.92), len: 190, rustic: [[0, 64]],
    balconies: [[1, 0.35, 0.65, 10, true]],
    ground: [shop([0.05, 0.2], '#8a4a2a'), shop([0.28, 0.4], '#8a4a2a'), door([0.5, 0.58], { frame: '#3a2a1a' }), shop([0.74, 0.86], '#8a4a2a'), shop([0.9, 0.98], '#8a4a2a')],
  }),
  house({
    name: 'Narożnik z oknem', mid: [178, 6546], wall: '#e8dcc0', base: '#d8cca8', g: 66, n: 3, w: 8, trim: '#f4ecd8', axes: [0.5], len: 29,
  }),
];
