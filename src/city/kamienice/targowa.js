/* ---------- ulica Targowa: pierzeja SE (kolorowy szereg kamienic) i fronty NW od Złotej do Przechodniej ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Lewy koniec frontu liczony patrząc z ulicy:
// po stronie SE to koniec NE (od Złotej), po stronie NW koniec od Złotej.
// Długi szereg po stronie SE to jedna krawędź obrysu, więc poszczególne domy są pasami tynku (panels).
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const door = (f, w = 0.012) => ({ k: 'door', x: [f - w, f + w], y: [3, 40] });
const shop = (a, b, o = {}) => ({ k: 'shop', x: [a, b], y: [6, 42], frame: '#f2efe8', ...o });
const lintel = '#f1ebdc';

const FRONTS = [
  {
    // szereg kamienic: żółty dom narożny z barem, beżowe, pomarańczowa, różowa, zielona i liliowa kamienica; parter z drzwiami w kamiennych opaskach i witrynami
    name: 'Targowa, szereg SE', mid: [-1570, -26], seed: 161, wall: '#e5c58c', base: '#cfa97a', groundTop: 52, trim: lintel, frame: '#f4f2ec', eave: 165,
    axes: ax(25), floors: rows(2, 10, 62, 36).concat([{ y: [134, 154], w: 9.5 }]), bands: [[48, 53, 2.2], [157, 161, 1.4], [161, 165, 3.6]],
    panels: [[0, 0.13, '#ebd68a', -2], [0.13, 0.27, '#eadfc0', -2], [0.27, 0.42, '#e6bd80', -2], [0.42, 0.58, '#dc9d8c', -2], [0.58, 0.7, '#b6c595', -2], [0.7, 0.8, '#cdb7c4', -2], [0.8, 1, '#e8d2a2', -2]],
    ground: [
      shop(0.015, 0.1, { frame: '#7a3b22' }), door(0.14), shop(0.17, 0.24), door(0.29), shop(0.32, 0.36), door(0.4), shop(0.44, 0.49), door(0.53), shop(0.56, 0.6),
      door(0.64), shop(0.67, 0.72), door(0.76), shop(0.8, 0.86), door(0.9), shop(0.93, 0.985),
    ],
    signs: [{ x: 0.075, w: 7, y: [36, 44], bg: '#1d3f8f', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['BAR', 0.8, 0.5]] }],
  },
  {
    // zielona kamienica z wejściem w kamiennej opasce i dwiema witrynami (antykwariat)
    name: 'Targowa, zielona SE', mid: [-1786, 254], seed: 162, wall: '#a9b98a', base: '#8f9c74', groundTop: 52, trim: '#f0ece0', frame: '#f4f2ec', eave: 165,
    axes: ax(7), floors: rows(2, 10).concat([{ y: [134, 154], w: 9.5 }]), bands: [[48, 53, 2.2], [157, 161, 1.4], [161, 165, 3.6]],
    ground: [shop(0.07, 0.2), shop(0.27, 0.4), door(0.58, 0.035), shop(0.72, 0.84)],
  },
  {
    // ciemnoszary dom z kratami w oknach parteru i dwiema kondygnacjami nad nim
    name: 'Targowa, szary SE', mid: [-1937, 466], seed: 163, wall: '#7a7168', base: '#5e5750', groundTop: 52, trim: '#8d8479', frame: '#ece7dc', eave: 150,
    axes: ax(10), floors: [{ y: [14, 44], w: 10 }, ...rows(2, 9.5)], bands: [[48, 52, 2], [148, 152, 3.4]],
    balconies: [[0, 0.1, 0.17, 8, true]], ground: [],
  },
  {
    // żółty dawny pałac za żywopłotem: trzy kondygnacje z oknami w prostych opaskach i pasami podokiennymi
    name: 'Targowa, żółty pałac NW', mid: [-1628, -127], seed: 164, wall: '#e6d08c', base: '#d6c07a', groundTop: 52, trim: '#f4efd8', frame: '#f4f2ec', eave: 140,
    axes: ax(6), floors: [{ y: [14, 46], w: 10.5 }, { y: [62, 96], w: 10.5 }, { y: [110, 130], w: 9.5 }], bands: [[50, 55, 2.4], [132, 136, 1.6], [136, 140, 3.4]], ground: [],
  },
  {
    name: 'Targowa, żółty pałac NW 2', mid: [-1714, -111], seed: 165, wall: '#e6d08c', base: '#d6c07a', groundTop: 52, trim: '#f4efd8', frame: '#f4f2ec', eave: 140,
    axes: ax(6), floors: [{ y: [14, 46], w: 10.5 }, { y: [62, 96], w: 10.5 }, { y: [110, 130], w: 9.5 }], bands: [[50, 55, 2.4], [132, 136, 1.6], [136, 140, 3.4]], ground: [],
  },
];

export const TARGOWA = FRONTS.map(f => ({ ground: [], ...f }));
