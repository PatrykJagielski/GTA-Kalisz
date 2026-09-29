import { $ } from '../core/dom.js';
import { V } from '../core/geometry.js';
import { camera, controls } from '../core/renderer.js';
import { paintCam } from '../drive/camera.js';
import { drive } from '../drive/state.js';
import { R, blocked, groundAt, placePerson, showPerson } from './person.js';

/* ---------- pasażer w aucie innego gracza: wsiadanie, kamera, wysiadanie ---------- */
// drive.ride = { id, last } — id kierowcy (auto z drive.traffic.cars), last = ostatnie znane położenie jego auta
// (gdy kierowca wyjdzie z gry, pasażer wysiada tam, gdzie auto było widać ostatni raz).
// Własne auto pasażera zostaje zaparkowane; postaci nie widać, a nick jest dopisany do nicku kierowcy.
const REACH = 14;                              // dm, jak przy własnym aucie
const tmpA = V(), tmpB = V(), tmpC = V();

// odległość punktu od obrysu auta c (0 = w środku)
function gapTo(c, x, z) {
  const dx = x - c.cx, dz = z - c.cz, co = Math.cos(c.psi), s = Math.sin(c.psi);
  return Math.hypot(Math.max(Math.abs(dx * co - dz * s) - c.hx, 0), Math.max(Math.abs(dx * s + dz * co) - c.hz, 0));
}
// najbliższe auto innego gracza w zasięgu wsiadania (pieszo, na ziemi)
export function nearOther(x, z) {
  let best = null, bestGap = REACH;
  for (const c of drive.traffic.cars) {
    const g = gapTo(c, x, z);
    if (g <= bestGap) { best = c; bestGap = g; }
  }
  return best;
}
const rideCar = () => drive.traffic.cars.find(c => c.id === drive.ride.id);
export function board(c) {
  drive.ride = { id: c.id, last: c };
  showPerson(false);
  $('driveHud').classList.add('riding');
  paintCam();
}
// wysiadanie po stronie pasażera (prawej), potem kierowcy, z tyłu i z przodu auta
export function unboard(me) {
  const c = (drive.ride && rideCar()) || drive.ride?.last;
  drive.ride = null;
  $('driveHud').classList.remove('riding');
  paintCam();
  if (!c) return;
  const co = Math.cos(c.psi), s = Math.sin(c.psi), off = R + 1.5;
  let spot = [c.cx + (c.hz + off) * s, c.cz + (c.hz + off) * co];
  for (const [lx, lz] of [[2, c.hz + off], [2, -c.hz - off], [-c.hx - off, 0], [c.hx + off, 0]]) {
    const x = c.cx + lx * co + lz * s, z = c.cz - lx * s + lz * co;
    if (!blocked(x, z, c.y)) { spot = [x, z]; break; }
  }
  const [x, z] = spot;
  Object.assign(me, { x, z, y: groundAt(x, z), vy: 0, psi: c.psi, air: false, on: null });
  showPerson(true); placePerson(me, me.y);
}
// co klatkę w trakcie jazdy: kamera za autem kierowcy albo z fotela pasażera; me idzie za autem (minimapa, ulica)
export function updateRide(dt, me) {
  const c = rideCar();
  if (!c) { unboard(me); return false; }      // kierowca wyszedł z gry
  drive.ride.last = c;
  const fx = Math.cos(c.psi), fz = -Math.sin(c.psi);
  if (drive.cam === 'chase') {
    const follow = 3.5 * Math.max(1, Math.abs(c.v) / 300);
    camera.position.lerp(tmpA.set(c.cx - fx * 80, c.y + 30, c.cz - fz * 80), 1 - Math.exp(-dt * follow));
    camera.lookAt(c.cx + fx * 25, c.y + 9, c.cz + fz * 25);
  } else if (drive.cam === 'driver') {                                           // fotel pasażera: oko kierowcy w lustrze
    const [eye, look] = c.model.eye;
    c.rig.updateMatrixWorld(true);
    camera.position.copy(c.rig.localToWorld(tmpA.set(eye[0], eye[1], -eye[2])));
    camera.lookAt(c.rig.localToWorld(tmpB.set(look[0], look[1], -look[2])));
  } else {
    camera.position.add(tmpC.set(c.cx, 0, c.cz).sub(drive.last));
    controls.target.set(c.cx, c.y + 7, c.cz); controls.update();
  }
  drive.last.set(c.cx, 0, c.cz);
  Object.assign(me, { x: c.cx, z: c.cz, y: c.y, psi: c.psi });
  return true;
}
