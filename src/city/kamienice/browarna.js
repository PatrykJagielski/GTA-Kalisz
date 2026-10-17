/* ---------- ulica Browarna: obie pierzeje od Śródmiejskiej do Kazimierzowskiej ---------- */
// Według Street View (lip i paź 2024), format jak w kolegialna.js. Lewy koniec frontu liczony patrząc z ulicy:
// po stronie NE to koniec od Śródmiejskiej (NW), po stronie SW koniec od Kazimierzowskiej (SE).
const rows = (n, w = 9.5, o = {}, y0 = 62, step = 36) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 24 + step * i - (i === n - 1 ? 2 : 0)], w: w - (i === n - 1 ? 0.5 : 0), ...o }));
const fl = (n, w, o) => [{ y: [22, 40], w: w - 1.5 }, ...rows(n, w, o)];
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const door = (f, w = 0.04) => ({ k: 'arch', x: [f - w, f + w], y: [3, 46], rise: 8, wood: true, ring: '#e9e2d0' });
const gate = (f, w = 0.07) => ({ k: 'arch', x: [f - w, f + w], y: [3, 50], rise: 10, gate: true, ring: '#cfc6b0' });

const FRONTS = [
  {
    // narożna z Śródmiejską: różowobeżowy tynk, brunatny cokół, wejście w narożniku
    name: 'Browarna, narożna NE', mid: [650, 1432], seed: 141, wall: '#dcbfa8', base: '#7a4e42', groundTop: 52, trim: '#efe3d2', frame: '#f4f2ec', eave: 170,
    axes: [0.3, 0.7], floors: fl(3, 9.5, { hood: 'hood' }), bands: [[50, 55, 2.6], [162, 166, 1.6], [166, 170, 4]],
    balconies: [[1, 0.35, 0.65, 9, true]], ground: [door(0.12)],
  },
  {
    // biała kamienica z oknami w prostych opaskach i rustykowanym parterem
    name: 'Browarna, biała NE', mid: [698, 1476], seed: 142, wall: '#e6dfd0', base: '#bfb7a6', groundTop: 52, trim: '#f4efe2', frame: '#f4f2ec', eave: 170,
    axes: ax(5), floors: fl(3, 9.5, { hood: 'hood' }), bands: [[50, 55, 2.4], [162, 166, 1.6], [166, 170, 4]], rustic: [[0, 52]],
    balconies: [[1, 0.4, 0.6, 8, true]], ground: [door(0.9)],
  },
  {
    // różowa kamienica z secesyjnymi opaskami: okna w łuku na drugim piętrze, żelazne balkony na osi, ciemne drzwi z prawej
    name: 'Browarna, różowa NE', mid: [769, 1542], seed: 143, wall: '#e29a86', base: '#c9806e', groundTop: 52, trim: '#f6efe6', frame: '#f4f2ec', eave: 170,
    axes: ax(5), floors: fl(3, 9.5, { hood: 'hood' }), bands: [[50, 55, 2.6], [162, 166, 1.6], [166, 170, 4]],
    balconies: [[1, 0.4, 0.6, 9, true], [2, 0.4, 0.6, 9, true]], ground: [door(0.83)],
  },
  {
    // długi dom z wyblakłym tynkiem w kolorze brudnej ochry, balkony z betonowymi płytami
    name: 'Browarna, ochrowa NE', mid: [892, 1656], seed: 144, wall: '#b7a889', base: '#8d8167', groundTop: 52, trim: '#cdbf9f', frame: '#f0ece2', eave: 170,
    axes: ax(9), floors: fl(3, 9), bands: [[50, 54, 2.2], [162, 165, 1.4], [165, 170, 3.4]],
    balconies: [[1, 0.1, 0.18, 9], [2, 0.1, 0.18, 9], [1, 0.52, 0.6, 9, true], [2, 0.52, 0.6, 9, true]], ground: [door(0.28), gate(0.82)],
  },
  {
    // żółtawa kamienica z boniowanym parterem i bramą w łuku
    name: 'Browarna, żółtawa NE', mid: [1004, 1758], seed: 145, wall: '#d6c590', base: '#bda877', groundTop: 52, trim: '#e9dcb6', frame: '#f4f2ec', eave: 170,
    axes: ax(4), floors: fl(3, 9.5, { hood: 'hood' }), bands: [[50, 55, 2.6], [162, 166, 1.6], [166, 170, 4]], rustic: [[0, 52]],
    balconies: [[1, 0.58, 0.78, 8, true]], ground: [gate(0.86, 0.08)],
  },
  {
    name: 'Browarna, szara NE', mid: [1046, 1800], seed: 146, wall: '#c9bfae', base: '#9a917f', groundTop: 52, trim: '#dcd3c2', frame: '#f0ece2', eave: 170,
    axes: ax(2), floors: fl(3, 9.5), bands: [[50, 54, 2.2], [162, 166, 1.6]], ground: [door(0.5)],
  },
  {
    name: 'Browarna, jasna NE', mid: [1090, 1838], seed: 147, wall: '#d8d0bf', base: '#aaa08c', groundTop: 52, trim: '#e6dfcf', frame: '#f0ece2', eave: 170,
    axes: ax(4), floors: fl(3, 9.5), bands: [[50, 54, 2.2], [162, 166, 1.6]], ground: [door(0.12)],
  },
  {
    // biały blok z brunatnym cokołem i kratami w oknach piwnicznych, przy Kazimierzowskiej
    name: 'Browarna, biały blok NE', mid: [1168, 1912], seed: 148, wall: '#e8e5de', base: '#573a30', groundTop: 52, trim: '#f2efe8', frame: '#f4f2ec', eave: 170,
    axes: ax(7), floors: fl(3, 9.5), bands: [[50, 54, 2.2], [166, 170, 3.4]], ground: [],
  },
  {
    // narożna z Śródmiejską po stronie SW: szarobeżowy budynek z zaokrąglonym narożnikiem, cokół z boni, sklep z odzieżą
    name: 'Browarna, narożna SW', mid: [600, 1518], seed: 151, wall: '#bcb19b', base: '#9c917b', groundTop: 52, trim: '#cfc5af', frame: '#f0ece2', eave: 170,
    axes: ax(8), floors: fl(3, 9), bands: [[50, 55, 2.4], [162, 166, 1.6], [166, 170, 3.6]], rustic: [[0, 52]],
    balconies: [[1, 0.7, 0.8, 8, true], [2, 0.7, 0.8, 8, true]],
    ground: [{ k: 'shop', x: [0.78, 0.97], y: [4, 44], frame: '#f0f0ee', door: [0.82, 0.92] }],
    signs: [{ x: [0.8, 0.97], y: [46, 52], bg: '#b0222c', fg: '#f4f4f4', font: '700 {}px Arial, sans-serif', lines: [['ODZIEŻ FRANCUSKA', 0.8, 0.5]] }],
  },
  {
    // ciemnoszary dom z drzwiami z lewej i betonowymi balkonami
    name: 'Browarna, ciemna SW', mid: [720, 1630], seed: 152, wall: '#857d6c', base: '#6e6757', groundTop: 52, trim: '#9a927f', frame: '#f0ece2', eave: 170,
    axes: ax(6), floors: fl(3, 9.5), bands: [[50, 54, 2.2], [162, 166, 1.6]],
    balconies: [[1, 0.8, 0.92, 8, true], [2, 0.8, 0.92, 8, true]], ground: [door(0.08)],
  },
  {
    // żółtawa kamienica z rustykowanym parterem i bramą w łuku
    name: 'Browarna, żółta SW', mid: [851, 1752], seed: 153, wall: '#d7c696', base: '#b9a676', groundTop: 52, trim: '#e8dcb8', frame: '#f4f2ec', eave: 170,
    axes: ax(7), floors: fl(3, 9.5, { hood: 'hood' }), bands: [[50, 55, 2.6], [162, 166, 1.6], [166, 170, 4]], rustic: [[0, 52]],
    balconies: [[1, 0.3, 0.4, 8, true], [2, 0.3, 0.4, 8, true]], ground: [gate(0.68, 0.06)],
  },
  {
    // ciemna kamienica z szerokimi rustykowanymi lizenami po bokach bramy i zielonymi balkonami
    name: 'Browarna, brunatna SW', mid: [1041, 1926], seed: 154, wall: '#7f7462', base: '#62594a', groundTop: 52, trim: '#968c78', frame: '#f0ece2', eave: 170,
    axes: ax(10), floors: fl(3, 9.5), bands: [[50, 54, 2.2], [162, 166, 1.6], [166, 170, 3.4]],
    balconies: [[1, 0.1, 0.2, 9, true], [2, 0.1, 0.2, 9, true], [3, 0.1, 0.2, 9, true]], ground: [gate(0.52, 0.06)],
  },
];

export const BROWARNA = FRONTS.map(f => ({ ground: [], ...f }));
