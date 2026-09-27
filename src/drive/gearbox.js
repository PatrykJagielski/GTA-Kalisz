import { st } from './state.js';

/* ---------- automatyczna skrzynia 5-biegowa i obroty silnika ---------- */
export const KMH = 0.36;                                     // dm/s -> km/h
const GEARS = [9.5, 17.5, 28, 39, 50];                // km/h na 1000 obr/min (zmiana biegu w górę przy 37, 68, 109, 152 km/h)
export function updateGearbox(dt, gas) {
  const kmh = Math.abs(st.v) * KMH;
  if (st.v < -0.5) { st.rpm = Math.max(850, kmh / 9 * 1000); return; }
  let r = kmh / GEARS[st.gear - 1] * 1000;
  if (r > 3900 && st.gear < GEARS.length) st.gear++; else if (r < 1500 && st.gear > 1) st.gear--;
  r = kmh / GEARS[st.gear - 1] * 1000;
  if (kmh < 9) r = Math.max(r, 850 + (gas ? 1400 : 0));
  st.rpm += (Math.min(4700, Math.max(850, r)) - st.rpm) * Math.min(1, dt * 8);
}
