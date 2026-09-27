import { active } from '../car/index.js';
import { S } from '../core/state.js';
import { drive, st } from '../drive/state.js';
import { me } from '../foot/index.js';
import { applyWorld, clearOthers, updateOthers } from './remote.js';
import { net } from './state.js';
import { initNetUi, paintNet, roomFromHash } from './ui.js';

/* ================= gra online: połączenie z serwerem (/ws), wysyłanie własnego stanu ================= */
// Serwer (server/index.mjs) tylko przekazuje stany w obrębie pokoju; fizykę każdy liczy u siebie.
// Bez serwera (np. npm run serve) gra działa jak dotąd, a menu pokazuje, że online jest niedostępne.
const SEND_EVERY = 1 / 15;                     // s
const RETRY = [1, 2, 5, 10, 20, 30];           // s: kolejne próby po zerwaniu połączenia
let ws = null, sendT = 0, tries = 0, retryTimer = 0;

const r1 = v => Math.round(v * 10) / 10, r3 = v => Math.round(v * 1000) / 1000;
function sendState() {
  const s = [r1(st.x), r1(st.z), r3(st.psi), r1(st.y), r3(st.pitch), r3(st.roll), r3(st.steer), r1(st.v)];
  const f = drive.onFoot ? [r1(me.x), r1(me.z), r1(me.y), r3(me.psi)] : 0;
  ws.send(JSON.stringify({ t: 's', k: Math.round(performance.now()), c: active.model.id, s, f }));
}
function onMessage(e) {
  let m;
  try { m = JSON.parse(e.data); } catch (err) { return; }
  if (m.t === 'hi') { net.id = m.id; net.room = m.room; tries = 0; net.status = 'on'; paintNet(); }
  else if (m.t === 'w' && Array.isArray(m.p)) {
    applyWorld(m.p, net.id, performance.now());
    if (m.n !== net.n) { net.n = m.n; paintNet(); }
  }
}
export function connect() {
  clearTimeout(retryTimer);
  if (ws) { ws.onclose = null; ws.close(); }
  clearOthers();
  net.room = roomFromHash(); net.n = 0; net.status = 'connecting'; paintNet();
  const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws?room=${encodeURIComponent(net.room)}`;
  const sock = ws = new WebSocket(url);
  sock.onmessage = onMessage;
  sock.onclose = e => {
    if (ws !== sock) return;
    ws = null; clearOthers();
    net.status = e.code === 4001 ? 'full' : 'down'; net.n = 0; paintNet();
    if (e.code === 4001) return;               // pełny pokój: bez ponawiania, gracz może założyć własny
    retryTimer = setTimeout(connect, RETRY[Math.min(tries++, RETRY.length - 1)] * 1000);
  };
}
export function initNet() {
  initNetUi(connect);
  addEventListener('hashchange', () => { if (roomFromHash() !== net.room) connect(); });
  connect();
}
// co klatkę (game/loop.js): auta innych graczy i własny stan, gdy gra już trwa
export function updateNet(dt) {
  updateOthers(dt, performance.now());
  sendT += dt;
  if (sendT < SEND_EVERY) return;
  sendT = 0;
  if (ws && ws.readyState === 1 && S.started && drive.city && ws.bufferedAmount < 4096) sendState();
}
