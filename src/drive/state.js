import { V } from '../core/geometry.js';

/* ---------- stan jazdy: wspólny dla fizyki, kamery, dźwięku i interfejsu ---------- */
// auto: x, z = środek tylnej osi (dm), psi = kurs, v = prędkość (dm/s), wh = wysokość podłoża pod kołami
export const st = { x: 0, z: 0, psi: 0, v: 0, steer: 0, gear: 1, rpm: 850, spin: 0, y: 0, pitch: 0, roll: 0, wh: [0, 0, 0, 0] };
// city = zbudowane miasto, keys = wciśnięte klawisze i przyciski dotykowe, last = pozycja z poprzedniej klatki
export const drive = { city: null, cam: 'chase', keys: {}, sound: false, audio: null, last: V(), grass: 0, streetT: 0, street: '', loading: false };
