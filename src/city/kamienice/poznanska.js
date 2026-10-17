/* ---------- ulica Poznańska: 13 frontów z pokryciem Street View (najdalszy zachodni front bez ujęcia pominięty) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2500;
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

export const POZNANSKA = [
  house({
    // zniszczona dwukondygnacyjna z odsłoniętą cegłą
    name: 'Zniszczona z ceglanymi łatami', mid: [-11397, 1953], wall: '#b8b0a0', base: '#9a9284', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 155, stains: true,
    ground: [win([0.1, 0.22]), win([0.4, 0.52]), win([0.72, 0.84])],
  }),
  house({
    // żółta dwukondygnacyjna z balkonikiem i drzwiami
    name: 'Żółta z drzwiami', mid: [-11256, 2002], wall: '#e0cc98', base: '#d0bc88', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 144, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a2a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // żółta z sztukateriami nad oknami i drzwiami przychodni
    name: 'Żółta z poradnią', mid: [-10977, 2090], wall: '#e0d08a', base: '#d0c078', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(4, 0.1, 0.9), len: 202, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a2a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // niski beżowy pawilon z daszkiem
    name: 'Niski pawilon', mid: [-9066, 2980], wall: '#e0c8b0', base: '#d0b8a0', g: 40, n: 1, w: 5.5, trim: '#e4dcc8', axes: ax(1, 0.1, 0.9), len: 56, stains: true,
  }),
  house({
    // beżowa z dużą drewnianą bramą i sztukateriami
    name: 'Beżowa z drewnianą bramą', mid: [-8970, 3041], wall: '#d4c8a8', base: '#c0b090', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 172, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#6a4a2a', ring: '#c0b090' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // szara z drzwiami w portalu
    name: 'Szara z portalem', mid: [-8621, 3267], wall: '#b4aca0', base: '#9a9284', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 187, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a2a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // stara kamienica z bramą, szczytem i gzymsami
    name: 'Kamienica z bramą i szczytem', mid: [-8606, 3463], wall: '#a8a290', base: '#908a78', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(3, 0.1, 0.9), len: 189, stains: true,
    ground: [win([0.06, 0.18]), arch([0.35, 0.55], 8, { gate: true, frame: '#6a4a2a', ring: '#908a78' }), win([0.65, 0.78]), win([0.84, 0.95])],
  }),
  house({
    // z zielonymi balkonami i zakładem pogrzebowym
    name: 'Z zielonymi balkonami', mid: [-8335, 3711], wall: '#d0c8a8', base: '#b8b090', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 97, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true], [2, 0.2, 0.5, 10, true]],
    ground: [win([0.1, 0.22]), win([0.4, 0.52]), win([0.72, 0.84])],
  }),
  house({
    // ciemna ściana z billboardem
    name: 'Ściana szczytowa z reklamą', mid: [-8140, 3650], wall: '#7a766a', base: '#6a665a', g: 40, n: 1, w: 5.5, trim: '#e4dcc8', axes: ax(1, 0.1, 0.9), len: 40, stains: true,
  }),
  house({
    // szara z żaluzjami w oknach
    name: 'Szara z żaluzjami', mid: [-8078, 3704], wall: '#8a8678', base: '#7a766a', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(1, 0.1, 0.9), len: 79, stains: true,
    ground: [win([0.1, 0.22]), win([0.4, 0.52]), win([0.72, 0.84])],
  }),
  house({
    // dwukondygnacyjna z szczytem z okrągłym oknem i drzwiami
    name: 'Piętrowa z owalnym oknem', mid: [-7950, 3816], wall: '#c4bc9c', base: '#a8a088', g: 56, n: 2, w: 8, trim: '#e4dcc8', axes: ax(5, 0.1, 0.9), len: 261, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a2a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // beżowa, czerwone obramienia okien, drewniane drzwi
    name: 'Beżowa narożna', mid: [-7760, 3988], wall: '#d0c0a0', base: '#c0b090', g: 56, n: 3, w: 8, trim: '#e4dcc8', axes: ax(2, 0.1, 0.9), len: 135, stains: true,
    ground: [win([0.08, 0.2]), door([0.35, 0.45], { frame: '#5a2a1a' }), win([0.6, 0.72]), win([0.82, 0.94])],
  }),
  house({
    // beżoworóżowa z odpadającym tynkiem i balkonami
    name: 'Różowa z balkonami', mid: [-7596, 4106], wall: '#d4c0a8', base: '#c0a898', g: 66, n: 4, w: 8, trim: '#e4dcc8', axes: ax(5, 0.1, 0.9), len: 270, stains: true,
    balconies: [[1, 0.2, 0.5, 10, true], [2, 0.2, 0.5, 10, true]],
    ground: [win([0.1, 0.22]), win([0.4, 0.52]), win([0.72, 0.84])],
  }),
];
