/* ---------- ulica Towarowa: dawne budynki fabryczne z cegły i nowe bloki ---------- */
// Według Street View (2025). Format jak w kanonicka.js; okna rozmieszczone równomiernie.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const TOWAROWA = [
  {
    // ceglana fabryka: dolny rząd okien łukowych z kratami i opaskami z cegieł, wyższy rząd mniejszych okien
    name: 'Fabryka ceglana', mid: [-5220, 731], seed: 121, wall: '#8a4c3c', base: '#6e3c30', groundTop: 52, trim: '#7a4234', frame: '#5a5a58', eave: 75,
    axes: [0.056, 0.167, 0.278, 0.389, 0.5, 0.611, 0.722, 0.833, 0.944],
    floors: [{ y: [10, 40], w: 12, hood: 'hood' }, { y: [58, 72], w: 12, hood: 'ear' }],
    bands: [[50, 54, 1.6], [72, 75, 2.2]],
    ground: [],
  },
  {
    // nowy blok z jasnej cegły z zagłębionymi balkonami
    name: 'Blok z balkonami', mid: [-4855, 494], seed: 122, wall: '#dcdad2', base: '#c9c7bd', groundTop: 30, trim: '#c4c2b8', frame: '#3a3d40', eave: 138,
    axes: [0.083, 0.25, 0.417, 0.583, 0.75, 0.917],
    floors: [WIN([36, 62], 11, 'ear'), WIN([76, 102], 11, 'ear'), WIN([114, 134], 11, 'ear')],
    bands: [[30, 34, 1.4], [136, 140, 2]],
    balconies: [[1, 0.15, 0.3, 8], [2, 0.15, 0.3, 8]],
    ground: [],
  },
  {
    // jasnoszara kamienica z boniowanym parterem, zabitymi deskami oknami i brązową bramą
    name: 'Kamienica z balkonem', mid: [-5487, 1168], seed: 123, wall: '#cfd2d6', base: '#bfc2c6', groundTop: 46, trim: '#e8e9ea', frame: '#eeeeee', eave: 104,
    axes: [0.1, 0.3, 0.5, 0.7, 0.9],
    floors: [WIN([10, 36], 11, 'ear'), WIN([62, 90], 11)],
    bands: [[44, 50, 2.4], [98, 104, 3.2]],
    balconies: [[1, 0.5, 0.75, 8]],
    ground: [
      { k: 'door', x: [0.0, 0.1], y: [4, 40], frame: '#4a2a22', ring: '#e8e9ea' },
    ],
  },
  {
    // ceglany budynek z klubem: łuki w górnej kondygnacji (zamurowane), wejście w łuku, dwa okna z kratą
    name: 'Ariklub', mid: [-4958, 444], seed: 124, wall: '#a24f35', base: '#7e3d2c', groundTop: 52, trim: '#8a4a38', frame: '#33302e', eave: 105,
    axes: [0.55, 0.78],
    floors: [WIN([14, 38], 12, 'hood')],
    bands: [[50, 54, 1.8], [100, 105, 2.4]],
    ground: [
      { k: 'arch', x: [0.02, 0.2], y: [2, 44], rise: 8, frame: '#2a2a2a', ring: '#a24f35' },
    ],
  },
];
