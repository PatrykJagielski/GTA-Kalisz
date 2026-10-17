/* ---------- ulica Sukiennicza: pierzeja SE od skrzyżowania z Rynkiem po ul. Łazienną, pierzeja NW od bloku przy Złotej po sklepy na rogu ---------- */
// Według Street View (lip 2024 i paź 2024). Format jak w marianska.js (pieces) i spec.js; poza tym:
//   U(w)     przelicza odległość od początku kawałka (dm) na ułamek jego szerokości, więc osie i otwory podaję w dm
//   rows     kolejne kondygnacje okien o tej samej szerokości
// Ułamki frontu liczone od lewego końca patrząc z ulicy: pierzeja SE zaczyna się od Rynku (NE), pierzeja NW od strony Łaziennej (SW).
const U = w => d => +(d / w).toFixed(3);
const piece = (w, mk) => [w, mk(U(w))];
const rows = (ys, w, o = {}) => ys.map(y => ({ y, w, ...o }));
const cornice = (eave, d = 4.2) => [[eave - 9, eave - 5, 1.6], [eave - 5, eave, d]];
const sans = '700 {}px Arial, sans-serif';
const serif = '700 {}px Georgia, serif';

export const SUKIENNICZA = [
  {
    // SE 1: narożna kamienica z Optykiem, od Rynku
    name: 'Sukiennicza SE 1', mid: [1209, 608],
    pieces: [piece(131, u => ({
      name: 'Narożna z kebabem', seed: 101, wall: '#b2a47c', base: '#8c8575', groundTop: 46, trim: '#d8d1bd', frame: '#e6e1d2', eave: 198,
      axes: [u(62)], floors: rows([[64, 90], [112, 139], [161, 183]], 14, { hood: 'hood' }),
      bands: [[48, 52, 2.6], ...cornice(198)], strips: [[u(113), u(128)]], stripY0: 52,
      ground: [{ k: 'shop', x: [u(48), u(70)], y: [4, 38], frame: '#7a4a2a' }],
      signs: [{ x: [u(40), u(96)], y: [37, 48], bg: '#e9e6dc', lines: [] }],
    }))],
  },
  {
    // SE 2: szary dom z pilastrami, balkonami i łukowymi witrynami (Sultan, sklep spożywczy, brama z numerem 2)
    name: 'Sukiennicza SE 2', mid: [1058, 786],
    pieces: [piece(338, u => ({
      name: 'Kamienica Sultan', seed: 102, wall: '#a69b80', base: '#827c6c', groundTop: 48, trim: '#c4bda9', frame: '#e8e4d8', eave: 198,
      axes: [19, 87, 126, 188, 241, 278, 314].map(u), floors: rows([[64, 89], [112, 139], [161, 183]], 14, { hood: 'hood' }),
      bands: [[48, 52, 2.8], [157, 161, 1.8], ...cornice(198)],
      strips: [[u(39), u(54)], [u(158), u(172)]], stripY0: 52,
      balconies: [[0, u(106), u(139), 11, true], [1, u(106), u(139), 11, true], [0, u(225), u(256), 11, true], [1, u(266), u(302), 11], [0, u(304), u(338), 10, true]],
      ground: [
        { k: 'shop', x: [u(3), u(40)], y: [4, 41], door: [u(8), u(26)], frame: '#7a2a24', sign: { bg: '#2b1d17', fg: '#e8d9b0', font: serif, lines: [['Sultan', 0.7, 0.5]] } },
        { k: 'arch', x: [u(55), u(82)], y: [3, 43], rise: 9, frame: '#6a3b24', ring: '#9b9482' },
        { k: 'arch', x: [u(83), u(104)], y: [2, 46], rise: 9, gate: true, ring: '#9b9482' },
        { k: 'arch', x: [u(118), u(156)], y: [3, 43], rise: 12, frame: '#4a3a2a', ring: '#9b9482' },
        { k: 'arch', x: [u(172), u(194)], y: [3, 43], rise: 9, wood: true, ring: '#9b9482' },
        { k: 'arch', x: [u(213), u(250)], y: [3, 43], rise: 12, frame: '#4a3a2a', ring: '#9b9482' },
        { k: 'arch', x: [u(264), u(286)], y: [3, 43], rise: 9, door: true, frame: '#7a4a2a', ring: '#9b9482' },
        { k: 'arch', x: [u(307), u(338)], y: [3, 43], rise: 9, frame: '#7a2a24', ring: '#9b9482' },
      ],
      signs: [{ x: [u(58), u(79)], y: [34, 41], bg: '#3a9a45', fg: '#f4f4f4', font: sans, z: 0.9, lines: [['od do', 0.6, 0.5]] }],
    }))],
  },
  {
    // SE 3: różowa kamienica z trzema kondygnacjami balkonów po bokach i pilastrami w osi
    name: 'Sukiennicza SE 3', mid: [831, 1054],
    pieces: [piece(225, u => ({
      name: 'Różowa z balkonami', seed: 103, wall: '#d1b8aa', base: '#a8716a', groundTop: 14, trim: '#efe7dc', frame: '#f4efe8', eave: 205,
      axes: [13, 59, 116, 168, 209].map(u),
      floors: [{ y: [18, 43], w: 17, at: [13, 59, 168, 209].map(u) }, ...rows([[64, 89], [108, 131], [155, 177]], 16, { hood: 'hood' })],
      bands: [[56, 60, 2], ...cornice(205)], strips: [[u(84), u(98)], [u(132), u(146)]], stripY0: 56,
      balconies: [[1, u(43), u(79), 11, true], [2, u(43), u(79), 11, true], [3, u(43), u(79), 11], [1, u(156), u(190), 11], [2, u(156), u(190), 11, true], [3, u(156), u(190), 11]],
      ground: [{ k: 'door', x: [u(106), u(124)], y: [3, 42] }],
    }))],
  },
  {
    // SE 4: od lewej dom z Don Kichotem i balkonem, wąska kamienica z bramą, bogata kamienica z naczółkami i tatuażem
    name: 'Sukiennicza SE 4', mid: [666, 1250],
    pieces: [piece(122, u => ({
      name: 'Dom Don Kichot', seed: 104, wall: '#dcc8b4', base: '#cfae9a', groundTop: 44, trim: '#f2ebdf', frame: '#f6f1e8', eave: 189,
      axes: [27, 52, 79, 106].map(u),
      floors: [{ y: [12, 34], w: 11, at: [52, 79, 106].map(u) }, ...rows([[54, 77], [93, 117], [136, 159]], 12, { hood: 'hood' })],
      bands: [[43, 47, 2.2], ...cornice(189)],
      balconies: [[1, u(26), u(66), 10]],
      ground: [{ k: 'shop', x: [u(28), u(50)], y: [4, 32], frame: '#7a2a24' }],
      signs: [{ x: [u(28), u(78)], y: [76, 84], fg: '#7a1f2b', font: 'italic 700 {}px Georgia, serif', lines: [['Don Quijote', 0.9, 0.5]] }],
    })), piece(43, u => ({
      name: 'Wąska z bramą', seed: 105, wall: '#d5bfae', base: '#c9b09e', groundTop: 44, trim: '#f0e8dc', frame: '#f6f1e8', eave: 213,
      axes: [u(21)], floors: [{ y: [56, 76], w: 12, hood: 'hood' }, { y: [112, 133], w: 12, hood: 'hood' }, { y: [158, 173], w: 11, hood: 'hood' }],
      bands: [[43, 47, 2.2], [82, 87, 2], [136, 141, 2.4], ...cornice(213, 4.6)],
      ground: [{ k: 'arch', x: [u(7), u(36)], y: [0, 33], rise: 9, gate: true, ring: '#efe7dc' }],
    })), piece(122, u => ({
      name: 'Kamienica z naczółkami', seed: 106, wall: '#d7c3b4', base: '#cdb09c', groundTop: 48, trim: '#efe7d8', frame: '#f4efe6', eave: 218,
      axes: [27, 53, 80, 108].map(u),
      floors: [{ y: [18, 45], w: 12, at: [27, 53, 80].map(u) }, ...rows([[66, 92], [112, 138], [158, 179]], 13, { hood: 'hood' })],
      bands: [[47, 51, 2.2], [152, 156, 1.8], ...cornice(218, 4.6)],
      rustic: [[2, 47]],
      ground: [{ k: 'door', x: [u(101), u(116)], y: [3, 42] }],
      signs: [{ x: [u(47), u(59)], y: [20, 43], bg: '#1b1612', fg: '#d8b66a', border: '#6a5230', font: serif, z: 0.9, lines: [['TATTOO', 0.1, 0.4], ['FAMILY', 0.1, 0.6]] }],
    }))],
  },
  {
    // SE 5: beżowa kamienica z rustykowanym parterem, łukowymi oknami i trzema balkonami
    name: 'Sukiennicza SE 5', mid: [426, 1556],
    pieces: [piece(213, u => ({
      name: 'Kamienica z łukami', seed: 107, wall: '#c8bfaa', base: '#b4ad9b', groundTop: 45, trim: '#ded7c5', frame: '#ece7d9', eave: 178,
      axes: [20, 71, 103, 143, 194].map(u), floors: rows([[54, 75], [94, 117], [138, 160]], 13, { hood: 'hood' }),
      bands: [[44, 48, 2.4], ...cornice(178)], rustic: [[2, 44]],
      balconies: [[0, u(76), u(119), 10], [2, u(76), u(119), 10], [1, u(125), u(168), 10, true]],
      ground: [
        { k: 'arch', x: [u(10), u(29)], y: [6, 38], rise: 9, frame: '#2a2622' },
        { k: 'arch', x: [u(45), u(57)], y: [14, 37], rise: 6, frame: '#2a2622' },
        { k: 'door', x: [u(71), u(79)], y: [3, 36] },
        { k: 'arch', x: [u(86), u(98)], y: [14, 37], rise: 6, frame: '#2a2622' },
        { k: 'arch', x: [u(105), u(117)], y: [14, 37], rise: 6, frame: '#2a2622' },
        { k: 'arch', x: [u(134), u(146)], y: [14, 37], rise: 6, frame: '#2a2622' },
        { k: 'arch', x: [u(163), u(175)], y: [14, 37], rise: 6, frame: '#2a2622' },
        { k: 'arch', x: [u(191), u(201)], y: [14, 37], rise: 5, frame: '#2a2622' },
      ],
    }))],
  },
  {
    // SE 6: ochrowa kamienica z białymi pilastrami, trzema łukami na parterze i bramą z kartuszem
    name: 'Sukiennicza SE 6', mid: [307, 1726],
    pieces: [piece(201, u => ({
      name: 'Ochrowa z pilastrami', seed: 108, wall: '#d6bb86', base: '#d1b57e', groundTop: 50, trim: '#ece5d1', frame: '#f5f0e2', eave: 172,
      axes: [24, 67, 104, 140, 180].map(u), floors: rows([[54, 77], [96, 116], [135, 155]], 13, { hood: 'hood' }),
      bands: [[48, 52, 2.4], ...cornice(172)], strips: [[u(41), u(53)], [u(82), u(94)], [u(120), u(132)], [u(151), u(163)]], stripY0: 52,
      balconies: [[0, u(57), u(88), 10, true], [1, u(57), u(88), 11, true], [0, u(127), u(152), 8], [1, u(127), u(152), 8]],
      ground: [
        { k: 'arch', x: [u(9), u(41)], y: [3, 45], rise: 12, frame: '#4a2f1e', ring: '#f1ead8' },
        { k: 'arch', x: [u(53), u(80)], y: [3, 45], rise: 11, frame: '#4a2f1e', ring: '#f1ead8' },
        { k: 'arch', x: [u(89), u(119)], y: [2, 46], rise: 10, wood: true, ring: '#f1ead8' },
        { k: 'arch', x: [u(131), u(150)], y: [3, 43], rise: 8, frame: '#4a2f1e', ring: '#f1ead8' },
        { k: 'arch', x: [u(161), u(193)], y: [3, 45], rise: 12, frame: '#4a2f1e', ring: '#f1ead8' },
      ],
      cartouche: [u(104), 50],
    }))],
  },
  {
    // SE 7: ciemnoszara kamienica z dwiema grupami balkonów i bramą kancelarii notarialnej
    name: 'Sukiennicza SE 7', mid: [180, 1908],
    pieces: [piece(244, u => ({
      name: 'Szara z bramą notariusza', seed: 109, wall: '#9a948a', base: '#6f6a62', groundTop: 42, trim: '#b8b1a3', frame: '#e4e0d6', eave: 148,
      axes: [20, 42, 68, 89, 110, 130, 164, 183, 204].map(u),
      floors: [{ y: [18, 36], w: 12, at: [20, 43, 68, 89, 110, 130, 204].map(u) }, ...rows([[52, 69], [88, 105], [122, 139]], 12, { hood: 'hood' })],
      bands: [[41, 45, 2.4], ...cornice(148, 3.8)],
      balconies: [[1, u(70), u(99), 10], [2, u(70), u(99), 10], [3, u(70), u(99), 10], [1, u(148), u(181), 10, true], [2, u(148), u(181), 10], [3, u(148), u(181), 10]],
      ground: [{ k: 'door', x: [u(150), u(166)], y: [3, 30] }, { k: 'shop', x: [u(178), u(198)], y: [8, 30], frame: '#5a3a2a' }],
      signs: [
        { x: [u(147), u(168)], y: [31, 37], bg: '#f0f0f0', fg: '#1f3f8f', border: '#1f3f8f', font: sans, z: 0.9, lines: [['EVEREST', 0.7, 0.5]] },
        { x: [u(147), u(168)], y: [23, 29], bg: '#f4f4f4', fg: '#2b2b2b', font: sans, z: 0.9, lines: [['NOTARIUSZ', 0.6, 0.5]] },
      ],
    }))],
  },
  {
    // SE 8: zaniedbana kamienica z dużymi witrynami na parterze, od strony skrzyżowania z Łazienną
    name: 'Sukiennicza SE 8', mid: [77, 2078],
    pieces: [piece(154, u => ({
      name: 'Kamienica przy Łazienną', seed: 110, wall: '#a79a8e', base: '#cfcfc8', groundTop: 42, trim: '#c8bcae', frame: '#e6e0d4', eave: 172,
      axes: [24, 48, 89, 119].map(u), floors: rows([[51, 73], [92, 114], [132, 152]], 13, { hood: 'hood' }),
      bands: [[41, 45, 2.2], ...cornice(172, 3.8)],
      balconies: [[0, u(72), u(99), 10], [1, u(72), u(99), 10]],
      ground: [
        { k: 'shop', x: [u(17), u(51)], y: [10, 36], frame: '#26292c' },
        { k: 'shop', x: [u(64), u(91)], y: [12, 37], frame: '#26292c' },
        { k: 'shop', x: [u(105), u(119)], y: [12, 37], frame: '#26292c' },
      ],
    }))],
  },
  {
    // NW 1: biały blok z lat 30. z trzema kondygnacjami balkonów po bokach
    name: 'Sukiennicza NW 1', mid: [868, 735],
    pieces: [piece(170, u => ({
      name: 'Biały blok z balkonami', seed: 111, dormers: false, wall: '#dcdcd6', base: '#c4c4bd', groundTop: 28, trim: '#c4c4be', frame: '#f2f2ee', eave: 138,
      axes: [42, 75, 105, 135, 153].map(u), floors: rows([[30, 43], [58, 71], [85, 99], [114, 127]], 15),
      bands: [[26, 29, 1.4], [132, 138, 2.6]],
      balconies: [[1, u(14), u(55), 12], [2, u(14), u(55), 12, true], [3, u(14), u(55), 12], [1, u(124), u(166), 12], [2, u(124), u(166), 12, true], [3, u(124), u(166), 12]],
      ground: [],
    }))],
  },
  {
    // NW 2: kremowy dom z półokrągłymi balkonami, drzwiami i sklepem „Nowy”
    name: 'Sukiennicza NW 2', mid: [1024, 560],
    pieces: [piece(127, u => ({
      name: 'Dom z okrągłymi balkonami', seed: 112, dormers: false, wall: '#e4dcc0', base: '#9c9484', groundTop: 38, trim: '#d9d0b8', frame: '#f4efe0', eave: 138,
      axes: [35, 68, 100].map(u), floors: rows([[50, 63], [79, 92], [107, 121]], 15),
      bands: [[37, 40, 1.8], ...cornice(138, 3.4)],
      balconies: [[0, u(21), u(54), 10], [1, u(21), u(54), 10, true], [2, u(21), u(54), 10], [0, u(82), u(115), 10], [1, u(82), u(115), 10, true], [2, u(82), u(115), 10]],
      ground: [
        { k: 'shop', x: [u(28), u(50)], y: [4, 37], frame: '#6a2a24' },
        { k: 'door', x: [u(61), u(76)], y: [3, 38] },
        { k: 'shop', x: [u(86), u(112)], y: [4, 37], frame: '#4a3a2a', sign: { bg: '#e6e9cf', fg: '#2f6a3a', font: sans, lines: [['NOWY', 0.7, 0.5]] } },
      ],
    }))],
  },
  {
    // NW 3: jasnozielony blok z balkonami z kwiatami po prawej
    name: 'Sukiennicza NW 3', mid: [1098, 478],
    pieces: [piece(95, u => ({
      name: 'Zielony blok', seed: 113, dormers: false, wall: '#dfe3cb', base: '#b9b8a2', groundTop: 14, trim: '#e9ecd9', frame: '#f6f7ee', eave: 124,
      axes: [13, 50, 84].map(u), floors: rows([[21, 34], [48, 60], [72, 85], [99, 112]], 12),
      bands: [[14, 17, 1.6], [118, 124, 2.4]],
      balconies: [[1, u(70), u(96), 9, true], [2, u(70), u(96), 9, true], [3, u(70), u(96), 9]],
      ground: [],
    }))],
  },
  {
    // NW 4: szary blok z lat 50. przy Złotej, dwa okna w parze na osi, parter z witrynami
    name: 'Sukiennicza NW 4', mid: [502, 1152],
    pieces: [piece(113, u => ({
      name: 'Blok przy Złotej', seed: 114, dormers: false, wall: '#d9d9d3', base: '#b9b8b0', groundTop: 42, trim: '#cfcfc9', frame: '#f2f2ee', eave: 161,
      axes: [22, 32, 51, 62, 72, 91, 101].map(u), floors: rows([[50, 62], [80, 92], [110, 121], [139, 150]], 8, { hood: 'hood' }),
      bands: [[42, 46, 1.6], [128, 131, 1.4], [156, 161, 3]],
      ground: [
        { k: 'shop', x: [u(19), u(36)], y: [6, 34], frame: '#2f3a32' },
        { k: 'shop', x: [u(58), u(75)], y: [6, 34], frame: '#2f3a32' },
        { k: 'shop', x: [u(87), u(104)], y: [6, 34], frame: '#2f3a32' },
      ],
    }))],
  },
  {
    // NW 5: długa pierzeja pary okien na osiach, parter ze sklepami (Expander i inne)
    name: 'Sukiennicza NW 5', mid: [646, 986],
    pieces: [piece(222, u => ({
      name: 'Pierzeja z parami okien', seed: 115, dormers: false, wall: '#dcdcd6', base: '#b4b2a8', groundTop: 43, trim: '#cfcfc9', frame: '#f4f4f0', eave: 131,
      axes: [17, 27, 45.5, 55.5, 79, 89, 113, 123, 147, 157, 181, 191].map(u), floors: rows([[49, 60], [77, 90], [106, 117]], 7.5),
      bands: [[42, 46, 1.6], [96, 99, 1.4], [125, 131, 3]],
      balconies: [[0, u(77), u(92), 4], [0, u(111), u(126), 4], [0, u(145), u(163), 4]],
      ground: [
        { k: 'shop', x: [u(19), u(34)], y: [6, 38], frame: '#e8693a' },
        { k: 'shop', x: [u(45), u(57)], y: [6, 38], frame: '#e8693a' },
        { k: 'shop', x: [u(76), u(91)], y: [8, 38], frame: '#2a2a2a' },
        { k: 'door', x: [u(109), u(128)], y: [3, 38] },
        { k: 'shop', x: [u(146), u(161)], y: [6, 38], frame: '#c3213f' },
        { k: 'shop', x: [u(181), u(194)], y: [6, 38], frame: '#c3213f' },
        { k: 'door', x: [u(196), u(209)], y: [3, 38] },
      ],
      signs: [{ x: [u(163), u(179)], y: [33, 39], bg: '#d52b1e', fg: '#f4f4f4', font: sans, lines: [['expander', 0.7, 0.5]] }],
    }))],
  },
  {
    // NW 6: narożny dom z biurem nieruchomości i sklepem
    name: 'Sukiennicza NW 6', mid: [738, 874],
    pieces: [piece(70, u => ({
      name: 'Dom z biurem nieruchomości', seed: 116, dormers: false, wall: '#d6d6d0', base: '#b8b6ac', groundTop: 43, trim: '#cfcfc9', frame: '#f2f2ee', eave: 131,
      axes: [16.5, 25.5, 44].map(u), floors: rows([[46, 57], [76, 88], [104, 115]], 8.5, { hood: 'hood' }),
      bands: [[42, 46, 1.6], [96, 99, 1.4], [125, 131, 3]],
      ground: [
        { k: 'shop', x: [u(13), u(29)], y: [6, 38], frame: '#2a2a2a' },
        { k: 'shop', x: [u(41), u(56)], y: [6, 38], frame: '#2a2a2a' },
      ],
    }))],
  },
];
