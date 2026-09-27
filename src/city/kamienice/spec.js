/* ---------- kamienice Głównego Rynku odtworzone ze zdjęć 1:1 (Street View i widok z lotu ptaka) ---------- */
// Pierzeja północno-zachodnia między Złotą a Piskorzewską, od lewej patrząc z płyty Rynku: Salon Firan (róg Złotej),
// Pod Filarami (Główny Rynek 1), Żak (2), Bank Millennium (3, róg Piskorzewskiej). Zamiast typowej elewacji Rynku
// (rynek-facades.js) każda ma własny front: liczbę osi, okna, balkony, sklepy i szyldy jak w rzeczywistości.
// mid = środek frontowej krawędzi obrysu OSM (dm): po nim rynek.js rozpoznaje kamienicę.
// Poziomo ułamki długości frontu (0 = lewy koniec), pionowo dm nad jezdnią.
//   floors    okna pięter: y = [dół, góra], at = osie (domyślnie axes), w = szerokość, wide = { nr okna: szerokość },
//             hood = naczółek ('hood' gzymsik, 'ear' uszaki); okno nad balkonem schodzi do płyty (drzwi balkonowe)
//   base      kolor parteru do wysokości groundTop
//   bands     gzymsy [y0, y1, wysięg, od, do, kolor]; balconies [piętro, od, do, głębokość, kwiaty]; flowers = okna ze
//             skrzynkami na kolejnych piętrach
//   ground    parter: shop (witryna, sign = szyld w górnym pasie otworu, door = drzwi w witrynie), door, arch (wnęka
//             łukowa z szybą albo drzwiami; rise = strzałka łuku), arcade (otwarty podcień, inner = co w głębi)
//   signs     szyldy i napisy na ścianie, blades = wysięgniki prostopadle do ściany
const plate = (x0, x1, y) => ({ x: [x0, x1], y: [y, y + 3], bg: '#d8d4c9', fg: '#2e2e2e', border: '#2e2e2e', lines: [['GŁÓWNY RYNEK', 0.5, 0.55]] });
const MILL = { bg: '#c3213f', border: '#f5f5f5', lit: true, font: '700 {}px Arial, sans-serif', lines: [['Millennium', 0.44, 0.42], ['bank', 0.24, 0.78, '#fff', '400 {}px Arial, sans-serif']] };
const ZAK = '#2c3a51';

export const KAMIENICE = [
  {
    name: 'Salon Firan', mid: [-682, 68], seed: 1, wall: '#efece3', base: '#b3bd8c', groundTop: 60, trim: '#f8f6ef', frame: '#f4f2ec',
    eave: 155, top: 191, dormers: false,
    axes: [0.11, 0.27, 0.42, 0.59, 0.76, 0.91],
    // górna kondygnacja tylko nad osiami 2–5, zwieńczona attyką z kulami; skrajne osie kończą się gzymsem pod dachem
    floors: [{ y: [70, 95], w: 9.5 }, { y: [107, 132], w: 9.5 }, { y: [162, 180], w: 8.5, at: [0.27, 0.42, 0.59, 0.76] }],
    attic: [0.19, 0.845],
    flowers: [[0, 3, 4, 5], [0, 3, 4, 5], [0, 1, 2, 3]],
    bands: [[55, 60, 2.6], [140, 145, 1.6], [145, 155, 4.4], [185, 191, 3, 0.19, 0.845]],
    balconies: [[0, 0.19, 0.5, 13, true], [1, 0.19, 0.5, 11, true]],
    // trzy łukowe wejścia (prasa, dwa wejścia do salonu), między nimi pary kolumn na podeście z czerwonej terakoty
    ground: [
      { k: 'arch', x: [0.076, 0.208], y: [3, 35], rise: 9 },
      { k: 'arch', x: [0.32, 0.47], y: [3, 34], rise: 8, door: true },
      { k: 'arch', x: [0.6, 0.81], y: [3, 38], rise: 11, door: true },
    ],
    columns: [0.232, 0.292, 0.5, 0.56], colTop: 28, platform: [0.065, 0.83],
    signs: [{ x: [0.6, 0.83], y: [41.5, 48], fg: '#6b4c33', font: '700 {}px Georgia, serif', lines: [['SALON FIRAN', 0.85, 0.55]] }, plate(0.012, 0.062, 44)],
    cafe: [0.78, 1.54],                                                                 // dwa parasole na styku z Pod Filarami
  },
  {
    name: 'Pod Filarami', mid: [-578, -22], seed: 2, wall: '#f2cbbb', base: '#c28f86', groundTop: 62, trim: '#f7e9e2', frame: '#f8f5f2', eave: 175,
    axes: [0.2, 0.4, 0.6, 0.8],
    floors: [{ y: [71, 95], w: 10 }, { y: [105, 129], w: 10 }, { y: [142, 161], w: 9.5 }],
    bands: [[58, 63, 2.4], [133, 137, 2.6], [165, 169, 1.6], [169, 175, 4.4]],
    balconies: [[1, 0.115, 0.285, 10], [1, 0.715, 0.885, 10]],
    // podcień z trzema łukami na filarach (bar Pod Filarami w pierwszym) i duże okno łukowe perfumerii
    ground: [
      { k: 'arcade', x: [0.128, 0.272], y: [0, 46], inner: 'door' },
      { k: 'arcade', x: [0.328, 0.472], y: [0, 46], inner: 'door' },
      { k: 'arcade', x: [0.528, 0.672], y: [0, 46], inner: 'shop' },
      { k: 'arch', x: [0.715, 0.885], y: [6, 46], frame: '#5a3a2a' },
    ],
    // cztery medaliony z portretami kaliszan i napis „Sława nasz gród”
    medallions: [0.27, 0.355, 0.44, 0.525], medY: 52.5,
    signs: [
      { x: [0.6, 0.69], y: [47, 57.5], fg: '#3f3a36', font: 'italic 800 {}px Georgia, serif', lines: [['SŁAWA', 0.3, 0.18], ['NASZ', 0.3, 0.5], ['GRÓD', 0.3, 0.82]] },
      { x: [0.028, 0.112], y: [6, 27], bg: '#1c1c1c', border: '#6b4a2e', lines: [['POD FILARAMI', 0.08, 0.1, '#f2a33a'], ['KEBAB', 0.1, 0.32], ['BURGERY', 0.1, 0.49],
        ['SKRZYDEŁKA', 0.1, 0.66], ['ZAPRASZAMY', 0.07, 0.86, '#f2d15c']] },
    ],
    blades: [{ x: 0.7, y: 42, w: 7, h: 7, round: true, bg: '#5a1d26', fg: '#f1dcc0', font: 'italic 700 {}px Georgia, serif', lines: [['Perfumeria', 0.18, 0.5]] }],
    boards: [0.1, 0.19], basket: [0.4, 37],
  },
  {
    name: 'Żak', mid: [-494, -92], seed: 3, wall: '#f2dcae', base: null, groundTop: 0, trim: '#f8f0dd', frame: '#6a4631', eave: 175,
    axes: [0.19, 0.49, 0.79],
    floors: [{ y: [62, 88], w: 10.5, hood: 'ear' }, { y: [100, 125], w: 10.5, hood: 'hood' }, { y: [136, 157], w: 10.5, hood: 'hood' }],
    bands: [[47, 53, 2.2], [89.5, 92, 1.6], [162, 166, 1.4], [166, 175, 4.4]],
    dentils: [158.5, 162], strips: [[0, 0.035], [0.965, 1]],
    balconies: [[1, 0.33, 0.66, 11]],
    // dwie witryny szkoły Żak z granatowymi szyldami, drewniane drzwi do klatki z kartuszem
    ground: [
      { k: 'shop', x: [0.07, 0.3], y: [4, 41], sign: { bg: ZAK, lit: true, lines: [['żak', 0.62, 0.5]] } },
      { k: 'shop', x: [0.36, 0.64], y: [4, 41], door: [0.375, 0.47], sign: { bg: ZAK, lit: true, font: '600 {}px Arial, sans-serif',
        lines: [['szkoły policealne · licea dla dorosłych', 0.22, 0.36], ['kursy i szkolenia', 0.22, 0.7]] } },
      { k: 'door', x: [0.7, 0.82], y: [3, 38] },
    ],
    cartouche: [0.76, 43],
    blades: [{ x: 0.875, y: 37, w: 4.2, h: 5, bg: '#1b1b1b', lines: [['ŻAK', 0.42, 0.45]] }],
  },
  {
    name: 'Bank Millennium', mid: [-419, -157], seed: 4, wall: '#dcd8c6', base: '#e8794c', groundTop: 50, trim: '#e4e1d6', frame: '#f5f5f2', eave: 175,
    dormers: false, stains: true,
    axes: [0.09, 0.23, 0.43, 0.64, 0.83],
    // na III piętrze tylko trzy szerokie okna (nad parami osi i w środku), balkon na II piętrze w osi środkowej
    floors: [{ y: [62, 87], w: 11, wide: { 2: 15 } }, { y: [98, 123], w: 11, wide: { 2: 15 } }, { y: [134, 158], w: 15, at: [0.16, 0.43, 0.735] }],
    bands: [[47, 53, 1.8, 0, 1, '#b4b1a7'], [167, 171, 1.4], [171, 175, 3.4]],
    balconies: [[1, 0.31, 0.55, 12]],
    ground: [
      { k: 'shop', x: [0.05, 0.25], y: [4, 43], frame: '#e8e6e0', sign: MILL },
      { k: 'door', x: [0.38, 0.47], y: [3, 40] },
      { k: 'shop', x: [0.6, 0.89], y: [4, 43], frame: '#e8e6e0', sign: MILL },
    ],
    signs: [plate(0.905, 0.965, 45)],
  },
];

// kamienica, której front ma środek w (x, z)
export const kamienica = (x, z) => KAMIENICE.find(k => Math.hypot(k.mid[0] - x, k.mid[1] - z) < 20) || null;
