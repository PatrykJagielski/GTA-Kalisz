
/* ================= jazda: fizyka, kolizje, kamery, minimapa, dźwięk ================= */
const KMH = 0.36;                              // dm/s -> km/h
const WB = CAR.axF - CAR.axR;                  // rozstaw osi 26,48 dm
const REAR = -CAR.axR;                         // środek auta leży 12,88 dm przed tylną osią
const GEARS = [10.2, 18.6, 29, 38.5, 47.5, 56.5];   // km/h na 1000 obr/min, skrzynia 6-biegowa
const st = { x: 0, z: 0, psi: 0, v: 0, steer: 0, gear: 1, rpm: 850, spin: 0, y: 0, pitch: 0, roll: 0, wh: [0, 0, 0, 0] };   // x, z = środek tylnej osi
const drive = { city: null, cam: 'chase', keys: {}, sound: false, audio: null, last: V(), grass: 0, streetT: 0, street: '', loading: false };
const CAMS = { chase: 'za autem', driver: 'kierowca', orbit: 'swobodna' };
// elementy HUD i wektory robocze: pętla gry nie szuka w DOM ani nie tworzy obiektów co klatkę
const hud = { speed: $('dSpeed'), rpm: $('dRpm'), gear: $('dGear'), street: $('dStreet'), cam: $('dCam') };
const mapCanvas = $('minimap'), mapG = mapCanvas.getContext('2d');
const tmpA = V(), tmpB = V(), tmpC = V();
function setText(el, text) { if (el.textContent !== text) el.textContent = text; }

/* ---------- kolizje i podłoże ---------- */
const CP = [[22.9, 8.4], [22.9, -8.4], [-22.9, 8.4], [-22.9, -8.4], [11, 8.8], [11, -8.8], [0, 8.8], [0, -8.8], [-11, 8.8], [-11, -8.8], [23, 0], [-23, 0]];
function hits(cx, cz, psi) {
  const C = drive.city, [bx0, bz0, bx1, bz1] = C.bounds, c = Math.cos(psi), s = Math.sin(psi);
  for (const [lx, lz] of CP) {
    const x = cx + lx * c + lz * s, z = cz - lx * s + lz * c;
    if (x < bx0 + 4 || x > bx1 - 4 || z < bz0 + 4 || z > bz1 - 4 || inGrid(C.solid, x, z)) return true;
  }
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {                // słupek w obrysie auta (układ lokalny)
    for (const [px, pz, r] of cellOf(C.posts, cx + i * GRID, cz + j * GRID)) {
      const dx = px - cx, dz = pz - cz;
      if (Math.abs(dx) > 30 || Math.abs(dz) > 30) continue;
      const lx = dx * c - dz * s, lz = dx * s + dz * c;
      if (Math.abs(lx) < 23 + r && Math.abs(lz) < 8.9 + r) return true;
    }
  }
  return false;
}
// podłoże: 0 = jezdnia, 1 = chodnik / podwórko (krawężnik 14 cm), 2 = trawnik (lekko nierówny)
function surfaceAt(x, z) {
  const C = drive.city, f = C.fountain;
  if (f && (x - f.c[0]) ** 2 + (z - f.c[1]) ** 2 < f.r * f.r) return 1;             // granitowy plac przy fontannie
  if (!inGrid(C.blockG, x, z)) return 0;
  return inGrid(C.greenG, x, z) ? 2 : 1;
}
const heightOf = (k, x, z) => k === 0 ? 0 : k === 1 ? CURB : CURB + 0.25 + 0.25 * Math.sin(x * 0.23) * Math.sin(z * 0.19);
const WHEELS = [[CAR.axF, -CAR.trackZ], [CAR.axF, CAR.trackZ], [CAR.axR, -CAR.trackZ], [CAR.axR, CAR.trackZ]];   // LP, PP, LT, PT
function thump(strength) {
  const au = drive.audio; if (!au || !drive.sound || au.ctx.state !== 'running') return;
  const t = au.ctx.currentTime, o = au.ctx.createOscillator(), g = au.ctx.createGain();
  o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.18);
  g.gain.setValueAtTime(0.35 * strength, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  o.connect(g); g.connect(au.master); o.start(t); o.stop(t + 0.25);
}
// zawieszenie: wysokość i przechyły z wysokości pod czterema kołami
function suspension(cx, cz, dt, jump) {
  const c = Math.cos(st.psi), s = Math.sin(st.psi);
  let step = 0, grass = 0;
  const h = WHEELS.map(([lx, lz], i) => {
    const x = cx + lx * c + lz * s, z = cz - lx * s + lz * c, k = surfaceAt(x, z), v = heightOf(k, x, z);
    step = Math.max(step, Math.abs(v - st.wh[i])); if (k === 2) grass++;
    return v;
  });
  if (step > 0.5 && !jump) { st.v *= 0.9; thump(Math.min(1, Math.abs(st.v) / 120 + 0.3)); }
  st.wh = h;
  const y = (h[0] + h[1] + h[2] + h[3]) / 4;
  const pitch = Math.atan(((h[0] + h[1]) - (h[2] + h[3])) / 2 / WB);
  const roll = Math.atan(((h[0] + h[2]) - (h[1] + h[3])) / 2 / (2 * CAR.trackZ));
  const k = jump ? 1 : Math.min(1, dt * 14);
  st.y += (y - st.y) * k; st.pitch += (pitch - st.pitch) * k; st.roll += (roll - st.roll) * k;
  return grass / 4;
}
function resetCar() {
  const [x, z, psi0] = drive.city.start, psi = psi0 + Math.PI;                 // start obrócony o 180°
  Object.assign(st, { x: x - Math.cos(psi) * REAR, z: z + Math.sin(psi) * REAR, psi, v: 0, steer: 0, gear: 1, rpm: 850 });
  suspension(x, z, 0, true); placeCar();
  camera.position.set(x - Math.cos(psi) * 90, 34, z + Math.sin(psi) * 90); drive.last.set(x, 0, z);
}
function placeCar() {
  rig.position.set(st.x + Math.cos(st.psi) * REAR, st.y, st.z - Math.sin(st.psi) * REAR);
  rig.rotation.order = 'YZX';                                                  // kurs, potem pochylenie, potem przechył
  rig.rotation.set(st.roll, st.psi, st.pitch);
}
function updateDrive(dt) {
  if (!S.driving) return;
  const k = drive.keys;
  const gas = k.KeyW || k.ArrowUp || k.tgas, brk = k.KeyS || k.ArrowDown || k.tbrake;
  const steerIn = (k.KeyA || k.ArrowLeft || k.tleft ? 1 : 0) - (k.KeyD || k.ArrowRight || k.tright ? 1 : 0);
  let a = 0;
  if (gas) a += st.v >= -1 ? Math.max(0, 32 - Math.abs(st.v) * 0.055) : 90;      // gaz przy cofaniu = hamowanie
  if (brk) a -= st.v > 1 ? 90 : (st.v > -70 ? 26 : 0);                            // hamulec, potem wsteczny do ~25 km/h
  if (k.Space) a -= Math.sign(st.v) * 70;
  // trawa: mały opór przy ruszaniu, rosnący z prędkością (maks. ok. 35 km/h), zawsze słabszy niż napęd
  const drag = Math.sign(st.v) * (6 + 0.00011 * st.v * st.v + drive.grass * (6 + Math.abs(st.v) * 0.12));
  let v = st.v + (a - drag) * dt;
  if (!gas && !brk && Math.abs(v) < 3) v = 0;
  st.v = v;
  const maxSteer = 0.6 / (1 + Math.abs(v) / 200);
  st.steer += (steerIn * maxSteer - st.steer) * Math.min(1, dt * 5);
  const ox = st.x, oz = st.z, op = st.psi;
  st.psi += v / WB * Math.tan(st.steer) * dt;                                     // model rowerowy: obrót wokół tylnej osi
  st.x += Math.cos(st.psi) * v * dt; st.z -= Math.sin(st.psi) * v * dt;
  let cx = st.x + Math.cos(st.psi) * REAR, cz = st.z - Math.sin(st.psi) * REAR;
  // blokuj tylko wjazd w przeszkodę; jeśli auto już o coś zahacza, zawsze może się wycofać
  if (hits(cx, cz, st.psi) && !hits(ox + Math.cos(op) * REAR, oz - Math.sin(op) * REAR, op)) {
    st.x = ox; st.z = oz; st.psi = op; st.v = Math.abs(v) < 8 ? 0 : -v * 0.25;
    cx = st.x + Math.cos(st.psi) * REAR; cz = st.z - Math.sin(st.psi) * REAR;
  }
  drive.grass = suspension(cx, cz, dt, false);
  placeCar();
  // koła
  st.spin -= st.v * dt / CAR.wr;
  for (const { w, spin, front } of wheelGroups) { spin.rotation.z = st.spin; if (front) w.rotation.y = st.steer; }
  // automatyczna zmiana biegów i obroty
  const kmh = Math.abs(st.v) * KMH;
  if (st.v < -0.5) st.rpm = Math.max(850, kmh / 9 * 1000);
  else {
    let r = kmh / GEARS[st.gear - 1] * 1000;
    if (r > 3900 && st.gear < 6) st.gear++; else if (r < 1500 && st.gear > 1) st.gear--;
    r = kmh / GEARS[st.gear - 1] * 1000;
    if (kmh < 9) r = Math.max(r, 850 + (gas ? 1400 : 0));
    st.rpm += (Math.min(4700, Math.max(850, r)) - st.rpm) * Math.min(1, dt * 8);
  }
  // licznik
  setText(hud.speed, String(Math.round(kmh)));
  const rpmW = Math.round(Math.min(100, st.rpm / 50)) + '%';
  if (hud.rpm.style.width !== rpmW) hud.rpm.style.width = rpmW;
  setText(hud.gear, `${st.v < -0.5 ? 'R' : st.v === 0 && !gas ? 'N' : st.gear} · ${Math.round(st.rpm / 10) * 10} obr/min`);
  updateCamera(dt, cx, cz);
  updateAudio(gas, dt);
  drawMinimap(cx, cz);
  if (drive.city.fountain) drive.city.fountain.anim(performance.now() / 1000);
  drive.streetT -= dt;
  if (drive.streetT <= 0) { drive.streetT = 0.3; const nm = streetAt(cx, cz); if (nm !== drive.street) hud.street.textContent = drive.street = nm; }
}
frameHooks.push(updateDrive);

function updateCamera(dt, cx, cz) {
  const fx = Math.cos(st.psi), fz = -Math.sin(st.psi);
  if (drive.cam === 'chase') {
    camera.position.lerp(tmpA.set(cx - fx * 80, 30, cz - fz * 80), 1 - Math.exp(-dt * 3.5));
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
function cycleCam() {
  const order = Object.keys(CAMS);
  drive.cam = order[(order.indexOf(drive.cam) + 1) % order.length];
  controls.enabled = drive.cam === 'orbit';
  if (drive.cam === 'orbit') controls.target.copy(rig.position).y += 7;
  camera.near = drive.cam === 'driver' ? 0.2 : 0.5; camera.updateProjectionMatrix();
  hud.cam.textContent = 'Kamera: ' + CAMS[drive.cam];
}
function drawMinimap(cx, cz) {
  const g = mapG, C = drive.city, n = mapCanvas.width, rot = st.psi - Math.PI / 2;
  g.fillStyle = '#7b8a63'; g.fillRect(0, 0, n, n);
  g.save(); g.translate(n / 2, n / 2); g.rotate(rot);
  g.drawImage(C.map, -(cx - C.bounds[0]) * C.MS, -(cz - C.bounds[1]) * C.MS);
  g.restore();
  g.save(); g.translate(n / 2, n / 2);
  g.fillStyle = '#e09a12'; g.strokeStyle = '#1b1300'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, -13); g.lineTo(8, 8); g.lineTo(0, 4); g.lineTo(-8, 8); g.closePath(); g.fill(); g.stroke();
  const na = rot - Math.PI / 2, nr = n / 2 - 22;                               // północ na brzegu mapy
  g.translate(Math.cos(na) * nr, Math.sin(na) * nr);
  g.fillStyle = 'rgba(20,24,28,.78)'; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.font = '700 18px Barlow Condensed, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('N', 0, 1);
  g.restore();
}

/* ---------- dźwięk silnika 1.9 TDI: pętla cyklu pracy odtwarzana z prędkością zależną od obrotów ---------- */
const BASE_RPM = 1000;
function engineCycleBuffer(ctx) {
  const sr = ctx.sampleRate, cyc = 120 / BASE_RPM, cycles = 8;          // 2 obroty wału = 1 cykl = 4 zapłony
  const len = Math.round(cyc * cycles * sr), buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  const R = rng(1896), per = cyc / 4, tail = Math.round(per * 1.7 * sr);
  for (let n = 0; n < cycles * 4; n++) {
    const s0 = Math.round((n * per + (R() - 0.5) * per * 0.04) * sr);    // lekka nierówność pracy
    const amp = 0.75 + R() * 0.35, knock = 0.45 + R() * 0.25;
    for (let i = 0; i < tail; i++) {
      const t = i / sr, k = (s0 + i) % len;
      d[k] += amp * (Math.sin(6.2832 * 64 * t) + 0.4 * Math.sin(6.2832 * 131 * t + 0.6) + 0.15 * Math.sin(6.2832 * 262 * t)) * Math.exp(-t * 34);
      d[k] += knock * (R() * 2 - 1) * Math.exp(-t * 380);               // klekot wtrysku PD
    }
  }
  let peak = 0; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
  for (let i = 0; i < len; i++) d[i] *= 0.9 / peak;
  return buf;
}
function setupAudio() {
  if (drive.audio) return drive.audio;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
  const src = ctx.createBufferSource(); src.buffer = engineCycleBuffer(ctx); src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.8;
  const body = ctx.createGain(); src.connect(lp); lp.connect(body); body.connect(master);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1600;
  const clatter = ctx.createGain(); src.connect(hp); hp.connect(clatter); clatter.connect(master);
  const turbo = ctx.createOscillator(); turbo.type = 'sine';
  const turboG = ctx.createGain(); turboG.gain.value = 0; turbo.connect(turboG); turboG.connect(master);
  src.start(); turbo.start();
  drive.audio = { ctx, master, src, lp, body, clatter, turbo, turboG, load: 0 };
  return drive.audio;
}
function updateAudio(gas, dt) {
  const au = drive.audio; if (!au || au.ctx.state !== 'running') return;
  const t = au.ctx.currentTime, rpm = st.rpm;
  au.load += ((gas ? 1 : 0.15) - au.load) * Math.min(1, dt * 6);
  const boost = au.load * Math.min(1, Math.max(0, (rpm - 1600) / 1800));
  au.src.playbackRate.setTargetAtTime(rpm / BASE_RPM, t, 0.03);
  au.lp.frequency.setTargetAtTime(420 + au.load * 2200 + rpm * 0.35, t, 0.05);
  au.body.gain.setTargetAtTime(0.4 + au.load * 0.5, t, 0.05);
  au.clatter.gain.setTargetAtTime(0.22 * (1 - au.load * 0.55) * (rpm < 1800 ? 1 : 0.6), t, 0.05);
  au.turbo.frequency.setTargetAtTime(1900 + rpm * 1.1, t, 0.1);
  au.turboG.gain.setTargetAtTime(boost * 0.03, t, 0.15);
  if (t > (au.startUntil || 0)) au.master.gain.setTargetAtTime(drive.sound ? 0.55 : 0, t, 0.08);   // nie przerywaj rozruchu
}
function playStarter() {
  const au = drive.audio; if (!au) return;
  const t = au.ctx.currentTime, o = au.ctx.createOscillator(), g = au.ctx.createGain(), f = au.ctx.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(120, t + 0.7);
  f.type = 'lowpass'; f.frequency.value = 900;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.05); g.gain.setValueAtTime(0.22, t + 0.6); g.gain.linearRampToValueAtTime(0, t + 0.8);
  o.connect(f); f.connect(g); g.connect(au.master.context.destination); o.start(t); o.stop(t + 0.85);
  au.master.gain.cancelScheduledValues(t); au.master.gain.setValueAtTime(0, t); au.master.gain.setTargetAtTime(0.55, t + 0.6, 0.1);
  au.startUntil = t + 0.9;
}
function startEngineSound() {
  if (!drive.sound) return;
  try { const au = setupAudio(); au.ctx.resume(); st.rpm = 1350; playStarter(); } catch (e) { /* brak Web Audio: jazda bez dźwięku */ }
}
function stopEngineSound() {
  const au = drive.audio; if (!au) return;
  au.master.gain.setTargetAtTime(0, au.ctx.currentTime, 0.05);
  setTimeout(() => { if (!S.driving) au.ctx.suspend(); }, 300);
}
function paintSoundBtn() {
  for (const id of ['dSound', 'pSound']) {
    $(id).setAttribute('aria-pressed', String(drive.sound));
    $(id).textContent = drive.sound ? 'Dźwięk: wł.' : 'Dźwięk: wył.';
  }
}
function toggleSound() {
  drive.sound = !drive.sound;
  try { localStorage.setItem('gta-sound', drive.sound ? '1' : '0'); } catch (e) { /* bez zapisu preferencji */ }
  if (drive.sound) { try { setupAudio().ctx.resume(); } catch (e) { drive.sound = false; } }
  paintSoundBtn();
}
try { drive.sound = localStorage.getItem('gta-sound') !== '0'; } catch (e) { drive.sound = true; }
paintSoundBtn();
document.addEventListener('visibilitychange', () => {
  const au = drive.audio; if (!au) return;
  if (document.hidden) au.ctx.suspend(); else if (S.driving && drive.sound) au.ctx.resume();
});

/* ---------- niebo: dzień i noc ---------- */
function applySky() {
  if (!drive.city) return;
  const dark = isDark(), col = new THREE.Color(dark ? 0x10171f : 0xc9d6e1);
  scene.background = col; scene.fog = new THREE.Fog(col, 1400, 7500);
  drive.city.lampHeadM.emissiveIntensity = dark ? 2.2 : 0.4;
  drive.city.facM.emissiveIntensity = drive.city.glassM.emissiveIntensity = dark ? 0.9 : 0;
  for (const m of drive.city.ratM) m.emissiveIntensity = dark ? 0.3 : 0;                  // iluminacja ratusza nocą
  if (drive.city.fountain) for (const m of drive.city.fountain.mats) m.emissiveIntensity = dark ? 0.9 : 0;   // podświetlona fontanna
}
new MutationObserver(applySky).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
sysDark.addEventListener('change', applySky);
