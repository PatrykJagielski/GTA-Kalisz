import { active } from '../car/index.js';
import { hits } from './collision.js';
import { drive, st } from './state.js';

/* ---------- inni gracze jako przeszkody: auta (prostokąty) i piesi (koła) ---------- */
// drive.traffic uzupełnia co klatkę net/remote.js:
//   cars   = [{ cx, cz, psi, hx, hz, v }]  środek auta, kurs, pół długości i szerokości (hit.box modelu), prędkość
//   people = [[x, z, y]]                   stopy postaci
// Każdy gracz rozwiązuje zderzenia tylko dla siebie: odsuwa własne auto i zmienia jego prędkość, a drugi gracz robi
// to samo u siebie. Cudze auto widzimy ok. 150 ms wstecz, więc przy uderzeniu auta mogą na chwilę na siebie wejść.
const PERSON_R = 2.2;                          // dm, jak R w foot/person.js
const BOUNCE = 0.3;                            // sprężystość zderzenia aut (0 = bez odbicia)

const axes = psi => [[Math.cos(psi), -Math.sin(psi)], [Math.sin(psi), Math.cos(psi)]];   // przód, bok (x, z)
// dwa prostokąty (twierdzenie o osi rozdzielającej): null albo najkrótsze wypchnięcie A z B { nx, nz, depth }
function overlap(a, b) {
  const A = axes(a.psi), B = axes(b.psi), dx = a.cx - b.cx, dz = a.cz - b.cz;
  let best = null;
  for (const [ux, uz] of [...A, ...B]) {
    const ra = a.hx * Math.abs(A[0][0] * ux + A[0][1] * uz) + a.hz * Math.abs(A[1][0] * ux + A[1][1] * uz);
    const rb = b.hx * Math.abs(B[0][0] * ux + B[0][1] * uz) + b.hz * Math.abs(B[1][0] * ux + B[1][1] * uz);
    const d = dx * ux + dz * uz, depth = ra + rb - Math.abs(d);
    if (depth <= 0) return null;
    if (!best || depth < best.depth) best = { nx: d < 0 ? -ux : ux, nz: d < 0 ? -uz : uz, depth };
  }
  return best;
}
// punkt (z zapasem r) w prostokącie auta
function inCar(c, x, z, r) {
  const dx = x - c.cx, dz = z - c.cz, co = Math.cos(c.psi), s = Math.sin(c.psi);
  return Math.abs(dx * co - dz * s) < c.hx + r && Math.abs(dx * s + dz * co) < c.hz + r;
}
const self = (cx, cz, psi) => { const [hx, hz] = active.model.hit.box; return { cx, cz, psi, hx, hz }; };

// własne auto na cudzym pieszym: jak słupek, auto staje
export function hitsPeople(cx, cz, psi) {
  const me = self(cx, cz, psi);
  return drive.traffic.people.some(([x, z, y]) => Math.abs(y - st.y) < 12 && inCar(me, x, z, PERSON_R));
}
// własne auto na cudzym aucie: wypchnięcie (jeśli nie wjedzie przez to w budynek) i zderzenie sprężyste po normalnej;
// zwraca siłę uderzenia (0 = brak), żeby fizyka mogła stuknąć zawieszeniem
export function bumpCars(cx, cz) {
  let hit = 0;
  for (const o of drive.traffic.cars) {
    const c = overlap(self(cx, cz, st.psi), o);
    if (!c) continue;
    const px = c.nx * (c.depth + 0.3), pz = c.nz * (c.depth + 0.3);
    if (!hits(cx + px, cz + pz, st.psi)) { st.x += px; st.z += pz; cx += px; cz += pz; }
    const fx = Math.cos(st.psi), fz = -Math.sin(st.psi), ox = Math.cos(o.psi) * o.v, oz = -Math.sin(o.psi) * o.v;
    const rel = (fx * st.v - ox) * c.nx + (fz * st.v - oz) * c.nz;           // < 0: auta zbliżają się
    if (rel < 0) {
      const j = -(1 + BOUNCE) / 2 * rel;                                     // równe masy
      st.v = (fx * st.v + j * c.nx) * fx + (fz * st.v + j * c.nz) * fz;      // bok gubią opony
      hit = Math.max(hit, -rel);
    }
  }
  return hit;
}
// pieszy (stopy na wysokości y) w cudzym aucie albo w cudzej postaci
export function trafficBlocks(x, z, y) {
  const { cars, people } = drive.traffic;
  return cars.some(c => inCar(c, x, z, PERSON_R)) ||
    people.some(([px, pz, py]) => Math.abs(py - y) < 15 && (px - x) ** 2 + (pz - z) ** 2 < (2 * PERSON_R) ** 2);
}
// wolne miejsce na start obok zajętego: w bok, potem do tyłu (środek auta i kurs); bez innych graczy — start
export function freeSpot(cx, cz, psi) {
  const fx = Math.cos(psi), fz = -Math.sin(psi), sx = Math.sin(psi), sz = Math.cos(psi);
  const [hx, hz] = active.model.hit.box;
  for (const [f, s] of [[0, 0], [0, 1], [0, -1], [-1, 0], [-1, 1], [-1, -1], [-2, 0], [1, 0], [-2, 1], [-2, -1]]) {
    const x = cx + fx * f * (2 * hx + 8) + sx * s * (2 * hz + 8), z = cz + fz * f * (2 * hx + 8) + sz * s * (2 * hz + 8);
    if (!hits(x, z, psi) && !drive.traffic.cars.some(o => overlap(self(x, z, psi), { ...o, hx: o.hx + 4, hz: o.hz + 4 }))) return [x, z];
  }
  return [cx, cz];
}
