import { S } from '../core/state.js';
import { othersWhere } from '../net/remote.js';
import { me, paintDoor, updateFoot } from '../foot/index.js';
import { updateAudio } from './audio.js';
import { updateCamera } from './camera.js';
import { updateGearbox } from './gearbox.js';
import { updateHud, updateStreetName } from './hud.js';
import { drawMinimap } from './minimap.js';
import { readInput, stepCar } from './physics.js';
import { drive, st } from './state.js';

/* ================= jazda: jeden krok gry w aucie albo pieszo ================= */
const PARKED = { gas: false, brake: false, steer: 0, handbrake: true };    // auto bez kierowcy: ręczny, toczy się do zatrzymania
export function updateDrive(dt) {
  if (!S.driving) return;
  paintDoor();
  if (drive.onFoot) {
    const car = stepCar(dt, PARKED);
    updateFoot(dt);
    drawMinimap(me.x, me.z, me.psi, car, othersWhere());
    updateStreetName(dt, me.x, me.z);
  } else {
    const input = readInput(drive.keys);
    const { cx, cz } = stepCar(dt, input);
    updateGearbox(dt, input.gas);
    updateHud(input.gas);
    updateCamera(dt, cx, cz);
    updateAudio(input.gas, dt);
    drawMinimap(cx, cz, st.psi, null, othersWhere());
    updateStreetName(dt, cx, cz);
  }
  if (drive.city.fountain) drive.city.fountain.anim(performance.now() / 1000);
}
