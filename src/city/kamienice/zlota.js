/* ---------- ulica Złota: pierwsze ok. 230 m od Rynku (dalsza część ulicy poza listą frontów) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 400;
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

export const ZLOTA = [
  house({
    // narożna pistacjowa ściana z tabliczką „Złota”
    name: 'Narożna pistacjowa', mid: [-750, 105], wall: '#c3cba8', base: '#b4bd98', g: 56, n: 3, w: 8, axes: [0.5], len: 33, trim: '#d9dec4', stains: true,
    ground: [arch([0.05, 0.4], 4, { frame: '#5a3a22' })],
  }),
  house({
    // pistacjowa z kratą w bramie
    name: 'Pistacjowa z bramą', mid: [-984, -83], wall: '#c3cba8', base: '#b4bd98', g: 56, n: 3, w: 8, axes: [0.22, 0.78], len: 49, trim: '#d9dec4', stains: true,
    balconies: [[1, 0.6, 0.98, 8, true]],
    ground: [arch([0.4, 0.82], 5, { gate: true, ring: '#d9dec4' })],
  }),
  house({
    // oliwkowa z dwoma łukowymi witrynami (Guccio, Świat Dziecka) i szerokim kutym balkonem
    name: 'Guccio', mid: [-1090, -170], wall: '#c9c48c', base: '#c0b27a', g: 58, n: 3, w: 8, frame: '#e8dcc0', axes: [0.2, 0.45, 0.66, 0.89], len: 87,
    balconies: [[0, 0.3, 0.74, 10, true], [2, 0.02, 0.28, 9], [2, 0.7, 0.98, 9]],
    ground: [arch([0.16, 0.48], 7, { frame: '#8a2a1a', ring: '#d8cfa8' }), arch([0.6, 0.97], 7, { frame: '#8a2a1a', ring: '#d8cfa8' })],
    signs: [{ x: [0.17, 0.4], y: [46, 54], bg: '#8a2323', fg: '#f4efe6', font: '800 {}px Arial, sans-serif', lines: [['GUCCIO', 0.62, 0.55]] },
      { x: [0.66, 0.92], y: [46, 54], bg: '#f1ece0', fg: '#7a2a1a', font: '800 {}px Arial, sans-serif', lines: [['ŚWIAT DZIECKA', 0.3, 0.55]] }],
  }),
  house({
    // sadowa z zielonym parterem: zakład rzemieślniczy, drzwi w ochrowej opasce, witryna
    name: 'Zakład rzemieślniczy', mid: [-1122, -30], wall: '#cbcdb2', base: '#7e8a58', g: 58, n: 3, w: 8, frame: '#6a3a22', trim: '#e2dcc8', axes: ax(4, 0.06, 0.94), len: 99, hood: 'hood',
    balconies: [[0, 0.5, 0.86, 9, true], [1, 0.08, 0.3, 8, true], [2, 0.66, 0.9, 8, true]],
    ground: [shop([0.06, 0.34], '#5a3a22'), door([0.4, 0.5], { frame: '#c9a24a' }), shop([0.6, 0.9], '#5a3a22')],
    signs: [{ x: [0.05, 0.32], y: [45, 53], bg: '#6a3a22', fg: '#e8d8b8', font: '700 {}px Georgia, serif', lines: [['ZAKŁAD RZEMIEŚLNICZY', 0.12, 0.55]] }],
  }),
  house({
    // kremowa z czarnym balkonem i łukowym wejściem z numerem 5
    name: 'Czarny balkon', mid: [-1188, -254], wall: '#e6dcc2', base: '#d8ccb0', g: 56, n: 3, w: 8, axes: [0.5], len: 35,
    balconies: [[0, 0.1, 0.96, 10, true]],
    ground: [arch([0.08, 0.5], 5, { door: true, frame: '#5a3a22', ring: '#f1e8d2' })],
  }),
  house({
    // różowa z półkolistym portalem, czarnym balkonem i fryzjerem
    name: 'Różowa z fryzjerem', mid: [-1196, -87], wall: '#e0b8b0', base: '#e6dcd0', g: 58, n: 4, w: 8.5, hood: 'hood', trim: '#f2eee2', axes: ax(4, 0.1, 0.9), len: 88,
    balconies: [[0, 0.28, 0.88, 9, true], [3, 0.02, 0.2, 8, true]],
    ground: [arch([0.06, 0.2], 6, { door: true, frame: '#6a2a1a', ring: '#efe8da' }), shop([0.3, 0.58], '#8a2a1a'), shop([0.62, 0.95], '#f4f2ec')],
    signs: [{ x: [0.34, 0.54], y: [44, 52], bg: '#9a2a2a', fg: '#f4efe6', font: '700 {}px Arial, sans-serif', lines: [['FRYZJER', 0.5, 0.52]] }],
  }),
  house({
    // beżowa z dwiema szerokimi witrynami w drewnianych ramach (butik Veroni) i kutym balkonem
    name: 'Veroni', mid: [-1247, -306], wall: '#dccfae', base: '#d3c49c', g: 62, n: 3, w: 8.5, frame: '#f4f2ec', axes: ax(4, 0.12, 0.88), len: 123,
    balconies: [[0, 0.1, 0.52, 9, true], [1, 0.02, 0.5, 8]],
    ground: [shop([0.1, 0.48], '#b5632a'), shop([0.54, 0.86], '#b5632a'), shop([0.92, 0.99], '#f4f2ec')],
    signs: [{ x: [0.5, 0.53], y: [8, 50], bg: '#f4f2ec', fg: '#2a2a2a', font: '700 {}px Arial, sans-serif', lines: [['VERONI', 0.5, 0.5]] }],
  }),
  house({
    // jasnożółta z przejazdem bramowym, balkonem z białą balustradą i lukarnami
    name: 'Żółta z przejazdem', mid: [-1315, -180], wall: '#ece3be', base: '#e0c26a', g: 60, n: 3, w: 8, axes: ax(8, 0.05, 0.95), len: 213, trim: '#f6efd6',
    balconies: [[1, 0.1, 0.22, 8, true]],
    ground: [arch([0.08, 0.3], 8, { gate: true, ring: '#f6efd6' }), shop([0.34, 0.44], '#2a2a2a'), shop([0.5, 0.62], '#2a2a2a')],
    awnings: [[0.64, 0.74, 44, 8, '#2a4a8a']],
  }),
  house({
    // kremowa narożna z płaskorzeźbionymi naczółkami i dwiema dużymi witrynami w białych opaskach
    name: 'Narożna kremowa', mid: [-1429, -462], wall: '#efe3bd', base: '#e8d9ae', g: 64, n: 3, w: 8.5, hood: 'hood', axes: ax(3, 0.1, 0.9), len: 79, trim: '#f8f1d8',
    ground: [shop([0.14, 0.5], '#f4f2ec'), shop([0.58, 0.92], '#f4f2ec')],
  }),
  house({
    // szaro-brązowa z jubilerem pod czerwoną markizą i dwoma bramami
    name: 'Jubiler', mid: [-1494, -518], wall: '#a89d88', base: '#cdb98a', g: 60, n: 3, w: 7.5, frame: '#f4f2ec', axes: ax(4, 0.08, 0.92), len: 95, stains: true,
    ground: [shop([0.04, 0.34], '#7a2a1a'), door([0.4, 0.5], { frame: '#5a2a1a' }), door([0.64, 0.78], { frame: '#5a2a1a' })],
    awnings: [[0.02, 0.36, 46, 8, '#8a3a24']],
  }),
  house({
    // szarooliwkowa z lizenami, rustykalny parter z oknami
    name: 'Z lizenami', mid: [-1562, -577], wall: '#d0cdb4', base: '#c0b898', g: 56, n: 4, w: 8, trim: '#e6e2d0', axes: ax(4, 0.14, 0.88), len: 85, rustic: [[0, 54]],
    ground: [shop([0.1, 0.26], '#f4f2ec'), shop([0.4, 0.56], '#f4f2ec'), shop([0.72, 0.9], '#f4f2ec')],
  }),
  house({
    // długa beżowa z pilastrami i rusztowaniem w parterze
    name: 'Długa beżowa', mid: [-1664, -662], wall: '#c4b894', base: '#a08c6a', g: 62, n: 4, w: 7.5, trim: '#ddd2b4', axes: ax(8, 0.05, 0.95), len: 180, stains: true,
    ground: [shop([0.1, 0.22], '#6a4a2a'), door([0.5, 0.58], { frame: '#3a2a1a' }), shop([0.66, 0.78], '#6a4a2a')],
  }),
  house({
    // szara z turkusowym parterem, dużą witryną i drewnianą bramą
    name: 'Turkusowy parter', mid: [-1770, -749], wall: '#9d9684', base: '#8fc4bd', g: 62, n: 3, w: 8, trim: '#b3ac98', axes: ax(3, 0.12, 0.9), len: 95, stains: true,
    ground: [door([0.08, 0.18]), shop([0.3, 0.62], '#6a8a84'), door([0.78, 0.92], { frame: '#4a2a1a' })],
  }),
  house({
    // biała z pilastrami i lukarnami, drewniane drzwi
    name: 'Biała z pilastrami', mid: [-1878, -836], wall: '#e8e3d2', base: '#cdc3aa', g: 58, n: 3, w: 8, trim: '#f6f2e6', axes: ax(8, 0.05, 0.95), len: 181,
    ground: [shop([0.08, 0.2], '#f4f2ec'), door([0.3, 0.36], { frame: '#5a2a1a' }), shop([0.46, 0.56], '#f4f2ec'), shop([0.7, 0.86], '#f4f2ec')],
  }),
  house({
    // kremowa z pilastrami, w parterze sklep zoologiczny i witryny
    name: 'Zoologiczny', mid: [-2021, -953], wall: '#ede8cc', base: '#e6dfc0', g: 62, n: 2, w: 8, trim: '#f8f4e0', axes: ax(9, 0.05, 0.95), len: 189,
    ground: [shop([0.04, 0.3], '#f4f2ec'), shop([0.34, 0.52], '#f4f2ec'), shop([0.62, 0.96], '#f4f2ec')],
    signs: [{ x: [0.06, 0.2], y: [44, 52], bg: '#1f5a8a', fg: '#ffffff', font: '700 {}px Arial, sans-serif', lines: [['ZOOLOGICZNY', 0.2, 0.52]] }],
  }),
  house({
    // długa oliwkowo-biała kamienica z balkonami i sklepami w parterze
    name: 'Długa oliwkowa', mid: [-978, 78], wall: '#dcd8b8', base: '#e0dccc', g: 58, n: 4, w: 8, hood: 'hood', trim: '#f2eee2', axes: ax(9, 0.03, 0.97), len: 262,
    balconies: [[1, 0.5, 0.58, 9, true], [2, 0.54, 0.62, 9, true], [1, 0.7, 0.8, 9, true], [2, 0.14, 0.24, 8, true]],
    ground: [shop([0.06, 0.22], '#2a2a2a'), door([0.3, 0.38], { frame: '#3a2a1a' }), shop([0.5, 0.64], '#2a2a2a'), shop([0.74, 0.97], '#2a2a2a')],
  }),
];
