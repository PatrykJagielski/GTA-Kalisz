import { $ } from '../core/dom.js';
import { cycleCam } from '../drive/camera.js';
import { loadCity } from './loader.js';
import { pauseGame, restartGame, startGame } from './session.js';
import { toggleSound } from './sound.js';

/* ---------- przyciski menu, pauzy i HUD ---------- */
export function bindButtons() {
  $('mPlay').onclick = startGame;
  $('mRetry').onclick = () => { $('mRetry').hidden = true; loadCity(); };
  $('pResume').onclick = startGame;
  $('pRestart').onclick = restartGame;
  $('dPause').onclick = pauseGame;
  $('dCam').onclick = cycleCam;
  $('dSound').onclick = toggleSound;
  $('pSound').onclick = toggleSound;
}
