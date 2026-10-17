/* ---------- ulica Handlowa: pierzeje przy jezdni na odcinku najbliżej Rynku ---------- */
// Według Street View (2025), format jak w zamkowa-kit.js. Ułamki frontu liczone od lewego końca patrząc z ulicy.
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);

export const HANDLOWA = [
  {
    // opuszczona kamienica z czerwonej cegły: okna bez ram i zamurowane płytami, ceglane gzymsy, piętro nad parterem
    name: 'Handlowa ceglana ruina', mid: [-3454, 8027], seed: 351, wall: '#8e4a38', base: '#7a4030', groundTop: 40, trim: '#a8806a', frame: '#2a2420', eave: 176,
    axes: ax(7, 0.04, 0.98),
    floors: [{ y: [52, 90], w: 10 }, { y: [112, 150], w: 10 }],
    bands: [[40, 44, 2], [100, 104, 2], [156, 160, 1.6], [160, 176, 4]],
    ground: [{ k: 'door', x: [0.2, 0.28], y: [2, 60], frame: '#8a8a82' }],
  },
  {
    // niski dom z ciemnoszarego tynku: drewniane drzwi, trzy okna, wysoki dach z lukarnami
    name: 'Handlowa szary domek', mid: [-3591, 7868], seed: 352, wall: '#8a8a7c', base: '#78786a', groundTop: 20, trim: '#b0b0a0', frame: '#f2f0e8', eave: 110,
    axes: [0.14, 0.58, 0.82], floors: [{ y: [30, 70], w: 9 }],
    bands: [[100, 106, 2.4, 0, 1, '#5a4a40']],
    ground: [{ k: 'door', x: [0.34, 0.44], y: [2, 60], frame: '#6a3a22' }],
  },
  {
    // dwukondygnacyjna kamienica w jasnoniebieskim tynku z kremowymi opaskami drzwi i okien witrynowych
    name: 'Handlowa niebieskoszara', mid: [-2838, 8598], seed: 353, wall: '#c8ccd0', base: '#a8aab0', groundTop: 36, trim: '#e8e0b8', frame: '#f4f4f0', eave: 150,
    axes: [0.12, 0.38, 0.66, 0.86], floors: [{ y: [86, 112], w: 8.5 }],
    bands: [[150, 154, 1.6]],
    ground: [
      { k: 'shop', x: [0.04, 0.18], y: [4, 60], frame: '#e8e0b8' },
      { k: 'shop', x: [0.3, 0.46], y: [4, 60], frame: '#e8e0b8' },
      { k: 'door', x: [0.72, 0.84], y: [2, 60], frame: '#e8e0b8' },
    ],
  },
  {
    // blok powojenny: szary tynk, cztery piętra okien w poziomych pasach, kilka balkonów, brama garażowa z drewna
    name: 'Handlowa blok szary', mid: [-2688, 8788], seed: 354, wall: '#d4d2cc', base: '#a6a29a', groundTop: 40, trim: '#e8e6e0', frame: '#f4f4f0', eave: 250,
    axes: ax(8, 0.04, 0.98),
    floors: [{ y: [50, 80], w: 9 }, { y: [98, 128], w: 9 }, { y: [146, 176], w: 9 }, { y: [194, 224], w: 9 }],
    bands: [[40, 43, 1.4], [240, 250, 3]],
    balconies: [[1, 0.3, 0.42, 8], [2, 0.3, 0.42, 8], [3, 0.3, 0.42, 8]],
    ground: [{ k: 'arch', x: [0.3, 0.46], y: [2, 50], rise: 0, wood: true, frame: '#6a4a22' }],
  },
  {
    // trzypiętrowa kamienica z secesyjnym szczytem: ciemny boniowany parter z wąskimi oknami, bramka pośrodku, pilastry piętra
    name: 'Handlowa kamienica ze szczytem', mid: [-2514, 9008], seed: 355, wall: '#aaa196', base: '#5e5650', groundTop: 56, trim: '#c4bcb0', frame: '#f2eee6', eave: 210,
    axes: ax(7, 0.04, 0.98),
    floors: [{ y: [80, 114], w: 8.5 }, { y: [126, 160], w: 8.5 }],
    bands: [[56, 60, 2.2], [118, 121, 1.4], [176, 180, 1.6], [180, 210, 4]],
    rustic: [[0, 56]],
    ground: [{ k: 'door', x: [0.43, 0.5], y: [2, 54], frame: '#1e1e1c' },
      ...[0.04, 0.14, 0.64, 0.78, 0.9].map(f => ({ k: 'shop', x: [f - 0.03, f + 0.03], y: [14, 50], frame: '#f2eee6' }))],
  },
  {
    // blok z balkonami: zielony cokół, szary tynk, pomarańczowe płyciny między oknami, balkony z metalowymi balustradami
    name: 'Handlowa blok zielony', mid: [-2390, 9163], seed: 356, wall: '#c8c8c0', base: '#6e8458', groundTop: 70, trim: '#e4e2da', frame: '#f4f4f0', eave: 240,
    axes: [0.18, 0.42, 0.66, 0.9],
    floors: [{ y: [86, 116], w: 11 }, { y: [138, 168], w: 11 }, { y: [188, 216], w: 11 }],
    bands: [[70, 73, 1.4], [230, 240, 3]],
    balconies: [[1, 0.02, 0.1, 7], [2, 0.02, 0.1, 7], [1, 0.88, 0.98, 7], [2, 0.88, 0.98, 7]],
    panels: [[0.3, 0.52, '#c8946a', 118, 138], [0.3, 0.52, '#c8946a', 168, 188]],
    ground: [],
  },
];
