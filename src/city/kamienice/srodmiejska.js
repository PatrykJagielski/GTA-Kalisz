import { nr } from './zamkowa-kit.js';

/* ---------- ulica Śródmiejska: pierwsze ok. 170 m od Rynku (dalsza część ulicy poza listą frontów) ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację
// (pierzeja NW = prawa strona, idąc od Rynku, pierzeja SE = lewa); `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 100;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const wallPlate = (x, y, t) => nr(x, y, t);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });
const sign = (x, y, bg, fg, text, font = '700 {}px Arial, sans-serif') => ({ x, y, bg, fg, font, lines: [[text, 0.62, 0.55]] });

// n pięter okien nad parterem o wysokości g (dm); frame = kolor ram okien; o = dodatki okien
function house({ name, mid, wall, base = null, g = 54, n = 4, w = 9, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}
const ACC = ['#4a3a2a', '#1f3a52', '#2a2a2a'];

export const SRODMIEJSKA = [
  house({
    // biała kamienica z kutymi balkonami, parter z łukowymi oknami
    name: 'Biała z balkonami', mid: [-798, 322], wall: '#ebe7de', base: '#d4d0c4', g: 56, n: 4, w: 8.5, hood: 'hood', axes: ax(9, 0.03, 0.97), len: 268,
    balconies: [[0, 0.4, 0.5, 8, true], [1, 0.4, 0.5, 8, true], [2, 0.4, 0.5, 8], [0, 0.12, 0.22, 8, true], [2, 0.12, 0.22, 8, true]],
    ground: [arch([0.04, 0.12], 4, { frame: ACC[0] }), arch([0.2, 0.28], 4, { frame: ACC[0] }), arch([0.36, 0.44], 4, { frame: ACC[0] }), arch([0.52, 0.6], 4, { frame: ACC[0] }), arch([0.7, 0.78], 4, { frame: ACC[0] })],
  }),
  house({
    // jasna z naczółkami, kute balkony; parter: salon sukien i dwie witryny
    name: 'Salon sukien', mid: [-922, 231], wall: '#e9e6df', base: '#dcd8cc', g: 56, n: 4, w: 8.5, hood: 'hood', axes: [0.16, 0.4, 0.64, 0.88], len: 124,
    balconies: [[1, 0.5, 0.82, 9, true], [3, 0.5, 0.82, 9, true]],
    ground: [shop([0.04, 0.3], '#2a2a2a'), { k: 'door', x: [0.38, 0.5], y: [3, 40] }, shop([0.6, 0.74], '#2a2a2a'), shop([0.84, 0.97], '#2a2a2a')],
  }),
  house({
    // różowobrązowa z dwoma okazałymi kutymi balkonami; łukowe wejście i turkusowy szyld „Usługi krawieckie u Elizy”
    name: 'U Elizy', mid: [-1008, 304], wall: '#d8b0a0', base: '#e2dcd0', g: 56, n: 4, w: 8.5, trim: '#b5604e', axes: [0.26, 0.66], len: 101,
    balconies: [[1, 0.12, 0.62, 10, true], [3, 0.12, 0.62, 10, true]],
    ground: [arch([0.16, 0.28], 5, { door: true, frame: '#8a2a2a', ring: '#efe8da' }), shop([0.44, 0.97], '#2a6a8a')],
    signs: [{ x: [0.42, 0.98], y: [44, 54], bg: '#3aa9d8', fg: '#ffffff', font: '700 {}px Arial, sans-serif', lines: [['USŁUGI KRAWIECKIE', 0.36, 0.3], ['U ELIZY', 0.4, 0.74]] }, wallPlate(0.34, 40, '7')],
  }),
  house({
    // biała, okna w brązowych ramach, dwa balkony z jasną balustradą; parter: bistro pod czarną markizą
    name: 'Bistro', mid: [-1070, 358], wall: '#efeeea', base: null, g: 56, n: 4, w: 8.5, frame: '#8a4a2a', axes: [0.32, 0.76], len: 65,
    balconies: [[3, 0.36, 0.96, 8], [1, 0.5, 0.98, 8]],
    ground: [shop([0.04, 0.96], '#2a2a2a')],
    awnings: [[0.0, 1.0, 46, 12, '#1c1b1a']],
    signs: [{ x: [0.14, 0.24], y: [30, 38], bg: '#7a1d24', fg: '#f4efe6', lines: [['Bistro', 0.5, 0.5]] }],
  }),
  house({
    // ciemna, okopcona kamienica z okrągłymi balkonami i zielonymi ramami okien; parter z Trafiką pod łukami
    name: 'Trafika', mid: [-1010, 508], wall: '#6f665a', base: '#8c857a', g: 60, n: 4, w: 8.5, hood: 'hood', frame: '#3a5a3a', trim: '#8a7f70', axes: ax(9, 0.03, 0.97), len: 296, stains: true,
    balconies: [[1, 0.3, 0.42, 9, true], [2, 0.3, 0.42, 9], [1, 0.62, 0.74, 9, true], [3, 0.62, 0.74, 9], [2, 0.8, 0.92, 9, true]],
    ground: [arch([0.03, 0.14], 7, { frame: '#2a2a2a', ring: '#9a9286' }), arch([0.4, 0.46], 5, { frame: '#5a3a22', ring: '#9a9286' }), arch([0.5, 0.56], 5, { frame: '#5a3a22', ring: '#9a9286' }),
      arch([0.62, 0.67], 4, { door: true, frame: '#4a2a1a', ring: '#9a9286' }), arch([0.74, 0.8], 5, { frame: '#5a3a22', ring: '#9a9286' })],
    signs: [{ x: [0.2, 0.36], y: [46, 52], bg: '#c8452a', fg: '#f6efe0', font: '800 {}px Arial, sans-serif', lines: [['TRAFIKA', 0.7, 0.52]] }],
  }),
  house({
    // oliwkowa z naczółkami i balkonem z kwiatami; parter ochrowy z witryną i ciemnymi drzwiami
    name: 'Oliwkowa', mid: [-1139, 424], wall: '#b8bb9b', base: '#cc9c58', g: 56, n: 4, w: 8.5, hood: 'hood', axes: [0.14, 0.4, 0.66, 0.9], len: 125,
    balconies: [[0, 0.4, 0.76, 10, true], [2, 0.4, 0.76, 9, true]],
    ground: [shop([0.04, 0.32], '#4a3a2a'), { k: 'door', x: [0.42, 0.54], y: [3, 42] }, shop([0.66, 0.92], '#4a3a2a')],
    awnings: [[0.64, 0.94, 46, 7, '#5a5a4a']],
  }),
  house({
    // secesyjna: kremowa ze sztukateriami, balkon z kutą balustradą i okna z półkolistymi szczytami
    name: 'Secesyjna', mid: [-1211, 490], wall: '#e2d7b8', base: '#d8cba8', g: 60, n: 3, w: 8, trim: '#efe6cf', axes: [0.26, 0.74], len: 71,
    balconies: [[1, 0.16, 0.86, 10, true]],
    ground: [{ k: 'door', x: [0.1, 0.4], y: [3, 42] }, shop([0.55, 0.92], '#5a3a22')],
  }),
  house({
    // kremowa na rogu Grodzkiej: łukowe arkady z ogródkiem restauracji, na piętrach dwa kute balkony
    name: 'Żywiec', mid: [-1180, 664], wall: '#e4dcc6', base: '#e6e2d4', g: 62, n: 4, w: 8.5, hood: 'hood', axes: ax(5, 0.04, 0.96), len: 165,
    balconies: [[1, 0.36, 0.64, 9, true], [2, 0.36, 0.64, 9, true]], strips: [[0.93, 1]], stripY0: 64,
    ground: [arch([0.04, 0.18], 8, { frame: '#5a3e24', ring: '#f0ecde' }), arch([0.28, 0.44], 8, { frame: '#5a3e24', ring: '#f0ecde' }), arch([0.52, 0.7], 8, { frame: '#5a3e24', ring: '#f0ecde' }), arch([0.78, 0.9], 8, { frame: '#5a3e24', ring: '#f0ecde' })],
    signs: [{ x: [0.04, 0.9], y: [47, 53], bg: '#e8c868', fg: '#6a3a1a', font: '700 {}px Georgia, serif', lines: [['żywiec', 0.7, 0.52]] }],
    cafe: [0.0, 0.9],
  }),
  house({
    // narożna bladozielona, cztery piętra; parter z kilkoma witrynami sklepów i schodkami
    name: 'Bladozielona narożna', mid: [-1308, 586], wall: '#b7c9be', base: '#9fb0a4', g: 56, n: 4, w: 8.5, axes: ax(7, 0.03, 0.97), len: 202,
    ground: [shop([0.04, 0.14], '#5a4a3a'), shop([0.22, 0.38], '#5a4a3a'), { k: 'door', x: [0.44, 0.5], y: [3, 42] }, shop([0.58, 0.76], '#5a4a3a'), shop([0.82, 0.96], '#5a4a3a')],
    signs: [sign([0.24, 0.36], [43, 48], '#2e7d32', '#ffffff', 'TRUC')],
  }),
  house({
    // pudroworóżowa, okna w brązowych ramach, dwa szare balkony; parter z żaluzjami i witryną
    name: 'Różowa', mid: [-1316, 816], wall: '#d4b0aa', base: '#d9b9b0', g: 56, n: 4, w: 8.5, frame: '#6a3f2a', axes: [0.2, 0.56, 0.86], len: 83,
    balconies: [[3, 0.4, 0.95, 9, true], [1, 0.35, 0.95, 9]],
    ground: [shop([0.06, 0.52], '#6a3f2a'), { k: 'door', x: [0.58, 0.68], y: [3, 42] }, shop([0.74, 0.98], '#6a3f2a')],
    signs: [wallPlate(0.06, 44, '1')],
  }),
  house({
    // brązoworóżowa z białymi lizenami, długi balkon z jasną balustradą; kancelaria adwokacka i bank
    name: 'Santander', mid: [-1444, 734], wall: '#a8837a', base: '#e4c580', g: 56, n: 3, w: 8.5, frame: '#7a3a22', trim: '#f0eeea', axes: [0.2, 0.5, 0.8], len: 64,
    strips: [[0.34, 0.4], [0.62, 0.68]], stripY0: 58,
    balconies: [[0, 0.1, 0.95, 9]],
    ground: [shop([0.04, 0.96], '#3a3a3a')],
    signs: [sign([0.04, 0.96], [64, 70], '#2f8466', '#ffffff', 'KANCELARIA ADWOKACKA'), sign([0.1, 0.9], [44, 50], '#f0dfae', '#c4202c', 'Santander Consumer Bank')],
  }),
  house({
    // różowa z kremowymi sztukateriami i medalionami, dwa kute balkony; parter: Rossmann w łuku i wejście z czarną markizą
    name: 'Rossmann', mid: [-1368, 880], wall: '#e7bfb0', base: '#e0aa98', g: 58, n: 3, w: 8.5, hood: 'hood', trim: '#f3e8da', axes: [0.2, 0.52, 0.84], len: 82,
    balconies: [[1, 0.1, 0.5, 9, true], [1, 0.6, 1.0, 9, true]], medallions: [0.34, 0.7], medY: 108, medColor: '#f3e8da',
    ground: [arch([0.04, 0.3], 5, { door: true, frame: '#8a5a2a' }), arch([0.44, 0.96], 10, { frame: '#b8452a' })],
    awnings: [[0.02, 0.32, 54, 8, '#1c1b1a']],
    signs: [{ x: [0.46, 0.94], y: [44, 52], bg: '#f4eadb', fg: '#c8202a', font: '800 {}px Arial, sans-serif', lines: [['ROSSMANN', 0.66, 0.52]] }],
  }),
  house({
    // kremowobiała z kutym balkonem; łukowe wejście z numerem 17 i sklep Joker z czerwonym szyldem
    name: 'Joker', mid: [-1488, 789], wall: '#ebe5d6', base: '#e8e2d2', g: 56, n: 4, w: 9, hood: 'hood', axes: [0.26, 0.62], len: 76,
    balconies: [[3, 0.16, 0.62, 9, true]],
    ground: [arch([0.05, 0.22], 5, { door: true, frame: '#7a3a22', ring: '#f1ece0' }), shop([0.3, 0.7], '#7a3a22', { sign: { bg: '#1c1c1c', fg: '#f2b632', font: '800 {}px Arial, sans-serif', lines: [['JOKER', 0.7, 0.5]] } }), { k: 'door', x: [0.8, 0.92], y: [3, 40] }],
    signs: [wallPlate(0.25, 43, '17')],
  }),
  house({
    // miętowa, okna w białych opaskach z naczółkami, zielone balkony; wielki łukowy salon gier i łukowa brama
    name: 'Salon gier', mid: [-1414, 944], wall: '#9bc0a2', base: '#8cb596', g: 56, n: 3, w: 9, hood: 'hood', trim: '#f2f0e6', axes: [0.25, 0.7], len: 76,
    balconies: [[2, 0.1, 0.5, 8, true]],
    ground: [arch([0.12, 0.62], 10, { frame: '#2a2a2a', ring: '#eeeadd' }), arch([0.7, 0.9], 6, { door: true, frame: '#4a2a1a', ring: '#eeeadd' })],
    signs: [{ x: [0.24, 0.52], y: [30, 40], bg: '#f2ede2', fg: '#c0392b', lines: [['Salon gier', 0.3, 0.5]] }],
  }),
  house({
    // żółta z białymi lizenami, aptekarski krzyż; środkowe drewniane wejście z portalem, dwie witryny
    name: 'Apteka żółta', mid: [-1541, 870], wall: '#efd35c', base: '#efd98a', g: 58, n: 4, w: 8.5, frame: '#6a3a22', trim: '#f6f4ec', axes: ax(5, 0.06, 0.94), len: 118,
    strips: [[0.0, 0.07], [0.37, 0.45], [0.66, 0.74]], stripY0: 60,
    balconies: [[1, 0.06, 0.34, 8, true], [2, 0.44, 0.58, 8, true], [1, 0.62, 0.94, 8, true]],
    ground: [shop([0.07, 0.34], '#6a3a22'), arch([0.46, 0.56], 4, { door: true, frame: '#6a3a22', ring: '#f6f4ec' }), shop([0.62, 0.92], '#6a3a22')],
    signs: [{ x: [0.04, 0.3], y: [46, 52], bg: '#f2f2ee', fg: '#2f8a3a', font: '800 {}px Arial, sans-serif', lines: [['apteka', 0.7, 0.52]] }],
  }),
  house({
    // kremowa z karminowymi lizenami i pasami pod oknami; sklep Radomski w różowym łukowym portalu
    name: 'Radomski', mid: [-1453, 1015], wall: '#e8e2d4', base: '#e6dccf', g: 58, n: 3, w: 8.5, hood: 'hood', trim: '#f2eee6', axes: [0.22, 0.5, 0.8], len: 86,
    strips: [[0.0, 0.05], [0.95, 1]], stripY0: 60, panels: [[0, 0.05, '#c4687a', 0, 200], [0.95, 1, '#c4687a', 0, 200]],
    balconies: [[2, 0.55, 0.95, 8, true]],
    ground: [arch([0.08, 0.24], 5, { door: true, frame: '#4a2a1a', ring: '#d98a98' }), arch([0.32, 0.7], 5, { frame: '#a2505a', ring: '#d98a98' }), arch([0.78, 0.95], 5, { door: true, frame: '#f2efe6', ring: '#d98a98' })],
    signs: [{ x: [0.36, 0.66], y: [46, 51], fg: '#6a6a6a', font: '600 {}px Georgia, serif', lines: [['RADOMSKI', 0.8, 0.5]] }],
  }),
  house({
    // różowobeżowa z wykuszem; sklep Bolero
    name: 'Bolero', mid: [-1482, 1074], wall: '#d9c0b4', base: '#d4b8aa', g: 56, n: 3, w: 8, axes: [0.3, 0.74], len: 45,
    ground: [shop([0.06, 0.8], '#6a3f2a')],
    signs: [{ x: [0.1, 0.5], y: [44, 50], bg: '#f2eee6', fg: '#1f2f7a', font: '700 {}px Georgia, serif', lines: [['bolero', 0.7, 0.5]] }],
  }),
  house({
    // kremowozielona: oliwkowy parter z łukowymi wejściami (restauracja) i witryną
    name: 'Oliwkowy parter', mid: [-1593, 958], wall: '#e0dbc5', base: '#a7b786', g: 58, n: 3, w: 8.5, hood: 'hood', frame: '#6a3a22', axes: [0.2, 0.5, 0.8], len: 86,
    ground: [arch([0.04, 0.18], 5, { door: true, frame: '#3a2a22', ring: '#efe9d4' }), shop([0.28, 0.78], '#6a3a22'), arch([0.84, 0.97], 4, { frame: '#6a3a22', ring: '#efe9d4' })],
    signs: [wallPlate(0.2, 44, '21')],
  }),
  house({
    // różowobeżowa z szerokim gzymsem-wykuszem; sklep Linia Mody i ciemne drzwi
    name: 'Linia Mody', mid: [-1508, 1126], wall: '#d9bfb0', base: '#d4b5a5', g: 56, n: 3, w: 8.5, trim: '#f2ece2', axes: ax(4, 0.1, 0.9), len: 72,
    strips: [[0.0, 0.06], [0.45, 0.5]], stripY0: 58,
    balconies: [[2, 0.6, 0.98, 8, true]],
    ground: [shop([0.08, 0.6], '#3a2a22'), { k: 'door', x: [0.7, 0.82], y: [3, 42] }],
    signs: [{ x: [0.12, 0.54], y: [44, 51], bg: '#f2ebe0', fg: '#2a2a2a', round: true, font: 'italic 700 {}px Georgia, serif', lines: [['linia MODY', 0.5, 0.5]] }],
  }),
  house({
    // różowoszara, pilastry, drewniane drzwi w portalu z gzymsem (nr 14) i małe okno
    name: 'Portal 14', mid: [-1531, 1180], wall: '#d2b8ac', base: '#cfb2a4', g: 56, n: 3, w: 8, axes: [0.3, 0.74], len: 45,
    ground: [shop([0.1, 0.3], '#3a3a3a'), { k: 'door', x: [0.42, 0.68], y: [3, 42] }],
    signs: [wallPlate(0.72, 40, '14')],
  }),
  house({
    // biała odnowiona, czarne kute balkony na II i IV piętrze; FOTO, drzwi i butik Golden Lady
    name: 'Golden Lady', mid: [-1638, 1050], wall: '#f0ece0', base: '#e4dccb', g: 56, n: 4, w: 8.5, hood: 'hood', axes: ax(4, 0.12, 0.88), len: 120,
    balconies: [[1, 0.28, 0.62, 9, true], [3, 0.28, 0.62, 9, true]],
    ground: [shop([0.04, 0.28], '#e8508a', { sign: { bg: '#f4f2ec', fg: '#e8508a', font: '800 {}px Arial, sans-serif', lines: [['FOTO', 0.6, 0.5]] } }), { k: 'door', x: [0.35, 0.45], y: [3, 42] },
      shop([0.52, 0.78], '#5a3a22', { sign: { bg: '#1c1c1c', fg: '#d9b45a', lines: [['BUTIK GOLDEN LADY', 0.2, 0.5]] } })],
  }),
  house({
    // ciemna, zakopcona, balkon z kutą balustradą; sklep Geers (aparaty słuchowe) w trzech witrynach
    name: 'Geers', mid: [-1560, 1246], wall: '#7a7872', base: '#8d8c88', g: 58, n: 3, w: 8.5, hood: 'hood', frame: '#4a3a2a', axes: [0.2, 0.5, 0.8], len: 99, stains: true,
    balconies: [[1, 0.5, 0.92, 9, true]],
    ground: [shop([0.04, 0.38], '#5a2f22'), shop([0.46, 0.7], '#5a2f22'), shop([0.8, 0.97], '#5a2f22')],
    signs: [{ x: [0.04, 0.42], y: [46, 52], bg: '#76c043', fg: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['GEERS', 0.7, 0.5]] }],
  }),
  house({
    // szarozielona w rusztowaniu: remont kamienicy, parter z witryną
    name: 'Rusztowanie', mid: [-1686, 1164], wall: '#a0a898', base: '#98a090', g: 56, n: 4, w: 8.5, axes: ax(5, 0.08, 0.92), len: 127,
    ground: [shop([0.1, 0.5], '#4a4a3a'), { k: 'door', x: [0.6, 0.7], y: [3, 42] }],
  }),
  house({
    // karmelowobeżowa narożnik: duże witryny w białych opaskach, szklane drzwi, tabliczka 16; okna z naczółkami, balkon po prawej
    name: 'Beżowa narożna', mid: [-1657, 1472], wall: '#e0c6a0', base: '#d9b995', g: 66, n: 3, w: 9, trim: '#f4eee6', frame: '#f6f2ea', axes: ax(7, 0.06, 0.94), len: 199,
    balconies: [[1, 0.62, 0.94, 8, true]],
    ground: [shop([0.06, 0.22], '#4a3a2a'), { k: 'door', x: [0.36, 0.5], y: [3, 46] }, shop([0.56, 0.62], '#4a3a2a'), shop([0.68, 0.74], '#4a3a2a'), shop([0.8, 0.9], '#4a3a2a')],
    signs: [wallPlate(0.05, 48, '16')],
  }),
  house({
    // łososiowa z kremowymi opaskami i długim kutym balkonem; Albas second hand w czerwonym parterze
    name: 'Albas', mid: [-1772, 1360], wall: '#e0907a', base: '#b85a42', g: 58, n: 3, w: 8.5, trim: '#f1e6d0', axes: [0.2, 0.6], len: 78,
    balconies: [[2, 0.1, 0.8, 9, true]],
    ground: [shop([0.06, 0.4], '#e8d8b8', { sign: { bg: '#f0e04a', fg: '#1a2a6a', font: '800 {}px Arial, sans-serif', lines: [['ALBAS', 0.5, 0.35], ['SECOND HAND', 0.2, 0.72]] } }), shop([0.5, 0.9], '#e8d8b8', { sign: { bg: '#f0e04a', fg: '#1a2a6a', font: '800 {}px Arial, sans-serif', lines: [['ALBAS', 0.5, 0.35], ['SECOND HAND', 0.2, 0.72]] } })],
  }),
  house({
    // szałwiowozielona z białymi lizenami i opaskami okien; Żabka w łukowej witrynie obok łukowych wejść
    name: 'Żabka', mid: [-1813, 1456], wall: '#a2c28a', base: '#9cbb85', g: 58, n: 3, w: 9, trim: '#f2f0e6', frame: '#f4f2ec', axes: ax(5, 0.06, 0.94), len: 130,
    strips: [[0.3, 0.36], [0.64, 0.7]], stripY0: 60,
    ground: [arch([0.08, 0.34], 6, { frame: '#6a3a22', ring: '#f2f0e6' }), arch([0.42, 0.56], 5, { door: true, frame: '#6a3a22', ring: '#f2f0e6' }), arch([0.62, 0.8], 5, { frame: '#6a3a22', ring: '#f2f0e6' }), shop([0.86, 0.96], '#6a3a22')],
    signs: [{ x: [0.4, 0.58], y: [44, 49], fg: '#5cb82a', font: '800 {}px Arial, sans-serif', z: 0.9, lines: [['żabka', 0.9, 0.5]] }],
  }),
];
