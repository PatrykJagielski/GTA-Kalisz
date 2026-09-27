import { $ } from '../core/dom.js';
import { canvas, makeEnvironment } from '../core/renderer.js';
import { S } from '../core/state.js';
import { drive } from '../drive/state.js';
import { pauseGame } from './session.js';

/* ---------- utrata kontekstu WebGL (sterownik GPU, uśpienie, za dużo kart) ---------- */
// Three.js sam wgrywa geometrię i tekstury po odzyskaniu kontekstu; gra stoi w pauzie do tego czasu
export function initContextLoss() {
  let statusBeforeLoss = '';
  canvas.addEventListener('webglcontextlost', () => {
    S.contextLost = true;
    pauseGame();
    const msg = 'Karta graficzna przerwała renderowanie. Czekam na jej powrót…';
    $('pNote').textContent = msg; $('pNote').hidden = false;
    if (!S.started) { statusBeforeLoss = $('mStatus').textContent; $('mStatus').textContent = msg; }
    $('pResume').disabled = $('mPlay').disabled = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    S.contextLost = false;
    makeEnvironment(true);
    $('pNote').hidden = true;
    if (statusBeforeLoss) { $('mStatus').textContent = statusBeforeLoss; statusBeforeLoss = ''; }
    $('pResume').disabled = false; $('mPlay').disabled = !drive.city || drive.loading;
  });
}
