/* ---------- ulica Berka Joselewicza: cała ulica, 7 frontów (odnowione kamienice, zniszczone ciemne kamienice i blok) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1900;
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

export const BERKA = [
  house({
    // narożna ochrowa kamienica ze sklepem w parterze, okna z ciemnymi parapetami
    name: 'Ochrowa narożna', mid: [-1759, 4958], wall: '#e0c078', base: '#b08850', g: 56, n: 4, w: 8, trim: '#ecd8a0', axes: ax(4, 0.1, 0.9), len: 121,
    ground: [shop([0.7, 0.92], '#f4f2ec')],
  }),
  house({
    // beżowa z czerwonym pasem klatki schodowej, bramą i czerwonymi drzwiami
    name: 'Beżowa z czerwonym pasem', mid: [-1758, 4784], wall: '#d8cca0', base: '#cfc296', g: 56, n: 5, w: 8, trim: '#e8dcc0', axes: ax(5, 0.1, 0.8), len: 138,
    ground: [door([0.78, 0.86], { frame: '#a02a1a' }), arch([0.9, 0.99], 8, { gate: true, frame: '#2a2a2a', ring: '#e8dcc0' })],
  }),
  house({
    // ciemnoszara okopcona kamienica z balkonami, naroża z ozdobnymi kartuszami
    name: 'Ciemna z balkonami 1', mid: [-1656, 4691], wall: '#6a665c', base: '#58544a', g: 66, n: 4, w: 8.5, trim: '#7a766c', axes: ax(5, 0.08, 0.92), len: 137, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.35, 0.55, 10, true], [2, 0.6, 0.85, 10, true]],
  }),
  house({
    // brzoskwiniowa odnowiona kamienica z balkonami z kutą balustradą i okrągłymi okienkami
    name: 'Brzoskwiniowa odnowiona', mid: [-1654, 4863], wall: '#f0d8c0', base: '#e8b898', g: 56, n: 4, w: 8, trim: '#fff0e0', axes: ax(5, 0.08, 0.92), len: 161,
    balconies: [[1, 0.55, 0.7, 10, true], [2, 0.55, 0.7, 10, true]],
  }),
  house({
    // ciemna kamienica z drewnianym portalem bramy i ozdobnymi kartuszami nad oknami
    name: 'Ciemna z portalem', mid: [-1587, 4631], wall: '#6a665c', base: '#58544a', g: 66, n: 4, w: 8.5, trim: '#7a766c', axes: ax(2, 0.1, 0.9), len: 45, stains: true, rustic: [[0, 64]],
    ground: [door([0.35, 0.65], { frame: '#a06030' })],
  }),
  house({
    // ciemna okopcona z odpadającym tynkiem, balkony z zielonymi balustradami
    name: 'Ciemna z balkonami 2', mid: [-1520, 4569], wall: '#6a665c', base: '#58544a', g: 66, n: 4, w: 8.5, trim: '#7a766c', axes: ax(5, 0.08, 0.92), len: 137, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.2, 0.4, 10, true], [2, 0.2, 0.4, 10, true]],
  }),
  house({
    // długi blok z oliwkowo-żółtym tynkiem, pięć kondygnacji, białe okna
    name: 'Blok oliwkowy', mid: [-1490, 4715], wall: '#b8a868', base: '#8a7a48', g: 56, n: 5, w: 9, trim: '#c8b880', axes: ax(7, 0.04, 0.96), len: 281, stains: true,
  }),
];
