import { S } from '../core/state.js';
import { cycleCam } from '../drive/camera.js';
import { resetCar } from '../drive/physics.js';
import { drive } from '../drive/state.js';
import { enterCar, toggleCar } from '../foot/index.js';
import { pauseGame, restartGame, startGame } from './session.js';
import { toggleSound } from './sound.js';
import { toggleNight } from './theme.js';

/* ---------- sterowanie: klawiatura i przyciski dotykowe ---------- */
const DRIVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];   // bez przewijania strony
function onKeyDown(e) {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'KeyN' && !e.repeat) toggleNight();
  if (!S.driving) {
    if (e.repeat || S.contextLost) return;
    if (e.code === 'Escape' && S.paused) { e.preventDefault(); startGame(); }
    else if ((e.code === 'Enter' || e.code === 'Space') && !S.started && drive.city && document.activeElement === document.body) { e.preventDefault(); startGame(); }
    else if (e.code === 'KeyR' && S.paused) restartGame();
    return;
  }
  if (DRIVE_KEYS.includes(e.code)) e.preventDefault();
  drive.keys[e.code] = true;
  if (e.repeat) return;
  if (e.code === 'KeyC') cycleCam();
  if (e.code === 'KeyF' || e.code === 'KeyE') toggleCar();
  if (e.code === 'KeyR') { enterCar(true); resetCar(); }
  if (e.code === 'KeyM') toggleSound();
  if (e.code === 'Escape' || e.code === 'KeyP') pauseGame();
}
// przycisk dotykowy trzyma klawisz wirtualny (tgas, tbrake, tleft, tright, tjump) do puszczenia palca
function bindTouchButton(b) {
  const on = e => { e.preventDefault(); drive.keys[b.dataset.k] = true; try { b.setPointerCapture(e.pointerId); } catch (err) { /* brak capture */ } };
  const off = () => { drive.keys[b.dataset.k] = false; };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
  b.addEventListener('contextmenu', e => e.preventDefault());
}
export function initInput() {
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', e => { drive.keys[e.code] = false; });
  addEventListener('blur', () => { drive.keys = {}; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
  document.querySelectorAll('.dh-touch button').forEach(bindTouchButton);
}
