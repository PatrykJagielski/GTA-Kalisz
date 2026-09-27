import { active, rig, wheelGroups } from '../car/index.js';
import { camera } from '../core/renderer.js';
import { thump } from './audio.js';
import { heightOf, hits, surfaceAt } from './collision.js';
import { KMH } from './gearbox.js';
import { drive, st } from './state.js';

/* ---------- fizyka auta: model rowerowy, opory, zawieszenie, zderzenia ---------- */
// wymiary (rozstaw osi WB, położenie środka auta REAR, koła WHEELS) i osiągi pochodzą z wybranego modelu: active w car/index.js
// napęd: przy ruszaniu przyspieszenie ogranicza przyczepność opon (grip), potem stała moc silnika (power / prędkość);
// opory: toczenia (roll) i powietrza (air · v²); vmax = ogranicznik prędkości (km/h), jeśli model go ma
const CURB_LOSS = 0.98;                        // każde uderzenie kół o krawężnik zabiera 2% prędkości
const MAX_STEP = 5;                            // najdłuższy krok ruchu (dm): przy dużej prędkości krok dzieli się na części,
                                               // żeby auto nie przeskoczyło przez wąską przeszkodę

// sterowanie z klawiatury (strzałki, WASD, spacja) i przycisków dotykowych
export function readInput(k) {
  return {
    gas: !!(k.KeyW || k.ArrowUp || k.tgas),
    brake: !!(k.KeyS || k.ArrowDown || k.tbrake),
    steer: (k.KeyA || k.ArrowLeft || k.tleft ? 1 : 0) - (k.KeyD || k.ArrowRight || k.tright ? 1 : 0),
    handbrake: !!k.Space,
  };
}

// zawieszenie: wysokość i przechyły z wysokości pod czterema kołami; zwraca udział kół na trawie
function suspension(cx, cz, dt, jump) {
  const { WB, WHEELS } = active.geo, c = Math.cos(st.psi), s = Math.sin(st.psi);
  let step = 0, grass = 0;
  const h = WHEELS.map(([lx, lz], i) => {
    const x = cx + lx * c + lz * s, z = cz - lx * s + lz * c, k = surfaceAt(x, z), v = heightOf(k, x, z);
    step = Math.max(step, Math.abs(v - st.wh[i])); if (k === 2) grass++;
    return v;
  });
  if (step > 0.5 && !jump) { st.v *= CURB_LOSS; thump(Math.min(1, Math.abs(st.v) / 120 + 0.3)); }
  st.wh = h;
  const y = (h[0] + h[1] + h[2] + h[3]) / 4;
  const pitch = Math.atan(((h[0] + h[1]) - (h[2] + h[3])) / 2 / WB);
  const roll = Math.atan(((h[0] + h[2]) - (h[1] + h[3])) / 2 / (2 * active.model.dims.trackZ));
  const k = jump ? 1 : Math.min(1, dt * 14);
  st.y += (y - st.y) * k; st.pitch += (pitch - st.pitch) * k; st.roll += (roll - st.roll) * k;
  return grass / 4;
}
export function resetCar() {
  const { REAR } = active.geo, [x, z, psi0] = drive.city.start, psi = psi0 + Math.PI;   // start obrócony o 180°
  Object.assign(st, { x: x - Math.cos(psi) * REAR, z: z + Math.sin(psi) * REAR, psi, v: 0, steer: 0, gear: 1, rpm: active.model.gears.idle });
  suspension(x, z, 0, true); placeCar();
  camera.position.set(x - Math.cos(psi) * 90, 34, z + Math.sin(psi) * 90); drive.last.set(x, 0, z);
}
export function placeCar() {
  const { REAR } = active.geo;
  rig.position.set(st.x + Math.cos(st.psi) * REAR, st.y, st.z - Math.sin(st.psi) * REAR);
  rig.rotation.order = 'YZX';                                                  // kurs, potem pochylenie, potem przechył
  rig.rotation.set(st.roll, st.psi, st.pitch);
}
// jeden krok fizyki; zwraca środek auta (cx, cz) po kroku
export function stepCar(dt, input) {
  const n = Math.max(1, Math.ceil(Math.abs(st.v) * dt / MAX_STEP));
  let c;
  for (let i = 0; i < n; i++) c = move(dt / n, input);
  placeCar();
  // koła: obrót i skręt przednich
  st.spin -= st.v * dt / active.model.dims.wr;
  for (const { w, spin, front } of wheelGroups) { spin.rotation.z = st.spin; if (front) w.rotation.y = st.steer; }
  return c;
}
function move(dt, input) {
  const { gas, brake } = input, { WB, REAR } = active.geo, { grip, power, roll, air, vmax } = active.model.perf;
  let a = 0;
  if (gas && st.v < -1) a += 90;                                                  // gaz przy cofaniu = hamowanie
  else if (gas) {
    a += Math.min(grip, power / Math.max(st.v, 1));
    if (vmax) a *= Math.min(1, Math.max(0, (vmax - st.v * KMH) / 4));             // ogranicznik: napęd słabnie w ostatnich 4 km/h
  }
  if (brake) a -= st.v > 1 ? 90 : (st.v > -70 ? 26 : 0);                          // hamulec, potem wsteczny do ~25 km/h
  if (input.handbrake) a -= Math.sign(st.v) * 70;
  // trawa: mały opór przy ruszaniu, rosnący z prędkością (maks. ok. 38 km/h), zawsze słabszy niż napęd
  const drag = Math.sign(st.v) * (roll + air * st.v * st.v + drive.grass * (6 + Math.abs(st.v) * 0.37));
  let v = st.v + (a - drag) * dt;
  if (!gas && !brake && Math.abs(v) < 3) v = 0;
  st.v = v;
  const maxSteer = 0.6 / (1 + Math.abs(v) / 200);
  st.steer += (input.steer * maxSteer - st.steer) * Math.min(1, dt * 5);
  const ox = st.x, oz = st.z, op = st.psi;
  st.psi += v / WB * Math.tan(st.steer) * dt;                                     // model rowerowy: obrót wokół tylnej osi
  st.x += Math.cos(st.psi) * v * dt; st.z -= Math.sin(st.psi) * v * dt;
  let cx = st.x + Math.cos(st.psi) * REAR, cz = st.z - Math.sin(st.psi) * REAR;
  // blokuj tylko wjazd w przeszkodę; jeśli auto już o coś zahacza, zawsze może się wycofać
  if (hits(cx, cz, st.psi) && !hits(ox + Math.cos(op) * REAR, oz - Math.sin(op) * REAR, op)) {
    st.x = ox; st.z = oz; st.psi = op; st.v = Math.abs(v) < 8 ? 0 : -v * 0.25;
    cx = st.x + Math.cos(st.psi) * REAR; cz = st.z - Math.sin(st.psi) * REAR;
  }
  drive.grass = suspension(cx, cz, dt, false);
  return { cx, cz };
}
