/* ---------- ulica Kanonicka: obie pierzeje od Zamkowej do zakrętu przy Franciszkańskiej ---------- */
// Według Street View (paź 2024). Format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy:
// po stronie południowo-zachodniej to koniec od Zamkowej, po północno-wschodniej koniec od kolegiaty.
// Wysokości (dm nad jezdnią) wzięte ze zdjęć: parter do ok. 4,2–5,2 m, dwa piętra po ok. 3,1–3,7 m, okap na 12–12,5 m.
const ivory = '#f1eee4', WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const KANONICKA = [
  {
    // zielona kamienica narożna: parter w ośmiu łukach (Brafting, Forthis, brama, Pozytywka, Sharker, Vera), dwa balkony, boczne lizeny
    name: 'Pozytywka', mid: [-96, -703], seed: 61, wall: '#8fa78a', base: '#4a8b4f', groundTop: 42, trim: '#f1eee4', frame: '#f4f2ea', eave: 117,
    axes: [0.06, 0.102, 0.179, 0.259, 0.3, 0.345, 0.426, 0.499, 0.562, 0.602, 0.654, 0.719, 0.784, 0.85, 0.91, 0.957],
    floors: [WIN([46, 66], 9.5), WIN([77, 97], 9.5)],
    bands: [[38, 43, 2.4], [105, 109, 1.6], [109, 117, 4.2]],
    strips: [[0.128, 0.15], [0.212, 0.236], [0.368, 0.39]], stripY0: 43,
    balconies: [[0, 0.137, 0.214, 11], [1, 0.142, 0.21, 8], [0, 0.6, 0.748, 11], [1, 0.61, 0.748, 10, true]],
    panels: [[0.6, 1, '#5f8f6a', -2, 42]],
    ground: [
      { k: 'arch', x: [0.04, 0.115], y: [4, 33], rise: 8, ring: ivory },
      { k: 'arch', x: [0.142, 0.214], y: [4, 33], rise: 8, door: true, frame: '#7a4a2a', ring: ivory },
      { k: 'arch', x: [0.242, 0.321], y: [4, 33], rise: 8, frame: '#7a4a2a', ring: ivory },
      { k: 'arch', x: [0.395, 0.456], y: [3, 33], rise: 8, gate: true, ring: ivory },
      { k: 'arch', x: [0.482, 0.583], y: [4, 33], rise: 8, door: true, frame: '#7a4a2a', ring: ivory },
      { k: 'arch', x: [0.637, 0.736], y: [4, 33], rise: 8, door: true, frame: '#7a3a26', ring: ivory },
      { k: 'arch', x: [0.769, 0.869], y: [4, 33], rise: 8, frame: '#6a3a2a', ring: ivory },
      { k: 'arch', x: [0.915, 0.979], y: [4, 33], rise: 8, frame: '#6a3a2a', ring: ivory },
    ],
    signs: [
      { x: 0.228, w: 14, y: [27.5, 33.5], bg: '#f7f7f5', fg: '#1d1d1d', border: '#d8d8d8', font: '700 {}px Georgia, serif', lines: [['FORTHIS', 0.42, 0.34], ['MODA MĘSKA', 0.26, 0.74, '#c2282d', '700 {}px Arial, sans-serif']] },
      { x: [0.65, 0.724], y: [25, 29.5], bg: '#ebe6dc', fg: '#4a4a4a', font: 'italic 700 {}px Georgia, serif', lines: [['Sharker  SKLEP FIRMOWY', 0.5, 0.5]] },
      { x: [0.857, 0.912], y: [30, 35], bg: '#fbfbfa', fg: '#d9272e', border: '#d9d9d9', lines: [['Vera', 0.72, 0.55]] },
    ],
  },
  {
    // beżowa kamienica Carla: dwie pary balkonów między lizenami, brama „u Romana”, cztery arkady z witrynami
    name: 'Carla', mid: [-308, -926], seed: 62, wall: '#cdb9a8', base: '#d6c8b8', groundTop: 42, trim: '#e5dccf', frame: '#f1ece2', eave: 118,
    axes: [0.118, 0.276, 0.376, 0.456, 0.536, 0.63, 0.715, 0.87],
    floors: [WIN([50, 68], 9.5), WIN([87, 102], 8.5)],
    bands: [[38, 43, 2.4], [105, 109, 1.6], [109, 118, 4.2]],
    strips: [[0.002, 0.043], [0.147, 0.191], [0.759, 0.813], [0.932, 0.985]], stripY0: 43,
    balconies: [[0, 0.042, 0.206, 11], [1, 0.058, 0.189, 9], [0, 0.781, 0.964, 11], [1, 0.798, 0.942, 9]],
    ground: [
      { k: 'arch', x: [0.04, 0.182], y: [4, 32], rise: 9, door: true, frame: '#6b4a32', ring: '#ece6da' },
      { k: 'arch', x: [0.24, 0.395], y: [4, 32], rise: 9, frame: '#6b4a32', ring: '#ece6da' },
      { k: 'arch', x: [0.437, 0.557], y: [3, 33], rise: 9, gate: true, frame: '#6a4a30', ring: '#ece6da' },
      { k: 'arch', x: [0.589, 0.745], y: [4, 32], rise: 9, frame: '#f1f1ee', ring: '#ece6da' },
      { k: 'arch', x: [0.791, 0.946], y: [4, 32], rise: 9, door: true, frame: '#f1f1ee', ring: '#ece6da' },
    ],
    signs: [
      { x: [0.166, 0.25], y: [33, 38], bg: '#1c1b1a', fg: '#f3efe6', font: '700 {}px Arial, sans-serif', lines: [['CARLA', 0.58, 0.5]] },
      { x: [0.458, 0.534], y: [33, 37], bg: '#2a1d14', fg: '#f2b632', font: '800 {}px Arial, sans-serif', lines: [['u ROMANA', 0.6, 0.5]] },
      { x: [0.601, 0.736], y: [33, 37.5], bg: '#2d2d33', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['K&K  SALON MODY', 0.55, 0.5]] },
    ],
  },
  {
    // niebieskoszara kamienica Deni Cler: boniowany parter, szerokie lizeny z płycinami, balkon nad dwiema osiami, zaokrąglony narożnik
    name: 'Deni Cler', mid: [-431, -1056], seed: 63, wall: '#a8b0c2', base: '#8e96ab', groundTop: 43, trim: '#e8dfcb', frame: '#f1ede2', eave: 119,
    axes: [0.208, 0.477, 0.631],
    floors: [{ ...WIN([51, 71], 10), at: [0.206, 0.465, 0.653] }, { ...WIN([87, 103], 10), at: [0.208, 0.477, 0.631] }],
    bands: [[37, 44, 3], [108, 112, 1.6], [112, 119, 4.4]],
    strips: [[0.244, 0.381], [0.719, 0.874]], stripY0: 44,
    balconies: [[1, 0.363, 0.746, 10]],
    panels: [[0, 1, '#7f87a0', -2, 43]],
    ground: [
      { k: 'arch', x: [0.088, 0.478], y: [4, 34], rise: 11, door: true, frame: '#3a2a22', ring: '#e8dfcb' },
      { k: 'arch', x: [0.618, 0.898], y: [4, 34], rise: 11, frame: '#3a2a22', ring: '#e8dfcb' },
    ],
    signs: [{ x: [0.13, 0.43], y: [24, 30], bg: '#1c1c1c', fg: '#f4f1ea', font: '600 {}px Georgia, serif', lines: [['DENI CLER   PATRIZIA ARYTON', 0.5, 0.5]] }],
  },
  {
    // narożna kamienica z pracownią Enico: pas balkonowy na całej długości, szyld na parterze
    name: 'Enico', mid: [-590, -1224], seed: 64, wall: '#8c8576', base: '#a8a396', groundTop: 50, trim: '#a39d90', frame: '#d8d4c8', eave: 120,
    axes: [0.21, 0.49, 0.75],
    floors: [{ ...WIN([58, 77], 9), at: [0.21, 0.49, 0.75] }, { ...WIN([95, 113], 9), at: [0.214, 0.47, 0.741] }],
    bands: [[48, 52, 2.2], [110, 114, 1.6], [114, 120, 3.8]],
    balconies: [[0, 0.07, 1, 10]],
    ground: [
      { k: 'shop', x: [0.16, 0.526], y: [6, 34], frame: '#6a3a26' },
      { k: 'door', x: [0.8, 0.88], y: [3, 36] },
    ],
    signs: [{ x: [0.167, 0.887], y: [35, 42], bg: '#f4f1ea', fg: '#2a2a2a', font: '600 {}px Arial, sans-serif', lines: [['E N I C O', 0.7, 0.55]] }],
  },
  {
    // zniszczona szara kamienica z wielką witryną, bramą i balkonem na pierwszym piętrze
    name: 'Kanonicka szara', mid: [-682, -1323], seed: 65, wall: '#8d8575', base: '#a39e93', groundTop: 50, trim: '#7d776b', frame: '#d9d6cc', eave: 122,
    axes: [0.12, 0.26, 0.395, 0.535, 0.685, 0.855],
    floors: [WIN([58, 77], 9), WIN([95, 114], 9)],
    bands: [[48, 52, 2], [111, 115, 1.6], [115, 122, 3.8]],
    balconies: [[1, 0.32, 0.49, 10]],
    ground: [
      { k: 'shop', x: [0.081, 0.292], y: [9, 34], frame: '#6a3a2a' },
      { k: 'shop', x: [0.514, 0.724], y: [9, 34], frame: '#6a3a2a' },
      { k: 'door', x: [0.81, 0.898], y: [3, 38] },
    ],
  },
  {
    // dwie kamienice w jednym obrysie: Prima Zdrowie (żywność naturalna) i Apteka Prima z długim zielonym szyldem
    name: 'Apteka Prima', mid: [-790, -1442], seed: 66, wall: '#cbb090', base: '#e2d9c6', groundTop: 52, trim: '#d8cdb8', frame: '#f1ede3', eave: 124,
    axes: [0.105, 0.28, 0.465, 0.636, 0.8],
    floors: [WIN([57, 78], 9.5), WIN([91, 114], 9.5)],
    bands: [[50, 54, 2.4], [113, 117, 1.6], [117, 124, 4]],
    balconies: [[1, 0.38, 0.55, 10]],
    ground: [
      { k: 'shop', x: [0.07, 0.246], y: [8, 40], frame: '#6a3a26', door: [0.175, 0.243] },
      { k: 'shop', x: [0.261, 0.312], y: [8, 40], frame: '#6a3a26' },
      { k: 'door', x: [0.414, 0.477], y: [3, 40] },
      { k: 'shop', x: [0.492, 0.56], y: [8, 40], frame: '#6a3a26' },
      { k: 'shop', x: [0.64, 0.745], y: [8, 40], frame: '#6a3a26' },
      { k: 'shop', x: [0.834, 0.96], y: [8, 40], frame: '#6a3a26' },
    ],
    signs: [
      { x: [0.03, 0.125], y: [37, 43], fg: '#3a3a3a', font: '700 {}px Arial, sans-serif', lines: [['NATURALNA', 0.4, 0.28], ['ŻYWNOŚĆ', 0.4, 0.74]] },
      { x: 0.185, w: 12, y: [33, 45], round: true, bg: '#e8f0e0', fg: '#3e7a2a', lines: [['PRIMA', 0.2, 0.42], ['ZDROWIE', 0.14, 0.62]] },
      { x: [0.22, 0.335], y: [37, 43], fg: '#3a3a3a', font: '700 {}px Arial, sans-serif', lines: [['WYROBY', 0.4, 0.28], ['PROBIOTYCZNE', 0.4, 0.74]] },
      { x: [0.507, 0.945], y: [35, 42], bg: '#3fa535', fg: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['APTEKA  PRIMA', 0.62, 0.52]] },
    ],
  },
  {
    // jasna kamienica z długim balkonem na pierwszym piętrze (nad aptecznymi witrynami), trzy osie okien
    name: 'Kanonicka balkon', mid: [-869, -1529], seed: 67, wall: '#d9bd9f', base: '#e4dccb', groundTop: 52, trim: '#f1ede3', frame: '#f4f1e8', eave: 124,
    axes: [0.205, 0.47, 0.725],
    floors: [WIN([61, 81], 9.5), WIN([99, 116], 9)],
    bands: [[50, 54, 2.2], [113, 117, 1.6], [117, 124, 4]],
    balconies: [[0, 0.07, 0.99, 12, true]],
    ground: [
      { k: 'shop', x: [0.132, 0.278], y: [8, 40], frame: '#6a3a26' },
      { k: 'shop', x: [0.401, 0.543], y: [8, 40], frame: '#6a3a26' },
      { k: 'shop', x: [0.67, 0.815], y: [8, 40], frame: '#6a3a26' },
    ],
  },

  // ---- pierzeja północno-wschodnia (strona kościoła): od Zamkowej ku kolegiacie ----
  {
    // żółta kamienica na rogu Zamkowej: Red Door, Fujifilm, kancelaria, prasa; dwie pary balkonów
    name: 'Red Door', mid: [13, -757], seed: 68, wall: '#dac9a0', base: '#d9c993', groundTop: 50, trim: '#efe6cf', frame: '#f2ede0', eave: 124,
    axes: [0.03, 0.14, 0.22, 0.31, 0.425, 0.54, 0.61, 0.765, 0.878, 0.96],
    floors: [WIN([60, 80], 9.5), WIN([96, 116], 9.5)],
    bands: [[47, 51, 2.6], [111, 115, 1.6], [115, 124, 4.2]],
    balconies: [[0, 0.18, 0.275, 9], [1, 0.15, 0.29, 9, true], [0, 0.69, 0.84, 11], [1, 0.692, 0.825, 9]],
    ground: [
      { k: 'arch', x: [0.005, 0.061], y: [4, 36], rise: 7, ring: '#efe6cf', frame: '#5a3a2a' },
      { k: 'arch', x: [0.105, 0.162], y: [4, 36], rise: 7, ring: '#efe6cf', frame: '#5a3a2a' },
      { k: 'arch', x: [0.297, 0.355], y: [4, 36], rise: 7, door: true, ring: '#efe6cf', frame: '#7a3a26' },
      { k: 'arch', x: [0.397, 0.455], y: [4, 36], rise: 7, ring: '#efe6cf', frame: '#7a3a26' },
      { k: 'arch', x: [0.522, 0.58], y: [3, 36], rise: 6, wood: true, ring: '#efe6cf', frame: '#7a3a26' },
      { k: 'arch', x: [0.636, 0.784], y: [4, 36], rise: 10, door: true, ring: '#efe6cf', frame: '#8a4a22' },
      { k: 'arch', x: [0.855, 0.95], y: [4, 36], rise: 8, wood: true, ring: '#efe6cf', frame: '#7a4a2a' },
    ],
    signs: [
      { x: [0.31, 0.434], y: [38, 44], bg: '#3aa56a', fg: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['FUJIFILM', 0.62, 0.52]] },
      { x: [0.652, 0.77], y: [40, 48], fg: '#c4202a', font: '800 {}px Georgia, serif', lines: [['RED DOOR', 0.85, 0.5]] },
    ],
  },
  {
    // ochrowa kamienica z dużym oknem łukowym „Pamiątki z Kalisza” i balkonami z prawej
    name: 'Pamiątki', mid: [-124, -898], seed: 69, wall: '#d8c7a0', base: '#d6c7a0', groundTop: 50, trim: '#e8dec6', frame: '#f1ecdf', eave: 124,
    axes: [0.175, 0.425, 0.62, 0.74],
    floors: [{ ...WIN([61, 81], 9.5), at: [0.175, 0.425, 0.62] }, { ...WIN([97, 117], 9.5), at: [0.174, 0.425, 0.74] }],
    bands: [[47, 51, 2.4], [111, 115, 1.6], [115, 124, 4.2]],
    balconies: [[1, 0.55, 0.89, 10, true], [0, 0.52, 0.7, 9]],
    ground: [{ k: 'arch', x: [0.134, 0.476], y: [4, 36], rise: 10, door: true, ring: '#e8dec6', frame: '#7a5a3a' }],
    signs: [{ x: [0.2, 0.44], y: [27, 32], bg: '#f2eee6', fg: '#b12a2a', font: '700 {}px Georgia, serif', lines: [['Pamiątki z Kalisza', 0.62, 0.5]] }],
  },
  {
    // różowa kamienica z sklepem Mustang Jeans, bramą z drewnianymi drzwiami i balkonami na obu piętrach
    name: 'Mustang', mid: [-224, -1001], seed: 70, wall: '#bf9e93', base: '#d9a8a2', groundTop: 46, trim: '#e6c7bd', frame: '#f0e6df', eave: 122,
    axes: [0.19, 0.36, 0.485, 0.612, 0.79, 0.92],
    floors: [{ ...WIN([59, 80], 9.5), at: [0.22, 0.37, 0.487, 0.616, 0.77] }, { ...WIN([94, 116], 9.5), at: [0.19, 0.36, 0.485, 0.612, 0.79, 0.92] }],
    bands: [[43, 47, 2.4], [110, 114, 1.6], [114, 122, 4]],
    balconies: [[1, 0.1, 0.28, 10, true], [1, 0.7, 0.885, 10, true], [0, 0.708, 0.829, 8]],
    ground: [
      { k: 'shop', x: [0.035, 0.14], y: [6, 31], frame: '#a8706a' },
      { k: 'shop', x: [0.155, 0.29], y: [6, 31], frame: '#a8706a' },
      { k: 'shop', x: [0.313, 0.394], y: [3, 33], frame: '#8a5a2a', door: [0.313, 0.394] },
      { k: 'shop', x: [0.411, 0.554], y: [6, 31], frame: '#a8706a' },
      { k: 'arch', x: [0.584, 0.638], y: [3, 33], rise: 5, wood: true, ring: '#e6c7bd' },
      { k: 'shop', x: [0.699, 0.85], y: [6, 31], frame: '#a8706a' },
    ],
    signs: [{ x: [0.08, 0.13], y: [33, 37], bg: '#c3282d', fg: '#ffffff', font: '800 {}px Arial, sans-serif', lines: [['MUSTANG', 0.5, 0.5]] }],
  },
  {
    // narożnik z Jubilerem (żółty parter, zniszczone piętra) i szara kamienica z Lombardem Grosz
    name: 'Jubiler', mid: [-336, -1118], seed: 71, wall: '#a49d8a', base: '#d9c88f', groundTop: 45, trim: '#e4dcc4', frame: '#ece6d6', eave: 122,
    axes: [0.13, 0.28, 0.535, 0.506, 0.706],
    floors: [{ ...WIN([57, 76], 9), at: [0.13, 0.28, 0.535] }, { ...WIN([93, 112], 9), at: [0.132, 0.28, 0.506, 0.706] }],
    bands: [[41, 45, 2.4], [109, 113, 1.6], [113, 122, 4]],
    balconies: [[0, 0.41, 0.69, 11, true]],
    panels: [[0.36, 1, '#d6d3cb', -2, 45]],
    ground: [
      { k: 'arch', x: [0.084, 0.341], y: [4, 34], rise: 11, door: true, ring: '#e9e4d6', frame: '#6a3a22' },
      { k: 'arch', x: [0.43, 0.6], y: [4, 34], rise: 9, door: true, ring: '#e9e4d6', frame: '#7a3a26' },
      { k: 'arch', x: [0.69, 0.9], y: [4, 34], rise: 9, door: true, ring: '#c4c1b8', frame: '#6a4a30' },
    ],
    signs: [
      { x: [0.161, 0.266], y: [39, 44], bg: '#4a2e22', fg: '#f1e6d0', font: '600 {}px Georgia, serif', lines: [['Jubiler', 0.7, 0.5]] },
      { x: 0.51, w: 12, y: [38, 48], round: true, bg: '#7a4a20', fg: '#f1e0b0', font: '800 {}px Georgia, serif', lines: [['LOMBARD', 0.2, 0.42], ['GROSZ', 0.16, 0.64]] },
    ],
  },
];
