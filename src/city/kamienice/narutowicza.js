/* ---------- ulica Gabriela Narutowicza: cała ulica (134 m) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 900;
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

export const NARUTOWICZA = [
  house({
    // długa jasnozielonkawa z ciemnym cokołem, drewniane drzwi w portalu, balustrady pod oknami pierwszego piętra
    name: 'Zielonkawa z portalem', mid: [-2738, 874], wall: '#d9d8a8', base: '#4a4e52', g: 62, n: 3, w: 8, trim: '#ecebc8', axes: ax(7, 0.04, 0.96), len: 232,
    ground: [door([0.28, 0.35], { frame: '#9a5a2a' }), win([0.08, 0.16]), win([0.5, 0.62]), win([0.7, 0.8])],
  }),
  house({
    // modernistyczna z półokrągłym wykuszem, brązowy parter z pasmanterią
    name: 'Pasmanteria', mid: [-2528, 840], wall: '#e8d89a', base: '#7a6252', g: 62, n: 3, w: 8, trim: '#f2e8b8', axes: ax(3, 0.2, 0.9), len: 94,
    balconies: [[1, 0.5, 0.8, 8, true]],
    ground: [win([0.08, 0.2]), door([0.62, 0.78])],
    signs: [{ x: [0.4, 0.78], y: [44, 50], bg: '#f4f2ec', fg: '#b3392a', font: '700 {}px Arial, sans-serif', lines: [['PASMANTERIA', 0.1, 0.55]] }],
  }),
  house({
    // różowa z kwiecistą girlandą wokół łukowego wejścia i dwoma łukowymi oknami, balkony z kwiatami
    name: 'Różowa z łukami', mid: [-2506, 980], wall: '#efe4d6', base: '#e8c8b4', g: 66, n: 3, w: 8, trim: '#f8f2e8', axes: ax(3, 0.2, 0.9), len: 109,
    balconies: [[1, 0.5, 0.8, 9, true], [2, 0.5, 0.8, 9, true]],
    ground: [arch([0.08, 0.3], 8, { door: true, frame: '#3a2a1a', ring: '#f8f2e8' }), arch([0.4, 0.6], 8, { frame: '#3a2a1a', ring: '#f8f2e8' }), arch([0.72, 0.92], 8, { frame: '#3a2a1a', ring: '#f8f2e8' })],
  }),
  house({
    // kremowa z naczółkami i kutymi balkonami, dwa łukowe okna w parterze i brązowe cokoły
    name: 'Kremowa z balkonami', mid: [-2408, 895], wall: '#e4dcb8', base: '#5a3a30', g: 60, n: 3, w: 8, hood: 'hood', trim: '#f2ecd0', axes: ax(4, 0.1, 0.9), len: 172,
    balconies: [[1, 0.36, 0.7, 9, true], [2, 0.04, 0.2, 8, true]],
    ground: [win([0.06, 0.16], '#6a4a3a'), win([0.26, 0.36], '#6a4a3a'), door([0.5, 0.58], { frame: '#3a2a1a' })],
  }),
  house({
    // różowa z łukowymi witrynami Hermetic i kutymi balkonami, kremowe piętra
    name: 'Hermetic', mid: [-2232, 1106], wall: '#efe4d2', base: '#eac6b0', g: 66, n: 3, w: 8, hood: 'hood', trim: '#f8f2e8', axes: ax(3, 0.2, 0.9), len: 107,
    balconies: [[1, 0.36, 0.7, 9, true], [2, 0.36, 0.7, 9, true]],
    ground: [arch([0.08, 0.3], 8, { frame: '#2a2a2a', ring: '#f8f2e8' }), arch([0.38, 0.62], 9, { frame: '#2a2a2a', ring: '#f8f2e8' }), arch([0.7, 0.96], 9, { frame: '#2a2a2a', ring: '#f8f2e8' })],
    signs: [{ x: [0.2, 0.7], y: [50, 58], bg: '#eac6b0', fg: '#3a1a1a', font: '800 {}px Arial, sans-serif', lines: [['HERMETIC', 0.2, 0.55]] }],
  }),
  house({
    // zaokrąglona kamienica z kutymi balkonami i butikami (Tommy Hilfiger, Joop, Bugatti) w drewnianych ramach
    name: 'Butiki', mid: [-2096, 1168], wall: '#d6c8b0', base: '#d8b890', g: 66, n: 3, w: 8, hood: 'hood', trim: '#eadfc6', axes: ax(4, 0.1, 0.9), len: 192,
    balconies: [[0, 0.02, 0.28, 10, true], [1, 0.02, 0.28, 10, true], [1, 0.78, 0.98, 9, true]],
    ground: [shop([0.05, 0.2], '#c8641a'), shop([0.26, 0.4], '#c8641a'), shop([0.46, 0.6], '#c8641a'), shop([0.66, 0.8], '#c8641a'), shop([0.86, 0.98], '#c8641a')],
  }),
  house({
    // biała z szarym parterem: dwie czarne kute bramy i wjazd, okna z żaluzjami
    name: 'Z czarnymi bramami', mid: [-2027, 1074], wall: '#eaeae6', base: '#a8a8a0', g: 62, n: 3, w: 8, trim: '#d0d0c8', axes: ax(8, 0.04, 0.96), len: 418, stains: true,
    ground: [arch([0.08, 0.2], 9, { gate: true }), win([0.3, 0.38]), arch([0.7, 0.8], 9, { gate: true }), win([0.9, 0.96])],
  }),
  house({
    // trzy kamienice: żółta, czerwona i żółta, z sztukateriami nad oknami; czerwony boniowany parter z drewnianymi drzwiami
    name: 'Żółto-czerwone', mid: [-1883, 1266], wall: '#e0b04a', base: '#b84a40', g: 62, n: 3, w: 8, hood: 'hood', trim: '#f0dcc0', axes: ax(9, 0.03, 0.97), len: 277,
    ground: [win([0.04, 0.14], '#e8dcc0'), door([0.4, 0.5], { frame: '#6a3a1a' }), shop([0.66, 0.92], '#e8dcc0')],
  }),
  house({
    // kamienica w remoncie: rusztowanie, zielonkawy tynk, wejście z czerwonymi drzwiami i schodami
    name: 'W rusztowaniu', mid: [-1774, 1193], wall: '#bcc6b0', base: '#a8b0a0', g: 62, n: 3, w: 8, trim: '#d6dccc', axes: ax(5, 0.08, 0.92), len: 142, stains: true,
    ground: [win([0.1, 0.2], '#8a2a3a'), door([0.3, 0.38], { frame: '#8a1a3a' }), win([0.5, 0.64]), win([0.74, 0.9])],
  }),
];
