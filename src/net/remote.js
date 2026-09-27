import * as THREE from 'three';
import { carParts, modelById } from '../car/index.js';
import { createShadow } from '../car/shadow.js';
import { scene } from '../core/renderer.js';

/* ---------- auta innych graczy: kopie brył, płynny ruch między stanami z serwera ---------- */
// stan s = [x, z, psi, y, pitch, roll, steer, v] jak st w drive/state.js (x, z = środek tylnej osi)
// Stany przychodzą ok. 15 razy na sekundę, nierówno. Każdy ma czas nadawcy k (ms), więc auto pokazujemy
// DELAY za nadawcą i wygładzamy między dwoma stanami, które obejmują ten moment; gdy nowego stanu brak, auto
// jedzie dalej z ostatnią prędkością (najdłużej MAX_AHEAD), a potem stoi.
const DELAY = 150, MAX_AHEAD = 250;            // ms
const KEEP = 30;                               // stanów w buforze (ok. 2 s)
const others = new Map();                      // id → gracz
let shadowTemplate = null;

// kopia zbudowanego auta: bryły i materiały wspólne, własne położenie kół
function cloneCar(model) {
  const { car, wheels } = carParts(model), copy = car.clone();
  const path = o => { const p = []; for (; o !== car; o = o.parent) p.unshift(o.parent.children.indexOf(o)); return p; };
  const at = p => p.reduce((o, i) => o.children[i], copy);
  return { car: copy, wheels: wheels.map(({ w, spin, front }) => ({ w: at(path(w)), spin: at(path(spin)), front })) };
}
function setModel(o, id) {
  const model = modelById(id);
  if (o.model === model) return;
  o.model = model;
  const { car, wheels } = cloneCar(model);
  shadowTemplate = shadowTemplate || createShadow();
  const shadow = shadowTemplate.clone(); shadow.scale.set(model.shadow[0], model.shadow[1], 1);
  o.rig.clear(); o.rig.add(car, shadow); o.wheels = wheels;
}
function add(id) {
  const o = { id, rig: new THREE.Group(), model: null, wheels: [], buf: [], off: null, spin: 0 };
  o.rig.rotation.order = 'YZX';                // jak placeCar: kurs, potem pochylenie, potem przechył
  scene.add(o.rig); others.set(id, o);
  return o;
}
function remove(o) { scene.remove(o.rig); others.delete(o.id); }

// stan pokoju z serwera; me = własne id (siebie nie pokazujemy)
export function applyWorld(list, me, now) {
  const seen = new Set();
  for (const [id, car, k, s] of list) {
    if (id === me) continue;
    seen.add(id);
    const o = others.get(id) || add(id);
    setModel(o, car);
    const last = o.buf[o.buf.length - 1];
    if (last && k <= last.k) continue;         // serwer rozsyła ostatni stan, dopóki gracz nie przyśle nowego
    // przesunięcie zegara nadawcy względem naszego: najmniejsze opóźnienie, powoli doganiane w górę
    const off = now - k;
    o.off = o.off === null || off < o.off ? off : o.off + (off - o.off) * 0.02;
    o.buf.push({ k, s });
    if (o.buf.length > KEEP) o.buf.shift();
  }
  for (const o of others.values()) if (!seen.has(o.id)) remove(o);
}
export function clearOthers() { for (const o of [...others.values()]) remove(o); }
export const othersCount = () => others.size;

const lerp = (a, b, t) => a + (b - a) * t;
function sample(o, t) {                        // stan w chwili t (czas nadawcy)
  const b = o.buf;
  let i = b.length - 1;
  while (i > 0 && b[i].k > t) i--;
  const A = b[i], B = b[i + 1];
  if (B) { const u = (t - A.k) / (B.k - A.k); return A.s.map((v, j) => lerp(v, B.s[j], u)); }
  const s = [...A.s], dt = Math.min(Math.max(t - A.k, 0), MAX_AHEAD) / 1000;
  s[0] += Math.cos(s[2]) * s[7] * dt; s[1] -= Math.sin(s[2]) * s[7] * dt;
  return s;
}
export function updateOthers(dt, now) {
  for (const o of others.values()) {
    if (!o.buf.length) continue;
    const [x, z, psi, y, pitch, roll, steer, v] = sample(o, now - o.off - DELAY);
    const rear = -o.model.dims.axR;
    o.rig.position.set(x + Math.cos(psi) * rear, y, z - Math.sin(psi) * rear);
    o.rig.rotation.set(roll, psi, pitch);
    o.spin -= v * dt / o.model.dims.wr;
    for (const { w, spin, front } of o.wheels) { spin.rotation.z = o.spin; if (front) w.rotation.y = steer; }
  }
}
