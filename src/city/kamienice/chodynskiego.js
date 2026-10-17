/* ---------- ulica Adama Chodyńskiego: pierzeje z przybliżonymi oknami ---------- */
// Według Street View (paź 2024). Format jak w kanonicka.js. Zdjęcia pokrywają tylko część pierzei, reszta zostaje generyczna.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const CHODYNSKIEGO = [
  {
    name: 'Kremowa z łukiem', mid: [571, -1250], seed: 91, wall: '#e8e2cc', base: '#cfc7ae', groundTop: 44, trim: '#e9e5d8', frame: '#f1eee4', eave: 120,
    axes: [0.062, 0.188, 0.312, 0.438, 0.562, 0.688, 0.812, 0.938],
    floors: [WIN([58, 80], 12), WIN([88, 108], 12)],
    bands: [[44, 49, 2.4], [114, 120, 3.2]],
    ground: [
      { k: 'arch', x: [0.04, 0.2], y: [4, 36], rise: 8, frame: '#4a2418', ring: '#f1eee4' },
      { k: 'door', x: [0.55, 0.64], y: [4, 36], frame: '#4a2418', ring: '#f1eee4' },
      { k: 'arch', x: [0.84, 0.96], y: [4, 36], rise: 8, frame: '#d9d3b9', ring: '#f1eee4' },
    ],
  },
  {
    name: 'Szara z boniowaniem', mid: [510, -1474], seed: 92, wall: '#c2c0b8', base: '#a6a49c', groundTop: 44, trim: '#e9e5d8', frame: '#f1eee4', eave: 108,
    axes: [0.083, 0.25, 0.417, 0.583, 0.75, 0.917],
    floors: [WIN([58, 80], 12), WIN([88, 108], 12)],
    bands: [[44, 49, 2.4], [102, 108, 3.2]],
    ground: [
      { k: 'door', x: [0.4, 0.5], y: [4, 36], frame: '#3a3a3a', ring: '#e9e5d8' },
    ],
  },
  {
    name: 'Różowa z kratami', mid: [672, -1222], seed: 93, wall: '#b38a82', base: '#8a665f', groundTop: 44, trim: '#e9e5d8', frame: '#f1eee4', eave: 108,
    axes: [0.083, 0.25, 0.417, 0.583, 0.75, 0.917],
    floors: [WIN([58, 80], 12), WIN([88, 108], 12)],
    bands: [[44, 49, 2.4], [102, 108, 3.2]],
    ground: [
      { k: 'door', x: [0.42, 0.52], y: [4, 36], frame: '#4a2a28' },
    ],
  },
  {
    name: 'Szara z witrynami', mid: [390, -1504], seed: 94, wall: '#d2d0c8', base: '#b2b0a6', groundTop: 44, trim: '#e9e5d8', frame: '#f1eee4', eave: 108,
    axes: [0.125, 0.375, 0.625, 0.875],
    floors: [WIN([58, 80], 12), WIN([88, 108], 12)],
    bands: [[44, 49, 2.4], [102, 108, 3.2]],
    ground: [
      { k: 'door', x: [0.05, 0.2], y: [4, 34], frame: '#4a1f26' },
      { k: 'shop', x: [0.33, 0.55], y: [8, 38], frame: '#4a2418' },
      { k: 'shop', x: [0.65, 0.92], y: [8, 38], frame: '#4a2418' },
    ],
  },
];
