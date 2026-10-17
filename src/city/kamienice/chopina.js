/* ---------- ulica Chopina: współczesny blok z ceglanym cokołem i półokrągłymi balkonami ---------- */
// Według Street View (paź 2024), format jak w jozefa.js. Lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu.
const rows = (n, w, y0 = 66, step = 30) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 20 + step * i], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

const FRONTS = [
  {
    // wejście i witryny w ceglanym parterze, wyżej kremowy tynk i zaokrąglone balkony przy narożniku
    name: 'Chopina, blok z balkonami (wschód)', mid: [-4288, -2456], seed: 290, wall: '#e6ded0', base: '#b55a40', groundTop: 60, trim: '#ede6d8', frame: '#f4f2ec', eave: 170,
    axes: ax(7), floors: [{ y: [26, 50], w: 13 }, ...rows(4, 10)], bands: [[56, 60, 1.6], [166, 170, 3]],
    balconies: [[1, 0.05, 0.2, 14, true], [2, 0.05, 0.2, 14, true], [3, 0.05, 0.2, 14, true], [1, 0.72, 0.88, 14, true], [2, 0.72, 0.88, 14, true]],
    ground: [{ k: 'shop', x: [0.02, 0.3], y: [14, 48], frame: '#a8664a' }, { k: 'door', x: [0.4, 0.5], y: [2, 44], frame: '#a8664a' }],
  },
  {
    name: 'Chopina, blok z balkonami (północ)', mid: [-4502, -2470], seed: 291, wall: '#e6ded0', base: '#b55a40', groundTop: 60, trim: '#ede6d8', frame: '#f4f2ec', eave: 170,
    axes: ax(11), floors: [{ y: [26, 50], w: 11 }, ...rows(4, 10)], bands: [[56, 60, 1.6], [166, 170, 3]],
    balconies: [[1, 0.9, 0.98, 14, true], [2, 0.9, 0.98, 14, true], [3, 0.9, 0.98, 14, true]], ground: [],
  },
];

export const CHOPINA = FRONTS.map(f => ({ ground: [], ...f }));
