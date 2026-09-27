import * as THREE from 'three';
import { rig } from '../car/index.js';
import { camera, controls, renderer, scene, view } from '../core/renderer.js';
import { S } from '../core/state.js';
import { updateDrive } from '../drive/index.js';
import { drive } from '../drive/state.js';
import { updateNet } from '../net/index.js';

/* ---------- pętla gry: rozmiar płótna, kamera menu, klatka ---------- */
const clock = new THREE.Clock();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let orbitA = 0.6, frameErrors = 0;
function resize() {
  const w = view.clientWidth, h = view.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
}
function menuCamera(dt) {                                  // menu: kamera powoli krąży wokół auta
  if (S.started) return;
  orbitA += dt * (reduced ? 0 : 0.09);
  const p = rig.position, r = 88;
  camera.position.set(p.x + Math.cos(orbitA) * r, p.y + 26, p.z + Math.sin(orbitA) * r);
  camera.lookAt(p.x, p.y + 8, p.z);
}
function frame() {
  requestAnimationFrame(frame);                            // najpierw: wyjątek w jednej klatce nie zatrzymuje gry
  try {
    const dt = Math.min(clock.getDelta(), 0.05);
    updateDrive(dt);
    updateNet(dt);
    if (!S.driving) {
      menuCamera(dt);
      if (drive.city && drive.city.fountain) drive.city.fountain.anim(performance.now() / 1000);
    }
    if (controls.enabled) controls.update();
    renderer.render(scene, camera);
  } catch (e) {
    if (frameErrors++ < 5) console.error('Błąd w klatce gry:', e);        // bez zalewania konsoli 60 razy na sekundę
  }
}
export function startLoop() {
  new ResizeObserver(resize).observe(view);
  resize();
  camera.position.set(80, 30, 60); camera.lookAt(0, 8, 0);
  frame();
}
