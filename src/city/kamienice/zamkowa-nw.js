import { bands3, floors3, nr } from './zamkowa-kit.js';

/* ---------- ulica Zamkowa, pierzeja północno-zachodnia (numery parzyste) od Rynku do placu św. Józefa ---------- */
// Według Street View (paź 2024). Lewy koniec frontu = strona Rynku.
const BLACK = { bg: '#1c1b1a', fg: '#f3efe6' };

export const ZAMKOWA_NW = [
  {
    // narożna z Kanonicką: kawiarnia Bussola (drzwi przy narożniku, ogródek), butik Passion pod markizą
    name: 'Bussola', mid: [160, -690], seed: 11, wall: '#d9cfae', base: null, groundTop: 52, trim: '#e8e0c8', frame: '#f2efe6', eave: 172,
    axes: [0.2, 0.5, 0.8],
    floors: [{ y: [62, 88], w: 10 }, { y: [100, 125], w: 10 }, { y: [140, 156], w: 7 }],
    bands: [[50, 54, 2.6], [130, 136, 2.4], [163, 167, 1.6], [167, 172, 4.4]],
    balconies: [[0, 0.36, 0.64, 11], [1, 0.36, 0.64, 9]],
    ground: [
      { k: 'arch', x: [0.03, 0.15], y: [3, 40], rise: 5, wood: true, frame: '#9a5a32' },
      { k: 'arch', x: [0.22, 0.43], y: [3, 40], rise: 7, door: true, frame: '#7a4a2a' },
      { k: 'arch', x: [0.6, 0.8], y: [3, 40], rise: 8, door: true, frame: '#f2efe6' },
    ],
    awnings: [[0.2, 0.45, 44, 10], [0.58, 0.82, 44, 7]],
    signs: [
      { x: 0.118, w: 2.6, y: [8, 34], bg: '#2a1d14', fg: '#f4ede0', font: '700 {}px Arial, sans-serif', lines: [...'BUSSOLA'].map((t, i) => [t, 0.11, 0.1 + i * 0.133]) },
      { x: [0.58, 0.82], y: [46, 51], fg: '#c4508a', font: 'italic 700 {}px Georgia, serif', lines: [['Passion', 0.95, 0.55]] },
      { x: [0.47, 0.56], y: [28, 34], bg: '#f3f1ec', fg: '#3a3a3a', border: '#8a8a8a', lines: [['PASSION PRET', 0.3, 0.33], ['VALENTINO', 0.3, 0.7]] },
    ],
    cafe: [0.02, 0.58],
  },
  {
    name: 'Zamkowa 2', mid: [238, -750], seed: 12, wall: '#e8efe6', base: '#b9c4bd', groundTop: 52, trim: '#f6f7f3', frame: '#f6f6f2', eave: 170,
    axes: [0.21, 0.51, 0.79],
    floors: floors3(10.5, { hood: 'hood' }), bands: bands3(2, 170), strips: [[0, 0.03], [0.97, 1]],
    balconies: [[0, 0.33, 0.69, 10], [1, 0.07, 0.35, 9], [1, 0.65, 0.93, 9]],
    ground: [
      { k: 'shop', x: [0.12, 0.35], y: [4, 42], frame: '#f0f0ee' },
      { k: 'shop', x: [0.45, 0.75], y: [4, 42], frame: '#f0f0ee', door: [0.46, 0.55] },
      { k: 'door', x: [0.84, 0.96], y: [3, 40] },
    ],
    signs: [nr(0.8, 43, '2')],
  },
  {
    // cukiernia Sowa i Centrum Tanich Podręczników w różowym parterze, brama z kratą
    name: 'Zamkowa 4', mid: [307, -802], seed: 13, wall: '#eeece6', base: '#d9b9bd', groundTop: 54, trim: '#f8f7f3', frame: '#f6f6f2', eave: 172,
    axes: [0.13, 0.37, 0.62, 0.86],
    floors: floors3(9.5, { hood: 'hood' }), bands: bands3(2.4),
    balconies: [[0, 0.02, 0.24, 9], [0, 0.52, 0.96, 11], [1, 0.02, 0.48, 11, true]],
    ground: [
      { k: 'arch', x: [0.02, 0.1], y: [3, 40], rise: 3, gate: true },
      { k: 'shop', x: [0.15, 0.36], y: [4, 42], frame: '#f2f2ee', sign: { bg: '#f4f2ec', fg: '#2a2a2a', lines: [['CENTRUM TANICH', 0.4, 0.3], ['PODRĘCZNIKÓW', 0.4, 0.72]] } },
      { k: 'shop', x: [0.4, 0.5], y: [4, 42], frame: '#f2f2ee', door: [0.4, 0.5], sign: { bg: '#f4f2ec', fg: '#2a2a2a', lines: [['CENTRUM', 0.4, 0.3], ['TANICH', 0.4, 0.72]] } },
      { k: 'shop', x: [0.55, 0.88], y: [4, 42], frame: '#c8c4be', door: [0.79, 0.88] },
    ],
    signs: [{ x: [0.55, 0.88], y: [44, 50], bg: '#5b3b2b', fg: '#f2e6d0', border: '#c9a77a', font: '600 {}px Georgia, serif', lines: [['CUKIERNIA  SOWA', 0.62, 0.55]] }, nr(0.92, 40, '4')],
  },
  {
    name: 'Zamkowa 6', mid: [374, -853], seed: 14, wall: '#bab3a2', base: '#efede8', groundTop: 52, trim: '#c9c3b3', frame: '#f4f4f0', eave: 170,
    axes: [0.14, 0.39, 0.61, 0.84],
    floors: floors3(9), bands: [[48, 54, 2.6], [90, 95, 2.2], [127, 131, 1.4], [161, 165, 1.6], [165, 170, 4]],
    ground: [
      { k: 'shop', x: [0.02, 0.15], y: [3, 40], frame: '#b05a2c', door: [0.02, 0.15] },
      { k: 'shop', x: [0.33, 0.65], y: [4, 38], frame: '#7a3a26' },
      { k: 'door', x: [0.81, 0.93], y: [3, 40] },
    ],
    signs: [{ x: [0.33, 0.66], y: [41, 45], bg: '#ddd2b4', fg: '#6a5530', border: '#8f7a52', font: '600 {}px Georgia, serif', lines: [['OTWARTA PRACOWNIA CERAMIKI', 0.6, 0.55]] }, nr(0.77, 38, '6')],
  },
  {
    // grafitowa, okna w brązowych ramach, na górze okna łukowe, balkony z pnączami
    name: 'Zamkowa 8', mid: [456, -913], seed: 15, wall: '#6a665e', base: '#9a9284', groundTop: 52, trim: '#9a958b', frame: '#5a3b2a', eave: 172,
    axes: [0.12, 0.3, 0.5, 0.7, 0.88],
    floors: [{ y: [62, 87], w: 9, hood: 'ear' }, { y: [99, 124], w: 9 }, { y: [137, 156], w: 8 }],
    bands: bands3(2.4),
    balconies: [[0, 0.56, 0.84, 9, true], [1, 0.56, 0.84, 9], [2, 0.8, 0.98, 8, true]],
    ground: [
      { k: 'door', x: [0.12, 0.23], y: [3, 40] },
      { k: 'shop', x: [0.31, 0.46], y: [4, 42], frame: '#5a3b2a', door: [0.31, 0.46] },
      { k: 'shop', x: [0.55, 0.8], y: [4, 42], frame: '#5a3b2a' },
      { k: 'shop', x: [0.84, 0.97], y: [4, 42], frame: '#5a3b2a' },
    ],
    signs: [nr(0.08, 40, '8')],
  },
  {
    name: 'Zamkowa 10', mid: [538, -969], seed: 16, wall: '#b8685c', base: '#c9705a', groundTop: 52, trim: '#c98174', frame: '#f4f4f0', eave: 170,
    axes: [0.23, 0.49, 0.77],
    floors: floors3(10), bands: bands3(2.2, 170),
    panels: [[0, 1, '#e3c9be', 130, 170]],                                               // jasny pas ostatniej kondygnacji
    ground: [
      { k: 'arch', x: [0.08, 0.62], y: [3, 44], rise: 12, door: true, frame: '#f4f4f0' },
      { k: 'arch', x: [0.75, 0.93], y: [3, 41], rise: 5, wood: true },
    ],
    signs: [nr(0.96, 36, '10')],
  },
  {
    // kremowa z białymi lizenami, zaokrąglony narożnik do Chodyńskiego; restauracja Pięterko
    name: 'Pięterko', mid: [624, -1024], seed: 17, wall: '#ebe5c9', base: null, groundTop: 52, trim: '#f7f5ec', frame: '#f4f2ea', eave: 175,
    axes: [0.08, 0.26, 0.43, 0.6, 0.78, 0.95],
    floors: [{ y: [64, 89], w: 9.5 }, { y: [101, 126], w: 9.5 }, { y: [139, 161], w: 9 }],
    bands: bands3(2.6, 175), stripY0: 53, strips: [[0.16, 0.18], [0.34, 0.36], [0.51, 0.53], [0.69, 0.71], [0.87, 0.89]],
    ground: [
      { k: 'arch', x: [0.02, 0.1], y: [3, 40], rise: 4, wood: true },
      { k: 'arch', x: [0.14, 0.24], y: [8, 40], rise: 5 },
      { k: 'shop', x: [0.32, 0.46], y: [3, 42], frame: '#6a3d26', door: [0.35, 0.43] },
      { k: 'shop', x: [0.55, 0.86], y: [10, 40], frame: '#6a3d26' },
    ],
    awnings: [[0.3, 0.48, 46, 8, '#e7e4dc']],
    signs: [
      { x: [0.57, 0.84], y: [33, 38], fg: '#b58e3f', font: '700 {}px Georgia, serif', z: 0.9, lines: [['RESTAURACJA PIĘTERKO', 0.8, 0.5]] },
      { x: [0.88, 0.97], y: [16, 32], bg: '#4f2d22', fg: '#f1e1c6', border: '#c69b5a', font: '600 {}px Georgia, serif', lines: [['Restauracja', 0.13, 0.2],
        ['PIĘTERKO', 0.15, 0.36], ['Zapraszamy', 0.12, 0.58], ['obiady', 0.1, 0.72], ['catering', 0.1, 0.86]] },
      nr(0.115, 42, '12'),
    ],
  },
  {
    // za Chodyńskiego: łososiowa z medalionami; sklep ukraiński (kwas chlebowy) i M&P Alkohole i Wina Świata
    name: 'Zamkowa 14', mid: [868, -1166], seed: 18, wall: '#e5bba9', base: '#c5917f', groundTop: 52, trim: '#efd3c6', frame: '#f6f4ef', eave: 170,
    axes: [0.07, 0.21, 0.36, 0.5, 0.64, 0.79, 0.93],
    floors: floors3(9, { hood: 'hood' }), bands: bands3(2.4, 170),
    medallions: [0.14, 0.29, 0.43, 0.57, 0.71, 0.86], medY: 131, medColor: '#f2dfd6',
    ground: [
      { k: 'shop', x: [0.04, 0.22], y: [4, 44], frame: '#2a2522', door: [0.11, 0.16] },
      { k: 'arch', x: [0.27, 0.4], y: [3, 42], rise: 7, door: true, frame: '#2a2522' },
      { k: 'arch', x: [0.45, 0.58], y: [3, 42], rise: 7, frame: '#2a2522' },
      { k: 'arch', x: [0.63, 0.72], y: [3, 40], rise: 4, wood: true },
      { k: 'arch', x: [0.8, 0.95], y: [3, 42], rise: 7, frame: '#2a2522' },
    ],
    signs: [
      { x: [0.04, 0.22], y: [44, 49.5], ...BLACK, font: '700 {}px Arial, sans-serif', lines: [['Ukrainoczka', 0.62, 0.55, '#f2d64a']] },
      { x: [0.05, 0.1], y: [10, 36], ...BLACK, lines: [['WĘDLINY', 0.06, 0.15], ['SŁODYCZE', 0.06, 0.32], ['KAWIOR', 0.06, 0.49], ['PIEROGI', 0.06, 0.66],
        ['KWAS', 0.07, 0.8], ['CHLEBOWY', 0.06, 0.91]] },
      { x: [0.26, 0.6], y: [45, 50.5], ...BLACK, font: '600 {}px Georgia, serif', lines: [['M&P  ALKOHOLE I WINA ŚWIATA', 0.6, 0.55]] },
    ],
  },
  {
    // wąska brązowa ze sztukatorskim fryzem; duża łukowa witryna z winami
    name: 'Zamkowa 16', mid: [1021, -1250], seed: 19, wall: '#8c5a4b', base: '#7a4c3f', groundTop: 52, trim: '#a87868', frame: '#f4f2ec', eave: 170,
    axes: [0.3, 0.7],
    floors: floors3(10), bands: [[48, 54, 2.6], [150, 160, 1.2], [163, 167, 1.6], [167, 170, 4]],
    balconies: [[0, 0.12, 0.88, 10], [1, 0.12, 0.88, 10]],
    ground: [{ k: 'arch', x: [0.1, 0.9], y: [3, 44], rise: 14, door: true, frame: '#2a2522' }],
    dentils: [158, 161],
  },
  {
    name: 'Buty Bucik', mid: [1124, -1307], seed: 20, wall: '#dcd6c6', base: '#e8e4d8', groundTop: 52, trim: '#efebe0', frame: '#f6f5f0', eave: 172,
    axes: [0.08, 0.28, 0.5, 0.72, 0.92],
    floors: floors3(9.5), bands: bands3(2.4),
    balconies: [[0, 0.3, 0.74, 10], [1, 0.62, 0.82, 9], [2, 0.0, 0.18, 8], [2, 0.62, 0.82, 8]],
    ground: [
      { k: 'door', x: [0.03, 0.12], y: [3, 40] },
      { k: 'shop', x: [0.17, 0.42], y: [4, 42], frame: '#5e3a28' },
      { k: 'shop', x: [0.47, 0.56], y: [3, 42], frame: '#5e3a28', door: [0.47, 0.56] },
      { k: 'shop', x: [0.6, 0.8], y: [4, 42], frame: '#5e3a28' },
      { k: 'shop', x: [0.85, 0.97], y: [4, 42], frame: '#5e3a28' },
    ],
    signs: [
      { x: [0.2, 0.39], y: [24, 30], fg: '#f4f4f4', font: '800 {}px Arial, sans-serif', z: 0.9, lines: [['BUTY BUCIKI', 0.85, 0.5]] },
      { x: [0.62, 0.78], y: [24, 30], fg: '#f4f4f4', font: '800 {}px Arial, sans-serif', z: 0.9, lines: [['BUTY BUCIKI', 0.85, 0.5]] },
      nr(0.135, 36, '18'),
    ],
  },
  {
    // biały gmach poczty (pięć kondygnacji) i szara modernistyczna kamienica na rogu placu
    name: 'Poczta Polska', mid: [1308, -1397], seed: 21, wall: '#f1f1ef', base: '#e9e8e3', groundTop: 52, trim: '#fbfbf9', frame: '#f6f6f2', eave: 190,
    axes: [0.04, 0.13, 0.22, 0.31, 0.4, 0.49, 0.6, 0.69, 0.78, 0.87, 0.96],
    floors: [{ y: [60, 82], w: 8.5 }, { y: [92, 114], w: 8.5 }, { y: [124, 146], w: 8.5 }, { y: [156, 176], w: 8 }],
    bands: [[48, 53, 2], [181, 185, 1.6], [185, 190, 4]],
    panels: [[0.55, 1, '#a9a598', -2, 190]],
    balconies: [[1, 0.65, 0.73, 7], [1, 0.82, 0.9, 7]],
    ground: [
      { k: 'shop', x: [0.02, 0.17], y: [3, 42], frame: '#4a4f55', door: [0.1, 0.17] },
      { k: 'shop', x: [0.21, 0.35], y: [8, 40], frame: '#4a4f55' },
      { k: 'shop', x: [0.39, 0.52], y: [8, 40], frame: '#4a4f55' },
      { k: 'shop', x: [0.58, 0.64], y: [10, 40], frame: '#f2f2ee' },
      { k: 'shop', x: [0.67, 0.79], y: [10, 40], frame: '#f2f2ee' },
      { k: 'shop', x: [0.83, 0.95], y: [10, 40], frame: '#f2f2ee' },
    ],
    signs: [{ x: [0.02, 0.3], y: [44, 50], bg: '#8f969c', fg: '#ffffff', font: '600 {}px Arial, sans-serif', lines: [['Poczta Polska', 0.62, 0.55]] }],
  },
];
