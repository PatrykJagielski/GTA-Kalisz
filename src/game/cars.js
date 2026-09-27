import { MODELS, active, buildCar, modelById } from '../car/index.js';
import { $ } from '../core/dom.js';
import { S } from '../core/state.js';
import { setEngineSound } from '../drive/audio.js';
import { placeCar, resetCar } from '../drive/physics.js';
import { drive } from '../drive/state.js';

/* ---------- wybór auta: przyciski w menu i w pauzie, zapis wyboru ---------- */
const PICKERS = ['mCars', 'pCars'];
function paintPicker() {
  const m = active.model, line = $('mCar');
  line.replaceChildren(Object.assign(document.createElement('b'), { textContent: m.name }), ` · ${m.engine} · ${m.plate}`);
  for (const id of PICKERS) for (const b of $(id).children) b.setAttribute('aria-checked', String(b.dataset.car === m.id));
}
export function selectCar(id) {
  const model = modelById(id);
  if (model === active.model) return;
  buildCar(model);
  setEngineSound();
  try { localStorage.setItem('gta-car', model.id); } catch (e) { /* bez zapisu: wybór działa do przeładowania */ }
  if (drive.city) { if (S.started) placeCar(); else resetCar(); }   // w trakcie gry auto zmienia się w miejscu
  paintPicker();
}
export function initCars() {
  let saved = null;
  try { saved = localStorage.getItem('gta-car'); } catch (e) { /* pierwsze auto z listy */ }
  buildCar(modelById(saved));
  for (const id of PICKERS) {
    $(id).replaceChildren(...MODELS.map(m => {
      const b = Object.assign(document.createElement('button'), { className: 'tbtn', type: 'button', textContent: m.name });
      b.dataset.car = m.id; b.setAttribute('role', 'radio');
      b.onclick = () => selectCar(m.id);
      return b;
    }));
  }
  paintPicker();
}
