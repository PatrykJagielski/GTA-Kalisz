/* ---------- ulica Łazienna: fronty kamienic przy osi ulicy z danych OSM ---------- */
// UWAGA: to NIE jest odwzorowanie 1:1 według Street View. Sesja budująca ten plik nie miała dostępu do Street View ani
// do serwerów OSM, więc opisy opierają się wyłącznie na obrysach z public/kalisz.json (długość frontu, wysokość okapu)
// oraz na typowym wyglądzie kaliskich kamienic śródmiejskich: tynk w pastelach, okna w osiach co ok. 3 m, parter
// z witrynami i bramą, gzyms wieńczący. Nazw sklepów i numerów domów celowo nie ma — nie są znane. Gdy ktoś dostarczy
// zdjęcia, wystarczy podmienić wpis w LAZIENNA na ręcznie opisany (format jak w zamkowa-nw.js).
const PASTELS = [['#e9dfc6', '#f6f1e3'], ['#d9e2d1', '#f2f5ee'], ['#e8cfc2', '#f7ece6'], ['#dcd5c6', '#efeae0'], ['#e6e0b8', '#f6f3dc'], ['#cfd8de', '#eef2f4']];
const FRAMES = ['#5e3a28', '#f0f0ee', '#2c2c2c', '#7a4a2e'];

// edge = [id obrysu OSM (tylko opis), środek krawędzi, długość, okap]; mid = środek krawędzi obrysu, po nim photoFronts rozpoznaje front
const front = (name, mid, len, eave, seed, o = {}) => {
  const [wall, trim] = PASTELS[seed % PASTELS.length], n = Math.max(2, Math.round(len / 32)), cell = 1 / n, tall = eave >= 130, mid2 = eave >= 105;
  const gt = tall ? 50 : mid2 ? 48 : 46, axes = [...Array(n).keys()].map(i => (i + 0.5) * cell);
  const floors = tall ? [{ y: [58, 82], w: 9.5 }, { y: [94, 118], w: 9.5 }] : mid2 ? [{ y: [56, 80], w: 9.5 }] : [{ y: [54, 74], w: 9 }];
  const gate = (seed >> 1) % n, ground = axes.map((c, i) => i === gate
    ? { k: 'door', x: [c - cell * 0.2, c + cell * 0.2], y: [3, gt - 8] }
    : { k: 'shop', x: [c - cell * 0.36, c + cell * 0.36], y: [4, gt - 8], frame: FRAMES[(seed + i) % FRAMES.length] });
  return {
    name, mid, seed, wall, base: null, groundTop: gt, trim, frame: '#f4f2ec', eave, axes, floors, ground,
    bands: [[gt - 2, gt + 2, 2], [eave - 9, eave - 5, 1.4], [eave - 5, eave, 3.4]], signs: o.signs || [],
  };
};

// tabliczka z nazwą ulicy na narożnej kamienicy (jak street() w zamkowa-kit.js)
const plate = (x, y) => ({ x, w: 10, y: [y, y + 2.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. ŁAZIENNA', 0.62, 0.55]] });

export const LAZIENNA = [
  front('Łazienna A1', [784, 112], 144, 136, 1, { signs: [plate(0.5, 41)] }),
  front('Łazienna A2', [922, 112], 245, 135, 2),
  front('Łazienna A3', [922, 246], 242, 136, 3),
  front('Łazienna A4', [1070, 386], 165, 90, 4),
  front('Łazienna B1', [1340, 636], 236, 90, 5),
  front('Łazienna B2', [1362, 564], 138, 105, 6),
  front('Łazienna B3', [1482, 759], 140, 120, 7),
  front('Łazienna B4', [1585, 845], 129, 135, 8),
  front('Łazienna B5', [1670, 916], 92, 90, 9),
  front('Łazienna C1', [1800, 1024], 246, 120, 10),
  front('Łazienna C2', [1976, 1168], 209, 90, 11),
  front('Łazienna C3', [2169, 1328], 166, 135, 12),
];
