
/* ================= gra: menu startowe, pauza, pętla ================= */
const LOAD_TIMEOUT = 60000;                                                      // ms; 1,3 MB także na słabym LTE
async function fetchCity(onProgress) {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), LOAD_TIMEOUT);
  try {
    const r = await fetch(CITY_URL, { signal: abort.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    if (!r.body) return await r.json();
    // strumień jest już rozpakowany (gzip), więc postęp liczymy względem rozmiaru znanego z buildu
    const rd = r.body.getReader(), chunks = []; let got = 0;
    for (;;) {
      const { done, value } = await rd.read(); if (done) break;
      chunks.push(value); got += value.length; onProgress(Math.min(1, got / CITY_BYTES));
    }
    return JSON.parse(new TextDecoder().decode(await new Blob(chunks).arrayBuffer()));
  } finally { clearTimeout(timer); }
}
async function loadCity() {
  const status = $('mStatus'), bar = $('mBar');
  drive.loading = true; $('mPlay').disabled = true; $('mMenu').classList.add('busy');
  status.textContent = 'Wczytywanie Kalisza…'; bar.style.width = '0%';
  try {
    const data = await fetchCity(p => { bar.style.width = Math.round(p * 80) + '%'; });
    status.textContent = 'Budowanie miasta…'; bar.style.width = '85%';
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
    drive.city = buildCity(data);
    bar.style.width = '100%';
    resetCar(); applySky();
    status.textContent = 'Gotowe. Audi czeka na Placu Jana Pawła II.';
    $('mPlay').disabled = false; $('mMenu').classList.remove('busy');
    $('mPlay').focus({ preventScroll: true });
  } catch (e) {
    console.error('Nie udało się wczytać Kalisza:', e);
    status.textContent = e.name === 'AbortError' ? 'Mapa wczytuje się zbyt długo. Sprawdź połączenie i spróbuj ponownie.'
      : !navigator.onLine ? 'Brak połączenia z internetem. Połącz się i spróbuj ponownie.'
      : 'Nie udało się wczytać mapy. Spróbuj ponownie za chwilę.';
    $('mMenu').classList.remove('busy');
    $('mRetry').hidden = false; $('mRetry').focus({ preventScroll: true });
  }
  drive.loading = false;
}

function showHud(on) { $('driveHud').hidden = !on; }
function startGame() {
  if (!drive.city || S.driving || S.contextLost) return;
  $('mMenu').hidden = true; $('pMenu').hidden = true;
  const first = !S.started;
  S.started = true; S.paused = false; S.driving = true;
  showHud(true);
  camera.near = drive.cam === 'driver' ? 0.2 : 0.5; camera.updateProjectionMatrix();
  controls.enabled = drive.cam === 'orbit';
  if (first) { drive.street = ''; drive.streetT = 0; startEngineSound(); }
  else if (drive.sound) { try { setupAudio().ctx.resume(); } catch (e) { /* bez dźwięku */ } }
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();   // spacja = ręczny, nie klik w przycisk
}
function pauseGame() {
  if (!S.driving) return;
  S.driving = false; S.paused = true; drive.keys = {};
  controls.enabled = false;
  showHud(false); $('pMenu').hidden = false;
  stopEngineSound();
  $('pResume').focus({ preventScroll: true });
}
function restartGame() {
  resetCar(); drive.street = ''; drive.streetT = 0;
  if (S.paused) startGame();
}

/* ---------- przyciski ---------- */
$('mPlay').onclick = startGame;
$('mRetry').onclick = () => { $('mRetry').hidden = true; loadCity(); };
$('pResume').onclick = startGame;
$('pRestart').onclick = restartGame;
$('dPause').onclick = pauseGame;
$('dCam').onclick = cycleCam;
$('dSound').onclick = toggleSound;
$('pSound').onclick = toggleSound;

const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function paintThemeBtns() {
  const d = isDark();
  for (const id of ['dNight', 'pNight', 'mNight']) {
    const b = $(id); b.hidden = false; b.setAttribute('aria-pressed', String(d));
    b.innerHTML = (d ? SUN : MOON) + `<span>${d ? 'Dzień' : 'Noc'}</span>`;
    b.title = d ? 'Przełącz na dzień' : 'Przełącz na noc';
  }
}
function toggleNight() {
  const t = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('gta-theme', t); } catch (e) { /* bez zapisu: motyw działa do przeładowania */ }
}
for (const id of ['dNight', 'pNight', 'mNight']) $(id).onclick = toggleNight;
sysDark.addEventListener('change', paintThemeBtns);
new MutationObserver(paintThemeBtns).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
paintThemeBtns();

/* ---------- klawiatura ---------- */
const DRIVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
addEventListener('keydown', e => {
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
  if (e.code === 'KeyR') resetCar();
  if (e.code === 'KeyM') toggleSound();
  if (e.code === 'Escape' || e.code === 'KeyP') pauseGame();
});
addEventListener('keyup', e => { drive.keys[e.code] = false; });
addEventListener('blur', () => { drive.keys = {}; });
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
document.querySelectorAll('.dh-touch button').forEach(b => {
  const on = e => { e.preventDefault(); drive.keys[b.dataset.k] = true; try { b.setPointerCapture(e.pointerId); } catch (err) { /* brak capture */ } };
  const off = () => { drive.keys[b.dataset.k] = false; };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
  b.addEventListener('contextmenu', e => e.preventDefault());
});

/* ---------- utrata kontekstu WebGL (sterownik GPU, uśpienie, za dużo kart) ---------- */
// Three.js sam wgrywa geometrię i tekstury po odzyskaniu kontekstu; gra stoi w pauzie do tego czasu
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

/* ---------- pętla ---------- */
function resize() {
  const w = view.clientWidth, h = view.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(view);
const clock = new THREE.Clock();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let orbitA = 0.6;
function menuCamera(dt) {                                  // menu: kamera powoli krąży wokół auta
  if (S.started) return;
  orbitA += dt * (reduced ? 0 : 0.09);
  const p = rig.position, r = 88;
  camera.position.set(p.x + Math.cos(orbitA) * r, p.y + 26, p.z + Math.sin(orbitA) * r);
  camera.lookAt(p.x, p.y + 8, p.z);
}
let frameErrors = 0;
function frame() {
  requestAnimationFrame(frame);                            // najpierw: wyjątek w jednej klatce nie zatrzymuje gry
  try {
    const dt = Math.min(clock.getDelta(), 0.05);
    for (const f of frameHooks) f(dt);
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
resize();
camera.position.set(80, 30, 60); camera.lookAt(0, 8, 0);
frame();
document.documentElement.setAttribute('data-ready', '');   // od tej chwili błędy obsługuje gra, nie strażnik startu w <head>
loadCity();
