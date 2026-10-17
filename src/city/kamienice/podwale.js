/* ---------- ulica Podwale: cała ulica, 9 frontów (kamienica, blok z lat 50., garaże i pawilony) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1800;
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

export const PODWALE = [
  house({
    // kamienica z kremowym parterem z drzwiami i ciemnoszarymi piętrami z odpadającym tynkiem
    name: 'Kamienica z kremowym parterem', mid: [-244, -4852], wall: '#8a857a', base: '#d8d0a8', g: 66, n: 3, w: 8, trim: '#b0aa9c', axes: ax(3, 0.45, 0.95), len: 121, stains: true,
    ground: [door([0.2, 0.3], { frame: '#6a3a1a' }), door([0.62, 0.72], { frame: '#6a3a1a' })],
  }),
  house({
    // blok z lat 50.: ochrowy tynk, białe obramienia okien, balkon
    name: 'Blok ochrowy 1', mid: [-142, -5420], wall: '#d0b070', base: '#a8a290', g: 56, n: 4, w: 7, trim: '#f0ece0', axes: [0.5], len: 27,
  }),
  house({
    name: 'Blok ochrowy 2', mid: [-137, -5468], wall: '#d0b070', base: '#a8a290', g: 56, n: 4, w: 7, trim: '#f0ece0', axes: ax(2, 0.2, 0.8), len: 66,
    ground: [arch([0.7, 1], 8, { frame: '#f4f2ec', ring: '#a8a290' })],
  }),
  house({
    name: 'Blok ochrowy 3', mid: [-131, -5520], wall: '#d0b070', base: '#a8a290', g: 56, n: 4, w: 7, trim: '#f0ece0', axes: [0.5], len: 34,
    ground: [shop([0.3, 0.95], '#f4f2ec')],
  }),
  house({
    name: 'Blok ochrowy 4', mid: [-140, -5559], wall: '#d0b070', base: '#a8a290', g: 56, n: 4, w: 7, trim: '#f0ece0', axes: [0.5], len: 29,
    ground: [shop([0.1, 0.9], '#f4f2ec')],
  }),
  house({
    // szarobrązowa trzykondygnacyjna ściana z drzwiami w kamiennym obramieniu
    name: 'Szarobrązowa z drzwiami', mid: [-79, -4922], wall: '#8a8272', base: '#7a7262', g: 56, n: 3, w: 7.5, trim: '#aaa294', axes: ax(2, 0.2, 0.55), len: 129, stains: true,
    ground: [door([0.6, 0.72], { frame: '#f4f2ec' })],
  }),
  house({
    // niski pawilon z blaszanym dachem
    name: 'Blaszany pawilon', mid: [-52, -5060], wall: '#c8c0a8', base: '#a8a088', g: 30, n: 1, w: 5, trim: '#d8d0b8', axes: [0.5], len: 27,
  }),
  house({
    // niski żółty garaż z brązowymi bramami
    name: 'Żółty garaż', mid: [-42, -5113], wall: '#d8b868', base: '#b89848', g: 30, n: 1, w: 5, trim: '#e8d098', axes: [0.5], len: 47,
    ground: [door([0.1, 0.45], { frame: '#6a2a1a' })],
  }),
  house({
    // kiosk wyłożony kafelkami, kratowane witryny i dach z dachówki
    name: 'Pawilon z kafelkami', mid: [-50, -5192], wall: '#d8d0b0', base: '#b8b090', g: 30, n: 1, w: 5, trim: '#4a3a30', axes: [0.5], len: 63,
    ground: [shop([0.1, 0.45], '#8a8678'), shop([0.5, 0.85], '#8a8678')],
  }),
];
