/* ---------- ulica Kredytowa: cała ulica (69 m), kamienice mocno zniszczone i okopcone ---------- */
// Według Street View (2024-2025), format jak w zamkowa-kit.js. Opisy od lewej do prawej patrząc z jezdni na elewację;
// `house` uzupełnia piętra, gzymsy, okap i ziarno.
const PITCH = 37;
let seed = 1500;
const ax = (n, a = 0, b = 1) => [...Array(n).keys()].map(i => a + (b - a) * (i + 0.5) / n);
const shop = (x, frame, extra = {}) => ({ k: 'shop', x, y: [4, 42], frame, ...extra });
const win = (x, frame = '#f4f2ec') => shop(x, frame);
const arch = (x, rise, extra = {}) => ({ k: 'arch', x, y: [3, 40], rise, ...extra });
const door = (x, extra = {}) => ({ k: 'door', x, y: [3, 40], ...extra });

function house({ name, mid, wall, base = null, g = 56, n = 4, w = 8.5, hood, axes, trim = '#f2eee2', frame = '#f4f2ec', ground = [], signs = [], ...rest }) {
  const y0 = g + 12, eave = y0 + PITCH * n + 14, ww = Math.min(w, 11);
  const floors = [...Array(n).keys()].map(i => ({ y: [y0 + PITCH * i, y0 + PITCH * i + 25], w: ww - (i === n - 1 ? 0.5 : 0), hood }));
  return {
    name, mid, seed: ++seed, wall, base, groundTop: g, trim, frame, eave, axes: axes || ax(Math.max(2, Math.round((rest.len || 80) / 30))),
    floors, bands: [[g - 4, g + 1, 2.4], [eave - 9, eave - 5, 1.6], [eave - 5, eave, 4]], ground, signs, ...rest,
  };
}

export const KREDYTOWA = [
  house({
    // okopcona ciemna narożna kamienica z boniowanym parterem i łukowymi oknami w czerwonych ramach
    name: 'Ciemna narożna', mid: [-1588, 4138], wall: '#5a5650', base: '#4a4640', g: 66, n: 3, w: 8, trim: '#6a665e', axes: ax(2, 0.2, 0.8), len: 45, stains: true, rustic: [[0, 64]],
    ground: [arch([0.2, 0.8], 8, { frame: '#8a2a1a', ring: '#5a5650' })],
  }),
  house({
    // okopcona z boniowanym parterem, łukowe okna z białymi ramami i wachlarzowymi nadprożami
    name: 'Ciemna z łukami', mid: [-1521, 4068], wall: '#5e5a54', base: '#4a4640', g: 66, n: 3, w: 8, trim: '#6e6a62', axes: ax(4, 0.1, 0.9), len: 149, stains: true, rustic: [[0, 64]],
    ground: [arch([0.06, 0.18], 7, { frame: '#f4f2ec', ring: '#5e5a54' }), arch([0.3, 0.42], 7, { frame: '#f4f2ec', ring: '#5e5a54' }), arch([0.56, 0.68], 7, { frame: '#f4f2ec', ring: '#5e5a54' }), arch([0.82, 0.94], 7, { frame: '#f4f2ec', ring: '#5e5a54' })],
  }),
  house({
    // różowobrązowy tynk z zamurowanymi niszami nad oknami, okna w białych ramach
    name: 'Zamurowane nisze', mid: [-1470, 4139], wall: '#b89888', base: '#a88878', g: 56, n: 2, w: 7, trim: '#cfb8a8', axes: ax(5, 0.1, 0.9), len: 265, stains: true,
    ground: [win([0.1, 0.18]), win([0.4, 0.5]), win([0.7, 0.8])],
  }),
  house({
    // okopcona z balkonem z zieloną balustradą i łukowym oknem w parterze
    name: 'Z zielonym balkonem', mid: [-1446, 4004], wall: '#5a5650', base: '#4a4640', g: 66, n: 3, w: 8, trim: '#6a665e', axes: ax(2, 0.2, 0.8), len: 48, stains: true, rustic: [[0, 64]],
    balconies: [[1, 0.1, 0.9, 10, true]],
    ground: [arch([0.2, 0.8], 8, { frame: '#f4f2ec', ring: '#5a5650' })],
  }),
  house({
    // złuszczony tynk z odsłoniętą cegłą, boniowany parter, okno z kratą
    name: 'Ze złuszczonym tynkiem', mid: [-1319, 3995], wall: '#cfc4b4', base: '#c4b8a6', g: 66, n: 2, w: 7.5, trim: '#dcd2c2', axes: [0.3, 0.75], len: 72, stains: true, rustic: [[0, 64]],
  }),
  house({
    // zaniedbana narożna: cegła i odpadający tynk, drewniane drzwi
    name: 'Zaniedbana z drzwiami', mid: [-1246, 3952], wall: '#c0b4a2', base: '#b8a898', g: 62, n: 2, w: 7.5, trim: '#d0c6b4', axes: [0.2, 0.55], len: 101, stains: true,
    ground: [door([0.35, 0.45], { frame: '#3a2a1a' })],
  }),
  house({
    // ciemny chropowaty szczyt z jednym okienkiem z kratą
    name: 'Ciemny szczyt', mid: [-1312, 3901], wall: '#6a655a', base: '#5a564c', g: 56, n: 2, w: 4, trim: '#8a857a', axes: [0.5], len: 63, stains: true,
  }),
];
