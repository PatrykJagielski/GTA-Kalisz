import { $ } from '../core/dom.js';
import { S } from '../core/state.js';
import { setupAudio } from '../drive/audio.js';
import { drive } from '../drive/state.js';

/* ---------- ustawienie dźwięku: przyciski, zapis w localStorage, wyciszenie w tle ---------- */
function paintSoundBtn() {
  for (const id of ['dSound', 'pSound']) {
    $(id).setAttribute('aria-pressed', String(drive.sound));
    $(id).textContent = drive.sound ? 'Dźwięk: wł.' : 'Dźwięk: wył.';
  }
}
export function toggleSound() {
  drive.sound = !drive.sound;
  try { localStorage.setItem('gta-sound', drive.sound ? '1' : '0'); } catch (e) { /* bez zapisu preferencji */ }
  if (drive.sound) { try { setupAudio().ctx.resume(); } catch (e) { drive.sound = false; } }
  paintSoundBtn();
}
export function initSound() {
  try { drive.sound = localStorage.getItem('gta-sound') !== '0'; } catch (e) { drive.sound = true; }
  paintSoundBtn();
  document.addEventListener('visibilitychange', () => {
    const au = drive.audio; if (!au) return;
    if (document.hidden) au.ctx.suspend(); else if (S.driving && drive.sound) au.ctx.resume();
  });
}
