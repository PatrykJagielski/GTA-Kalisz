import { camera } from '../core/renderer.js';
import { drive } from '../drive/state.js';
import { makeAvatar, removeAvatar, setCarModel, setLabel } from './avatar.js';
import { updateRemoteSound } from './sound.js';
import { net } from './state.js';

/* ---------- inni gracze: stany z serwera, płynny ruch, przeszkody, dźwięk, położenie dla minimapy i listy graczy ---------- */
// stan s = [x, z, psi, y, pitch, roll, steer, v, rpm, gaz, klakson] jak st w drive/state.js (x, z = środek tylnej osi;
// gaz i klakson 0 albo 1), f = [x, z, y, psi] postaci jak me w foot/index.js albo 0, gdy gracz siedzi w aucie.
// Stany przychodzą ok. 15 razy na sekundę, nierówno. Każdy ma czas nadawcy k (ms), więc gracza pokazujemy
// DELAY za nadawcą i wygładzamy między dwoma stanami, które obejmują ten moment; gdy nowego stanu brak, auto
// jedzie dalej z ostatnią prędkością (najdłużej MAX_AHEAD), a potem stoi.
const DELAY = 150, MAX_AHEAD = 250;            // ms
const KEEP = 30;                               // stanów w buforze (ok. 2 s)
const LABEL_FAR = 3000;                        // dm: dalej nick nie jest pokazywany
const CAR_LABEL = 17, PERSON_LABEL = 21;       // dm nad podłożem
const others = new Map();                      // id → gracz

function add(id) {
  const o = { id, a: makeAvatar(), buf: [], off: null, spin: 0, cx: 0, cz: 0, foot: null };
  others.set(id, o);
  return o;
}
function remove(o) { removeAvatar(o.a); others.delete(o.id); }
export const nickOf = id => net.roster.get(id) || `Gracz ${id}`;

// stan pokoju z serwera (siebie nie pokazujemy)
export function applyWorld(list, now) {
  const seen = new Set();
  for (const [id, car, k, s, f] of list) {
    if (id === net.id) continue;
    seen.add(id);
    const o = others.get(id) || add(id);
    setCarModel(o.a, car);
    const last = o.buf[o.buf.length - 1];
    if (last && k <= last.k) continue;         // serwer rozsyła ostatni stan, dopóki gracz nie przyśle nowego
    // przesunięcie zegara nadawcy względem naszego: najmniejsze opóźnienie, powoli doganiane w górę
    const off = now - k;
    o.off = o.off === null || off < o.off ? off : o.off + (off - o.off) * 0.02;
    o.buf.push({ k, s, f });
    if (o.buf.length > KEEP) o.buf.shift();
  }
  for (const o of others.values()) if (!seen.has(o.id)) remove(o);
}
export function clearOthers() {
  for (const o of [...others.values()]) remove(o);
  drive.traffic = { cars: [], people: [] };
  updateRemoteSound([]);
}

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, u) => a.map((v, j) => lerp(v, b[j], u));
function sample(o, t) {                        // { s, f } w chwili t (czas nadawcy)
  const b = o.buf;
  let i = b.length - 1;
  while (i > 0 && b[i].k > t) i--;
  const A = b[i], B = b[i + 1];
  if (B) {
    const u = (t - A.k) / (B.k - A.k);
    return { s: mix(A.s, B.s, u), f: A.f && B.f ? mix(A.f, B.f, u) : (u < 0.5 ? A.f : B.f) };
  }
  const s = [...A.s], dt = Math.min(Math.max(t - A.k, 0), MAX_AHEAD) / 1000;
  s[0] += Math.cos(s[2]) * s[7] * dt; s[1] -= Math.sin(s[2]) * s[7] * dt;
  return { s, f: A.f };
}
export function updateOthers(dt, now) {
  const cars = [], people = [], sounds = [];
  for (const o of others.values()) {
    if (!o.buf.length) continue;
    const { rig, wheels, model, person, label } = o.a;
    const { s: [x, z, psi, y, pitch, roll, steer, v, rpm = 0, gas = 0, horn = 0], f } = sample(o, now - o.off - DELAY);
    const rear = -model.dims.axR;
    o.cx = x + Math.cos(psi) * rear; o.cz = z - Math.sin(psi) * rear; o.foot = f;
    rig.position.set(o.cx, y, o.cz);
    rig.rotation.set(roll, psi, pitch);
    o.spin -= v * dt / model.dims.wr;
    for (const { w, spin, front } of wheels) { spin.rotation.z = o.spin; if (front) w.rotation.y = steer; }
    person.g.visible = !!f;
    if (f) { person.g.position.set(f[0], f[2], f[1]); person.g.rotation.y = f[3]; }
    // nick nad postacią albo nad autem, w którym gracz siedzi
    const [lx, ly, lz] = f ? [f[0], f[2] + PERSON_LABEL, f[1]] : [o.cx, y + CAR_LABEL, o.cz];
    label.sprite.position.set(lx, ly, lz);
    label.sprite.visible = camera.position.distanceToSquared(label.sprite.position) < LABEL_FAR * LABEL_FAR;
    setLabel(o.a, nickOf(o.id));
    const [hx, hz] = model.hit.box;
    cars.push({ cx: o.cx, cz: o.cz, psi, hx, hz, v });
    if (f) people.push([f[0], f[1], f[2]]);
    sounds.push({ id: o.id, x: o.cx, z: o.cz, model, rpm, load: gas, horn: horn > 0.5, engine: !f && rpm > 0 });
  }
  drive.traffic = { cars, people };
  updateRemoteSound(sounds);
}
// gdzie są inni: { id, x, z, foot, model } (x, z = postać albo środek auta)
export function othersWhere() {
  const out = [];
  for (const o of others.values()) {
    if (!o.buf.length) continue;
    out.push({ id: o.id, x: o.foot ? o.foot[0] : o.cx, z: o.foot ? o.foot[1] : o.cz, foot: !!o.foot, model: o.a.model });
  }
  return out;
}
