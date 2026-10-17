/* ---------- ulica Więzienna: mur zakładu karnego i domy po przeciwnej stronie ---------- */
// Według Street View (paź 2024). Format jak w spec.js. Obrys OSM muru jest w grze budynkiem, więc front bez okien
// zastępuje mu elewację z oknami; ułamki frontu liczone od lewego końca patrząc z ulicy.
const MUR = {
  name: 'Mur więzienny', seed: 121, wall: '#e9e3cf', base: '#d3ac66', groundTop: 46, trim: '#cfc6ad', frame: '#e6e0d0', eave: 72, dormers: false,
  axes: [], floors: [], bands: [[69, 72, 1.2]], ground: [], panels: [[0, 1, '#ece5d0', 46, 72]],
};

export const WIEZIENNA = [
  { ...MUR, name: 'Mur więzienny 1', mid: [7592, -2852] },
  { ...MUR, name: 'Mur więzienny 2', mid: [7504, -2832], seed: 122 },
  { ...MUR, name: 'Mur więzienny 3', mid: [7372, -2763], seed: 126 },
  {
    // stara kamienica z ochrowym tynkiem, dwie osie okien i narożny sklep spożywczo-monopolowy
    name: 'Więzienna SE 1', mid: [7145, -2428], seed: 123, wall: '#d3c4a0', base: '#d8cb9a', groundTop: 49, trim: '#e9e0c6', frame: '#f0ead8', eave: 180,
    axes: [0.044, 0.36],
    floors: [{ y: [20, 47], w: 11, at: [0.044, 0.38] }, { y: [69, 94], w: 11, hood: 'hood' }, { y: [116, 142], w: 11, hood: 'hood' }],
    bands: [[48, 52, 2.4], [168, 173, 1.6], [173, 180, 4]],
    ground: [{ k: 'door', x: [0.83, 0.97], y: [10, 40] }],
    signs: [{ x: [0.8, 1], y: [40, 52], bg: '#7a1f2b', fg: '#f0d98a', font: '700 {}px Georgia, serif', z: 0.9, lines: [['SPOŻYWCZO-', 0.3, 0.3], ['MONOPOLOWY', 0.3, 0.7]] }],
  },
  {
    // nowy blok z różowym cokołem, kremowymi ścianami i dachem czterospadowym z lukarną
    name: 'Więzienna SE 2', mid: [7661, -2710], seed: 124, wall: '#f1e6cf', base: '#e8b9a4', groundTop: 36, trim: '#efe6d2', frame: '#f8f4ea', eave: 102, dormers: false,
    axes: [0.87], floors: [{ y: [46, 62], w: 12 }, { y: [78, 94], w: 12 }],
    bands: [[35, 37, 1.2]], ground: [],
  },
  {
    name: 'Więzienna SE 3', mid: [7609, -2692], seed: 125, wall: '#f1e6cf', base: '#e8b9a4', groundTop: 36, trim: '#efe6d2', frame: '#f8f4ea', eave: 102, dormers: false,
    axes: [0.4], floors: [{ y: [46, 62], w: 12 }, { y: [78, 94], w: 12 }],
    bands: [[35, 37, 1.2]], ground: [],
  },
];
