import { active } from '../car/index.js';
import { camera } from '../core/renderer.js';
import { drive, st } from '../drive/state.js';
import { makeAvatar, removeAvatar, setCarModel, setLabel } from './avatar.js';
import { chatLine } from './chat.js';
import { updateRemoteSound } from './sound.js';
import { net } from './state.js';

/* ---------- inni gracze: stany z serwera, płynny ruch, przeszkody, dźwięk, położenie dla minimapy i listy graczy ---------- */
// stan s = [x, z, psi, y, pitch, roll, steer, v, rpm, gaz, klakson] jak st w drive/state.js (x, z = środek tylnej osi;
// gaz i klakson 0 albo 1), f = postać, gdy gracz wysiadł, albo 0:
//   [x, z, y, psi]                                  na ziemi, jak me w foot/index.js
//   [x, z, y, psi, auto, lx, lz, ly, lpsi]          na aucie gracza „auto”: położenie w układzie tego auta, więc
//                                                   postać jedzie z autem tak, jak to auto widać u odbiorcy
// p = id kierowcy, u którego gracz jedzie jako pasażer (0 = nie jedzie).
// Stany przychodzą ok. 15 razy na sekundę, nierówno. Każdy ma czas nadawcy k (ms), więc gracza pokazujemy
// DELAY za nadawcą i wygładzamy między dwoma stanami, które obejmują ten moment; gdy nowego stanu brak, auto
// jedzie dalej z ostatnią prędkością (najdłużej MAX_AHEAD), a potem stoi.
const DELAY = 150, MAX_AHEAD = 250;            // ms
const KEEP = 30;                               // stanów w buforze (ok. 2 s)
const LABEL_FAR = 3000;                        // dm: dalej nick nie jest pokazywany
const CAR_LABEL = 17, PERSON_LABEL = 21;       // dm nad podłożem
const others = new Map();                      // id → gracz
let myRiders = new Set();                      // kto jedzie jako pasażer w moim aucie (komunikat w czacie)

function add(id) {
  const o = { id, a: makeAvatar(), buf: [], off: null, spin: 0, pose: null, foot: null, ride: 0 };
  others.set(id, o);
  return o;
}
function remove(o) { removeAvatar(o.a); others.delete(o.id); }
export const nickOf = id => net.roster.get(id) || `Gracz ${id}`;

// stan pokoju z serwera (siebie nie pokazujemy)
export function applyWorld(list, now) {
  const seen = new Set(), riders = new Set();
  for (const [id, car, k, s, f, p = 0] of list) {
    if (id === net.id) continue;
    seen.add(id);
    const o = others.get(id) || add(id);
    setCarModel(o.a, car);
    o.ride = p;
    if (p === net.id) riders.add(id);
    const last = o.buf[o.buf.length - 1];
    if (last && k <= last.k) continue;         // serwer rozsyła ostatni stan, dopóki gracz nie przyśle nowego
    // przesunięcie zegara nadawcy względem naszego: najmniejsze opóźnienie, powoli doganiane w górę
    const off = now - k;
    o.off = o.off === null || off < o.off ? off : o.off + (off - o.off) * 0.02;
    o.buf.push({ k, s, f });
    if (o.buf.length > KEEP) o.buf.shift();
  }
  for (const o of others.values()) if (!seen.has(o.id)) remove(o);
  for (const id of riders) if (!myRiders.has(id)) chatLine('', `${nickOf(id)} jedzie z Tobą jako pasażer`);
  for (const id of myRiders) if (!riders.has(id) && seen.has(id)) chatLine('', `${nickOf(id)} wysiada z Twojego auta`);
  myRiders = riders;
}
export function clearOthers() {
  for (const o of [...others.values()]) remove(o);
  drive.traffic = { cars: [], people: [] };
  myRiders = new Set();
  updateRemoteSound([]);
}

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, u) => a.map((v, j) => lerp(v, b[j], u));
const sameSpot = (a, b) => a && b && a.length === b.length && a[4] === b[4];   // obie na ziemi albo na tym samym aucie
function sample(o, t) {                        // { s, f } w chwili t (czas nadawcy)
  const b = o.buf;
  let i = b.length - 1;
  while (i > 0 && b[i].k > t) i--;
  const A = b[i], B = b[i + 1];
  if (B) {
    const u = (t - A.k) / (B.k - A.k);
    return { s: mix(A.s, B.s, u), f: sameSpot(A.f, B.f) ? mix(A.f, B.f, u) : (u < 0.5 ? A.f : B.f) };
  }
  const s = [...A.s], dt = Math.min(Math.max(t - A.k, 0), MAX_AHEAD) / 1000;
  s[0] += Math.cos(s[2]) * s[7] * dt; s[1] -= Math.sin(s[2]) * s[7] * dt;
  return { s, f: A.f };
}
function ownPose() {
  const { REAR } = active.geo;
  return { cx: st.x + Math.cos(st.psi) * REAR, cz: st.z - Math.sin(st.psi) * REAR, psi: st.psi, y: st.y };
}
// postać w układzie świata; stojąca na aucie liczona od tego auta, tak jak jest widoczne tutaj
function personWorld(f) {
  if (!f || f.length < 9) return f;
  const base = f[4] === net.id ? ownPose() : others.get(f[4])?.pose;
  if (!base) return f;
  const c = Math.cos(base.psi), s = Math.sin(base.psi);
  return [base.cx + f[5] * c + f[6] * s, base.cz - f[5] * s + f[6] * c, base.y + f[7], base.psi + f[8]];
}
export function updateOthers(dt, now) {
  const cars = [], people = [], sounds = [], riders = new Map();
  // 1. auta: położenie, koła, przesunięcie od poprzedniej klatki (pieszy na dachu jedzie razem z autem)
  for (const o of others.values()) {
    if (!o.buf.length) continue;
    const { rig, wheels, model } = o.a;
    const { s: [x, z, psi, y, pitch, roll, steer, v, rpm = 0, gas = 0, horn = 0], f } = sample(o, now - o.off - DELAY);
    const rear = -model.dims.axR, prev = o.pose;
    o.pose = { cx: x + Math.cos(psi) * rear, cz: z - Math.sin(psi) * rear, psi, y };
    o.f = f;
    rig.position.set(o.pose.cx, y, o.pose.cz);
    rig.rotation.set(roll, psi, pitch);
    o.spin -= v * dt / model.dims.wr;
    for (const { w, spin, front } of wheels) { spin.rotation.z = o.spin; if (front) w.rotation.y = steer; }
    const move = prev ? [o.pose.cx - prev.cx, o.pose.cz - prev.cz, psi - prev.psi, y - prev.y] : [0, 0, 0, 0];
    const [hx, hz] = model.hit.box;
    cars.push({ id: o.id, ...o.pose, hx, hz, v, model, rig, move });
    sounds.push({ id: o.id, x: o.pose.cx, z: o.pose.cz, model, rpm, load: gas, horn: horn > 0.5, engine: !f && !o.ride && rpm > 0 });
    if (o.ride) riders.set(o.ride, [...(riders.get(o.ride) || []), nickOf(o.id)]);
  }
  if (drive.ride) riders.set(drive.ride.id, [...(riders.get(drive.ride.id) || []), 'ty']);
  // 2. postacie (także na autach, więc po autach) i nicki; pasażer siedzi w cudzym aucie: bez postaci, nick przy kierowcy
  for (const o of others.values()) {
    if (!o.pose) continue;
    const { person, label } = o.a, f = o.ride ? null : personWorld(o.f);
    o.foot = f;
    person.g.visible = !!f;
    if (f) { person.g.position.set(f[0], f[2], f[1]); person.g.rotation.y = f[3]; people.push([f[0], f[1], f[2]]); }
    const [lx, ly, lz] = f ? [f[0], f[2] + PERSON_LABEL, f[1]] : [o.pose.cx, o.pose.y + CAR_LABEL, o.pose.cz];
    label.sprite.position.set(lx, ly, lz);
    label.sprite.visible = !o.ride && camera.position.distanceToSquared(label.sprite.position) < LABEL_FAR * LABEL_FAR;
    const with_ = riders.get(o.id);
    setLabel(o.a, with_ ? `${nickOf(o.id)} + ${with_.join(', ')}` : nickOf(o.id));
  }
  drive.traffic = { cars, people };
  updateRemoteSound(sounds);
}
// gdzie są inni: { id, x, z, foot, ride, model } (x, z = postać albo środek auta; pasażer = auto kierowcy)
export function othersWhere() {
  const out = [];
  for (const o of others.values()) {
    if (!o.pose) continue;
    const at = o.ride ? others.get(o.ride)?.pose || (o.ride === net.id ? ownPose() : o.pose) : o.pose;
    out.push({ id: o.id, x: o.foot ? o.foot[0] : at.cx, z: o.foot ? o.foot[1] : at.cz, foot: !!o.foot, ride: o.ride, model: o.a.model });
  }
  return out;
}
