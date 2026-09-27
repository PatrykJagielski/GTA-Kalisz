import { active } from '../car/index.js';
import { rng } from '../core/random.js';
import { S } from '../core/state.js';
import { drive, st } from './state.js';

/* ---------- dźwięk silnika: pętla cyklu pracy odtwarzana z prędkością zależną od obrotów ---------- */
// Web Audio powstaje dopiero po geście gracza (Graj, przycisk dźwięku), bo przeglądarki blokują wcześniejszy start.
// Brzmienie opisuje model (sound w car/models/*/index.js):
//   fires = zapłony na cykl (2 obroty wału), bank = głośność kolejnych zapłonów (V8: nierówny rytm dwóch rzędów),
//   tones = [Hz, głośność, faza] jednego zapłonu, decay / tail = wygasanie, knock = stuk wtrysku,
//   clatter / turbo = głośność klekotu i świstu turbo, lp = filtr dolnoprzepustowy [baza, obciążenie, obroty]
const BASE_RPM = 1000;
function engineCycleBuffer(ctx, snd) {
  const sr = ctx.sampleRate, cyc = 120 / BASE_RPM, cycles = 8, F = snd.fires;
  const len = Math.round(cyc * cycles * sr), buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  const R = rng(snd.seed), per = cyc / F, tail = Math.round(per * snd.tail * sr);
  for (let n = 0; n < cycles * F; n++) {
    const s0 = Math.round((n * per + (R() - 0.5) * per * snd.jitter) * sr);   // lekka nierówność pracy
    const amp = (0.75 + R() * 0.35) * snd.bank[n % snd.bank.length], knock = snd.knock + R() * snd.knock * 0.55;
    for (let i = 0; i < tail; i++) {
      const t = i / sr, k = (s0 + i) % len;
      let v = 0; for (const [f, a, ph] of snd.tones) v += a * Math.sin(6.2832 * f * t + ph);
      d[k] += amp * v * Math.exp(-t * snd.decay);
      d[k] += knock * (R() * 2 - 1) * Math.exp(-t * snd.knockDecay);     // stuk wtrysku
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
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.8;
  const body = ctx.createGain(); lp.connect(body); body.connect(master);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1600;
  const clatter = ctx.createGain(); hp.connect(clatter); clatter.connect(master);
  const turbo = ctx.createOscillator(); turbo.type = 'sine';
  const turboG = ctx.createGain(); turboG.gain.value = 0; turbo.connect(turboG); turboG.connect(master);
  turbo.start();
  drive.audio = { ctx, master, src: null, snd: null, lp, body, hp, clatter, turbo, turboG, load: 0 };
  setEngineSound();
  return drive.audio;
}
// pętla silnika wybranego auta; po zmianie auta nowa pętla zastępuje starą (bufor źródła da się ustawić tylko raz)
const buffers = new Map();
export function setEngineSound() {
  const au = drive.audio, snd = active.model.sound;
  if (!au || au.snd === snd) return;
  if (!buffers.has(snd)) buffers.set(snd, engineCycleBuffer(au.ctx, snd));
  const src = au.ctx.createBufferSource(); src.buffer = buffers.get(snd); src.loop = true;
  src.connect(au.lp); src.connect(au.hp); src.start();
  if (au.src) au.src.stop();
  Object.assign(au, { src, snd });
}
export function updateAudio(gas, dt) {
  const au = drive.audio; if (!au || au.ctx.state !== 'running') return;
  const t = au.ctx.currentTime, rpm = st.rpm, snd = au.snd, [lp0, lpLoad, lpRpm] = snd.lp;
  au.load += ((gas ? 1 : 0.15) - au.load) * Math.min(1, dt * 6);
  const boost = au.load * Math.min(1, Math.max(0, (rpm - 1600) / 1800));
  au.src.playbackRate.setTargetAtTime(rpm / BASE_RPM, t, 0.03);
  au.lp.frequency.setTargetAtTime(lp0 + au.load * lpLoad + rpm * lpRpm, t, 0.05);
  au.body.gain.setTargetAtTime(0.4 + au.load * 0.5, t, 0.05);
  au.clatter.gain.setTargetAtTime(snd.clatter * (1 - au.load * 0.55) * (rpm < 1800 ? 1 : 0.6), t, 0.05);
  au.turbo.frequency.setTargetAtTime(1900 + rpm * 1.1, t, 0.1);
  au.turboG.gain.setTargetAtTime(boost * snd.turbo, t, 0.15);
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
