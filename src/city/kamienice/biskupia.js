/* ---------- ulica Biskupia: wąska uliczka między Rynkiem a Chodyńskiego ---------- */
// Według Street View (2012, 2019; zdjęcia tylko od strony Chodyńskiego, głębiej uliczka nie ma pokrycia). Format jak w zamkowa-kit.js.
// Lewy koniec frontu liczony patrząc z uliczki: po stronie SE to koniec od Chodyńskiego, po stronie NW koniec od Rynku.
const small = (n, y0, step, w) => [...Array(n).keys()].map(i => ({ y: [y0 + step * i, y0 + 20 + step * i], w }));

export const BISKUPIA = [
  {
    // wysoka ściana z surowej cegły po stronie SE: niewielkie okna na górnych kondygnacjach, ciemne drzwi
    name: 'Biskupia, ceglana ściana', mid: [1013, -646], seed: 101, wall: '#84604f', base: '#76554a', groundTop: 8, trim: '#7d4e3d', frame: '#d8d1c0', eave: 128, stains: true,
    axes: [0.07, 0.15],
    floors: [{ y: [66, 88], w: 7, at: [0.12, 0.42, 0.74] }, { y: [102, 124], w: 7, at: [0.07, 0.58] }],
    bands: [[122, 126, 1.2], [126, 128, 2]], rustic: [[0, 122]],
    ground: [
      { k: 'door', x: [0.27, 0.3], y: [3, 38] },
    ],
  },
  {
    // jasna tynkowana ściana po stronie NW (od strony Chodyńskiego z gzymsem pod okapem i latarnią przy narożniku)
    name: 'Biskupia, jasna ściana', mid: [1002, -675], seed: 102, wall: '#e3d9a8', base: '#d3c996', groundTop: 8, trim: '#d4cba0', frame: '#f1ede2', eave: 135,
    axes: [0.5], floors: [], bands: [[124, 128, 1.8], [128, 135, 4]],
    ground: [],
  },
  {
    // czerwono-pomarańczowa kamienica w głębi uliczki
    name: 'Biskupia, czerwona', mid: [908, -556], seed: 103, wall: '#c0705a', base: '#b5624d', groundTop: 8, trim: '#d8b8a8', frame: '#e8e2d6', eave: 120,
    axes: [0.2, 0.5, 0.8], floors: small(3, 24, 36, 7),
    bands: [[112, 115, 1.2], [115, 120, 2.4]],
    ground: [],
  },
  {
    // jasna kamienica z lampą na końcu uliczki
    name: 'Biskupia, żółtawa', mid: [834, -492], seed: 104, wall: '#ece6c4', base: '#dfd8b4', groundTop: 8, trim: '#f3efdc', frame: '#f4f2ec', eave: 130,
    axes: [0.2, 0.5, 0.8], floors: small(3, 26, 36, 8),
    bands: [[122, 126, 1.4], [126, 130, 2.8]],
    ground: [],
  },
];
