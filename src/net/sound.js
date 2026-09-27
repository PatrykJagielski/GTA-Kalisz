import { camera } from '../core/renderer.js';
import { BASE_RPM, engineBuffer } from '../drive/audio.js';
import { fxOut, makeHorn } from '../drive/horn.js';
import { drive } from '../drive/state.js';

/* ---------- dźwięk innych graczy: silnik i klakson, ciszej z odległością, z lewej albo z prawej ---------- */
// Głosy tylko dla VOICES najbliższych aut w promieniu HEAR od kamery; pętla silnika ta sama co własna (drive/audio.js).
const HEAR = 900;                              // dm
const VOICES = 4, VOL = 0.35, HORN = 0.2;
const voices = new Map();                      // id gracza → głos

function makeVoice(au, model) {
  const ctx = au.ctx, pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  pan.connect(fxOut(au));
  const g = ctx.createGain(), lp = ctx.createBiquadFilter();
  g.gain.value = 0; lp.type = 'lowpass'; lp.Q.value = 0.8; lp.connect(g); g.connect(pan);
  const src = ctx.createBufferSource(); src.buffer = engineBuffer(ctx, model.sound); src.loop = true;
  src.connect(lp); src.start();
  return { model, src, lp, g, pan, horn: makeHorn(ctx, pan) };
}
function drop(id) {
  const v = voices.get(id);
  v.src.stop(); v.horn.stop(); v.pan.disconnect();
  voices.delete(id);
}
// list = [{ id, x, z, model, rpm, load, horn, engine }] (engine = gracz siedzi w aucie)
export function updateRemoteSound(list) {
  const au = drive.audio;
  if (!au || au.ctx.state !== 'running' || !drive.sound) { for (const id of [...voices.keys()]) drop(id); return; }
  const c = camera.position;
  const near = list.map(o => ({ o, d: Math.hypot(o.x - c.x, o.z - c.z) })).filter(e => e.d < HEAR)
    .sort((a, b) => a.d - b.d).slice(0, VOICES);
  const keep = new Set(near.map(e => e.o.id));
  for (const id of [...voices.keys()]) if (!keep.has(id)) drop(id);
  const e = camera.matrixWorld.elements, rx = e[0], rz = e[2], rl = Math.hypot(rx, rz) || 1;   // prawa strona kamery
  const t = au.ctx.currentTime;
  for (const { o, d } of near) {
    let v = voices.get(o.id);
    if (v && v.model !== o.model) { drop(o.id); v = null; }
    if (!v) { v = makeVoice(au, o.model); voices.set(o.id, v); }
    const fade = 1 - d / HEAR, [lp0, lpLoad, lpRpm] = o.model.sound.lp;
    if (v.pan.pan) v.pan.pan.setTargetAtTime(0.8 * Math.max(-1, Math.min(1, ((o.x - c.x) * rx + (o.z - c.z) * rz) / (rl * (d || 1)))), t, 0.05);
    v.src.playbackRate.setTargetAtTime(Math.max(o.rpm, 500) / BASE_RPM, t, 0.05);
    v.lp.frequency.setTargetAtTime(lp0 + o.load * lpLoad + o.rpm * lpRpm, t, 0.05);
    v.g.gain.setTargetAtTime(o.engine ? VOL * fade * fade * (0.5 + 0.5 * o.load) : 0, t, 0.08);
    v.horn.set(o.horn ? HORN * fade : 0);
  }
}
