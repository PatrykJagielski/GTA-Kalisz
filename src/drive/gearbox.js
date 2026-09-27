import { active } from '../car/index.js';
import { st } from './state.js';

/* ---------- automatyczna skrzynia biegów i obroty silnika ---------- */
// przełożenia i progi obrotów ma każdy model (gears w car/models/*/index.js):
//   ratios = km/h na 1000 obr/min dla kolejnych biegów, up / down = obroty zmiany biegu w górę / w dół,
//   idle = obroty biegu jałowego, max = najwyższe obroty, launch = dodatek obrotów przy ruszaniu z gazem,
//   reverse = km/h na 1000 obr/min na wstecznym
export const KMH = 0.36;                                     // dm/s -> km/h
export function updateGearbox(dt, gas) {
  const G = active.model.gears, kmh = Math.abs(st.v) * KMH;
  if (st.gear > G.ratios.length) st.gear = G.ratios.length;  // po zmianie auta na takie z mniejszą liczbą biegów
  if (st.v < -0.5) { st.rpm = Math.max(G.idle, kmh / G.reverse * 1000); return; }
  let r = kmh / G.ratios[st.gear - 1] * 1000;
  if (r > G.up && st.gear < G.ratios.length) st.gear++; else if (r < G.down && st.gear > 1) st.gear--;
  r = kmh / G.ratios[st.gear - 1] * 1000;
  if (kmh < 9) r = Math.max(r, G.idle + (gas ? G.launch : 0));
  st.rpm += (Math.min(G.max, Math.max(G.idle, r)) - st.rpm) * Math.min(1, dt * 8);
}
