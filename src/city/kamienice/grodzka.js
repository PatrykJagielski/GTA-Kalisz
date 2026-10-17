/* ---------- ulica Grodzka: kamienice po stronie pn.-zach. i modernistyczny łuk (bez kościoła Franciszkanów po przeciwnej stronie) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 600;
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

const KOS = '#d8d0bc';
// wąskie, lekko wygięte odcinki łukowego budynku modernistycznego: dwie kondygnacje, w parterze okna z kratami
const luk = (name, mid) => house({ name, mid, wall: KOS, base: '#c8b890', g: 14, n: 2, w: 7, trim: '#e4dcc8', axes: [0.5], len: 48, stains: true });

export const GRODZKA = [
  house({
    // pożółkła kamienica ze złuszczonym tynkiem: drewniana brama, czarna witryna „Creations”, czerwony sklep, kute balkony z kwiatami
    name: 'Creations', mid: [322, -1718], wall: '#e6dcb0', base: '#8a7a6a', g: 62, n: 3, w: 8, hood: 'hood', trim: '#f2ead0', axes: ax(8, 0.04, 0.96), len: 249, stains: true,
    balconies: [[0, 0.04, 0.26, 9, true], [1, 0.06, 0.3, 9, true]],
    ground: [arch([0.04, 0.2], 6, { gate: true, frame: '#5a3a22', ring: '#d9cfae' }), shop([0.28, 0.5], '#1a1a1a'), shop([0.56, 0.72], '#8a2a1a'), door([0.8, 0.9], { frame: '#3a2a1a' })],
  }),
  house({
    // długa kremowa z lukarnami; parter z szyldem Salon Marta
    name: 'Salon Marta', mid: [154, -1511], wall: '#e4dccb', base: '#d6ccb4', g: 62, n: 3, w: 8, trim: '#f0e8d8', axes: ax(9, 0.04, 0.96), len: 381,
    ground: [shop([0.02, 0.12], '#5a3a22'), door([0.2, 0.26], { frame: '#5a3a22' }), shop([0.4, 0.5], '#5a3a22'), door([0.62, 0.68], { frame: '#3a2a1a' }), shop([0.8, 0.9], '#3a3a3a')],
    signs: [{ x: [0.03, 0.11], y: [44, 52], bg: '#1a1a1a', fg: '#f4efe6', font: '700 {}px Georgia, serif', lines: [['SALON MARTA', 0.1, 0.55]] }],
  }),
  house({
    // kremowa z boniowanym parterem, czterema oknami w rzędzie i pilastrami; kuty balkon w prawym rogu
    name: 'Boniowana kremowa', mid: [492, -1650], wall: '#ece4d4', base: '#e0d6c0', g: 64, n: 3, w: 8, trim: '#f6f0e0', axes: ax(4, 0.08, 0.92), len: 115, rustic: [[0, 62]],
    balconies: [[1, 0.9, 0.99, 8, true]],
    ground: [shop([0.1, 0.22], '#f4f2ec'), shop([0.3, 0.42], '#f4f2ec'), shop([0.5, 0.62], '#f4f2ec'), shop([0.72, 0.86], '#f4f2ec')],
  }),
  house({
    // grafitowy parter z czerwoną bramą w łuku, brązowe piętra z kutymi balkonami i półokrągłymi oknami parteru
    name: 'Czerwona brama', mid: [512, -1782], wall: '#a89c88', base: '#55524d', g: 62, n: 4, w: 8, hood: 'hood', trim: '#d8cfb8', axes: ax(4, 0.12, 0.88), len: 152, stains: true,
    balconies: [[1, 0.2, 0.34, 8, true], [2, 0.4, 0.5, 8, true], [3, 0.68, 0.8, 8, true]],
    ground: [arch([0.04, 0.26], 8, { gate: true, frame: '#9a2a2a', ring: '#d8cfb8' }), arch([0.36, 0.5], 6, { frame: '#3a2a1a', ring: '#d8cfb8' }), arch([0.58, 0.68], 6, { frame: '#3a2a1a', ring: '#d8cfb8' }), arch([0.74, 0.84], 6, { frame: '#3a2a1a', ring: '#d8cfb8' })],
  }),
  house({
    // kremowa z rustykalnym parterem, trzema półkolistymi oknami, granitowym portalem i bramą, naczółki nad oknami
    name: 'Z portalem granitowym', mid: [660, -1830], wall: '#e4d8bc', base: '#cfc3a4', g: 64, n: 4, w: 8, hood: 'hood', trim: '#f2ead4', axes: ax(5, 0.1, 0.9), len: 159, rustic: [[0, 62]],
    balconies: [[1, 0.1, 0.24, 9, true], [3, 0.88, 0.99, 8, true]],
    ground: [arch([0.08, 0.2], 7, { frame: '#3a2a1a', ring: '#f2ead4' }), arch([0.34, 0.46], 7, { frame: '#3a2a1a', ring: '#f2ead4' }), door([0.52, 0.64], { frame: '#8a4a3a' }), arch([0.74, 0.86], 7, { frame: '#3a2a1a', ring: '#f2ead4' })],
  }),
  house({
    // biała z kutymi balkonami i wjazdem w łuku z kratą
    name: 'Biała z bramą', mid: [612, -1692], wall: '#ece4d2', base: '#e0d8c0', g: 62, n: 4, w: 8.5, hood: 'hood', trim: '#f6f0e0', axes: ax(5, 0.1, 0.9), len: 140,
    balconies: [[1, 0.5, 0.74, 9, true], [2, 0.5, 0.74, 9, true]],
    ground: [arch([0.04, 0.32], 9, { gate: true, ring: '#f6f0e0' }), shop([0.44, 0.52], '#3a3a3a'), shop([0.6, 0.7], '#3a3a3a')],
  }),
  house({
    // jasna z balkonami z zielonymi panelami, drzwi w łuku i szklany łuk przedszkola
    name: 'Z balkonami zielonymi', mid: [718, -1729], wall: '#ebe3d6', base: '#e2dac8', g: 62, n: 4, w: 8.5, hood: 'hood', trim: '#f6f0e0', axes: [0.3, 0.72], len: 84,
    balconies: [[1, 0.2, 0.42, 9, true], [2, 0.2, 0.42, 9]],
    ground: [arch([0.08, 0.2], 6, { door: true, frame: '#5a3a22', ring: '#f6f0e0' }), arch([0.32, 0.62], 8, { frame: '#cfd6d8', ring: '#f6f0e0' })],
  }),
  house({
    // pudroworóżowa z boniowanym parterem i półkolistymi oknami
    name: 'Różowa z oknami łukowymi', mid: [755, -1861], wall: '#ecdfe2', base: '#e2cfd4', g: 60, n: 3, w: 7.5, trim: '#f6eef0', axes: [0.5], len: 42, rustic: [[0, 58]],
    ground: [arch([0.12, 0.88], 8, { frame: '#f4f2ec', ring: '#f6eef0' })],
  }),
  house({
    // różowa z bramą w łuku z kratą i kutym balkonem z kwiatami
    name: 'Różowa z bramą', mid: [796, -1872], wall: '#ecdfe2', base: '#e2cfd4', g: 60, n: 3, w: 7.5, trim: '#f6eef0', axes: [0.5], len: 45, rustic: [[0, 58]],
    balconies: [[0, 0.1, 0.9, 10, true]],
    ground: [arch([0.12, 0.88], 8, { gate: true, ring: '#f6eef0' })],
  }),
  house({
    // różowa, dwa półkoliste okna parteru
    name: 'Różowa druga', mid: [838, -1887], wall: '#ecdfe2', base: '#e2cfd4', g: 60, n: 3, w: 7.5, trim: '#f6eef0', axes: [0.5], len: 44, rustic: [[0, 58]],
    ground: [arch([0.1, 0.9], 8, { frame: '#f4f2ec', ring: '#f6eef0' })],
  }),
  house({
    // piaskowa z drewnianymi drzwiami pod ozdobnym daszkiem i oknami z kwiatami
    name: 'Piaskowa z daszkiem', mid: [922, -1888], wall: '#d8c4a0', base: '#cdb48e', g: 62, n: 2, w: 8, trim: '#efe6d0', axes: ax(5, 0.1, 0.92), len: 127,
    ground: [shop([0.15, 0.3], '#f4f2ec'), shop([0.38, 0.52], '#f4f2ec'), door([0.8, 0.9], { frame: '#4a2a1a' })],
  }),
  house({
    // modernistyczny łuk: kremowy, parter z boniowaniem, trzy okna w rzędzie (cz. 1)
    name: 'Łuk modernistyczny 1', mid: [1078, -1858], wall: '#e8dcaa', base: '#e0d49c', g: 58, n: 1, w: 7, trim: '#f2ead0', axes: ax(3, 0.12, 0.88), len: 123, rustic: [[0, 56]],
    floors: [{ y: [24, 48], w: 7 }, { y: [70, 96], w: 7 }],
  }),
  house({
    name: 'Łuk modernistyczny 2', mid: [1362, -1753], wall: '#ece6cf', base: '#e4dcc0', g: 58, n: 1, w: 7, trim: '#f4eed8', axes: ax(3, 0.12, 0.88), len: 114, rustic: [[0, 56]],
    floors: [{ y: [24, 48], w: 7 }, { y: [70, 96], w: 7 }],
  }),
  luk('Łuk szary 1', [777, -1749]),
  luk('Łuk szary 2', [822, -1760]),
  luk('Łuk szary 3', [870, -1769]),
  luk('Łuk szary 4', [918, -1773]),
  luk('Łuk szary 5', [982, -1770]),
  luk('Łuk szary 6', [1016, -1763]),
];
