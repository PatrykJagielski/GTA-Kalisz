/* ---------- Aleja Wojska Polskiego: ślepa ściana szczytowa z przejazdem ---------- */
// Według Street View (2026). Format jak w kanonicka.js. Odcinek najbliżej Rynku; reszta alei (ok. 5,9 km) zostaje generyczna.

export const WOJSKA_POLSKIEGO = [
  {
    // zniszczony szczyt: szary tynk z ceglanym cokołem, wysoka brama-przejazd z lewej, nad nią biała tablica reklamowa w niebieskiej ramie
    name: 'Szczyt z przejazdem', mid: [-3092, -4930], seed: 151, wall: '#c9c9c0', base: '#a65a3e', groundTop: 8, trim: '#9a9a92', frame: '#6a6a66', eave: 120,
    axes: [],
    floors: [],
    bands: [[112, 120, 3.2]],
    panels: [[0.32, 0.98, '#e9e9e4', 50, 108]],
    ground: [
      { k: 'arch', x: [0.03, 0.27], y: [0, 70], rise: 4, gate: true, frame: '#2a2a2a', ring: '#a8a89e' },
    ],
  },
];
