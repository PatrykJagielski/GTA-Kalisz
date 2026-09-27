import { cellOf } from './spatial.js';

/* ---------- nazwy ulic pod autem ---------- */
function streetName(n) {
  return /^(Aleja|Aleje|Plac|Główny|Nowy|Rynek|Most|Rondo|Bulwar|Wał|Skwer|Park|Stary|Rogatka)\b/.test(n) ? n : 'ul. ' + n;
}
export function streetAt(city, x, z) {
  let best = -1, bd = 1e9;
  for (const [x0, z0, x1, z1, id] of cellOf(city.segs, x, z)) {
    const dx = x1 - x0, dz = z1 - z0, L = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((x - x0) * dx + (z - z0) * dz) / L));
    const d = Math.hypot(x - x0 - dx * t, z - z0 - dz * t);
    if (d < bd) { bd = d; best = id; }
  }
  return best >= 0 && bd < 90 ? streetName(city.names[best]) : 'Kalisz';
}
