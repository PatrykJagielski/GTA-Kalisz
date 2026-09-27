import { buildCar, rig } from './car/index.js';
import { streetAt } from './city/streets.js';
import { camera, controls, renderer, scene } from './core/renderer.js';
import { S } from './core/state.js';
import { hits, surfaceAt } from './drive/collision.js';
import { updateDrive } from './drive/index.js';
import { placeCar, resetCar } from './drive/physics.js';
import { drive, st } from './drive/state.js';
import { bindButtons } from './game/buttons.js';
import { initInput } from './game/input.js';
import { loadCity } from './game/loader.js';
import { startLoop } from './game/loop.js';
import { pauseGame, startGame } from './game/session.js';
import { initSound } from './game/sound.js';
import { initTheme } from './game/theme.js';
import { initContextLoss } from './game/webgl.js';

/* ================= GTA Kalisz: punkt wejścia ================= */
// Jednostka świata = 1 dm; x = wschód, z = południe, (0, 0) = Główny Rynek.
//   core/   renderer, scena, stan gry, motyw, pomocnicze bryły i tekstury
//   car/    model Audi A4 B7: nadwozie, wnętrze, koła
//   city/   Kalisz z danych OpenStreetMap i zabytki (city/landmarks/)
//   drive/  fizyka, skrzynia, kamery, HUD, minimapa, dźwięk silnika
//   game/   wczytywanie, menu i pauza, sterowanie, pętla
buildCar();
initSound();
initTheme();
bindButtons();
initInput();
initContextLoss();
startLoop();
document.documentElement.setAttribute('data-ready', '');   // od tej chwili błędy obsługuje gra, nie strażnik startu w <head>
loadCity();

// build --debug: stan gry w konsoli (usuwane z wersji produkcyjnej)
if (__DEBUG__) {
  window.__gta = { S, st, drive, rig, camera, controls, renderer, scene, resetCar, placeCar, hits, surfaceAt, streetAt, startGame, pauseGame, updateDrive };
}
