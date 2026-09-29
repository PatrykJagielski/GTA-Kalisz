import { active } from '../car/index.js';
import { camera } from '../core/renderer.js';
import { drive, st } from '../drive/state.js';
import { makeAvatar, removeAvatar, setCarModel, setLabel } from './avatar.js';
import { chatLine } from './chat.js';
import { predict } from './predict.js';
import { updateRemoteSound } from './sound.js';
import { net } from './state.js';

/* ---------- inni gracze: stany z serwera, płynny ruch, przeszkody, dźwięk, położenie dla minimapy i listy graczy ---------- */
// stan s = [x, z, psi, y, pitch, roll, steer, v, rpm, gaz, klakson] jak st w drive/state.js (x, z = środek tylnej osi;
// gaz i klakson 0 albo 1), f = postać, gdy gracz wysiadł, albo 0:
//   [x, z, y, psi]                                  na ziemi, jak me w foot/index.js
//   [x, z, y, psi, auto, lx, lz, ly, lpsi]          na aucie gracza „auto”: położenie w układzie tego auta, więc
//                                                   postać jedzie z autem tak, jak to auto widać u odbiorcy
// p = id kierowcy, u którego gracz jedzie jako pasażer (0 = nie jedzie), q = ping gracza do serwera (ms).
// Stany przychodzą ok. 30 razy na sekundę, nierówno. Każdy ma czas nadawcy k (ms), więc gracza pokazujemy o.delay
// za nadawcą i wygładzamy między dwoma stanami, które obejmują ten moment. o.delay dopasowuje się do łącza: odstęp
// między stanami plus 95. centyl spóźnień pakietów (40–250 ms; w górę szybko, w dół powoli). Gdy nowego stanu brak,
// auto jedzie dalej modelem rowerowym (najdłużej MAX_AHEAD), a potem stoi.
// Zderzenia (drive/traffic.js) liczą się z przewidywanym położeniem cudzego auta „teraz” (o.hit), a nie z tym,
// które widać na ekranie: inaczej przy uderzeniu auta wjeżdżałyby na siebie o drogę przejechaną w czasie opóźnienia.
const DELAY_START = 150, DELAY_MIN = 40, DELAY_MAX = 250, MAX_AHEAD = 250, PREDICT_MAX = 300;   // ms
const JITTER_N = 60;                           // ostatnich pakietów do liczenia spóźnień (ok. 2 s)
const KEEP = 30;                               // stanów w buforze (ok. 2 s)
const LABEL_FAR = 3000;                        // dm: dalej nick nie jest pokazywany
const CAR_LABEL = 17, PERSON_LABEL = 21;       // dm nad podłożem
const others = new Map();                      // id → gracz
let myRiders = new Set();                      // kto jedzie jako pasażer w moim aucie (komunikat w czacie)

function add(id) {
  const o = { id, a: makeAvatar(), buf: [], off: null, delay: DELAY_START, late: [], gap: 33, rtt: 0, spin: 0, pose: null, foot: null, ride: 0 };
  others.set(id, o);
  return o;
}
function remove(o) { removeAvatar(o.a); others.delete(o.id); }
export const nickOf = id => net.roster.get(id) || `Gracz ${id}`;

// przesunięcie zegara nadawcy (najmniejsze opóźnienie pakietu, powoli w górę: dryf zegarów) i bufor dopasowany do łącza
function timing(o, k, now) {
  const lat = now - k, last = o.buf[o.buf.length - 1];
  o.off = o.off === null || lat < o.off ? lat : o.off + (lat - o.off) * 0.002;
  o.late.push(lat - o.off);
  if (o.late.length > JITTER_N) o.late.shift();
  if (last) o.gap += (Math.min(k - last.k, 200) - o.gap) * 0.1;
  const sorted = [...o.late].sort((a, b) => a - b), p95 = sorted[Math.floor(sorted.length * 0.95)];
  const target = Math.min(DELAY_MAX, Math.max(DELAY_MIN, o.gap + p95 + 10));
  o.delay += (target - o.delay) * (target > o.delay ? 0.3 : 0.03);   // lepiej chwilę później niż szarpnięcie
}
// stany graczy z serwera: pojedynczy ('u', od razu) albo wszystkie ('w', raz na sekundę); siebie nie pokazujemy
export function applyStates(list, now) {
  for (const [id, car, k, s, f, p = 0, q = 0] of list) {
    if (id === net.id) continue;
    const o = others.get(id) || add(id);
    setCarModel(o.a, car);
    if (p === net.id && !myRiders.has(id)) { myRiders.add(id); chatLine('', `${nickOf(id)} jedzie z Tobą jako pasażer`); }
    if (p !== net.id && myRiders.has(id)) { myRiders.delete(id); chatLine('', `${nickOf(id)} wysiada z Twojego auta`); }
    o.ride = p; o.rtt = q;
    const last = o.buf[o.buf.length - 1];
    if (last && k <= last.k) continue;         // pełny stan powtarza to, co już przyszło
    timing(o, k, now);
    o.buf.push({ k, s, f });
    if (o.buf.length > KEEP) o.buf.shift();
  }
}
// po zmianie składu pokoju: kto wyszedł, znika
export function keepOnly(roster) {
  for (const o of [...others.values()]) if (!roster.has(o.id)) { myRiders.delete(o.id); remove(o); }
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
const wheelbase = o => o.a.model.dims.axF - o.a.model.dims.axR;
function sample(o, t) {                        // { s, f } w chwili t (czas nadawcy)
  const b = o.buf;
  let i = b.length - 1;
  while (i > 0 && b[i].k > t) i--;
  const A = b[i], B = b[i + 1];
  if (B) {
    const u = (t - A.k) / (B.k - A.k);
    return { s: mix(A.s, B.s, u), f: sameSpot(A.f, B.f) ? mix(A.f, B.f, u) : (u < 0.5 ? A.f : B.f) };
  }
  return { s: predict(A.s, wheelbase(o), Math.min(Math.max(t - A.k, 0), MAX_AHEAD) / 1000), f: A.f };
}
// położenie auta „teraz” u nadawcy, do zderzeń: ostatni stan przesunięty o jego wiek i drogę pakietu
// nadawca → serwer → my (połowa pingu każdego z nas)
function predictedHit(o, now, rear, hx, hz) {
  const last = o.buf[o.buf.length - 1], rtt = net.rtt || 80;
  const ahead = Math.min(PREDICT_MAX, Math.max(0, now - o.off - last.k) + (rtt + (o.rtt || rtt)) / 2) / 1000;
  const [x, z, psi] = predict(last.s, wheelbase(o), ahead);
  return { cx: x + Math.cos(psi) * rear, cz: z - Math.sin(psi) * rear, psi, hx, hz };
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
    const { s: [x, z, psi, y, pitch, roll, steer, v, rpm = 0, gas = 0, horn = 0], f } = sample(o, now - o.off - o.delay);
    const rear = -model.dims.axR, prev = o.pose;
    o.pose = { cx: x + Math.cos(psi) * rear, cz: z - Math.sin(psi) * rear, psi, y };
    o.f = f;
    rig.position.set(o.pose.cx, y, o.pose.cz);
    rig.rotation.set(roll, psi, pitch);
    o.spin -= v * dt / model.dims.wr;
    for (const { w, spin, front } of wheels) { spin.rotation.z = o.spin; if (front) w.rotation.y = steer; }
    const move = prev ? [o.pose.cx - prev.cx, o.pose.cz - prev.cz, psi - prev.psi, y - prev.y] : [0, 0, 0, 0];
    const [hx, hz] = model.hit.box;
    cars.push({ id: o.id, ...o.pose, hx, hz, v, model, rig, move, hit: predictedHit(o, now, rear, hx, hz) });
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
// gdzie są inni: { id, x, z, foot, ride, model, rtt, delay } (x, z = postać albo środek auta; pasażer = auto kierowcy)
export function othersWhere() {
  const out = [];
  for (const o of others.values()) {
    if (!o.pose) continue;
    const at = o.ride ? others.get(o.ride)?.pose || (o.ride === net.id ? ownPose() : o.pose) : o.pose;
    out.push({ id: o.id, x: o.foot ? o.foot[0] : at.cx, z: o.foot ? o.foot[1] : at.cz, foot: !!o.foot, ride: o.ride, model: o.a.model, rtt: o.rtt, delay: o.delay });
  }
  return out;
}
