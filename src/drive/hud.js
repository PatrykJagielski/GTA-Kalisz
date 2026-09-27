import { streetAt } from '../city/streets.js';
import { $ } from '../core/dom.js';
import { KMH } from './gearbox.js';
import { drive, st } from './state.js';

/* ---------- HUD jazdy: prędkościomierz, obrotomierz, bieg, nazwa ulicy ---------- */
// elementy wyszukane raz; zapis do DOM tylko przy zmianie wartości
export const hud = { speed: $('dSpeed'), rpm: $('dRpm'), gear: $('dGear'), street: $('dStreet'), cam: $('dCam') };
function setText(el, text) { if (el.textContent !== text) el.textContent = text; }
export function updateHud(gas) {
  setText(hud.speed, String(Math.round(Math.abs(st.v) * KMH)));
  const rpmW = Math.round(Math.min(100, st.rpm / 50)) + '%';
  if (hud.rpm.style.width !== rpmW) hud.rpm.style.width = rpmW;
  setText(hud.gear, `${st.v < -0.5 ? 'R' : st.v === 0 && !gas ? 'N' : st.gear} · ${Math.round(st.rpm / 10) * 10} obr/min`);
}
// nazwa ulicy co 0,3 s (wyszukiwanie odcinków osi jest tańsze niż co klatkę, ale nie darmowe)
export function updateStreetName(dt, cx, cz) {
  drive.streetT -= dt;
  if (drive.streetT > 0) return;
  drive.streetT = 0.3;
  const nm = streetAt(drive.city, cx, cz);
  if (nm !== drive.street) hud.street.textContent = drive.street = nm;
}
export function resetStreetName() { drive.street = ''; drive.streetT = 0; }
