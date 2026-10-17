/* ---------- uliczka przy Moście Trybunalskim: wąski przejazd między białymi kamienicami a ochrowymi domami z bramami ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Po stronie NW lewy koniec frontu to koniec SW (od Kadeckiej),
// po stronie SE koniec NE.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const gate = (f, w = 0.07) => ({ k: 'arch', x: [f - w, f + w], y: [3, 50], rise: 14, wood: true, ring: '#d8c9ad' });

const FRONTS = [
  {
    // biała kamienica z odpadającym tynkiem, oknami z gzymsikami i zębatym gzymsem
    name: 'Most Trybunalski, biała NW 1', mid: [1774, 1498], seed: 191, wall: '#e5ddcb', base: '#cfc3a8', groundTop: 52, trim: '#f1ebdc', frame: '#f4f2ec', eave: 170,
    axes: ax(8), floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 9.5, { hood: 'hood' })], bands: [[50, 55, 2.4], [162, 166, 1.6], [166, 170, 3.6]], ground: [],
  },
  {
    name: 'Most Trybunalski, biała NW 2', mid: [1952, 1334], seed: 192, wall: '#e2d9c4', base: '#cabda0', groundTop: 52, trim: '#efe8d6', frame: '#f4f2ec', eave: 170,
    axes: ax(11), floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 9.5, { hood: 'hood' })], bands: [[50, 55, 2.4], [162, 166, 1.6], [166, 170, 3.6]], ground: [],
  },
  {
    // ochrowy dom z bramą w łuku i oknami w łuku na parterze, drugie piętro z prostymi oknami
    name: 'Most Trybunalski, ochrowy SE 1', mid: [1838, 1514], seed: 193, wall: '#c9aa8b', base: '#bd9d7e', groundTop: 52, trim: '#d8c3a8', frame: '#f4f2ec', eave: 110,
    axes: ax(8), floors: [{ y: [14, 44], w: 9 }, { y: [62, 90], w: 9.5 }], bands: [[50, 54, 2], [104, 107, 1.4], [107, 110, 3]], rustic: [[0, 52]],
    ground: [gate(0.3), gate(0.78, 0.06)],
  },
  {
    name: 'Most Trybunalski, ochrowy SE 2', mid: [2020, 1353], seed: 194, wall: '#c7a88a', base: '#bb9b7d', groundTop: 52, trim: '#d6c1a6', frame: '#f4f2ec', eave: 150,
    axes: ax(9), floors: [{ y: [14, 44], w: 9 }, ...rows(2, 9.5)], bands: [[50, 54, 2], [144, 147, 1.4], [147, 150, 3]], rustic: [[0, 52]],
    ground: [gate(0.55, 0.06)],
  },
];

export const MOST = FRONTS.map(f => ({ ground: [], ...f }));
