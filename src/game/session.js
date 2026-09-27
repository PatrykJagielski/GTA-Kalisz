import { $ } from '../core/dom.js';
import { controls } from '../core/renderer.js';
import { S } from '../core/state.js';
import { setupAudio, startEngineSound, stopEngineSound } from '../drive/audio.js';
import { applyCameraMode } from '../drive/camera.js';
import { resetStreetName } from '../drive/hud.js';
import { resetCar } from '../drive/physics.js';
import { drive } from '../drive/state.js';
import { enterCar } from '../foot/index.js';

/* ---------- przebieg gry: start z menu, pauza, powrót na start ---------- */
function showHud(on) { $('driveHud').hidden = !on; }
export function startGame() {
  if (!drive.city || S.driving || S.contextLost) return;
  $('mMenu').hidden = true; $('pMenu').hidden = true;
  const first = !S.started;
  S.started = true; S.paused = false; S.driving = true;
  showHud(true);
  applyCameraMode();
  if (first) { resetStreetName(); startEngineSound(); }
  else if (drive.sound) { try { setupAudio().ctx.resume(); } catch (e) { /* bez dźwięku */ } }
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();   // spacja = ręczny, nie klik w przycisk
}
export function pauseGame() {
  if (!S.driving) return;
  S.driving = false; S.paused = true; drive.keys = {};
  controls.enabled = false;
  showHud(false); $('pMenu').hidden = false;
  stopEngineSound();
  $('pResume').focus({ preventScroll: true });
}
export function restartGame() {
  enterCar(true); resetCar(); resetStreetName();
  if (S.paused) startGame();
}
