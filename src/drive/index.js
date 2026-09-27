import { S } from '../core/state.js';
import { updateAudio } from './audio.js';
import { updateCamera } from './camera.js';
import { updateGearbox } from './gearbox.js';
import { updateHud, updateStreetName } from './hud.js';
import { drawMinimap } from './minimap.js';
import { readInput, stepCar } from './physics.js';
import { drive } from './state.js';

/* ================= jazda: jeden krok gry podczas prowadzenia auta ================= */
export function updateDrive(dt) {
  if (!S.driving) return;
  const input = readInput(drive.keys);
  const { cx, cz } = stepCar(dt, input);
  updateGearbox(dt, input.gas);
  updateHud(input.gas);
  updateCamera(dt, cx, cz);
  updateAudio(input.gas, dt);
  drawMinimap(cx, cz);
  if (drive.city.fountain) drive.city.fountain.anim(performance.now() / 1000);
  updateStreetName(dt, cx, cz);
}
