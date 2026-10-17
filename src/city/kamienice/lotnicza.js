/* ---------- ulica Lotnicza: ceglane budynki za murem ---------- */
// Według Street View (2024). Format jak w kanonicka.js.
const WIN = (y, w, hood = 'hood') => ({ y, w, hood });

export const LOTNICZA = [
  {
    // ceglany dom za murem: okno z łukiem z cegły i opaską, dach okapowy z gzymsem z cegieł
    name: 'Dom ceglany', mid: [1286, 8090], seed: 181, wall: '#9a4636', base: '#8a3c2e', groundTop: 26, trim: '#7a3a2a', frame: '#f1eee4', eave: 75,
    axes: [0.2, 0.55, 0.85],
    floors: [WIN([22, 52], 12, 'hood')],
    bands: [[66, 75, 2.4]],
    ground: [],
  },
  {
    // długa ceglana ściana bez okien z gzymsem pod okapem i kilkoma otworami wentylacyjnymi
    name: 'Ściana ceglana', mid: [1530, 7732], seed: 182, wall: '#c0604a', base: '#b45540', groundTop: 8, trim: '#a24a38', frame: '#8a3c2e', eave: 90,
    axes: [],
    floors: [],
    bands: [[84, 90, 2.4]],
    ground: [],
  },
];
