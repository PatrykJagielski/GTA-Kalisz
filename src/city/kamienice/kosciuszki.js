/* ---------- ulica Tadeusza Kościuszki: dwa odcinki z pokryciem Street View (od okolic Pułaskiego na północny zachód oraz dalszy zachodni odcinek) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 2000;
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

export const KOSCIUSZKI = [
  house({
    // zielona szkoła z szarymi pilastrami, łukowe okna z kratami, wejście z arkadowym przedsionkiem
    name: 'Szkoła z arkadami', mid: [-4042, 3014], wall: '#a8b490', base: '#8a9478', g: 66, n: 3, w: 8.5, trim: '#d8d8c4', axes: ax(4, 0.1, 0.9), len: 91,
    balconies: [[1, 0.55, 0.95, 10, true]],
    ground: [arch([0.05, 0.25], 8, { frame: '#f4f2ec', ring: '#d8d8c4' }), arch([0.3, 0.5], 8, { frame: '#f4f2ec', ring: '#d8d8c4' }), arch([0.6, 0.9], 9, { gate: true, frame: '#2a2a2a', ring: '#e8e4d0' })],
  }),
  house({
    name: 'Szkoła zielona', mid: [-3973, 3094], wall: '#a8b490', base: '#8a9478', g: 66, n: 3, w: 8.5, trim: '#d8d8c4', axes: ax(5, 0.1, 0.9), len: 114,
    balconies: [[1, 0.4, 0.55, 10, true]],
    ground: [arch([0.45, 0.55], 8, { frame: '#f4f2ec', ring: '#d8d8c4' }), arch([0.62, 0.72], 8, { frame: '#f4f2ec', ring: '#d8d8c4' }), arch([0.78, 0.88], 8, { frame: '#f4f2ec', ring: '#d8d8c4' })],
  }),
  house({
    // narożnik w beżowym tynku z bujnymi kwiatami na balkonie
    name: 'Beżowy narożnik', mid: [-3870, 2978], wall: '#d8cc9c', base: '#c8bc8c', g: 66, n: 3, w: 8, trim: '#e8dcb8', axes: [0.4], len: 64, stains: true,
    balconies: [[1, 0.1, 0.9, 10, true]],
  }),
  house({
    // ciemnoszara okopcona kamienica z zieloną bramą, balkonami z kutymi balustradami
    name: 'Ciemna z zieloną bramą', mid: [-3861, 3201], wall: '#605c56', base: '#4a8a6a', g: 66, n: 4, w: 8.5, trim: '#74706a', axes: ax(7, 0.06, 0.94), len: 197, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.2, 0.4, 10, true], [2, 0.6, 0.8, 10, true]],
    ground: [arch([0.4, 0.55], 9, { gate: true, frame: '#2a6a4a', ring: '#4a8a6a' })],
  }),
  house({
    // ciemnoszara okopcona kamienica z wykuszami i odpadającym tynkiem
    name: 'Ciemna z wykuszami', mid: [-3722, 3350], wall: '#6a665e', base: '#58544c', g: 66, n: 4, w: 8.5, trim: '#7a766e', axes: ax(6, 0.08, 0.92), len: 211, stains: true, rustic: [[0, 64]],
    balconies: [[2, 0.55, 0.8, 10, true]],
  }),
  house({
    // pawilon komputerowy z żółtym daszkiem i dużą witryną
    name: 'Pawilon komputerowy 1', mid: [-3574, 3295], wall: '#d8c880', base: '#c8b868', g: 40, n: 1, w: 6, trim: '#e8d898', axes: [0.5], len: 40,
    ground: [shop([0.1, 0.9], '#f4f2ec')],
  }),
  house({
    name: 'Pawilon komputerowy 2', mid: [-3534, 3306], wall: '#d8c880', base: '#c8b868', g: 40, n: 1, w: 6, trim: '#e8d898', axes: [0.5], len: 30,
    ground: [shop([0.1, 0.9], '#f4f2ec')],
  }),
  house({
    // ciemna kamienica z jasnym boniowanym parterem, ceglaste obramienia okien
    name: 'Ciemna z jasnym parterem', mid: [-3519, 3571], wall: '#6a665e', base: '#c4beb2', g: 66, n: 4, w: 8.5, trim: '#7a766e', axes: ax(8, 0.04, 0.96), len: 389, stains: true,
    ground: [shop([0.2, 0.3], '#a8402a'), shop([0.55, 0.65], '#a8402a'), arch([0.78, 0.88], 8, { gate: true, frame: '#3a2a1a', ring: '#c4beb2' }), door([0.92, 0.98], { frame: '#6a3a1a' })],
  }),
  house({
    // szary okopcony front ze sklepem i szyldem ubezpieczeń
    name: 'Szara ze sklepem', mid: [-3502, 3371], wall: '#8a867e', base: '#a8a49c', g: 66, n: 3, w: 7.5, trim: '#a0a098', axes: ax(3, 0.2, 0.9), len: 66, stains: true,
    ground: [shop([0.05, 0.4], '#8a4a1a'), shop([0.5, 0.95], '#f4f2ec')],
  }),
  house({
    // różowy parter z łukowym oknem i drewnianymi drzwiami, beżowe piętra z balkonami
    name: 'Różowy parter', mid: [-3399, 3484], wall: '#c8b890', base: '#c0a8a8', g: 66, n: 4, w: 8.5, trim: '#d8ccaa', axes: ax(5, 0.08, 0.92), len: 240, stains: true,
    balconies: [[2, 0.7, 0.95, 10, true]],
    ground: [arch([0.05, 0.3], 8, { frame: '#5a3a1a', ring: '#c0a8a8' })],
  }),
  house({
    // kamienna kaplica: kamienne obramienie łuku wejścia i ściana w piaskowym tynku
    name: 'Kaplica z kamiennym łukiem', mid: [-7076, 716], wall: '#a89478', base: '#8a7860', g: 56, n: 3, w: 7, trim: '#b8a488', axes: [0.2], len: 133, stains: true,
    ground: [arch([0.2, 0.95], 8, { frame: '#4a3a2a', ring: '#7a6a58' })],
  }),
  house({
    // pięciokondygnacyjny blok z niebieskimi pasami i balkonami
    name: 'Blok z niebieskimi pasami', mid: [-6988, 546], wall: '#d8d0a8', base: '#c0b890', g: 56, n: 5, w: 9, trim: '#8a9ab8', axes: ax(8, 0.05, 0.95), len: 276,
    balconies: [[1, 0.1, 0.9, 6, false], [3, 0.1, 0.9, 6, false]],
  }),
  house({
    // wysoka szara ściana szczytowa z garażem
    name: 'Szara ściana z garażem', mid: [-6841, 836], wall: '#b0aca6', base: '#8a8a60', g: 40, n: 4, w: 7, trim: '#c0bcb6', axes: [0.5], len: 50, stains: true,
  }),
  house({
    // zrujnowana kamienica z bramą w łuku, boniowanym parterem i balkonami
    name: 'Zrujnowana z bramą', mid: [-6692, 888], wall: '#9a9078', base: '#7a7060', g: 66, n: 4, w: 8.5, trim: '#aaa088', axes: ax(5, 0.08, 0.92), len: 231, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.15, 0.55, 10, true], [2, 0.8, 0.98, 10, true]],
    ground: [arch([0.65, 0.88], 9, { gate: true, frame: '#2a2a2a', ring: '#aaa088' })],
  }),
  house({
    // jasnoszara kamienica z bramą, balkony z kutymi balustradami, dużo ozdób
    name: 'Jasnoszara z bramą', mid: [-6622, 774], wall: '#b8b4a8', base: '#8a8478', g: 66, n: 4, w: 8.5, trim: '#d0ccc0', axes: ax(7, 0.05, 0.95), len: 215, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.15, 0.3, 10, true], [2, 0.4, 0.6, 10, true], [1, 0.7, 0.85, 10, true]],
    ground: [arch([0.4, 0.6], 9, { gate: true, frame: '#2a2a2a', ring: '#d0ccc0' })],
  }),
  house({
    // ciemnofioletowo-brązowa okopcona kamienica z przejazdem bramnym
    name: 'Ciemna z przejazdem', mid: [-6488, 1008], wall: '#6a5a58', base: '#585050', g: 66, n: 4, w: 8.5, trim: '#7a6e6a', axes: ax(5, 0.05, 0.95), len: 242, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.0, 0.3, 10, true], [1, 0.7, 1, 10, true]],
    ground: [arch([0.4, 0.6], 9, { gate: true, frame: '#2a2a2a', ring: '#8a8078' })],
  }),
  house({
    // szara okopcona kamienica z balkonami, brama i boniowany parter
    name: 'Szara z balkonami', mid: [-6441, 880], wall: '#b0aca0', base: '#8a8478', g: 66, n: 4, w: 8.5, trim: '#c8c4b8', axes: ax(6, 0.05, 0.95), len: 207, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.1, 0.4, 10, true], [2, 0.5, 0.75, 10, true], [3, 0.3, 0.5, 10, true]],
    ground: [arch([0.4, 0.55], 9, { gate: true, frame: '#2a2a2a', ring: '#c8c4b8' })],
  }),
  house({
    // pięciokondygnacyjny blok w beżu i łososiu z balkonami
    name: 'Blok beżowo-łososiowy', mid: [-6278, 977], wall: '#d8c8a0', base: '#d89a78', g: 66, n: 5, w: 9, trim: '#e8dcb8', axes: ax(7, 0.05, 0.95), len: 173,
    balconies: [[1, 0.5, 0.9, 6, true], [2, 0.5, 0.9, 6, true], [3, 0.5, 0.9, 6, true]],
  }),
  house({
    // kamienica z bramą w ceglanym łuku, tynkowane gzymsy, balkony
    name: 'Kamienica z ceglaną bramą', mid: [-6076, 1255], wall: '#a89a7c', base: '#8a7a60', g: 66, n: 4, w: 8.5, trim: '#baae94', axes: ax(7, 0.05, 0.95), len: 242, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.1, 0.35, 10, true], [2, 0.6, 0.85, 10, true]],
    ground: [arch([0.4, 0.55], 9, { gate: true, frame: '#2a2a2a', ring: '#b88060' }), shop([0.82, 0.96], '#f4f2ec')],
  }),
  house({
    // tył kamienicy za murkiem, okna z odpadającym tynkiem
    name: 'Tył kamienicy', mid: [-5958, 1328], wall: '#b8b09a', base: '#a8a088', g: 66, n: 3, w: 8, trim: '#c8c0aa', axes: ax(2, 0.1, 0.9), len: 35, stains: true,
  }),
  house({
    name: 'Tył kamienicy 2', mid: [-5823, 1441], wall: '#b8b09a', base: '#a8a088', g: 66, n: 3, w: 8, trim: '#c8c0aa', axes: ax(3, 0.1, 0.9), len: 81, stains: true,
  }),
  house({
    // dom z cegłą klinkierową i kremowym tynkiem, żaluzje w oknach
    name: 'Dom ceglano-kremowy', mid: [-5767, 1500], wall: '#e0d4a8', base: '#9a4a3a', g: 56, n: 2, w: 7, trim: '#f0e8c8', axes: ax(2, 0.2, 0.8), len: 74,
  }),
  house({
    // jasnokremowa kamienica z sztukateriami, sklepy w parterze, balkony z kutymi balustradami
    name: 'Kremowa ze sklepami', mid: [-5514, 1369], wall: '#e8e4d4', base: '#d8d2bc', g: 66, n: 3, w: 8.5, trim: '#f4f0e0', axes: ax(7, 0.05, 0.95), len: 197, rustic: [[0, 64]],
    balconies: [[1, 0.6, 0.85, 10, true]],
    ground: [shop([0.02, 0.18], '#a8503a'), shop([0.22, 0.34], '#a8503a'), door([0.4, 0.46], { frame: '#1a1a2a' }), shop([0.62, 0.72], '#a8503a'), shop([0.78, 0.9], '#a8503a')],
  }),
];
