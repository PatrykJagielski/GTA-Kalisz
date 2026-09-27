import { rng } from '../core/random.js';
import { S } from '../core/state.js';
import { drive, st } from './state.js';

/* ---------- dźwięk silnika 1.9 TDI: pętla cyklu pracy odtwarzana z prędkością zależną od obrotów ---------- */
// Web Audio powstaje dopiero po geście gracza (Graj, przycisk dźwięku), bo przeglądarki blokują wcześniejszy start.
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
export function setupAudio() {
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
export function updateAudio(gas, dt) {
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
export function startEngineSound() {
  if (!drive.sound) return;
  try { const au = setupAudio(); au.ctx.resume(); st.rpm = 1350; playStarter(); } catch (e) { /* brak Web Audio: jazda bez dźwięku */ }
}
export function stopEngineSound() {
  const au = drive.audio; if (!au) return;
  au.master.gain.setTargetAtTime(0, au.ctx.currentTime, 0.05);
  setTimeout(() => { if (!S.driving) au.ctx.suspend(); }, 300);
}
// stuknięcie zawieszenia przy wjeździe na krawężnik
export function thump(strength) {
  const au = drive.audio; if (!au || !drive.sound || au.ctx.state !== 'running') return;
  const t = au.ctx.currentTime, o = au.ctx.createOscillator(), g = au.ctx.createGain();
  o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.18);
  g.gain.setValueAtTime(0.35 * strength, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  o.connect(g); g.connect(au.master); o.start(t); o.stop(t + 0.25);
}
