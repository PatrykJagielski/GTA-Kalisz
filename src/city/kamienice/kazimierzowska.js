/* ---------- ulica Kazimierzowska: zabudowa przy skrzyżowaniu z Browarną i łukowa pierzeja od Browarnej w stronę Wału Staromiejskiego ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Po stronie NW budynki patrzą na południowy wschód,
// a lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
// Łukowy gmach z lat 50. (#669 i #665) to wiele krawędzi obrysu o tym samym opisie: szary tynk, prążkowany parter, zielone balkony.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const door = (f, w = 0.04) => ({ k: 'door', x: [f - w, f + w], y: [3, 40] });

// fronty łukowego gmachu: [środek krawędzi, liczba osi, wejścia]
const ARC = [
  [[800, 2291], 2, [0.5]], [[856, 2272], 3, []], [[922, 2243], 3, [0.4]], [[982, 2204], 3, []], [[1038, 2156], 3, [0.55]], [[1110, 2080], 6, [0.3]],
  [[756, 2300], 2, []], [[674, 2312], 5, [0.45]], [[536, 2312], 7, [0.3, 0.8]], [[416, 2290], 4, []],
];
const grey = ([mid, n, doors], i) => ({
  name: `Kazimierzowska, szary gmach ${i + 1}`, mid, seed: 171 + i, wall: '#8c8478', base: '#766e62', groundTop: 52, trim: '#a69d8d', frame: '#f0ece2', eave: 170,
  axes: ax(n), floors: [{ y: [14, 44], w: 10, wide: true }, ...rows(3, 9.5)], bands: [[50, 54, 2], [166, 170, 3.2]], rustic: [[0, 52]],
  balconies: n > 3 ? [[1, 0.2, 0.3, 8, true], [2, 0.7, 0.8, 8, true]] : [], ground: doors.map(f => door(f)),
});

const FRONTS = [
  ...ARC.map(grey),
  {
    // biały blok przy Browarnej, od strony Kazimierzowskiej: tynk, okna w prostych opaskach, brunatny cokół
    name: 'Kazimierzowska, biały blok', mid: [1306, 1888], seed: 181, wall: '#e8e5de', base: '#d9d5cb', groundTop: 52, trim: '#f2efe8', frame: '#f4f2ec', eave: 170,
    axes: ax(5), floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 10)], bands: [[50, 54, 2.2], [166, 170, 3.4]], ground: [door(0.3, 0.05)],
  },
  {
    // klasycystyczny gmach z pilastrami i trójkątnym przyczółkiem, okna w opaskach z pasami podokiennymi
    name: 'Kazimierzowska, biały gmach z przyczółkiem', mid: [1476, 1737], seed: 182, wall: '#ece9e0', base: '#d8d3c6', groundTop: 52, trim: '#f6f3ea', frame: '#f4f2ec', eave: 175,
    axes: ax(11), floors: [{ y: [14, 46], w: 11 }, { y: [64, 94], w: 10.5 }, { y: [106, 132], w: 9.5 }, { y: [142, 160], w: 8.5 }], bands: [[50, 56, 2.4], [166, 170, 1.6], [170, 175, 4]],
    strips: [[0.16, 0.18], [0.34, 0.36], [0.5, 0.52], [0.66, 0.68], [0.82, 0.84]], stripY0: 56, ground: [],
  },
];

export const KAZIMIERZOWSKA = FRONTS.map(f => ({ ground: [], ...f }));
