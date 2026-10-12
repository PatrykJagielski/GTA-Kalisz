import { nr } from './zamkowa-kit.js';

/* ---------- ulica Kanonicka, pierzeja południowo-zachodnia: od Zamkowej do zakrętu przy kolegiacie ---------- */
// PRZYBLIŻENIE, nie 1:1: sesja robocza nie miała dostępu do Street View ani do serwerów OSM. Długości frontów, wysokości okapów
// (z OSM, w zaokrągleniu do gzymsu) i rozkład osi wynikają z obrysów w kalisz.json; kolory, sklepy i szyldy są typowe dla
// kamienic kanonicznych w Kaliszu (tynk w pastelach, parter z drzwiami do mieszkań i kilka lokali usługowych), a nie odczytane
// ze zdjęć. Pierzeja północno-wschodnia to bok kolegiaty i wolny plac, więc nie ma tu frontów. Format jak w jozefa.js.
// Lewy koniec frontu = koniec od Zamkowej (patrząc z ulicy, ulica biegnie na północny zachód).
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const street = x => ({ x, w: 10, y: [44, 46.6], bg: '#21468f', fg: '#f4f4f4', border: '#d8d8d8', font: '700 {}px Arial, sans-serif', lines: [['ul. KANONICKA', 0.62, 0.55]] });
const WIN = 9.5, FR = '#f4f2ec';

// n osi, dwa piętra nad parterem (okap ok. 14 m)
const house = (name, mid, seed, n, wall, base, eave, floors, extra = {}) => ({
  name, mid, seed, wall, base, groundTop: 50, trim: '#ece6d6', frame: FR, eave, axes: ax(n),
  floors, bands: [[46, 51, 2.2], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 3.8]], ...extra,
});
const fl2 = (w = WIN) => [{ y: [62, 86], w }, { y: [98, 122], w }];
const fl1 = (w = WIN) => [{ y: [62, 84], w }];

export const KANONICKA = [
  // blok przy Zamkowej: żółty tynk, bramy i trzy lokale w parterze
  house('Kanonicka 1', [-96, -703], 61, 9, '#e3d49b', '#cfc29a', 140, fl2(), {
    ground: [
      { k: 'arch', x: [0.04, 0.14], y: [3, 40], rise: 5, wood: true, frame: '#7a4a2a' },
      { k: 'shop', x: [0.22, 0.4], y: [4, 40], frame: '#5e3a28' },
      { k: 'arch', x: [0.46, 0.54], y: [3, 42], rise: 6, gate: true },
      { k: 'shop', x: [0.62, 0.8], y: [4, 40], frame: '#5e3a28', door: [0.62, 0.7] },
      { k: 'arch', x: [0.88, 0.96], y: [3, 40], rise: 5, wood: true, frame: '#7a4a2a' },
    ],
    signs: [{ x: [0.22, 0.4], y: [42, 47.5], bg: '#3a2a22', fg: '#f2e6d0', font: '600 {}px Georgia, serif', lines: [['KAWIARNIA', 0.62, 0.55]] }, street(0.5), nr(0.15, 41, '1')],
  }),
  // długa kamienica w kolorze waniliowym, dwa wejścia i brama
  house('Kanonicka 3', [-308, -926], 62, 6, '#ebe3cc', '#c5bba4', 125, fl2(), {
    ground: [
      { k: 'arch', x: [0.1, 0.22], y: [3, 40], rise: 5, wood: true, frame: '#5a3a2a' },
      { k: 'arch', x: [0.38, 0.5], y: [3, 42], rise: 7, gate: true },
      { k: 'shop', x: [0.6, 0.8], y: [4, 40], frame: '#4a4a4a', door: [0.6, 0.68] },
      { k: 'arch', x: [0.86, 0.94], y: [3, 40], rise: 4, wood: true, frame: '#5a3a2a' },
    ],
    signs: [nr(0.16, 41, '3'), nr(0.9, 41, '5')],
  }),
  // niska, dwukondygnacyjna kamieniczka w brzoskwini
  house('Kanonicka 7', [-431, -1055], 63, 3, '#e6c9ae', '#cdb59f', 100, fl1(10), {
    bands: [[46, 51, 2.2], [88, 92, 1.4], [92, 100, 3.4]],
    ground: [
      { k: 'arch', x: [0.1, 0.28], y: [3, 40], rise: 6, wood: true, frame: '#6a4a32' },
      { k: 'shop', x: [0.45, 0.88], y: [4, 40], frame: '#3a3a3a', door: [0.45, 0.58] },
    ],
    signs: [nr(0.19, 41, '7')],
  }),
  // narożnik przy zakręcie: szara kamienica z bramą
  house('Kanonicka 9', [-590, -1224], 64, 3, '#c9c4b8', '#aaa396', 130, fl2(), {
    ground: [
      { k: 'arch', x: [0.38, 0.62], y: [3, 44], rise: 8, gate: true, ring: '#e0dbcd' },
      { k: 'shop', x: [0.08, 0.28], y: [4, 40], frame: '#4a4a4a' },
      { k: 'arch', x: [0.74, 0.92], y: [3, 40], rise: 5, wood: true, frame: '#5a3a2a' },
    ],
    signs: [nr(0.7, 41, '9')],
  }),
  house('Kanonicka 11', [-681, -1323], 65, 5, '#d7dfd0', '#aeb8a6', 130, fl2(), {
    ground: [
      { k: 'arch', x: [0.06, 0.18], y: [3, 40], rise: 5, wood: true, frame: '#6a4a32' },
      { k: 'shop', x: [0.3, 0.5], y: [4, 40], frame: '#f0f0ee', door: [0.4, 0.5] },
      { k: 'arch', x: [0.58, 0.68], y: [3, 40], rise: 5, wood: true, frame: '#6a4a32' },
      { k: 'shop', x: [0.76, 0.94], y: [4, 40], frame: '#4a4a4a' },
    ],
    signs: [nr(0.2, 41, '11')],
  }),
  house('Kanonicka 13', [-790, -1442], 66, 4, '#e9d9c4', '#cbb9a2', 140, fl2(), {
    ground: [
      { k: 'arch', x: [0.08, 0.2], y: [3, 40], rise: 5, wood: true, frame: '#5a3a2a' },
      { k: 'shop', x: [0.32, 0.6], y: [4, 40], frame: '#5e3a28' },
      { k: 'arch', x: [0.7, 0.9], y: [3, 44], rise: 7, gate: true },
    ],
    signs: [nr(0.14, 41, '13')],
  }),
  house('Kanonicka 15', [-869, -1529], 67, 3, '#ddd0bc', '#bfb29c', 140, fl2(), {
    ground: [
      { k: 'arch', x: [0.1, 0.24], y: [3, 40], rise: 5, wood: true, frame: '#5a3a2a' },
      { k: 'arch', x: [0.4, 0.56], y: [3, 42], rise: 6, door: true, frame: '#5a3a2a' },
      { k: 'shop', x: [0.66, 0.9], y: [4, 40], frame: '#4a4a4a' },
    ],
    signs: [nr(0.17, 41, '15')],
  }),
];
