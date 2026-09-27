import { rig } from '../car/index.js';
import { V } from '../core/geometry.js';
import { camera, controls } from '../core/renderer.js';
import { hud } from './hud.js';
import { drive, st } from './state.js';

/* ---------- kamery jazdy: za autem, z miejsca kierowcy, swobodna (OrbitControls) ---------- */
const CAMS = { chase: 'za autem', driver: 'kierowca', orbit: 'swobodna' };
const tmpA = V(), tmpB = V(), tmpC = V();             // wektory robocze: bez alokacji co klatkę
export function updateCamera(dt, cx, cz) {
  const fx = Math.cos(st.psi), fz = -Math.sin(st.psi);
  if (drive.cam === 'chase') {
    // kamera goni auto; powyżej ~110 km/h szybciej, żeby nie zostawała dalej niż przy tej prędkości
    const follow = 3.5 * Math.max(1, Math.abs(st.v) / 300);
    camera.position.lerp(tmpA.set(cx - fx * 80, 30, cz - fz * 80), 1 - Math.exp(-dt * follow));
    camera.lookAt(cx + fx * 25, 9 + st.y, cz + fz * 25);
  } else if (drive.cam === 'driver') {
    rig.updateMatrixWorld(true);
    camera.position.copy(rig.localToWorld(tmpA.set(0.2, 11.2, -3.7)));
    camera.lookAt(rig.localToWorld(tmpB.set(40, 9.6, -3.4)));
  } else {
    camera.position.add(tmpC.set(cx, 0, cz).sub(drive.last));
    controls.target.set(cx, 7, cz); controls.update();
  }
  drive.last.set(cx, 0, cz);
}
// ustawienia kamery zależne od trybu (bliska płaszczyzna przycięcia w kabinie, sterowanie myszą w trybie swobodnym)
export function applyCameraMode() {
  camera.near = drive.cam === 'driver' ? 0.2 : 0.5; camera.updateProjectionMatrix();
  controls.enabled = drive.cam === 'orbit';
}
export function cycleCam() {
  const order = Object.keys(CAMS);
  drive.cam = order[(order.indexOf(drive.cam) + 1) % order.length];
  if (drive.cam === 'orbit') controls.target.copy(rig.position).y += 7;
  applyCameraMode();
  hud.cam.textContent = 'Kamera: ' + CAMS[drive.cam];
}
