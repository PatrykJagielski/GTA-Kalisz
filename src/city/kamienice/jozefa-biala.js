/* ---------- plac św. Józefa: biały gmach po stronie NW (obrys #632), dwa fronty ze Street View (paź 2024) ---------- */
// Format jak w kolegialna.js. Lewy koniec frontu liczony patrząc z placu na NW: to koniec SW (od Brendy), czyli początek krawędzi.
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (a, b, o = {}) => ({ k: 'shop', x: [a, b], y: [6, 44], frame: '#c9b27a', ...o });

const FRONTS = [
  {
    // koniec od Brendy: szeroka przeszklona witryna, drzwi i brama garażowa
    name: 'Józefa, biały gmach SW', mid: [1886, -1201], seed: 71, wall: '#ecebe6', base: '#9a917c', groundTop: 52, trim: '#f4f2ec', frame: '#f4f2ec', eave: 170,
    axes: ax(5), floors: rows(3, 11.5), bands: [[50, 55, 2.6], [162, 166, 1.4], [166, 170, 3.6]],
    ground: [shop(0.04, 0.56, { frame: '#d9d6cc', door: [0.28, 0.36] }), { k: 'door', x: [0.64, 0.7], y: [3, 40] }, { k: 'arch', x: [0.78, 0.94], y: [3, 40], rise: 1, gate: true, ring: '#e4e1da' }],
  },
  {
    // długi front z szarym kamiennym cokołem, trzema witrynami lokali (pizzeria, tajska restauracja) i bramą
    name: 'Józefa, biały gmach NE', mid: [1965, -1372], seed: 72, wall: '#ecebe6', base: '#9a917c', groundTop: 52, trim: '#f4f2ec', frame: '#f4f2ec', eave: 170,
    axes: ax(12), floors: rows(3, 11.5), bands: [[50, 55, 2.6], [162, 166, 1.4], [166, 170, 3.6]],
    ground: [
      { k: 'arch', x: [0.02, 0.07], y: [3, 40], rise: 1, gate: true, ring: '#e4e1da' },
      shop(0.09, 0.16), { k: 'door', x: [0.18, 0.215], y: [3, 40] }, shop(0.24, 0.32, { frame: '#d9d6cc' }),
      shop(0.37, 0.43), shop(0.47, 0.53), shop(0.57, 0.63), shop(0.72, 0.78), shop(0.82, 0.88), shop(0.92, 0.98),
    ],
    signs: [{ x: [0.72, 0.98], y: [45, 50], bg: '#c8512a', fg: '#fff2dc', font: '700 {}px Arial, sans-serif', lines: [['THAI THAI', 0.8, 0.5]] }],
  },
];

export const JOZEFA_BIALA = FRONTS.map(f => ({ ground: [], ...f }));
