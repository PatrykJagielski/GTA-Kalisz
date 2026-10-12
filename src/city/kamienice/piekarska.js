/* ---------- ulica Piekarska: obie pierzeje od Rynku do skrętu na Wał Staromiejski ---------- */
// Uwaga: dane powstały bez dostępu do Street View (sesja w chmurze nie ma wstępu do publicznych stron). Rozmieszczenie
// frontów, ich długości i liczba kondygnacji wynikają z obrysów OSM w kalisz.json, a wygląd (kolory tynku, sklepy, bramy,
// balkony) to typowe kamienice śródmieścia Kalisza, nie portrety konkretnych domów; szyldy są ogólne (bez nazw firm).
// Do poprawienia według zdjęć: kolory, układ parteru i okien w tablicy HOUSES.
// Format jak w zamkowa-kit.js; każdy front opisuje jedna linia HOUSES, a `tenement` składa z niej pełny opis:
//   mid   środek krawędzi obrysu OSM, span  front na kilku krawędziach (jak w jozefa.js), len = długość frontu w dm
//   eave  okap, n kondygnacji wynika z okapu; kind: 'shops' (witryny + wejście), 'gate' (brama z kratą + witryny),
//   'arcade' (witryny pod markizą), 'plain' (mieszkalna, jedno wejście); bal = balkon na pierwszym piętrze [od, do]
const GROUND = 50, PITCH = 36, SHOP = ['SKLEP', 'PIEKARNIA', 'FRYZJER', 'KWIACIARNIA', 'CUKIERNIA', 'APTEKA', 'KAWIARNIA', 'PRALNIA', 'SKLEP SPOŻYWCZY'];
const SIGN = [['#f4f2ec', '#2e2e2e'], ['#5b3b2b', '#f2e6d0'], ['#1f3a52', '#f4f4f2'], ['#e8e0c8', '#6a1f24'], ['#2a2a2a', '#f3f3f3']];
const FRAME = ['#f4f2ec', '#5e3a28', '#2c2c2c', '#e8e8e4', '#7a4a2e'];
const plate = (x, y) => ({ x, w: 10, y: [y, y + 2.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. PIEKARSKA', 0.62, 0.55]] });

function tenement([name, where, len, seed, wall, trim, eave, kind = 'shops', bal]) {
  const count = Math.max(2, Math.round(len / 32)), axes = [...Array(count).keys()].map(i => (i + 0.5) / count), s = 1 / count;
  const rows = Math.max(1, Math.floor((eave - 98) / PITCH) + 1), sw = Math.min(0.78 * s, 46 / len), plain = kind === 'plain';
  const floors = [...Array(rows).keys()].map(i => ({ y: [62 + PITCH * i, 86 + PITCH * i], w: 9.5 - (i === rows - 1 ? 0.5 : 0), hood: (seed + i) % 3 ? undefined : 'hood' }));
  const door = kind === 'gate' ? 0 : seed % count, ground = [], signs = [], awnings = [];
  axes.forEach((a, k) => {
    const x = [a - sw / 2, a + sw / 2], fr = FRAME[(seed + k) % FRAME.length];
    if (k === door && kind === 'gate') ground.push({ k: 'arch', x, y: [3, 42], rise: 5, gate: true, ring: trim });
    else if (k === door || plain) ground.push({ k: 'door', x: [a - sw * 0.4, a + sw * 0.4], y: [3, 40] });
    else {
      const [bg, fg] = SIGN[(seed + k) % SIGN.length], t = SHOP[(seed * 3 + k) % SHOP.length];
      ground.push({ k: 'shop', x, y: [4, 42], frame: fr, sign: { bg, fg, lines: [[t, Math.min(0.9, 8 * t.length / (sw * len)), 0.55]] } });
      if (kind === 'arcade') awnings.push([x[0] - 0.01, x[1] + 0.01, 47, 8, ['#8a2a2a', '#2a4a3a', '#e7e4dc'][(seed + k) % 3]]);
    }
  });
  if (seed % 4 === 0 && count > 2) signs.push(plate(axes[0] + s / 2, 43));
  return {
    name, ...where, seed, wall, base: seed % 2 ? null : '#c9c1b2', groundTop: GROUND, trim, frame: '#f4f2ec', eave,
    axes, floors, bands: [[GROUND - 4, GROUND + 1, 2.2], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 3.8]], ground, signs, awnings,
    ...(bal && rows > 1 ? { balconies: [[0, bal[0], bal[1], 9, true]] } : {}),
  };
}

// [nazwa, gdzie, długość frontu, ziarno, tynk, opaski, okap, rodzaj, balkon]; kolejność: pierzeja NE od Rynku, potem SW
const HOUSES = [
  ['Piekarska rynek', { mid: [422, 448] }, 223, 61, '#e3cdb0', '#f3ece0', 170, 'arcade', [0.38, 0.62]],
  ['Piekarska 1', { mid: [570, 584] }, 177, 62, '#cbd3c0', '#eeeee4', 130, 'shops'],
  ['Piekarska 2', { mid: [724, 722] }, 237, 63, '#d9b9a6', '#f1e4da', 130, 'gate', [0.2, 0.34]],
  ['Piekarska 3', { mid: [1056, 1010] }, 286, 64, '#e8dcb8', '#f6f1e2', 145, 'shops', [0.4, 0.6]],
  ['Piekarska 4', { mid: [1224, 1157] }, 161, 65, '#c6ced6', '#e9edf0', 125, 'plain'],
  ['Piekarska 5', { mid: [1357, 1269] }, 186, 66, '#e1c2b2', '#f3e8e1', 150, 'gate'],
  ['Piekarska 6', { mid: [1462, 1356] }, 87, 67, '#d4d0bc', '#ecebe0', 125, 'shops'],
  ['Piekarska 7', { mid: [1627, 1500] }, 194, 68, '#bfc9b4', '#e6ebe0', 150, 'shops'],
  ['Piekarska SW 1', { mid: [741, 827] }, 57, 69, '#e6d2ae', '#f4ecda', 140, 'plain'],
  ['Piekarska SW 2', { mid: [708, 792] }, 40, 70, '#c9b8b0', '#ebe3de', 140, 'plain'],
  ['Piekarska SW 3', { mid: [621, 710], span: [[694, 778], [521, 612]] }, 240, 71, '#d6c39a', '#f2eadb', 170, 'arcade', [0.3, 0.46]],
  ['Piekarska SW 4', { mid: [456, 558], span: [[518, 615], [299, 406]] }, 303, 72, '#e9d8c4', '#f6efe6', 170, 'shops', [0.12, 0.26]],
  ['Piekarska SW 5', { mid: [1119, 1162] }, 105, 73, '#cfc3b4', '#eee8df', 125, 'plain'],
  ['Piekarska SW 6', { mid: [992, 1048] }, 236, 74, '#e2c9b0', '#f4eadf', 150, 'gate'],
  ['Piekarska SW 7', { mid: [1225, 1252] }, 173, 75, '#d7dcc8', '#eef0e6', 170, 'shops', [0.46, 0.7]],
  ['Piekarska SW 8', { mid: [1456, 1460] }, 79, 76, '#c4cbd0', '#e8ecee', 150, 'plain'],
  ['Piekarska SW 9', { mid: [1362, 1367] }, 185, 77, '#e5d3b8', '#f5eee1', 150, 'shops'],
  ['Piekarska SW 10', { mid: [1576, 1565] }, 104, 78, '#d0b9ac', '#efe5df', 150, 'plain'],
  ['Piekarska SW 11', { mid: [1522, 1508] }, 52, 79, '#dccfb0', '#f4eedd', 125, 'plain'],
];

export const PIEKARSKA = HOUSES.map(tenement);
