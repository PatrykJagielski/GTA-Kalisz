import { st } from './state.js';

/* ---------- automatyczna skrzynia 6-biegowa i obroty silnika ---------- */
export const KMH = 0.36;                                     // dm/s -> km/h
const GEARS = [10.2, 18.6, 29, 38.5, 47.5, 56.5];     // km/h na 1000 obr/min
export function updateGearbox(dt, gas) {
  const kmh = Math.abs(st.v) * KMH;
  if (st.v < -0.5) { st.rpm = Math.max(850, kmh / 9 * 1000); return; }
  let r = kmh / GEARS[st.gear - 1] * 1000;
  if (r > 3900 && st.gear < 6) st.gear++; else if (r < 1500 && st.gear > 1) st.gear--;
  r = kmh / GEARS[st.gear - 1] * 1000;
  if (kmh < 9) r = Math.max(r, 850 + (gas ? 1400 : 0));
  st.rpm += (Math.min(4700, Math.max(850, r)) - st.rpm) * Math.min(1, dt * 8);
}
