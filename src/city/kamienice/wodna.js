/* ---------- ulica Wodna: zabudowa NE nad kanałem, od Parczewskiego w stronę Garbarskiej ---------- */
// Według Street View (paź 2024), format jak w kolegialna.js. Budynki stoją po stronie NE i patrzą na kanał (SW);
// lewy koniec frontu, patrząc z ulicy, to początek krawędzi obrysu (koniec NW).
const rows = (n, w, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w }));
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const gate = (f, w = 0.012) => ({ k: 'arch', x: [f - w, f + w], y: [3, 44], rise: 6, wood: true, ring: '#d0c4ac' });

const FRONTS = [
  {
    // narożny dom z barem Gastro: kremowy tynk, ciemnobrązowy parter z okiennicami, mansarda
    name: 'Wodna, narożny dom z barem', mid: [-3462, 428], seed: 221, wall: '#e5dcbc', base: '#5e3f35', groundTop: 40, trim: '#d4c9a6', frame: '#f4f2ec', eave: 100,
    axes: ax(10), floors: [{ y: [8, 34], w: 8.5 }, { y: [48, 74], w: 9 }], bands: [[38, 42, 2], [94, 97, 1.4], [97, 100, 3]], ground: [],
  },
  {
    // długa, wyblakła kamienica z oknami w prostych opaskach, drewnianymi balkonami i bramą w łuku
    name: 'Wodna, szara kamienica', mid: [-3832, 256], seed: 222, wall: '#bbae9a', base: '#9c8f7c', groundTop: 52, trim: '#cdc2ad', frame: '#f0ece2', eave: 188,
    axes: ax(24), floors: [{ y: [14, 44], w: 9.5 }, ...rows(3, 9.5)], bands: [[50, 54, 2.2], [182, 185, 1.4], [185, 188, 3.2]],
    balconies: [[1, 0.1, 0.16, 9, true], [1, 0.6, 0.66, 9, true]], ground: [gate(0.45), gate(0.85)],
  },
  {
    name: 'Wodna, ochrowa kamienica', mid: [-4256, 58], seed: 223, wall: '#cdbf98', base: '#ae9f7b', groundTop: 52, trim: '#dcd0ae', frame: '#f0ece2', eave: 155,
    axes: ax(18), floors: [{ y: [14, 44], w: 9.5 }, ...rows(2, 9.5)], bands: [[50, 54, 2.2], [149, 152, 1.4], [152, 155, 3.2]], balconies: [[1, 0.3, 0.36, 9, true]], ground: [gate(0.7)],
  },
];

export const WODNA = FRONTS.map(f => ({ ground: [], ...f }));
