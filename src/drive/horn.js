import { drive } from './state.js';

/* ---------- klakson: własny (H albo przycisk dotykowy) i, przez net/sound.js, innych graczy ---------- */
// dwa tony piłokształtne przez filtr pasmowy, jak typowy dwutonowy klakson osobówki
const TONES = [415, 520];                      // Hz
const LEVEL = 0.16;
let own = null;

// wyjście efektów: obok głośności silnika (master w audio.js), więc klakson i cudze auta słychać także pieszo
export function fxOut(au) {
  if (!au.fx) { au.fx = au.ctx.createGain(); au.fx.connect(au.ctx.destination); }
  return au.fx;
}
export function makeHorn(ctx, out) {
  const g = ctx.createGain(), bp = ctx.createBiquadFilter();
  g.gain.value = 0; bp.type = 'bandpass'; bp.frequency.value = 950; bp.Q.value = 0.8;
  const oscs = TONES.map(f => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(bp); o.start(); return o; });
  bp.connect(g); g.connect(out);
  return {
    set(level) { g.gain.setTargetAtTime(level, ctx.currentTime, 0.012); },
    stop() { for (const o of oscs) o.stop(); g.disconnect(); },
  };
}
export const hornPressed = () => !drive.onFoot && !!(drive.keys.KeyH || drive.keys.thorn);
// co klatkę: własny klakson gra, dopóki klawisz jest wciśnięty
export function updateHorn() {
  const au = drive.audio;
  if (!au || au.ctx.state !== 'running') return;
  own = own || makeHorn(au.ctx, fxOut(au));
  own.set(drive.sound && hornPressed() ? LEVEL : 0);
}
