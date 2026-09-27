import { active } from '../car/index.js';
import { $ } from '../core/dom.js';
import { V } from '../core/geometry.js';
import { camera, controls } from '../core/renderer.js';
import { startEngineSound, stopEngineSound } from '../drive/audio.js';
import { drive, st } from '../drive/state.js';
import { HEAD, R, blocked, carGap, carPoint, groundAt, placePerson, showPerson } from './person.js';

/* ================= pieszo: wysiadanie i wsiadanie, chodzenie, bieg, skok ================= */
// me: x, z = stopy postaci (dm), y = wysokość stóp, vy = prędkość w pionie, psi = kurs, air = w powietrzu
export const me = { x: 0, z: 0, y: 0, vy: 0, psi: 0, air: false };
const WALK = 20 / 0.36, RUN = 30 / 0.36, BACK = 7 / 0.36;   // dm/s: chód 20 km/h, bieg 30 km/h, cofanie 7 km/h
const TURN = 2.8;                              // rad/s
const JUMP = 51, GRAVITY = 98;                 // wyskok ok. 1,3 m: wystarczy na murki fontanny (76 cm i 1,2 m)
const REACH = 14;                              // z tej odległości od auta (dm) da się wsiąść
const door = $('dDoor');
const tmp = V();

// wysiadanie: najpierw od strony kierowcy (lewej), potem pasażera, z tyłu i z przodu auta
function exitSpot() {
  const [hx, hz] = active.model.hit.box, off = R + 1.5;
  for (const [lx, lz] of [[2, -hz - off], [2, hz + off], [-hx - off, 0], [hx + off, 0]]) {
    const [x, z] = carPoint(lx, lz);
    if (!blocked(x, z, st.y)) return [x, z];
  }
  return null;
}
export function leaveCar() {
  if (drive.onFoot) return;
  const spot = exitSpot();
  if (!spot) return;                                                             // auto zakleszczone: nie ma jak wysiąść
  const [x, z] = spot;
  Object.assign(me, { x, z, y: groundAt(x, z), vy: 0, psi: st.psi, air: false });
  drive.onFoot = true;
  showPerson(true); placePerson(me, me.y);
  stopEngineSound();
  $('driveHud').classList.add('on-foot');
}
export function enterCar(force = false) {
  if (!drive.onFoot || (!force && carGap(me.x, me.z) > REACH)) return;
  drive.onFoot = false;
  showPerson(false);
  $('driveHud').classList.remove('on-foot');
  if (!force) startEngineSound();
}
export function toggleCar() { if (drive.onFoot) enterCar(); else leaveCar(); }

function walk(dt, k) {
  const fwd = k.KeyW || k.ArrowUp || k.tgas, back = k.KeyS || k.ArrowDown || k.tbrake;
  const turn = (k.KeyA || k.ArrowLeft || k.tleft ? 1 : 0) - (k.KeyD || k.ArrowRight || k.tright ? 1 : 0);
  me.psi += turn * TURN * dt;
  const v = fwd ? (k.ShiftLeft || k.ShiftRight ? RUN : WALK) : back ? -BACK : 0;
  if (v) {
    const x = me.x + Math.cos(me.psi) * v * dt, z = me.z - Math.sin(me.psi) * v * dt;
    // po ścianie się ślizga: jeśli nie da się iść na ukos, idzie wzdłuż jednej osi; z zakleszczenia zawsze wyjdzie
    const b = (bx, bz) => blocked(bx, bz, me.y);
    if (!b(x, z) || b(me.x, me.z)) { me.x = x; me.z = z; }
    else if (!b(x, me.z)) me.x = x;
    else if (!b(me.x, z)) me.z = z;
  }
  const g = groundAt(me.x, me.z);
  if (!me.air && (k.Space || k.tjump)) { me.air = true; me.vy = JUMP; }
  if (me.air || me.y > g + 0.6) {                                                // skok albo zejście z krawężnika
    me.air = true; me.vy -= GRAVITY * dt; me.y += me.vy * dt;
    if (me.y <= g) { me.y = g; me.vy = 0; me.air = false; }
  } else me.y = g;                                                               // wejście na krawężnik: krok w górę
  return g;
}

function followCamera(dt) {
  const fx = Math.cos(me.psi), fz = -Math.sin(me.psi);
  if (drive.cam === 'chase') {
    camera.position.lerp(tmp.set(me.x - fx * 42, me.y + 19, me.z - fz * 42), 1 - Math.exp(-dt * 4));
    camera.lookAt(me.x + fx * 12, me.y + 12, me.z + fz * 12);
  } else if (drive.cam === 'driver') {                                           // oczami postaci
    camera.position.set(me.x + fx * 1.8, me.y + HEAD, me.z + fz * 1.8);
    camera.lookAt(me.x + fx * 40, me.y + HEAD - 1.5, me.z + fz * 40);
  } else {
    camera.position.add(tmp.set(me.x, 0, me.z).sub(drive.last));
    controls.target.set(me.x, me.y + 10, me.z); controls.update();
  }
  drive.last.set(me.x, 0, me.z);
}

// jeden krok pieszego; zwraca pozycję i kurs dla minimapy i nazwy ulicy
export function updateFoot(dt) {
  const g = walk(dt, drive.keys);
  placePerson(me, g);
  followCamera(dt);
  const near = carGap(me.x, me.z) <= REACH;
  if (door.disabled === near) door.disabled = !near;
  return me;
}
// napis na przycisku drzwi (w aucie zawsze aktywny)
export function paintDoor() {
  const t = drive.onFoot ? 'Wsiądź' : 'Wysiądź';
  if (door.textContent !== t) door.textContent = t;
  if (!drive.onFoot) door.disabled = false;
}
